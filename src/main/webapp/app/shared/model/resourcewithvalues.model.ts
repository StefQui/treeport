import { IOrganisation } from 'app/shared/model/organisation.model';
import { AttributeValueType, IAttributeValue, IAttributeWithValue } from './attribute.model';
import { IResource } from './resource.model';

export interface IResourceWithValue {
  attributeValues?: IAttributeValue[];
  id?: string;
  name?: string | null;
  content?: string | null;
  orga?: IOrganisation | null;
  parent?: IResource | null;
  childrens?: IResource[] | null;
  childrenCount?: number | null;
}

export const defaultValue: Readonly<IResourceWithValue> = {};
