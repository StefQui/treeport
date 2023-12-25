import { IOrganisation } from 'app/shared/model/organisation.model';
import { ITag } from 'app/shared/model/tag.model';
import { AttributeType } from 'app/shared/model/enumerations/attribute-type.model';
import { OperationType } from 'app/shared/model/enumerations/operation-type.model';
import { ISite } from './site.model';

export interface IAttributeConfig {
  id?: string;
  applyOnChildren?: boolean | null;
  isConsolidable?: boolean | null;
  relatedConfigId?: string | null;
  attributeType?: keyof typeof AttributeType | null;
  isWritable?: boolean | null;
  consoParameterKey?: string | null;
  consoOperationType?: keyof typeof OperationType | null;
  orga?: IOrganisation | null;
  site?: ISite | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IAttributeConfig> = {
  applyOnChildren: false,
  isConsolidable: false,
  isWritable: false,
};
