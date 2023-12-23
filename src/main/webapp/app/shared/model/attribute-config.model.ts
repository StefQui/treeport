import { IOrganisation } from 'app/shared/model/organisation.model';
import { IAsset } from 'app/shared/model/asset.model';
import { ITag } from 'app/shared/model/tag.model';
import { AttributeType } from 'app/shared/model/enumerations/attribute-type.model';
import { OperationType } from 'app/shared/model/enumerations/operation-type.model';

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
  site?: IAsset | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IAttributeConfig> = {
  applyOnChildren: false,
  isConsolidable: false,
  isWritable: false,
};
