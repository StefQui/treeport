import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrganisation } from '../organisation.model';
import { OrganisationService } from '../service/organisation.service';

@Component({
  standalone: true,
  templateUrl: './organisation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrganisationDeleteDialogComponent {
  organisation?: IOrganisation;

  constructor(
    protected organisationService: OrganisationService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.organisationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
