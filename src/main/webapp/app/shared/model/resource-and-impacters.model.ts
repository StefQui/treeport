import { IOrganisation } from 'app/shared/model/organisation.model';
import { IResource } from './resource.model';
import { IResourceWithValue } from './resourcewithvalues.model';
import { ISite } from './site.model';

export interface IResourceAndImpacters {
  resource: IResourceWithValue;
  impactedIds: string[];
}
