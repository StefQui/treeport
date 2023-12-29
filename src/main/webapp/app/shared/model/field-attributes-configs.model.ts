import { IOrganisation } from 'app/shared/model/organisation.model';
import { IAttributeConfig } from './attribute-config.model';
import { IAttribute, IAttributeWithValue } from './attribute.model';

export interface IFieldsAttributesConfigs {
  [fieldId: string]: IAttributeWithValue;
}

export const defaultValue: Readonly<IFieldsAttributesConfigs> = {};
