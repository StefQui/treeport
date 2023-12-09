import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrganisation, NewOrganisation } from '../organisation.model';

export type PartialUpdateOrganisation = Partial<IOrganisation> & Pick<IOrganisation, 'id'>;

export type EntityResponseType = HttpResponse<IOrganisation>;
export type EntityArrayResponseType = HttpResponse<IOrganisation[]>;

@Injectable({ providedIn: 'root' })
export class OrganisationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/organisations');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(organisation: NewOrganisation): Observable<EntityResponseType> {
    return this.http.post<IOrganisation>(this.resourceUrl, organisation, { observe: 'response' });
  }

  update(organisation: IOrganisation): Observable<EntityResponseType> {
    return this.http.put<IOrganisation>(`${this.resourceUrl}/${this.getOrganisationIdentifier(organisation)}`, organisation, {
      observe: 'response',
    });
  }

  partialUpdate(organisation: PartialUpdateOrganisation): Observable<EntityResponseType> {
    return this.http.patch<IOrganisation>(`${this.resourceUrl}/${this.getOrganisationIdentifier(organisation)}`, organisation, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IOrganisation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrganisation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrganisationIdentifier(organisation: Pick<IOrganisation, 'id'>): string {
    return organisation.id;
  }

  compareOrganisation(o1: Pick<IOrganisation, 'id'> | null, o2: Pick<IOrganisation, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrganisationIdentifier(o1) === this.getOrganisationIdentifier(o2) : o1 === o2;
  }

  addOrganisationToCollectionIfMissing<Type extends Pick<IOrganisation, 'id'>>(
    organisationCollection: Type[],
    ...organisationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const organisations: Type[] = organisationsToCheck.filter(isPresent);
    if (organisations.length > 0) {
      const organisationCollectionIdentifiers = organisationCollection.map(
        organisationItem => this.getOrganisationIdentifier(organisationItem)!,
      );
      const organisationsToAdd = organisations.filter(organisationItem => {
        const organisationIdentifier = this.getOrganisationIdentifier(organisationItem);
        if (organisationCollectionIdentifiers.includes(organisationIdentifier)) {
          return false;
        }
        organisationCollectionIdentifiers.push(organisationIdentifier);
        return true;
      });
      return [...organisationsToAdd, ...organisationCollection];
    }
    return organisationCollection;
  }
}
