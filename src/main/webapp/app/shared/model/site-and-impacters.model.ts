import { IOrganisation } from 'app/shared/model/organisation.model';
import { ISite } from './site.model';

export interface ISiteAndImpacters {
  site: ISite;
  impactedIds: string[];
}
