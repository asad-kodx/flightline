import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'user-settings',
    loadChildren: () =>
      import('./pages/user-settings/user-settings.module').then(
        (m) => m.UserSettingsPageModule
      ),
  },
  {
    path: 'site-alarms-list',
    loadChildren: () =>
      import('./pages/site-alarms-list/site-alarms-list.module').then(
        (m) => m.SiteAlarmsListPageModule
      ),
  },
  {
    path: 'rooms-page',
    loadChildren: () =>
      import('./pages/rooms-page/rooms-page.module').then(
        (m) => m.RoomsPagePageModule
      ),
  },
  {
    path: 'remote-settings',
    loadChildren: () =>
      import('./pages/remote-settings/remote-settings.module').then(
        (m) => m.RemoteSettingsPageModule
      ),
  },
  {
    path: 'alarm-list',
    loadChildren: () =>
      import('./pages/alarm-list/alarm-list.module').then(
        (m) => m.AlarmListPageModule
      ),
  },
  {
    path: 'control-list',
    loadChildren: () =>
      import('./pages/control-list/control-list.module').then(
        (m) => m.ControlListPageModule
      ),
  },
  {
    path: 'register-user',
    loadChildren: () =>
      import('./pages/register-user/register-user.module').then(
        (m) => m.RegisterUserPageModule
      ),
  },
  {
    path: 'add-control',
    loadChildren: () =>
      import('./pages/add-control/add-control.module').then(
        (m) => m.AddControlPageModule
      ),
  },
  {
    path: 'offline-alerts',
    loadChildren: () =>
      import('./pages/offline-alerts/offline-alerts.module').then(
        (m) => m.OfflineAlertsPageModule
      ),
  },
  {
    path: 'offline-alert-details',
    loadChildren: () =>
      import('./pages/offline-alert-details/offline-alert-details.module').then(
        (m) => m.OfflineAlertDetailsPageModule
      ),
  },
  {
    path: 'ignored-controls',
    loadChildren: () =>
      import('./pages/ignored-controls/ignored-controls.module').then(
        (m) => m.IgnoredControlsPageModule
      ),
  },

  {
    path: 'alarm-details-wrapper',
    loadChildren: () =>
      import('./pages/alarm-details/alarm-details-wrapper.module').then(
        (m) => m.AlarmDetailsWrapperPageModule
      ),
  },
  {
    path: 'alarm-details-tab',
    loadChildren: () =>
      import(
        './pages/alarm-details/alarm-details-tab/alarm-details-tab.module'
      ).then((m) => m.AlarmDetailsTabPageModule),
  },
  {
    path: 'remote-control-component',
    loadChildren: () => import('./pages/remote-control-component/remote-control-component.module').then( m => m.RemoteControlComponentPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
