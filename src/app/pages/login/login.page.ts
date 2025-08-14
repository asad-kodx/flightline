import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { LocalStorageHelper } from 'src/app/core/providers/storage-helper.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfigurationService } from 'src/app/core/services/configuration.service';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
    username: string = "";
    password: string = "";
    pushtoken: string = this.localstorage.getData('pushtoken');

    protected configurations = ConfigurationService;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authSvc: AuthService,
    private localstorage: LocalStorageHelper,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }

  async login() {
    const loading = await this.loadingCtrl.create({
        message: 'Please Wait, Logging You In',
        spinner: 'bubbles',
    });
    await loading.present();
    this.authSvc.login(this.username.toLowerCase(), this.password)
    .subscribe({
        next: (data) => {
            loading.dismiss();
            console.debug('Auth Service Return', data);
            this.navCtrl.navigateRoot('home');
        },
        error: (err) => {
            loading.dismiss();
        }
    })
  }

  async launchPasswordReset() {
    try{
        this.iab.create(this.configurations.baseUrl + '/account/forgotpassword');
    }
    catch{
        window.open(this.configurations.baseUrl + '/account/forgotpassword', '_system');
    }
  }
}
