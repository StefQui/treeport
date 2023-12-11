import { Component, CUSTOM_ELEMENTS_SCHEMA, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertComponent } from 'app/shared/alert/alert.component';
import SharedModule from 'app/shared/shared.module';
import { MyAlertComponent } from '../myalert/myalert.component';
import { RenderedAssetComponent } from '../rendered-asset/rendered-asset.component';

@Component({
  selector: 'jhi-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  template: ` <div [innerHTML]="sanitized"></div> `,
})
export class PageComponent implements OnInit, OnChanges {
  sanitized: SafeHtml | undefined;
  @Input() content: string | undefined | null = null;

  constructor(
    private injector: Injector,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(): void {
    if (this.content) {
      this.updateContent();
    }
  }

  updateContent(): void {
    this.sanitized = this.sanitizer.bypassSecurityTrustHtml(this.content ?? '');
  }

  ngOnInit(): void {
    const element = createCustomElement(MyAlertComponent, { injector: this.injector });
    if (!customElements.get('jhi-myalert')) {
      customElements.define('jhi-myalert', element);
    }
    // const element2 = createCustomElement(RenderedAssetComponent, { injector: this.injector });
    // if (!customElements.get('jhi-rendered-asset')) {
    //   customElements.define('jhi-rendered-asset', element2);
    // }
  }
}
