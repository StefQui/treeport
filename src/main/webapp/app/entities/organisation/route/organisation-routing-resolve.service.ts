import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganisation } from '../organisation.model';
import { OrganisationService } from '../service/organisation.service';

export const organisationResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrganisation> => {
  const id = route.params['id'];
  if (id) {
    return inject(OrganisationService)
      .find(id)
      .pipe(
        mergeMap((organisation: HttpResponse<IOrganisation>) => {
          if (organisation.body) {
            return of(organisation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default organisationResolve;
