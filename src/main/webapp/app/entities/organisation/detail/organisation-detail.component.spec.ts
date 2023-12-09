import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrganisationDetailComponent } from './organisation-detail.component';

describe('Organisation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: OrganisationDetailComponent,
              resolve: { organisation: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OrganisationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load organisation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OrganisationDetailComponent);

      // THEN
      expect(instance.organisation).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
