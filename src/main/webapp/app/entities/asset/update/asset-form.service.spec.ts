import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../asset.test-samples';

import { AssetFormService } from './asset-form.service';

describe('Asset Form Service', () => {
  let service: AssetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetFormService);
  });

  describe('Service methods', () => {
    describe('createAssetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAssetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            orga: expect.any(Object),
            parent: expect.any(Object),
            childrens: expect.any(Object),
            assets: expect.any(Object),
          }),
        );
      });

      it('passing IAsset should create a new form with FormGroup', () => {
        const formGroup = service.createAssetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            orga: expect.any(Object),
            parent: expect.any(Object),
            childrens: expect.any(Object),
            assets: expect.any(Object),
          }),
        );
      });
    });

    describe('getAsset', () => {
      it('should return NewAsset for default Asset initial value', () => {
        const formGroup = service.createAssetFormGroup(sampleWithNewData);

        const asset = service.getAsset(formGroup) as any;

        expect(asset).toMatchObject(sampleWithNewData);
      });

      it('should return NewAsset for empty Asset initial value', () => {
        const formGroup = service.createAssetFormGroup();

        const asset = service.getAsset(formGroup) as any;

        expect(asset).toMatchObject({});
      });

      it('should return IAsset', () => {
        const formGroup = service.createAssetFormGroup(sampleWithRequiredData);

        const asset = service.getAsset(formGroup) as any;

        expect(asset).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAsset should not enable id FormControl', () => {
        const formGroup = service.createAssetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAsset should disable id FormControl', () => {
        const formGroup = service.createAssetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
