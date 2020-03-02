import {
  NgModule
} from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes
} from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { VerifiedGuard } from './guards/verified.guard';
// import { VerifiedGuard } from './guards/verified.guard';
const redirectToLogin = redirectUnauthorizedTo(['login']);

const routes: Routes = [{
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule)
  },
  {
    path: 'offline',
    loadChildren: () => import('./pages/offline/offline.module').then(m => m.OfflinePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'edit-profile',
    ...canActivate(redirectToLogin),
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'report-history',
    ...canActivate(redirectToLogin),
    loadChildren: () => import('./pages/report-history/report-history.module').then(m => m.ReportHistoryPageModule)
  },
  {
    path: 'create-form',
    ...canActivate(redirectToLogin),
    loadChildren: () => import('./pages/create-form/create-form.module').then(m => m.CreateFormPageModule)
  },
  {
    path: 'spot-report',
    loadChildren: () => import('./pages/spot-report/spot-report.module').then(m => m.SpotReportPageModule)
  },
  {
    path: 'my-forms',
    loadChildren: () => import('./pages/my-forms/my-forms.module').then(m => m.MyFormsPageModule)
  },
  {
    path: 'spot-reports',
    loadChildren: () => import('./modals/spot-reports/spot-reports.module').then(m => m.SpotReportsPageModule)
  },
  {
    path: 'add-media',
    loadChildren: () => import('./modals/add-media/add-media.module').then(m => m.AddMediaPageModule)
  },
  {
    path: 'fill-in-ioi',
    loadChildren: () => import('./modals/fill-in-ioi/fill-in-ioi.module').then(m => m.FillInIoiPageModule)
  },
  {
    path: 'edit-ioi',
    loadChildren: () => import('./modals/edit-ioi/edit-ioi.module').then(m => m.EditIoiPageModule)
  },
  {
    path: 'site-status',
    loadChildren: () => import('./pages/site-status/site-status.module').then(m => m.SiteStatusPageModule)
  },
  {
    path: 'my-plans/:id',
    loadChildren: () => import('./pages/my-plans/my-plans.module').then(m => m.MyPlansPageModule)
  },
  {
    path: 'more-settings',
    ...canActivate(redirectToLogin),
    loadChildren: () => import('./pages/more-settings/more-settings.module').then(m => m.MoreSettingsPageModule)
  },
  {
    path: 'location-select',
    ...canActivate(redirectToLogin),
    loadChildren: () => import('./modals/location-select/location-select.module').then(m => m.LocationSelectPageModule)
  },
  {
    path: 'location-select',
    loadChildren: () => import('./modals/location-select/location-select.module').then( m => m.LocationSelectPageModule)
  },
  {
    path: 'add-ioi-type',
    loadChildren: () => import('./modals/add-ioi-type/add-ioi-type.module').then( m => m.AddIoiTypePageModule)
  },
  {
    path: 'add-ioi-status',
    loadChildren: () => import('./modals/add-ioi-status/add-ioi-status.module').then( m => m.AddIoiStatusPageModule)
  },
  {
    path: 'step-form',
    loadChildren: () => import('./pages/step-form/step-form.module').then( m => m.StepFormPageModule)
  },
  {
    path: 'edit-tabs-ioi',
    loadChildren: () => import('./modals/edit-tabs-ioi/edit-tabs-ioi.module').then( m => m.EditTabsIoiPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'add-shortcuts',
    loadChildren: () => import('./modals/add-shortcuts/add-shortcuts.module').then( m => m.AddShortcutsPageModule)
  },
  {
    path: 'create-sponsor-code',
    loadChildren: () => import('./modals/create-sponsor-code/create-sponsor-code.module').then( m => m.CreateSponsorCodePageModule)
  },
  {
    path: 'view-orgs',
    loadChildren: () => import('./modals/view-orgs/view-orgs.module').then( m => m.ViewOrgsPageModule)
  },
  {
    path: 'view-divisions',
    loadChildren: () => import('./modals/view-divisions/view-divisions.module').then( m => m.ViewDivisionsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}