import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { ProductsProvider } from '../../providers/products-provider';
import { NavController, MenuController, NavParams  } from 'ionic-angular';

import { OneProduct } from '../../pages/one-product/one-product';
/*
  Generated class for the ProductsLayout component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'products-layout',
  templateUrl: 'products-layout.html',
  providers: [ProductsProvider]
})
export class ProductsLayoutComponent {

  text: string;
  @Input() data: any;
  list:any;
  animateItems = [];
  animateClass: any;

  constructor(private productsProvider: ProductsProvider, private navCtrl: NavController, private navParams: NavParams) {
      this.animateClass = { 'zoom-in': true };
  }

    ngAfterViewInit() {    
        let that = this;
      var products = [2,4,9,1,3,5,6,7,8,10,11,12,13,14];
      that.productsProvider.filterProducts(products).subscribe(function(res){
        for (let i = 0; i < res.length; i++) {
            setTimeout(function() {
                that.animateItems.push(res[i]);
            }, 200 * i);
        }
      });
    }

    openProduct(item) {
        this.navCtrl.push(OneProduct, { item: item});
    }
}
