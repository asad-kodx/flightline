import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LiveValueDisplay } from '../../models';
import { Gesture, IonicModule } from '@ionic/angular';
import { RoomSearchType, ButtonsDisplayType, ModeDisplayType } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sliding-footer',
  templateUrl: './sliding-footer.component.html',
  styleUrls: ['./sliding-footer.component.scss'],
  standalone: false
})
export class SlidingFooterComponent{

  @Input('searchType') searchType!: RoomSearchType;
  @Input('liveValueDisplay') liveValueDisplay!: LiveValueDisplay;
  @Input('buttonsDisplayType') buttonsDisplayType!: ButtonsDisplayType;
  @Input('modeType') modeType!: ModeDisplayType;

  @ViewChild('footerContainer') footerContainer: any;
  @ViewChild('azButton') azButton: any;
  @ViewChild('valButton') valButton: any;
  @ViewChild('highButton') highButton: any;
  @ViewChild('lowButton') lowButton: any;

  @Output() sortAZ  = new EventEmitter();
  @Output() sortVal = new EventEmitter();
  @Output() showMode = new EventEmitter();
  @Output() showValues = new EventEmitter();

  leftMargin;
  numButtons = 4;
  // gesture: Gesture;

  constructor() {
    this.leftMargin = -1;
  }

  ngOnInit(){
    // this.gesture = new Gesture(this.footerContainer.nativeElement);
    // this.gesture.listen();
    // this.gesture.on('pan', (e) => {
    //   if(e.additionalEvent == "panleft"){
    //     this.leftMargin -= Math.abs(e.velocityX * 4.5);
    //     if(this.leftMargin < 25 * (this.numButtons - 4)) this.leftMargin = 25 * (this.numButtons - 4);
    //   }
    //   if(e.additionalEvent == "panright"){
    //     this.leftMargin += Math.abs(e.velocityX * 4.5);
    //     if(this.leftMargin > 0) this.leftMargin = 0;
    //   }
    // });
  }

  sortAlphabetical() {
    this.azButton.color = 'primary';
    this.valButton.color = 'inactive';

    this.sortAZ.emit();
  }

  sortValue() {
    this.azButton.color = 'inactive';
    this.valButton.color = 'primary';
    
    this.sortVal.emit();
  }

  getColor(type: LiveValueDisplay){
    if(type == this.liveValueDisplay) return 'primary';
    return 'inactive';
  }

  displayLiveValues(){
    this.showValues.emit();
  }

  displayMode(){
    this.showMode.emit();
  }

  get24High() {
    this.highButton.color = 'color';
    this.lowButton.color = 'inactive';
  }

  get24Low() {
    this.highButton.color = 'inactive';
    this.lowButton.color = 'primary';
  }
}