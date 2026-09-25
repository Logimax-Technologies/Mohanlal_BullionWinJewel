import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef, ViewChild } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';
import { NavController, LoadingController, ToastController, Platform, Events, Nav, NavParams, AlertController } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { CartPage } from '../../pages/cart/cart';
import { CommonProvider } from '../../providers/common';
import { HomePage } from '../../pages/home/home';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CollectionPage } from '../collection/collection';

@Component({
  selector: 'page-categorylist',
  templateUrl: 'categorylist.html',
  providers: [CategoryProvider]
})
export class CategorylistPage {

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

  id_collection = this.navParams.get('id_collect');
  last_id: any = 0;

  constructor(private alertCtrl: AlertController, public navParams: NavParams, public navCtrl: NavController, private commonservice: CommonProvider, private categoryProvider: CategoryProvider, public platform: Platform, private loadingCtrl: LoadingController, public events: Events, public toastCtrl: ToastController) {
    console.log(this.id_collection);

    var loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.commonservice.gethome(this.id_collection, this.last_id).then((data) => {
      if (data) {
        this.catprod = data;
        console.log(data)
      }
      loader.dismiss();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorylistPage');
  }
  // doRefresh(refresher) {
  //   this.commonservice.gethome().then((data) => {
  //     this.catprod = data;
  //     console.log(data)
  //   });
  //   this.productItems = [];
  //   this.categoryProvider.getCategoryData().then((data) => {
  //     this.productItems = data;
  //     this.show = true;
  //     console.log("results:" + JSON.stringify(data));
  //     /* var product=JSON.parse(localStorage.getItem( 'product')); */
  //     refresher.complete();
  //   })
  // }

  grid() {
    console.log("grid");
    this.checkStatus = true;
  }
  listgrid() {
    console.log("listgrid");
    this.checkStatus = false;
  }

  openproducts(id_category) {
    console.log(id_category)
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
      this.navCtrl.push(CollectionPage, { 'category_id': id_category });
    }
  }

  doInfinite(infiniteScroll: any) {
    // Set last_id to the last item's id_category
    this.last_id = this.catprod[this.catprod.length - 1]['id_category'];

    this.commonservice.gethome(this.id_collection, this.last_id).then(data => {
      console.log(data);

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          this.catprod.push(data[i]);
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
