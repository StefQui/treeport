import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AssetDetailComponent } from './asset-detail.component';

describe('Asset Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AssetDetailComponent,
              resolve: { asset: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AssetDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load asset on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AssetDetailComponent);

      // THEN
      expect(instance.asset).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
