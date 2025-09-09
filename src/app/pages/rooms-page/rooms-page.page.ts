
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { Keyboard } from '@capacitor/keyboard';

// Import models and types
import {
  Entity,
  AlarmCount,
  RoomSearchType,
  LiveValueDisplay,
  ButtonsDisplayType,
  ModeDisplayType,
  EntityType
} from '../../shared/models/index';
import { EntitiesDataProvider } from 'src/app/core/providers/entities-data.provider';
import { RoomDataProvider } from 'src/app/core/providers/room-data.provider';


@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.page.html',
  styleUrls: ['./rooms-page.page.scss'],
  standalone: false,
})
export class RoomsPagePage implements OnInit, OnDestroy {

  @ViewChild('searchBar') searchBar: any;
  @ViewChild('completer') completer: any;
  @ViewChild('azButton') azButton: any;
  @ViewChild('valButton') valButton: any;
  @ViewChild('highButton') highButton: any;
  @ViewChild('lowButton') lowButton: any;
  @ViewChild('ionList') ionList: any;

  protected searchData = [
    'All Sensors',
    'All Devices',
    'Fan Devices',
    'Heater Devices',
    'Temperature Sensors',
    'Bin Sensors',
    'Fogger Devices',
    'Motor Devices',
    'Humidity Sensors',
    'FanGroup Devices',
    'Curtain Devices',
    'BinSlide Devices',
    'BallDrop Devices',
    'Light Devices',
    'Switch Devices',
    'Pressure Sensors',
    'Oxygen Sensors',
    'Ammonia Sensors',
    'Gas Sensors',
    'Water Sensors',
    'Wind Sensors',
    'Current Sensors'];

  public entities: Observable<Entity[]> | undefined;
  public entArray: Entity[] = [];
  public searchInput: string = '';
  public refreshing: boolean = false;
  public isiOS: boolean = false;
  public open: boolean = false;

  public title: string = '';
  public searchTerm: string = '';
  public allEntities: boolean = false;

  public searchType: RoomSearchType = RoomSearchType.None;
  public liveValueDisplay: LiveValueDisplay = LiveValueDisplay.LiveValues;
  public buttonsDisplayType: ButtonsDisplayType = ButtonsDisplayType.All;
  public modeType: ModeDisplayType = ModeDisplayType.All;
  public alarmCount!: Observable<Map<string, AlarmCount>>;
  filteredArray: Entity[] = [];
  query!: string;

  constructor(private entityData: EntitiesDataProvider,
    private roomData: RoomDataProvider
  ) {
    this.searchType = RoomSearchType.None;
    this.buttonsDisplayType = ButtonsDisplayType.All;
    this.entArray = [
      {
        entityName: 'test',
        entitySerialNumber: '',
        controlName: 'test control',
        roomName: 'test room',
        controlSerialNumber: 'dropFromList123',
        entityType: EntityType.Device, // Fixed: use proper enum value
        siteId: 1 // Added required property
      } as Entity
    ]
  }

  ngOnInit() {
    this.refreshing = false;
  }

  ionViewDidEnter() {
    this.entArray.splice(0);
  }

  ngOnDestroy() {
    // this.pageAdapter.unsub();
  }

  handleRefresh(event: any) {
    // Handle refresh logic here
    console.log('Refresh triggered', event);
  }

  openDropdown() {
    this.open = true;
    if (this.completer) {
      this.completer.open();
    }
  }

  closeDropdown() {
    this.open = false;
    if (this.completer) {
      this.completer.close();
    }
  }

  setOpen(_event: any) {
    this.open = this.completer ? this.completer.isOpen() : false;
  }

  protected onSelected(event: any) {
    if (event == null) return;
    this.modeType = ModeDisplayType.All;
    this.liveValueDisplay = LiveValueDisplay.LiveValues;
    this.refreshing = false;
    var splitItem = event.detail.value.split(" ");
    this.searchTerm = splitItem[0];
    console.log(splitItem, this.searchTerm)
    var entityType;
    if (splitItem[1] == "Sensors") {
      entityType = EntityType.Sensor;
      this.allEntities = false;
      this.buttonsDisplayType = ButtonsDisplayType.Sensors;
    }
    else if (splitItem[1] == "Devices") {
      entityType = EntityType.Device;
      this.allEntities = false;
      this.buttonsDisplayType = ButtonsDisplayType.Devices;
    }
    else {
      entityType = EntityType.Both;
      this.allEntities = true;
      this.buttonsDisplayType = ButtonsDisplayType.All;
    }

    this.entityData.getEntities(this.searchTerm, entityType).subscribe((data) => {
      this.entArray = data;
      this.filteredArray = data;
      var group = Object.keys(_.groupBy(data, 'controlSerialNumber'));
      group.forEach(serial => {
        if(!this.roomData.controlsPulled.has(serial)){
          this.roomData.getDevicesForControl(serial)
          .pipe(
            catchError(() => {
              return of(null);
            })
          )
          .subscribe();
          this.roomData.getSensorsForControl(serial)
          .pipe(
            catchError(() => {
              return of(null);
            })
          )
          .subscribe();
        }
      })
      console.log(group);
    });
  }

  refreshLiveValues() {
    this.requestLiveValues();
    this.refreshing = true;
  }

  requestLiveValues() {
    var entityIds = this.entArray.map(entity => {
      return entity.entitySerialNumber;
    });
    // TODO: Implement live values request when service is available
    console.log('Requesting live values for:', entityIds);
  }

  sortAlphabetical() {
    if (this.searchType == RoomSearchType.AlphabeticalDesc) {
      this.entArray = [...this.entArray].sort((a, b) => a.entityName.localeCompare(b.entityName)).reverse();
      this.filteredArray = [...this.entArray];
    }
    else {
      this.entArray = [...this.entArray].sort((a, b) => a.entityName.localeCompare(b.entityName));
      this.filteredArray = [...this.entArray];
    }
    
    if (this.searchType == RoomSearchType.AlphabeticalDesc) {
      this.searchType = RoomSearchType.AlphabeticalAsc
    }
    else {
      this.searchType = RoomSearchType.AlphabeticalDesc;
    }
  }

  sortValue() {
    var filterTerm: keyof Entity;
    if (this.liveValueDisplay == LiveValueDisplay.LiveValues) filterTerm = 'liveValueData';
    if (this.liveValueDisplay == LiveValueDisplay.Mode) filterTerm = 'mode';

    // Simple sort implementation
    if (this.searchType == RoomSearchType.ValDesc) {
      this.entArray = [...this.entArray].sort((a, b) => {
        const aVal = (a as any)[filterTerm] || 0;
        const bVal = (b as any)[filterTerm] || 0;
        this.filteredArray = [...this.entArray]
        return aVal - bVal;
      }
    );
  } else {
    this.entArray = [...this.entArray].sort((a, b) => {
      const aVal = (a as any)[filterTerm] || 0;
      const bVal = (b as any)[filterTerm] || 0;
      this.filteredArray = [...this.entArray]
        return bVal - aVal;
      });
    }

    if (this.searchType == RoomSearchType.ValDesc) {
      this.searchType = RoomSearchType.ValAsc;
    }
    else {
      this.searchType = RoomSearchType.ValDesc;
    }
  }

  filterList(): void {
    if (this.searchType == RoomSearchType.AlphabeticalAsc) {
      this.entArray = [...this.entArray].sort((a, b) => a.entityName.localeCompare(b.entityName)).reverse();
      this.filteredArray = [...this.entArray]
      return;
    }
    if (this.searchType == RoomSearchType.AlphabeticalDesc) {
      this.entArray = [...this.entArray].sort((a, b) => a.entityName.localeCompare(b.entityName));
      this.filteredArray = [...this.entArray]
      return;
    }
    
    var filterTerm: keyof Entity;
    if (this.liveValueDisplay == LiveValueDisplay.LiveValues) filterTerm = 'liveValueData';
    if (this.liveValueDisplay == LiveValueDisplay.Mode) filterTerm = 'mode';
    
    if (this.searchType == RoomSearchType.ValDesc) {
      this.entArray = [...this.entArray].sort((a, b) => {
        const aVal = (a as any)[filterTerm] || 0;
        const bVal = (b as any)[filterTerm] || 0;
        return bVal - aVal;
      });
      this.filteredArray = [...this.entArray]
      return;
    }
    if (this.searchType == RoomSearchType.ValAsc) {
      this.entArray = [...this.entArray].sort((a, b) => {
        const aVal = (a as any)[filterTerm] || 0;
        const bVal = (b as any)[filterTerm] || 0;
        return aVal - bVal;
      });
      this.filteredArray = [...this.entArray]
      return;
    }
  }

  displayLiveValues() {
    this.liveValueDisplay = LiveValueDisplay.LiveValues;
    this.modeType = ModeDisplayType.All;
    this.filterList();
  }

  displayMode() {
    this.liveValueDisplay = LiveValueDisplay.Mode;
    if (this.modeType == ModeDisplayType.All) {
      this.modeType = ModeDisplayType.ManualOn;
    }
    else if (this.modeType == ModeDisplayType.ManualOn) {
      this.modeType = ModeDisplayType.ManualOff;
    }
    else if (this.modeType == ModeDisplayType.ManualOff) {
      this.modeType = ModeDisplayType.Auto;
    }
    else if (this.modeType == ModeDisplayType.Auto) {
      this.modeType = ModeDisplayType.All
    }
    this.filterList();
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      Keyboard.hide();
    }
  }

  closeKeyboard() {
    Keyboard.hide();
  }

  shouldShow(_entity: Entity): boolean {
    // For now, show all entities. Replace with actual site context logic when available
    return true;
  }

  onSearchChange(event: any) {
  const query = event.target.value.toLowerCase();
    if (!query || query.trim() === '') {
    this.filteredArray = [...this.entArray];
  } else {
    this.filteredArray = this.entArray.filter(d =>
      d.entityName.toLowerCase().includes(query)
    );
    console.log(this.filteredArray);
    }
  }
  onClearSearch(){
    this.filteredArray = [...this.entArray];
  }
}




