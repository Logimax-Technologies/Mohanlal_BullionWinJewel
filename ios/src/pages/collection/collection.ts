import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { CategoryProvider } from '../../providers/category-provider';
import { FilterModalPage } from '../../pages/filter-modal/filter-modal';
import { ProductDetailPage } from '../product-detail/product-detail';

@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
  providers: [CategoryProvider],
  animations: [
    trigger('flyInTopSlow', [
      state("0", style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('* => 0', [
        animate('500ms ease-in', keyframes([
          style({ transform: 'translate3d(0,-500px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    trigger('flyAlternameSlow', [
      state("1", style({
        transform: 'translate3d(0,0,0)'
      })),
      state("0", style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('* => 1', [
        animate('1000ms ease-in', keyframes([
          style({ transform: 'translate3d(500px,0,0', offset: 0 }),
          style({ transform: 'translate3d(-10px,0,0)', offset: 0.5 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ]),
      transition('* => 0', [
        animate('1000ms ease-in', keyframes([
          style({ transform: 'translate3d(-1000px,0,0', offset: 0 }),
          style({ transform: 'translate3d(10px,0,0)', offset: 0.5 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class CollectionPage {
  mySearch: any = '';
  productitems = [];
  //filter
  filters: object[];
  filter_options: object[];
  filterargs: object;
  isquickselect = false;
  addcartbtn = false;
  item = 1;
  id_category = this.navParams.get('category_id')
  products: any = [];
  last_id: any = 0;
  lazy_load_last_id: any = 0;
  filterData: any;

  constructor(private commonservice: CommonProvider, public navCtrl: NavController, public navParams: NavParams, private commProvider: CommonProvider, private modalCtrl: ModalController, private event: Events, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController) {
    console.log(this.id_category);
    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.commonservice.getProducts(this.id_category, this.last_id).then((data) => {
      if (data) {
        this.products = data['responseData'];
        console.log(data)
      }
      loader.dismiss();
    });

    if (navParams.get('subcatid') != undefined) {
      commProvider.updatecollectionpageaction('subcategory', navParams.get('subcatid'));
    } else {
      commProvider.updatecollectionpageaction('collection', null);
    }
    let that = this;
    this.commProvider.getFilterOptions().subscribe(function (res) {
      that.filters = res.filters;
      that.filter_options = res.filter_options;
      that.filterargs = res.filterargs;
      let obj = { filters: res.filters, filter_options: res.filter_options, filterargs: res.filterargs }
      localStorage.setItem('resetFilterData', JSON.stringify(obj));
    });
    //  this.doRefresh(0);
  }
  // doRefresh(refresher){
  //     let item=[];
  //     this.categoryProvider.getProductData().then(( data ) => {
  //     this.item=data;
  //     console.log("results:"+JSON.stringify(data));
  //     this.event.publish( 'collection:updated', data);
  //     if(refresher!=0)
  //     refresher.complete();
  //     })
  // }
  // open filter modal
  openModal() {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    console.log("dddwd" + currentUser);
    if (currentUser == null) {
      var temp = 1;
    }
    else {
      temp = currentUser.show_type;
    }
    let myModal = this.modalCtrl.create(FilterModalPage, { 'show_type': temp, 'filters': this.filters, 'filter_options': this.filter_options, 'filterargs': this.filterargs });

    //on closing modal
    myModal.onDidDismiss(data => {
      if (data == undefined) {
        console.log("onDidDismiss - undefined ");
      }
      else {
        this.lazy_load_last_id = data['lazy_load'];
        console.log('lazy load : ', this.lazy_load_last_id);
        console.log('data : ', data);
        this.filterData = data;

        console.log("onDidDismiss - else - call service ");
        let that = this;
        let loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
        loader.present();

        this.categoryProvider.getProductFilterData(data).then((data) => {
          that.products = [];
          console.log(data);
          console.log(data.length);
          for (let i = 0; i < data.length; i++) {
            setTimeout(function () {
              that.products.push(data[i]);
            }, 0 * i);
          }
          loader.dismiss();
          // if(data.length > 0){
          //     this.id_product = data[data.length - 1]['id_product'];
          // }
          console.log(that.products.length);
          this.event.publish('collection:updated', data);
          this.event.publish('filternew', that.products);
          // this.event.publish( 'collection', data[data.length - 1]['id_product'] );
          // this.event.publish( 'collection:updated', data );
        });
      }
    });
    myModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionPage');
  }
  searchCollection() {
  }

  quickselect() {
    this.isquickselect = !this.isquickselect;
    this.addcartbtn = (this.isquickselect == true ? true : false);
    this.event.publish('quickselect:changed', (this.isquickselect == true ? 'Y' : 'N'));
    console.log(">>>p&s>>> quickselect:changed");
  }

  addcart() {
    this.event.publish('addqcart:clicked', true);
    console.log(">>>p>>> addcart:clicked");
  }

  openProductdetails(product_id) {
    this.navCtrl.push(ProductDetailPage, { proid: product_id });
  }

  doInfinite(infiniteScroll: any) {
    // Set last_id to the last item's id_category
    if (this.lazy_load_last_id == 1) {
      let that = this;
      that.last_id = that.products[that.products.length - 1]['id_product'];
      console.log('last id : ', that.last_id);
      that.filterData['last_id'] = that.last_id
      console.log('filter data :', that.filterData);
      that.categoryProvider.getProductFilterData(that.filterData).then((data) => {
        // that.products = [];
        console.log(data);
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
          setTimeout(function () {
            console.log('ii : ',data[i]);
            that.products.push(data[i]);
          }, 500);

        }

        console.log(that.products.length);
        console.log(that.products,'product');

        that.event.publish('collection:updated', data);
        that.event.publish('filternew', that.products);

      }).catch(err => {
        console.error("Error loading more data", err);
        infiniteScroll.complete();
      });
    }
    else {
      this.last_id = this.products[this.products.length - 1]['id_product'];
      this.commonservice.getProducts(this.id_category, this.last_id).then(data => {
        console.log(data);
        if (data && data['responseData'].length > 0) {
          for (let i = 0; i < data['responseData'].length; i++) {
            this.products.push(data['responseData'][i]);
          }
        } else {
          // No more data - disable infinite scroll if needed
          infiniteScroll.disabled = true;
        }
        infiniteScroll.complete();
      }).catch(err => {
        console.error("Error loading more data", err);
        infiniteScroll.complete();
      });
    }

  }

}
