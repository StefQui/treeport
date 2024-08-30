import { IOrganisation } from 'app/shared/model/organisation.model';
import { IResource } from './resource.model';
import { ISite } from './site.model';

export interface IResourceAndImpacters {
  resource: IResource;
  impactedIds: string[];
}
