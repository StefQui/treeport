import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IOrganisation } from 'app/entities/organisation/organisation.model';
import { OrganisationService } from 'app/entities/organisation/service/organisation.service';
import { AssetService } from '../service/asset.service';
import { IAsset } from '../asset.model';
import { AssetFormService } from './asset-form.service';

import { AssetUpdateComponent } from './asset-update.component';

describe('Asset Management Update Component', () => {
  let comp: AssetUpdateComponent;
  let fixture: ComponentFixture<AssetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let assetFormService: AssetFormService;
  let assetService: AssetService;
  let organisationService: OrganisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AssetUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AssetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AssetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    assetFormService = TestBed.inject(AssetFormService);
    assetService = TestBed.inject(AssetService);
    organisationService = TestBed.inject(OrganisationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organisation query and add missing value', () => {
      const asset: IAsset = { id: 'CBA' };
      const orga: IOrganisation = { id: '997a443d-0558-42e9-a3b6-c5f2c48e1498' };
      asset.orga = orga;

      const organisationCollection: IOrganisation[] = [{ id: '40467967-51da-4bed-b4a0-80c7b5037d35' }];
      jest.spyOn(organisationService, 'query').mockReturnValue(of(new HttpResponse({ body: organisationCollection })));
      const additionalOrganisations = [orga];
      const expectedCollection: IOrganisation[] = [...additionalOrganisations, ...organisationCollection];
      jest.spyOn(organisationService, 'addOrganisationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(organisationService.query).toHaveBeenCalled();
      expect(organisationService.addOrganisationToCollectionIfMissing).toHaveBeenCalledWith(
        organisationCollection,
        ...additionalOrganisations.map(expect.objectContaining),
      );
      expect(comp.organisationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Asset query and add missing value', () => {
      const asset: IAsset = { id: 'CBA' };
      const parent: IAsset = { id: '118dbe74-bce7-4c6a-9bc0-08e2887703c9' };
      asset.parent = parent;
      const childrens: IAsset[] = [{ id: '0c2da21d-a4bf-43dc-a37d-6d4b9e4f3bbf' }];
      asset.childrens = childrens;

      const assetCollection: IAsset[] = [{ id: 'e27b1e90-ded7-4137-b427-94d4d7ca62bf' }];
      jest.spyOn(assetService, 'query').mockReturnValue(of(new HttpResponse({ body: assetCollection })));
      const additionalAssets = [parent, ...childrens];
      const expectedCollection: IAsset[] = [...additionalAssets, ...assetCollection];
      jest.spyOn(assetService, 'addAssetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(assetService.query).toHaveBeenCalled();
      expect(assetService.addAssetToCollectionIfMissing).toHaveBeenCalledWith(
        assetCollection,
        ...additionalAssets.map(expect.objectContaining),
      );
      expect(comp.assetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const asset: IAsset = { id: 'CBA' };
      const orga: IOrganisation = { id: '65cbe23f-13fa-4e02-aead-3a34b3cbda5e' };
      asset.orga = orga;
      const parent: IAsset = { id: 'bfb8df62-3a88-4e50-b024-b930d8da0d59' };
      asset.parent = parent;
      const childrens: IAsset = { id: '659bc6e0-74da-4c27-8776-f9f9059715a1' };
      asset.childrens = [childrens];

      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      expect(comp.organisationsSharedCollection).toContain(orga);
      expect(comp.assetsSharedCollection).toContain(parent);
      expect(comp.assetsSharedCollection).toContain(childrens);
      expect(comp.asset).toEqual(asset);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 'ABC' };
      jest.spyOn(assetFormService, 'getAsset').mockReturnValue(asset);
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(assetFormService.getAsset).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(assetService.update).toHaveBeenCalledWith(expect.objectContaining(asset));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 'ABC' };
      jest.spyOn(assetFormService, 'getAsset').mockReturnValue({ id: null });
      jest.spyOn(assetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: asset }));
      saveSubject.complete();

      // THEN
      expect(assetFormService.getAsset).toHaveBeenCalled();
      expect(assetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAsset>>();
      const asset = { id: 'ABC' };
      jest.spyOn(assetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ asset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(assetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrganisation', () => {
      it('Should forward to organisationService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(organisationService, 'compareOrganisation');
        comp.compareOrganisation(entity, entity2);
        expect(organisationService.compareOrganisation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAsset', () => {
      it('Should forward to assetService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(assetService, 'compareAsset');
        comp.compareAsset(entity, entity2);
        expect(assetService.compareAsset).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
