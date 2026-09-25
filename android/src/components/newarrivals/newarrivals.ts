import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';

@Component({
  selector: 'newarrivals',
  templateUrl: 'newarrivals.html',
  providers: [CategoryProvider]
})
export class NewarrivalsComponent {

  checkStatus: boolean = false;
  text: string;
  @Input() data: any;
  list: any;
  animateItems = [];
  productItems = [];
  animateClass: { 'zoom-in': true };
  last_id: any = 0;
  constructor(public navCtrl: NavController, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController, public events: Events) {
    events.subscribe('collection:updated', productitems => {
      if (productitems) {
        console.log(productitems);
        this.productItems = [];
        this.productItems = productitems;
        console.log("collection:updated");
      }
    });
  }

  ngAfterViewInit() {
    let that = this;
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.categoryProvider.getNewArrivalsData(this.last_id).then((data) => {
      for (let i = 0; i < data.length; i++) {
        setTimeout(function () {
          that.productItems.push(data[i]);
        }, 0 * i);
      }
      loader.dismiss();
    });
  }
  openProductdetails(product_id) {
    this.navCtrl.push(ProductDetailPage, { proid: product_id });
  }
  grid() {
    console.log("grid");
    this.checkStatus = true;
  }
  listgrid() {
    console.log("listgrid");
    this.checkStatus = false;
  }
  doInfinite(infiniteScroll: any) {
     var that = this;
    // Set last_id to the last item's id_category
    that.last_id = that.productItems[that.productItems.length - 1]['id_product'];

    that.categoryProvider.getNewArrivalsData(that.last_id).then((data) => {
      for (let i = 0; i < data.length; i++) {
        setTimeout(function () {
          that.productItems.push(data[i]);
        }, 0 * i);
      }
    }).catch(err => {
      console.error("Error loading more data", err);
      infiniteScroll.complete();
    });
  }

}
