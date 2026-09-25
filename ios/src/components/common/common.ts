import { Component } from '@angular/core';

/**
 * Generated class for the CommonComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'common',
  templateUrl: 'common.html'
})
export class CommonComponent {

  text: string;

  constructor() {
    console.log('Hello CommonComponent Component');
    this.text = 'Hello World';
  }
}
