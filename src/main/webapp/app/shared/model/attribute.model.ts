import { IOrganisation } from 'app/shared/model/organisation.model';
import { IAsset } from 'app/shared/model/asset.model';
import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { ITag } from 'app/shared/model/tag.model';

export interface IAttribute {
  id?: string;
  isAgg?: boolean | null;
  hasConfigError?: boolean | null;
  configError?: string | null;
  orga?: IOrganisation | null;
  site?: IAsset | null;
  config?: IAttributeConfig | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IAttribute> = {
  isAgg: false,
  hasConfigError: false,
};
