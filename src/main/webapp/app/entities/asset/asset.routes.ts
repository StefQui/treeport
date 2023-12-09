import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AssetComponent } from './list/asset.component';
import { AssetDetailComponent } from './detail/asset-detail.component';
import { AssetUpdateComponent } from './update/asset-update.component';
import AssetResolve from './route/asset-routing-resolve.service';

const assetRoute: Routes = [
  {
    path: '',
    component: AssetComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetDetailComponent,
    resolve: {
      asset: AssetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default assetRoute;
