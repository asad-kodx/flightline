import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DBKeys } from 'src/app/shared/models';
import { ControlDataProvider } from 'src/app/core/providers/control-data.provider';
import { OrganizationDataProvider } from 'src/app/core/providers/org-data.provider';
import { SiteDataProvider } from 'src/app/core/providers/site-data.provider';
import { UserDataProvider } from 'src/app/core/providers/user-data.provider';
import { AuthService } from 'src/app/core/services/auth.service';
import { OrgContextService } from 'src/app/core/services/org-context.service';
import { NewCustomer, Organization, Site, User } from 'src/app/shared/models';
import { StringBuilder } from 'typescript-string-operations';
@Component({
  selector: 'app-add-control',
  templateUrl: './add-control.page.html',
  styleUrls: ['./add-control.page.scss'],
  standalone: false,
})
export class AddControlPage implements OnInit {
  public serialNumber!: number;
  public newCustomer: NewCustomer = new NewCustomer();
  public newSite!: Site;
  public messageTitle: string = '';
  public messageBody: string = '';
  public hasErrors: boolean = false;
  public orgId!: number;
  public siteId!: number;
  private orgName!: string;
  private siteName!: string;
  public orgsList?: Observable<Organization[]>;
  public sitesList?: Observable<Site[]>;
  public controlAdded!: boolean;
  private messageBuilder = new StringBuilder();
  private orgAndSiteName!: User;
  private waitSpinner: any;
  private isNewUser!: boolean;
  private roles: string[] = [
    'Can Add Site',
    'Can Manage Security Groups',
    'Can Manage Alarm Groups',
    'Can Edit User Details',
    'Can Manage Roles',
    'View Control Alarms',
    'Can Change Others Password',
    'Add Control',
    'Can View My Organization',
    'Can VNC',
    'View Graphs',
    'View Controls',
    'View Site Management',
    'View Security Groups',
    'View Alarm Groups',
    'View User Management',
    'Can View Reports',
    'View Site Maintenance',
  ];
  constructor(
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public navParams: NavParams,
    public orgDataProvider: OrganizationDataProvider,
    private orgContext: OrgContextService,
    private siteDataProvider: SiteDataProvider,
    public controlDataProvider: ControlDataProvider,
    private authService: AuthService,
    public userProvider: UserDataProvider // private events: Events
  ) {
    console.info('serial number received', this.navParams.get('serialNo'));
    console.info('is new user', this.navParams.get('isNewUser'));
    this.serialNumber = this.navParams.get('serialNo');
    this.isNewUser = this.navParams.get('isNewUser');
    this.newCustomer.controlSerialNumbers = [];
    this.newCustomer.controlSerialNumbers.push(this.navParams.get('serialNo'));
    console.info(this.orgAndSiteName);
    // this.showPageLoader();

    //If new user was created, login, add roles, create org/site and add control
    if (this.isNewUser) {
      //add roles to user
      this.userProvider
        .addRolesToUserEndpoint(
          this.roles,
          localStorage.getItem('user_id') || ''
        )
        .subscribe({next: (roleData) => {
          console.info('Roles added', roleData);
          localStorage.setItem(DBKeys.ROLES, roleData);
          this.addControl();
        }});
    }
    //If user already exists then just create org/site and add control
    else {
      this.controlAdded = false;
      this.orgId = -1;
      this.siteId = -1;
      this.orgsList = this.orgDataProvider.getOrganizationsBinding();
      this.sitesList = this.siteDataProvider.getSitesBinding();
    }
  }
  ngOnInit() {}
  addControl() {
    this.showPageLoader();
    this.controlAdded = true;
    //get serial number
    this.controlDataProvider.getControlBySerialNo(this.serialNumber).subscribe({
      next: (data: any) => {
        console.info('Control info', data);
        if (data == null) {
          //create new org, site and control
          this.orgDataProvider
            .addNewCustomer(this.newCustomer)
            .subscribe({next: (data: Organization) => {
              //set new org info in local storage
              //localStorage.setItem("orgs", JSON.stringify(data));
              localStorage.setItem(
                'organization_id',
                (data.organizationId ?? 0).toString()
              );
              this.messageTitle = 'Info';
              this.hasErrors = false;
              this.orgAndSiteName = JSON.parse(
                localStorage.getItem('user_info') || ''
              );
              console.info('Org Site name', this.orgAndSiteName);
              // this.events.publish("OrgCreated", this.orgAndSiteName.firstName + " " + this.orgAndSiteName.lastName);
              this.messageBuilder.appendLine(
                'Control added successfully to app & website <br/><br/>'
              );
              this.messageBuilder.appendLine(
                '<b>Organization:</b> ' +
                  this.orgAndSiteName.firstName +
                  ' ' +
                  this.orgAndSiteName.lastName +
                  '<br/>'
              );
              this.messageBuilder.appendLine(
                '<b>Site:</b> ' +
                  this.orgAndSiteName.firstName +
                  ' ' +
                  this.orgAndSiteName.lastName +
                  '<br/>'
              );
              this.messageBuilder.appendLine(
                '<b>Serial Number:</b> ' + this.serialNumber + '<br/>'
              );
              this.messageBody = this.messageBuilder.toString();
              this.waitSpinner.dismiss();
            }});
        } else {
          if (data.orgName != null) {
            this.hasErrors = true;
            this.messageTitle = 'Error';
            this.messageBody =
              'Add Control failed. Control already added in the database.';
            this.waitSpinner.dismiss();
          } else {
            this.hasErrors = true;
            this.messageTitle = 'Error';
            this.messageBody =
              'Add Control failed because control is already in the system and not assigned to any organization or site. Please contact admin with serial number ' +
              this.serialNumber;
            this.waitSpinner.dismiss();
          }
        }
      },
    });
  }
  showPageLoader() {
    this.waitSpinner = this.loadingController.create({
      spinner: 'crescent',
      message: 'Adding control ' + this.serialNumber + '...',
      showBackdrop: true,
      backdropDismiss: true,
    });
    setTimeout(() => {
      this.waitSpinner.dismiss();
    }, 20000);
    this.waitSpinner.present();
  }
  compareOrgs(o1: any, o2: any) {
    return o1 && o2 ? o1.organizationId === o2.organizationId : o1 === o2;
  }

  compareSites(s1: any, s2: any) {
    return s1 && s2 ? s1.siteId === s2.siteId : s1 === s2;
  }
  onBackClick() {
    console.info('Back clicked', this.navCtrl);
    if (this.isNewUser) {
      this.navCtrl.navigateRoot('home-page');
    } else {
      this.navCtrl.pop();
    }
  }
  public onSiteChange(site: any) {
    if (!site.siteId) return;
    this.siteId = site.siteId;
    this.siteName = site.siteName;
  }
  public onOrgChange(organization: any) {
    if (!organization.organizationId) return;
    
    this.orgId = organization.organizationId;
    this.orgName = organization.name;
    console.log('Organization changed to:', this.orgId, organization.name);
    
    // Use org context service to set organization (this will emit the observable)
    this.orgContext.setOrganization(organization.organizationId, organization.name);
    
    // Refresh sites for the new organization
    this.siteDataProvider.getSites();
  }
  assignControl() {
    this.showPageLoader();
    this.controlAdded = true;
    //get serial number
    this.controlDataProvider.getControlBySerialNo(this.serialNumber).subscribe({
      next: (data: any) => {
        console.info('Control info', data);
        if (data == null) {
          //create new org, site and control
          this.orgDataProvider
            .addNewControl(this.serialNumber, this.orgId, this.siteId)
            .subscribe({
              next: (data: Organization) => {
                //set new org info in local storage
                //localStorage.setItem("orgs", JSON.stringify(data));
                this.messageTitle = 'Info';
                this.hasErrors = false;
                this.orgAndSiteName = JSON.parse(
                  localStorage.getItem('user_info') || ''
                );
                console.info('Org Site name', this.orgAndSiteName);
                // this.events.publish("OrgCreated", this.orgAndSiteName.firstName + " " + this.orgAndSiteName.lastName);
                this.messageBuilder.appendLine(
                  'Control added successfully to app & website <br/><br/>'
                );
                this.messageBuilder.appendLine(
                  '<b>Organization:</b> ' + this.orgName + '<br/>'
                );
                this.messageBuilder.appendLine(
                  '<b>Site:</b> ' + this.siteName + '<br/>'
                );
                this.messageBuilder.appendLine(
                  '<b>Serial Number:</b> ' + this.serialNumber + '<br/>'
                );
                this.messageBody = this.messageBuilder.toString();
                this.waitSpinner.dismiss();
              },
            });
        } else {
          if (data.orgName != null) {
            this.hasErrors = true;
            this.messageTitle = 'Error';
            this.messageBody =
              'Add Control failed. Control already added in the database.';
            this.waitSpinner.dismiss();
          } else {
            this.hasErrors = true;
            this.messageTitle = 'Error';
            this.messageBody =
              'Add Control failed because control is already in the system and not assigned to any organization or site. Please contact admin with serial number ' +
              this.serialNumber;
            this.waitSpinner.dismiss();
          }
        }
      },
    });
  }
}
