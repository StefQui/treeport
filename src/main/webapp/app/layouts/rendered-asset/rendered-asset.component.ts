import { HttpResponse } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Injector, Input, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IAsset } from 'app/entities/asset/asset.model';
import { AssetService } from 'app/entities/asset/service/asset.service';
import { map } from 'rxjs/operators';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'jhi-rendered-asset',
  standalone: true,
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [PageComponent],
  template: ` <jhi-page [content]="content"></jhi-page> `,
})
export class RenderedAssetComponent implements OnInit {
  @Input() assetId: string | undefined | null = null;

  content: string | undefined | null;

  constructor(
    protected assetService: AssetService, // private injector: Injector,
  ) {}

  ngOnInit(): void {
    console.log('ccccc' + this.assetId);
    if (this.assetId) {
      this.assetService
        .find(this.assetId)
        .pipe(
          map((asset: HttpResponse<IAsset>) => {
            if (asset.body) {
              this.content = asset.body.content;
              console.log('ccccc2 -- ' + this.content);
              // const element2 = createCustomElement(PageComponent, { injector: this.injector });
              // if (!customElements.get('jhi-page')) {
              //   console.log('ccccc3333 ');
              //   customElements.define('jhi-page', element2);
              // }
            }
          }),
        )
        .subscribe();
    }
  }
}
