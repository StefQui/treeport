import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAsset } from '../asset.model';
import { AssetService } from '../service/asset.service';

@Component({
  standalone: true,
  templateUrl: './asset-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AssetDeleteDialogComponent {
  asset?: IAsset;

  constructor(
    protected assetService: AssetService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.assetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
