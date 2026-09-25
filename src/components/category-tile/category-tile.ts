import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CategoryProvider } from '../../providers/category-provider';

import { ProductListPage } from '../../pages/product-list/product-list';
/*
  Generated class for the CategoryTile component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'category-tile',
  templateUrl: 'category-tile.html',
  providers: [CategoryProvider]
})
export class CategoryTileComponent {

  text: string;
  @Input() data: any;
  list:any;

    animateItems = [];
    animateClass: { 'zoom-in': true };

  constructor(public navCtrl: NavController, private categoryProvider: CategoryProvider) {
  
  }

    ngAfterViewInit() {
        let that = this;
      var categories = that.categoryProvider.getCategories()

        for (let i = 0; i < categories.length; i++) {
            setTimeout(function() {
                that.animateItems.push(categories[i]);
            }, 0 * i);
        }
    }

openCategory(category) {
   //this.navCtrl.push(ProductListPage, { category: category});
}

}
