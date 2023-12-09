import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { OrganisationComponent } from './list/organisation.component';
import { OrganisationDetailComponent } from './detail/organisation-detail.component';
import { OrganisationUpdateComponent } from './update/organisation-update.component';
import OrganisationResolve from './route/organisation-routing-resolve.service';

const organisationRoute: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganisationDetailComponent,
    resolve: {
      organisation: OrganisationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganisationUpdateComponent,
    resolve: {
      organisation: OrganisationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganisationUpdateComponent,
    resolve: {
      organisation: OrganisationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default organisationRoute;
