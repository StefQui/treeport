import { IOrganisation } from 'app/shared/model/organisation.model';

export interface ISite {
  id?: string;
  name?: string | null;
  content?: string | null;
  orga?: IOrganisation | null;
  parent?: ISite | null;
  childrens?: ISite[] | null;
}

export const defaultValue: Readonly<ISite> = {};
