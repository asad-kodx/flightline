import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';

import { UserDataProvider } from 'src/app/core/providers/user-data.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.page.html',
  styleUrls: ['./register-user.page.scss'],
  standalone: false,
})
export class RegisterUserPage implements OnInit {
  public userName: string = '';
  public password: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public confirmPassword: string = '';
  public errorMessage: string = '';
  public newUser!: User;
  private waitSpinner: any;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userProvider: UserDataProvider,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.errorMessage = '';
    this.newUser = new User();
    this.userProvider.getPinEndpoint().subscribe((data) => {
      this.newUser.pin = data;
      console.info('Pin number', data);
    });
  }

  ngOnInit() {}
  registerUser() {
    if (this.pageValidations()) {
      this.showPageLoader();
      this.newUser.firstName = this.firstName;
      this.newUser.lastName = this.lastName;
      this.newUser.userName = this.userName;
      this.newUser.password = this.password;
      this.newUser.confirmPassword = this.password;
      //create user
      this.userProvider.getRegisterEndpoint(this.newUser).subscribe({
        next: (response) => {
          console.info('new user creation result', response);

          // add the newly scanned control
          this.waitSpinner.dismiss();

          // Login as the new user
          this.authService
            .login(this.newUser.userName, this.newUser.password)
            .subscribe({
              next: (loginResponse) => {
                // Navigate to home page
                this.navCtrl.navigateRoot('home-page');
                // Nav to Add control page
                // this.navCtrl.navigateForward(AddControlPage,{queryParams: { serialNo: localStorage.getItem('scanned_serial_no'), isNewUser: true}});
              },
              error: (err) => {
                // dismiss spinner if login failed
                this.waitSpinner.dismiss();
              },
              complete: () => {
                console.info('Login request completed.');
              },
            });
        },
        error: (e) => {
          console.info('error occurred', e.error[''][0]);

          // store the error message
          this.errorMessage = e.error[''][0];

          // dismiss spinner on error
          this.waitSpinner.dismiss();
        },
        complete: () => {
          console.info('Registration request completed.');
        },
      });
    }
  }
  showPageLoader() {
    this.waitSpinner = this.loadingController.create({
      spinner: 'crescent',
      message: 'Registering user and logging in...',
      showBackdrop: true,
      backdropDismiss: true,
    });
    setTimeout(() => {
      this.waitSpinner.dismiss();
    }, 20000);
    this.waitSpinner.present();
  }
  pageValidations(): boolean {
    if (this.userName.trim() == '') {
      this.errorMessage = 'Please enter a Username';
      return false;
    }
    if (this.firstName.trim() == '') {
      this.errorMessage = 'Please enter a First name';
      return false;
    }
    if (this.lastName.trim() == '') {
      this.errorMessage = 'Please enter a Last Name';
      return false;
    }
    if (this.password.trim() == '') {
      this.errorMessage = 'Please enter a Password';
      return false;
    }
    if (this.confirmPassword.trim() == '') {
      this.errorMessage = 'Please enter a value for Confirm Password';
      return false;
    }
    if (this.password.trim() != this.confirmPassword.trim()) {
      this.errorMessage = "Password & Confirm Password values don't match";
      return false;
    }
    if (this.password.trim().length < 8) {
      this.errorMessage = 'Password should atleast be 7 characters long';
      return false;
    }
    return true;
  }
  backToLogin() {
    this.navCtrl.pop();
  }
}
