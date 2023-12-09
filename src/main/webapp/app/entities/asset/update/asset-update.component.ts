import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrganisation } from 'app/entities/organisation/organisation.model';
import { OrganisationService } from 'app/entities/organisation/service/organisation.service';
import { AssetType } from 'app/entities/enumerations/asset-type.model';
import { AssetService } from '../service/asset.service';
import { IAsset } from '../asset.model';
import { AssetFormService, AssetFormGroup } from './asset-form.service';

@Component({
  standalone: true,
  selector: 'jhi-asset-update',
  templateUrl: './asset-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AssetUpdateComponent implements OnInit {
  isSaving = false;
  asset: IAsset | null = null;
  assetTypeValues = Object.keys(AssetType);

  organisationsSharedCollection: IOrganisation[] = [];
  assetsSharedCollection: IAsset[] = [];

  editForm: AssetFormGroup = this.assetFormService.createAssetFormGroup();

  constructor(
    protected assetService: AssetService,
    protected assetFormService: AssetFormService,
    protected organisationService: OrganisationService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareOrganisation = (o1: IOrganisation | null, o2: IOrganisation | null): boolean =>
    this.organisationService.compareOrganisation(o1, o2);

  compareAsset = (o1: IAsset | null, o2: IAsset | null): boolean => this.assetService.compareAsset(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ asset }) => {
      this.asset = asset;
      if (asset) {
        this.updateForm(asset);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const asset = this.assetFormService.getAsset(this.editForm);
    if (asset.id !== null) {
      this.subscribeToSaveResponse(this.assetService.update(asset));
    } else {
      this.subscribeToSaveResponse(this.assetService.create(asset));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAsset>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(asset: IAsset): void {
    this.asset = asset;
    this.assetFormService.resetForm(this.editForm, asset);

    this.organisationsSharedCollection = this.organisationService.addOrganisationToCollectionIfMissing<IOrganisation>(
      this.organisationsSharedCollection,
      asset.orga,
    );
    this.assetsSharedCollection = this.assetService.addAssetToCollectionIfMissing<IAsset>(
      this.assetsSharedCollection,
      asset.parent,
      ...(asset.childrens ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.organisationService
      .query()
      .pipe(map((res: HttpResponse<IOrganisation[]>) => res.body ?? []))
      .pipe(
        map((organisations: IOrganisation[]) =>
          this.organisationService.addOrganisationToCollectionIfMissing<IOrganisation>(organisations, this.asset?.orga),
        ),
      )
      .subscribe((organisations: IOrganisation[]) => (this.organisationsSharedCollection = organisations));

    this.assetService
      .query()
      .pipe(map((res: HttpResponse<IAsset[]>) => res.body ?? []))
      .pipe(
        map((assets: IAsset[]) =>
          this.assetService.addAssetToCollectionIfMissing<IAsset>(assets, this.asset?.parent, ...(this.asset?.childrens ?? [])),
        ),
      )
      .subscribe((assets: IAsset[]) => (this.assetsSharedCollection = assets));
  }
}
