import { Component } from '@angular/core';
import { doCrap } from '@dercetech-mp/shared';

doCrap();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
