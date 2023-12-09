import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAsset } from '../asset.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../asset.test-samples';

import { AssetService } from './asset.service';

const requireRestSample: IAsset = {
  ...sampleWithRequiredData,
};

describe('Asset Service', () => {
  let service: AssetService;
  let httpMock: HttpTestingController;
  let expectedResult: IAsset | IAsset[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AssetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Asset', () => {
      const asset = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(asset).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Asset', () => {
      const asset = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(asset).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Asset', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Asset', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Asset', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAssetToCollectionIfMissing', () => {
      it('should add a Asset to an empty array', () => {
        const asset: IAsset = sampleWithRequiredData;
        expectedResult = service.addAssetToCollectionIfMissing([], asset);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asset);
      });

      it('should not add a Asset to an array that contains it', () => {
        const asset: IAsset = sampleWithRequiredData;
        const assetCollection: IAsset[] = [
          {
            ...asset,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, asset);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Asset to an array that doesn't contain it", () => {
        const asset: IAsset = sampleWithRequiredData;
        const assetCollection: IAsset[] = [sampleWithPartialData];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, asset);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asset);
      });

      it('should add only unique Asset to an array', () => {
        const assetArray: IAsset[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const assetCollection: IAsset[] = [sampleWithRequiredData];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, ...assetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const asset: IAsset = sampleWithRequiredData;
        const asset2: IAsset = sampleWithPartialData;
        expectedResult = service.addAssetToCollectionIfMissing([], asset, asset2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(asset);
        expect(expectedResult).toContain(asset2);
      });

      it('should accept null and undefined values', () => {
        const asset: IAsset = sampleWithRequiredData;
        expectedResult = service.addAssetToCollectionIfMissing([], null, asset, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(asset);
      });

      it('should return initial array if no Asset is added', () => {
        const assetCollection: IAsset[] = [sampleWithRequiredData];
        expectedResult = service.addAssetToCollectionIfMissing(assetCollection, undefined, null);
        expect(expectedResult).toEqual(assetCollection);
      });
    });

    describe('compareAsset', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAsset(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareAsset(entity1, entity2);
        const compareResult2 = service.compareAsset(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareAsset(entity1, entity2);
        const compareResult2 = service.compareAsset(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareAsset(entity1, entity2);
        const compareResult2 = service.compareAsset(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
