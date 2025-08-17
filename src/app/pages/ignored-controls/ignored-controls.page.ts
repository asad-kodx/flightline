import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { SiteContextService } from 'src/app/core/services/site-context.service';
import { Control } from 'src/app/shared/models';

@Component({
  selector: 'app-ignored-controls',
  templateUrl: './ignored-controls.page.html',
  styleUrls: ['./ignored-controls.page.scss'],
  standalone: false
})
export class IgnoredControlsPage implements OnInit {
  public controls!: Control[];
  public searchText: string = '';

  constructor(
    private modalCtrl: ModalController,
    private controlData: ControlDataProvider,
    private siteContext: SiteContextService
  ) {}
  ngOnInit() {
    this.controlData.getControlsBinding().subscribe((data) => {
      this.controls = data;
    });
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  toggleIgnored(control: Control,) {
    // console.log(event.checked);
    // if (event.checked) {
    //   this.controlData.addIgnoredControl(control).subscribe();
    // } else {
    //   this.controlData.removeIgnoredControl(control).subscribe();
    // }
  }

  shouldShow(control: Control) {
    if (!this.siteContext.isSiteSelected(control.siteId)) return false;
    if (!this.searchText || this.searchText.trim() == '') return true;
    if (control.name == null || control.name == undefined) control.name = '';
    return (
      control.name
        .toLocaleLowerCase()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1 ||
      control.serialNumber!.toString()
        .indexOf(this.searchText.toLocaleLowerCase()) > -1
    );
  }

  public handleKeyUp(event: any) {
    if (event.keyCode == 13) {
      // this.keyboard.close();
    }
  }

  public closeKeyboard() {
    // this.keyboard.close();
  }
}
