import { Component, NgModule, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, MenuController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { ProductsProvider } from '../../providers/products-provider';
import { OneProduct } from '../../pages/one-product/one-product';

/*
  Generated class for the Deals component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'deals',
  templateUrl: 'deals.html',
  providers: [ProductsProvider]
})
export class DealsComponent {

   DealsoftheDay: any = [];
   future: any;
   futureString: any;
   diff: any;
   rate: any = 2.5;
   timer: any;
    animateItems = [];
    animateClass: any;

  constructor(private productsProvider: ProductsProvider, private navCtrl: NavController) {
      this.futureString = new Date();
      this.futureString.setDate(this.futureString.getDate() + 1);
      this.animateClass = { 'zoom-in': true };

  }

 dhms(t) {
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;

    return [
       hours + 'h',
       minutes + 'm',
       seconds + 's'
    ].join(' ');
 }

 ngOnInit() {
    this.future = new Date(this.futureString);
    Observable.interval(1000).map((x) => {
       this.diff = Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
    }).subscribe((x) => {
       this.timer = this.dhms(this.diff);
    });
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
