
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
        canActivate: [AuthGuard]
      },
      {
        path: 'map',
        children: [{
          path: '',
          loadChildren: () =>
            import('../pages/map/map.module').then(m => m.MapPageModule)
        }]
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
        }]
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
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}