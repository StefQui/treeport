import { IOrganisation } from 'app/shared/model/organisation.model';
import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { ITag } from 'app/shared/model/tag.model';
import { ISite } from './site.model';

export interface IAttributeIdExploded {
  // siteId?: string;
  resourceId?: string;
  campaignId?: string;
  key?: string;
}
