import { Component, trigger, state, style, transition, animate, keyframes,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CollectionPage } from '../../pages/collection/collection';
import { Toast } from '@ionic-native/toast';
import { CommonProvider, BaseAPIURL } from '../../providers/common';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CartPage } from '../../pages/cart/cart';
import { ScrollHideConfig } from '../../directives/hide-footer/hide-footer';
import { LoginPage } from '../../pages/login/login';
import { RegisterPage } from '../../pages/register/register';
/**
 * Generated class for the QuotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-quote',
  templateUrl: 'quote.html',
})
export class QuotePage {


  product:any;
  purityname:any ='';

  constructor( private commonservice: CommonProvider,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private ftransfer: FileTransfer, private file: File, public http: Http, private alertCtrl: AlertController ) {

    this.product = this.navParams.get('data')
    console.log(this.product)
    if(this.product.purities.length == 1){
      this.purityname = this.product.purities[0].purity;
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuotePage');
  }
  addtocart( product ) {
    var loginstatus = JSON.parse( localStorage.getItem( 'check' ));
    if( loginstatus == false || loginstatus == null){

        // let toast = this.toastCtrl.create( {
        //     message: 'Please Login / Register Your Account to Checkout Your Item',
        //     duration: 4000,
        //     position: 'bottom'
        // } );
        // toast.present();
        let alert = this.alertCtrl.create({
            title: 'Aurum Chain',
            message: 'Please Login / Register Your Account to View Item',
            enableBackdropDismiss: false, // <- Here! :)

            buttons: [
              {
                text: 'SignIn',
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

    let loader = this.loadingCtrl.create( {
        content: "Please wait..."
    } );
    loader.present();

    if ( (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) || product.id_purity == undefined ) {
        console.log( product );
        if (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) {
            if ( this.platform.is( 'cordova' ) ) {
                this.toast.show( 'Minimum order weight is '+product.order_minweight+' g', 'short', 'center' ).subscribe(
                    toast => {
                        console.log( toast );
                    }
                );
            } else {
                let toast = this.toastCtrl.create( {
                    message: 'Minimum order weight is '+product.order_minweight+' g',
                    duration: 5000,
                    position: 'bottom'
                } );
                toast.present();
            }
        }
        else if ( product.id_purity == undefined ) {
            if ( this.platform.is( 'cordova' ) ) {
                this.toast.show( 'Select purity', 'short', 'center' ).subscribe(
                    toast => {
                        console.log( toast );
                    }
                );
            } else {
                let toast = this.toastCtrl.create( {
                    message: 'Select purity',
                    duration: 4000,
                    position: 'bottom'
                } );
                toast.present();
            }
        }
        /* else if ( product.sizeorlen == undefined ) {
            if ( this.platform.is( 'cordova' ) ) {
                this.toast.show( 'Enter size or length', 'short', 'center' ).subscribe(
                    toast => {
                        console.log( toast );
                    }
                );
            } else {
                let toast = this.toastCtrl.create( {
                    message: 'Enter size or length',
                    duration: 5000,
                    position: 'bottom'
                } );
                toast.present();
            }
        } */
        loader.dismiss();
    }
    else {
        if ( localStorage.getItem( 'appcartitems' ) != null ) {
            let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
            let deliveryorders = [];
            let prodavail = true;
            curr_cartproducts.forEach(( orders ) => { // foreach statement
                if ( orders.id_product == product.id_product && orders.id_purity == product.id_purity && product.sizeorlen == orders.sizeorlen && product.reqweight == orders.reqweight) {
                    orders.qty += product.qty;
                    prodavail = false;
                }
                deliveryorders.push( orders );
            } );
            if ( prodavail ) {
                deliveryorders.push( product );
            }
            localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
        } else {
            let deliveryorders = [];
            deliveryorders.push( product );
            localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
        }

        loader.dismiss();
        if ( this.platform.is( 'cordova' ) ) {
            this.toast.show( 'Item added to cart', 'short', 'center' ).subscribe(
                toast => {
                    console.log( toast );
                }
            );
        } else {
            let toast = this.toastCtrl.create( {
                message: 'Item added to cart',
                duration: 3000,
                position: 'bottom'
            } );
            toast.present();
        }
        this.event.publish( 'cart:changed', ( JSON.parse( localStorage.getItem( 'appcartitems' ) ).length ) );
        this.navCtrl.setRoot( CartPage,{value:''} );
        //this.navCtrl.pop();
    }
}
}
  // closeModal(){
  //   this.view.dismiss();
  // }
}
