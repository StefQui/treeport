import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrganisation } from '../organisation.model';
import { OrganisationService } from '../service/organisation.service';
import { OrganisationFormService, OrganisationFormGroup } from './organisation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-organisation-update',
  templateUrl: './organisation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrganisationUpdateComponent implements OnInit {
  isSaving = false;
  organisation: IOrganisation | null = null;

  editForm: OrganisationFormGroup = this.organisationFormService.createOrganisationFormGroup();

  constructor(
    protected organisationService: OrganisationService,
    protected organisationFormService: OrganisationFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organisation }) => {
      this.organisation = organisation;
      if (organisation) {
        this.updateForm(organisation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organisation = this.organisationFormService.getOrganisation(this.editForm);
    if (organisation.id !== null) {
      this.subscribeToSaveResponse(this.organisationService.update(organisation));
    } else {
      this.subscribeToSaveResponse(this.organisationService.create(organisation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganisation>>): void {
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

  protected updateForm(organisation: IOrganisation): void {
    this.organisation = organisation;
    this.organisationFormService.resetForm(this.editForm, organisation);
  }
}
