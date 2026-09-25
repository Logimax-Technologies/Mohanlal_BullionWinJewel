import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { CommonProvider } from '../../providers/common';
import { AlertController } from 'ionic-angular';
import { SubcategoryPage } from '../../pages/subcategory/subcategory';
import { LoginPage } from '../../pages/login/login';
import { RegisterPage } from '../../pages/register/register';
import { CollectionPage } from '../../pages/collection/collection';
import { NewarrivalsPage } from '../../pages/newarrivals/newarrivals';


@Component({
  selector: 'homecollection',
  templateUrl: 'homecollection.html',
  providers: [CategoryProvider]
})
export class HomecollectionComponent {
  checkStatus: boolean = false;

  text: string;
  @Input() data: any;
  list: any;
  loginstatus: any = false;
  animateItems = [];
  productItems = [];
  newarr: any[] = [];
  show: any = true;
  load: any = false;
  animateClass: { 'zoom-in': true };
  catprod: any[] = [];
  bottom: any[] = [{ 'img': 'assets/one.jpg' }, { 'img': 'assets/two.jpg' }, { 'img': 'assets/three.jpg' }, { 'img': 'assets/four.jpg' }];
  slides: any[] = [
    // { image: 'assets/img/slides/slide6.jpg' },
    { image: 'assets/img/slides/one.jpg' },
    { image: 'assets/img/slides/two.jpg' },
    { image: 'assets/img/slides/three.jpg' },
    // { image: 'assets/img/slides/four.jpg' },

    // { image: 'assets/img/slides/slide5.jpg' },
  ];
  last_id: any = 0;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private commonService: CommonProvider, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController, public events: Events) {
    // var loader = this.loadingCtrl.create( {
    //     content: "Please wait..."
    // } );
    // loader.present();
    // this.commonService.gethome().then(( data ) => {

    //     this.catprod = data;
    //     console.log(data)
    // });
    this.events.subscribe('collection:update', productitems => {

      this.productItems = [];
      this.productItems = productitems
      // loader.dismiss();
      console.log(productitems)
      this.show = false;
      if (productitems.length == 0) {
        this.load = true;
      }
      else {
        this.load = false;
      }
    });
  }
  new() {
    this.navCtrl.push(NewarrivalsPage)
  }
  ionViewDidLoad() {
    this.loginstatus = this.commonService.getIsloggedIn();
    console.log('444444')
    setTimeout(() => {
      console.log(true)
    }, 1000)
  }

  ngAfterViewInit() {
    let that = this;
    // let loader = this.loadingCtrl.create( {
    //     content: "Please wait..."
    // } );
    // loader.present();
    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.categoryProvider.getNewArrivalsData(this.last_id).then((data) => {
      this.newarr = data;
      this.categoryProvider.getCategoryData().then((data) => {
        loader.dismiss();
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          setTimeout(function () {
            that.productItems.push(data[i]);
          }, 0 * i);
        }
        if (data.length == 0) {
          this.load = true;
        }
        else {
          this.load = false;
        }
        // loader.dismiss();
      });
    });

  }
  // openProductdetails( product_id ) {
  //     this.navCtrl.push( ProductDetailPage, { proid: product_id } );
  // }
  // opensubCategories( category ) {
  //     this.navCtrl.push( SubcategoryPage, { category: category } );
  // }
  // openProductdetails( product_id ) {
  //     this.navCtrl.push( ProductDetailPage, { proid: product_id } );
  // }
  openproducts(subcatid) {
    console.log(subcatid)
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
      this.navCtrl.push(CollectionPage, { subcatid: subcatid });
    }
  }
  opensubCategories(category) {
    var loginstatus = JSON.parse(localStorage.getItem('check'));
    var navi = parseInt(localStorage.getItem('pubc'));

    if (loginstatus == false || loginstatus == null) {
      // let toast = this.toastCtrl.create( {
      //     message: 'Please Login / Register Your Account to View Item',
      //     duration: 4000,
      //     position: 'bottom'
      // } );
      // toast.present();
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
      this.navCtrl.push(SubcategoryPage, { category: category });
    }
  }
  go() {
    var loginstatus = JSON.parse(localStorage.getItem('check'));
    if (loginstatus == false || loginstatus == null) {
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
    if (loginstatus == true) {
      this.navCtrl.setRoot(CollectionPage);
    }
  }
  openProductdetails(product_id) {
    var loginstatus = JSON.parse(localStorage.getItem('check'));
    if (loginstatus == false || loginstatus == null) {
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
    if (loginstatus == true) {
      this.navCtrl.push(ProductDetailPage, { proid: product_id });
    }
  }
  grid() {
    console.log("grid");
    this.checkStatus = true;
  }
  listgrid() {
    console.log("listgrid");
    this.checkStatus = false;
  }
  doRefresh(refresher) {
    // this.commonService.gethome().then(( data ) => {
    //     this.catprod = data;
    //     console.log(data)
    // });
    this.productItems = [];
    this.categoryProvider.getCategoryData().then((data) => {
      this.productItems = data;
      this.show = true;
      console.log("results:" + JSON.stringify(data));
      /* var product=JSON.parse(localStorage.getItem( 'product')); */
      refresher.complete();
    })
  }
}
