import { IOrganisation } from 'app/shared/model/organisation.model';
import { ITag } from './tag.model';

export interface IResource {
  id?: string;
  name?: string | null;
  type?: string | null;
  content?: string | null;
  orga?: IOrganisation | null;
  parent?: IResource | null;
  childrens?: IResource[] | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IResource> = {};
