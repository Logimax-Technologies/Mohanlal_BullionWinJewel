import { Component } from '@angular/core';
import { NavController, ModalController, Events, LoadingController, AlertController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { ProductListPage } from '../../pages/product-list/product-list';
import { CartPage } from '../../pages/cart/cart';
import { FilterModalPage } from '../../pages/filter-modal/filter-modal';
import { CategoryProvider } from '../../providers/category-provider';
import { AutoPage } from '../../pages/auto/auto';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CategorylistPage } from '../categorylist/categorylist';
import { NewarrivalsPage } from '../../pages/newarrivals/newarrivals';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';

@Component({
  selector: 'page-winhome',
  templateUrl: 'winhome.html',
  providers: [CategoryProvider],
})
export class WinhomePage {

  myInput: any = '';
  totalcartitems = 0;
  filters: object[];
  filter_options: object[];
  filterargs: object;
  loginstatus = false;


  checkStatus: boolean = false;

  text: string;
  list: any;
  animateItems = [];
  productItems = [];
  newarr: any[] = [];
  show: any = true;
  load: any = false;
  animateClass: { 'zoom-in': true };
  catprod: any[] = [];
  bottom: any[] = [{ 'img': 'assets/one.jpg' }, { 'img': 'assets/two.jpg' }, { 'img': 'assets/three.jpg' }, { 'img': 'assets/four.jpg' }];
  slides: any[] = [
    { image: 'assets/img/slides/one.jpg' },
    { image: 'assets/img/slides/two.jpg' },
    { image: 'assets/img/slides/three.jpg' },
  ];

  collections: any[] = [];
  last_id: any = 0;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, private commonService: CommonProvider, private modalCtrl: ModalController, private event: Events, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController) {

    this.loginstatus = JSON.parse(localStorage.getItem('check'));
    console.log(this.loginstatus);
    this.totalcartitems = commonService.getTotalCartItems();
    let that = this;
    // this.commonService.getFilterOptions().subscribe(function (res) {
    //   that.filters = res.filters;
    //   that.filter_options = res.filter_options;
    //   that.filterargs = res.filterargs;
    //   let obj = { filters: res.filters, filter_options: res.filter_options, filterargs: res.filterargs }
    //   localStorage.setItem('resetFilterData', JSON.stringify(obj));
    // });
    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.commonService.getCollections().then((data) => {
      if (data) {
        this.collections = data['responseData'];
        console.log(data)
      }
      loader.dismiss();
    });

  }

  ionViewDidEnter() {

  }
  ionViewWillEnter() {
    this.event.publish('pageno', 3);
  }
  openCategory(category) {
    this.navCtrl.push(ProductListPage, { category: category });
  }
  openCart() {
    this.navCtrl.setRoot(CartPage);
  }
  // open filter modal
  openModal() {
    this.navCtrl.push(AutoPage)
  }

  openproducts(id_collection) {
    console.log(id_collection)
    var loginstatus = JSON.parse(localStorage.getItem('check'));
    var navi = parseInt(localStorage.getItem('pubc'));

    if (loginstatus == false || loginstatus == null) {
      let alert = this.alertCtrl.create({
        title: 'Mohanlal Jewellers',
        message: 'Please Login / Register Your Account to View Item',
        buttons: [
          {
            text: 'Sign In',
            role: 'cancel',
            handler: () => {
              this.navCtrl.push(LoginPage)
            }
          },
          {
            text: 'Register',
            handler: () => {
              this.navCtrl.push(RegisterPage);
            }
          }
        ],
        enableBackdropDismiss: false // <- Here! :)
      });
      alert.present();
    }
    if (loginstatus == true) {
      this.navCtrl.push(CategorylistPage, { 'id_collect': id_collection });
    }
  }

  ngAfterViewInit() {
    let that = this;
    var loader = this.loadingCtrl.create( {
        content: "Please wait..."
    } );
    loader.present();
    this.categoryProvider.getNewArrivalsData(this.last_id).then(( data ) => {
        this.newarr = data;
    this.categoryProvider.getCategoryData().then(( data ) => {
        loader.dismiss();
        console.log(data)
        for ( let i = 0; i < data.length; i++ ) {
            setTimeout( function() {
                that.productItems.push( data[i] );
            }, 0 * i );
        }
        if(data.length == 0){
            this.load = true;
        }
        else{
            this.load = false;
        }
        // loader.dismiss();
    } );
} );

}

new(){
  this.navCtrl.push(NewarrivalsPage)
}
openProductdetails( product_id ) {
  var loginstatus = JSON.parse( localStorage.getItem( 'check' ));
  if( loginstatus == false || loginstatus == null){
        let alert = this.alertCtrl.create({
          title: 'Mohanlal Jewellers',
          message: 'Please Login / Register Your Account to View Item',
          enableBackdropDismiss: false, // <- Here! :)
          buttons: [
            {
              text: 'Sign In',
              role: 'cancel',
              handler: () => {
                  this.navCtrl.push(LoginPage)
              }
            },
            {
              text: 'Register',
              handler: () => {
                  this.navCtrl.push(RegisterPage);
              }
            }
          ]
        });
        alert.present();
  }
  if( loginstatus == true){
      this.navCtrl.push( ProductDetailPage, { proid: product_id } );
  }
}
}
