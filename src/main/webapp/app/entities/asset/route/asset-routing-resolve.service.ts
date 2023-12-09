import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAsset } from '../asset.model';
import { AssetService } from '../service/asset.service';

export const assetResolve = (route: ActivatedRouteSnapshot): Observable<null | IAsset> => {
  const id = route.params['id'];
  if (id) {
    return inject(AssetService)
      .find(id)
      .pipe(
        mergeMap((asset: HttpResponse<IAsset>) => {
          if (asset.body) {
            return of(asset.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default assetResolve;
