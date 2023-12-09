import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'organisation',
        data: { pageTitle: 'treeportApp.organisation.home.title' },
        loadChildren: () => import('./organisation/organisation.routes'),
      },
      {
        path: 'asset',
        data: { pageTitle: 'treeportApp.asset.home.title' },
        loadChildren: () => import('./asset/asset.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
