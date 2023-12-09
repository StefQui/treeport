import { IOrganisation, NewOrganisation } from './organisation.model';

export const sampleWithRequiredData: IOrganisation = {
  id: '6722901a-ec00-4753-a737-c6595bf42db7',
};

export const sampleWithPartialData: IOrganisation = {
  id: '09cf778d-05b2-4818-b20d-80f4ad9d95e9',
  name: 'yippee meh sealift',
};

export const sampleWithFullData: IOrganisation = {
  id: '20b4dc8b-0dd2-4bf0-a0cb-c32997a8fa92',
  name: 'for asparagus',
};

export const sampleWithNewData: NewOrganisation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
