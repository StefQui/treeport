import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAsset, NewAsset } from '../asset.model';

export type PartialUpdateAsset = Partial<IAsset> & Pick<IAsset, 'id'>;

export type EntityResponseType = HttpResponse<IAsset>;
export type EntityArrayResponseType = HttpResponse<IAsset[]>;

@Injectable({ providedIn: 'root' })
export class AssetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/assets');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(asset: NewAsset): Observable<EntityResponseType> {
    return this.http.post<IAsset>(this.resourceUrl, asset, { observe: 'response' });
  }

  update(asset: IAsset): Observable<EntityResponseType> {
    return this.http.put<IAsset>(`${this.resourceUrl}/${this.getAssetIdentifier(asset)}`, asset, { observe: 'response' });
  }

  partialUpdate(asset: PartialUpdateAsset): Observable<EntityResponseType> {
    return this.http.patch<IAsset>(`${this.resourceUrl}/${this.getAssetIdentifier(asset)}`, asset, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAsset>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAsset[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAssetIdentifier(asset: Pick<IAsset, 'id'>): string {
    return asset.id;
  }

  compareAsset(o1: Pick<IAsset, 'id'> | null, o2: Pick<IAsset, 'id'> | null): boolean {
    return o1 && o2 ? this.getAssetIdentifier(o1) === this.getAssetIdentifier(o2) : o1 === o2;
  }

  addAssetToCollectionIfMissing<Type extends Pick<IAsset, 'id'>>(
    assetCollection: Type[],
    ...assetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const assets: Type[] = assetsToCheck.filter(isPresent);
    if (assets.length > 0) {
      const assetCollectionIdentifiers = assetCollection.map(assetItem => this.getAssetIdentifier(assetItem)!);
      const assetsToAdd = assets.filter(assetItem => {
        const assetIdentifier = this.getAssetIdentifier(assetItem);
        if (assetCollectionIdentifiers.includes(assetIdentifier)) {
          return false;
        }
        assetCollectionIdentifiers.push(assetIdentifier);
        return true;
      });
      return [...assetsToAdd, ...assetCollection];
    }
    return assetCollection;
  }
}
