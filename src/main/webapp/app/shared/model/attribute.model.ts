import { IOrganisation } from 'app/shared/model/organisation.model';
import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { ITag } from 'app/shared/model/tag.model';
import { ISite } from './site.model';

export interface IAttribute {
  id?: string;
  isAgg?: boolean | null;
  hasConfigError?: boolean | null;
  configError?: string | null;
  orga?: IOrganisation | null;
  site?: ISite | null;
  config?: IAttributeConfig | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IAttribute> = {
  isAgg: false,
  hasConfigError: false,
};
