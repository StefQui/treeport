import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAsset } from '../asset.model';
import { PageComponent } from 'app/layouts/page/page.component';
import { RenderedAssetComponent } from 'app/layouts/rendered-asset/rendered-asset.component';

@Component({
  standalone: true,
  selector: 'jhi-asset-detail',
  templateUrl: './asset-detail.component.html',
  imports: [
    SharedModule,
    RouterModule,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    PageComponent,
    RenderedAssetComponent,
  ],
})
export class AssetDetailComponent {
  @Input() asset: IAsset | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
