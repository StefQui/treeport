import { IAttributeConfig } from 'app/shared/model/attribute-config.model';
import { IAttribute } from 'app/shared/model/attribute.model';

export interface ITag {
  id?: string;
  name?: string | null;
  attributeConfigs?: IAttributeConfig[] | null;
  attributes?: IAttribute[] | null;
}

export const defaultValue: Readonly<ITag> = {};
