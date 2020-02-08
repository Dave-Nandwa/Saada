
import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  TabsPage
} from './tabs.page';
import { AuthGuard } from './../guards/auth.guard';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
const redirectToLogin = redirectUnauthorizedTo(['login']);

const routes: Routes = [{
    path: 'tabs',
    component: TabsPage,
    children: [{
        path: 'home',
        children: [{
          path: '',
          loadChildren: () =>
            import('../pages/home/home.module').then(m => m.HomePageModule)
        }],
        ...canActivate(redirectToLogin)
      },
      {
        path: 'map',
        children: [{
          path: '',
          loadChildren: () =>
            import('../pages/map/map.module').then(m => m.MapPageModule)
        }],
        ...canActivate(redirectToLogin)
      },
      {
        path: 'offline',
        children: [{
          path: '',
          loadChildren: () =>
            import('../pages/offline/offline.module').then(m => m.OfflinePageModule)
        }]
      },
      {
        path: 'profile',
        children: [{
          path: '',
          loadChildren: () =>
            import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
        }],
        ...canActivate(redirectToLogin)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}