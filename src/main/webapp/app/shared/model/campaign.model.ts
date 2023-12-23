import { IOrganisation } from 'app/shared/model/organisation.model';

export interface ICampaign {
  id?: string;
  name?: string | null;
  description?: string | null;
  orga?: IOrganisation | null;
}

export const defaultValue: Readonly<ICampaign> = {};
