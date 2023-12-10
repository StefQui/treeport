import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAsset, NewAsset } from '../asset.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAsset for edit and NewAssetFormGroupInput for create.
 */
type AssetFormGroupInput = IAsset | PartialWithRequiredKeyOf<NewAsset>;

type AssetFormDefaults = Pick<NewAsset, 'id' | 'childrens' | 'assets'>;

type AssetFormGroupContent = {
  id: FormControl<IAsset['id'] | NewAsset['id']>;
  name: FormControl<IAsset['name']>;
  content: FormControl<IAsset['content']>;
  type: FormControl<IAsset['type']>;
  orga: FormControl<IAsset['orga']>;
  parent: FormControl<IAsset['parent']>;
  childrens: FormControl<IAsset['childrens']>;
  assets: FormControl<IAsset['assets']>;
};

export type AssetFormGroup = FormGroup<AssetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AssetFormService {
  createAssetFormGroup(asset: AssetFormGroupInput = { id: null }): AssetFormGroup {
    const assetRawValue = {
      ...this.getFormDefaults(),
      ...asset,
    };
    return new FormGroup<AssetFormGroupContent>({
      id: new FormControl(
        { value: assetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(assetRawValue.name),
      content: new FormControl(assetRawValue.content),
      type: new FormControl(assetRawValue.type),
      orga: new FormControl(assetRawValue.orga),
      parent: new FormControl(assetRawValue.parent),
      childrens: new FormControl(assetRawValue.childrens ?? []),
      assets: new FormControl(assetRawValue.assets ?? []),
    });
  }

  getAsset(form: AssetFormGroup): IAsset | NewAsset {
    return form.getRawValue() as IAsset | NewAsset;
  }

  resetForm(form: AssetFormGroup, asset: AssetFormGroupInput): void {
    const assetRawValue = { ...this.getFormDefaults(), ...asset };
    form.reset(
      {
        ...assetRawValue,
        id: { value: assetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AssetFormDefaults {
    return {
      id: null,
      childrens: [],
      assets: [],
    };
  }
}
