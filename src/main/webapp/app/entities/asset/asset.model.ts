import { IOrganisation } from 'app/entities/organisation/organisation.model';
import { AssetType } from 'app/entities/enumerations/asset-type.model';

export interface IAsset {
  id: string;
  name?: string | null;
  content?: string | null;
  type?: keyof typeof AssetType | null;
  orga?: Pick<IOrganisation, 'id'> | null;
  parent?: Pick<IAsset, 'id'> | null;
  childrens?: Pick<IAsset, 'id'>[] | null;
  assets?: Pick<IAsset, 'id'>[] | null;
}

export type NewAsset = Omit<IAsset, 'id'> & { id: null };
