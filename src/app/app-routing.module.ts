import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),

  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'offline',
    loadChildren: () => import('./pages/offline/offline.module').then( m => m.OfflinePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'report-history',
    loadChildren: () => import('./pages/report-history/report-history.module').then( m => m.ReportHistoryPageModule)
  },
  {
    path: 'create-form',
    loadChildren: () => import('./pages/create-form/create-form.module').then( m => m.CreateFormPageModule)
  },
  {
    path: 'spot-report',
    loadChildren: () => import('./pages/spot-report/spot-report.module').then( m => m.SpotReportPageModule)
  },
  {
    path: 'my-forms',
    loadChildren: () => import('./pages/my-forms/my-forms.module').then( m => m.MyFormsPageModule)
  },
  {
    path: 'spot-reports',
    loadChildren: () => import('./modals/spot-reports/spot-reports.module').then( m => m.SpotReportsPageModule)
  },
  {
    path: 'add-media',
    loadChildren: () => import('./modals/add-media/add-media.module').then( m => m.AddMediaPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
