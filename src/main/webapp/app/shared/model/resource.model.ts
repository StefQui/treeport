import { IOrganisation } from 'app/shared/model/organisation.model';

export interface IResource {
  id?: string;
  name?: string | null;
  content?: string | null;
  orga?: IOrganisation | null;
  parent?: IResource | null;
  childrens?: IResource[] | null;
}

export const defaultValue: Readonly<IResource> = {};
