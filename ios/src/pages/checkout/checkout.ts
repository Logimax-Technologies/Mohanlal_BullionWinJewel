import { Component } from '@angular/core';
import { IonicPage, Events, ModalController,NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { WriteReviewPage } from '../../pages/write-review/write-review';


/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
} )
export class CheckoutPage {
    imageModal: any;
     count = 0;

    customerdetails: any = this.emptycustomerdetails();
    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public event: Events, public navParams: NavParams, public commonProvider: CommonProvider, public alertCtrl: AlertController, public toastCtrl: ToastController, private loadingCtrl: LoadingController ) {
        this.event.subscribe( 'close', temp => {
            
            console.log(temp)
            console.log(this.count)
            if(temp == true && this.count == 0){

                this.navCtrl.setRoot(MyDashboardPage)
                this.count ++;
            }
        }); 
          }

    ionViewDidLoad() {
        console.log(this.navParams.get('til'));
        console.log( 'ionViewDidLoad CheckoutPage' );
        console.log(JSON.parse( localStorage.getItem( 'appcurrentUser' ) ));
        console.log( JSON.parse( localStorage.getItem( 'newuser' )));
        console.log( this.commonProvider.getAppUserId() );
    }
    emptycustomerdetails() {
        let branchdet = JSON.parse( localStorage.getItem( 'newuser' ));
        console.log(branchdet);
        return {
            order_for: 2,
            order_to: branchdet.id_branch,
            cus_mobile: null,
            cus_name: null,
            cus_address: null,
            id_state: branchdet.id_state,
            id_city: branchdet.id_city,
            id_country: branchdet.id_country,
            order_taken_by: branchdet.userid
        };
    }
    confirmOrder() {

       /*  if ( this.customerdetails.order_for == 2 ) {
            if ( this.customerdetails.cus_mobile == null && this.customerdetails.cus_name == null && this.customerdetails.cus_address == null ) {
                let toast = this.toastCtrl.create( {
                    message: 'Please enter required fields',
                    duration: 2000,
                    position: "middle"
                } );

                toast.present( toast );
                return;
            }
        } */

        let confirm = this.alertCtrl.create( {
            title: 'Order Confirmation?',
            message: 'Do you agree to submit this order?',  
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                  
                       
                        console.log( 'Disagree clicked' );
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        let loader = this.loadingCtrl.create( {
                            content: "Please wait..."
                        } );
                        loader.present();
                        console.log(this.navParams.get('til'));
                      
        this.commonProvider.doConfirmOrder( JSON.stringify( {'orders': JSON.parse( localStorage.getItem( 'appcartitems' ) ), 'cusdetails': this.customerdetails,'is_admin_through' : 0} ) ).then( res => {
           console.log(res);

            if ( res ) {				
                if ( res.success ) {
                    let toast = this.toastCtrl.create( {
                        message: res.message,
                        duration: 2000,
                        position: "bottom"
                    } );

                    toast.present( toast );
  
                    let appcurrentitems = [];
                    localStorage.setItem( 'appcartitems', JSON.stringify( appcurrentitems ) );

                    this.event.publish( 'cart:changed', 0 );
                    // this.imageModal = this.modalCtrl.create(WriteReviewPage,{data: res['responseData']});
                    // this.imageModal.present();
  
                    this.navCtrl.setRoot( MyDashboardPage );
                } else {
                    //this.commonservice.showAlertMSG( 2, res.message );
                    let toast = this.toastCtrl.create( {
                        message: res.message,
                        duration: 2000,
                        position: "bottom"
                    } );

                    toast.present( toast );

                }
                loader.dismiss();
            }
        }, error => {
            loader.dismiss();
        } );
    }
}
            ]
        } );
confirm.present();
    }

}
