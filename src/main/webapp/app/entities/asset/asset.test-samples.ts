import { IAsset, NewAsset } from './asset.model';

export const sampleWithRequiredData: IAsset = {
  id: 'e60f143a-ea4a-46b3-a4a3-aed322a94768',
};

export const sampleWithPartialData: IAsset = {
  id: '4c40cfec-e546-469a-99f4-1de2681c7ea6',
  name: 'since',
};

export const sampleWithFullData: IAsset = {
  id: '7be32898-6558-48f3-9672-04f50d092df9',
  name: 'gadzooks on',
  type: 'SITE',
};

export const sampleWithNewData: NewAsset = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
