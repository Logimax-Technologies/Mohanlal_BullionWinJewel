import { Component } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';

/**
 * Generated class for the SubcategoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component( {
    selector: 'subcategory',
    templateUrl: 'subcategory.html',
    providers: [CategoryProvider]
} )
export class SubcategoryComponent {
    text: string;
    constructor( private categoryProvider: CategoryProvider, ) {
        console.log( 'Hello SubcategoryComponent Component' );
        this.text = 'Hello World';
    }
}
