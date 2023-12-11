import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert alert-{{ type }}" role="alert">
      <ng-content></ng-content>
    </div>
  `,
})
export class MyAlertComponent {
  @Input() type = 'primary';
}
