import { IOrganisation } from 'app/shared/model/organisation.model';
import { AssetType } from 'app/shared/model/enumerations/asset-type.model';

export interface IAsset {
  id?: string;
  name?: string | null;
  content?: string | null;
  type?: keyof typeof AssetType | null;
  orga?: IOrganisation | null;
  parent?: IAsset | null;
  childrens?: IAsset[] | null;
  assets?: IAsset[] | null;
}

export const defaultValue: Readonly<IAsset> = {};
