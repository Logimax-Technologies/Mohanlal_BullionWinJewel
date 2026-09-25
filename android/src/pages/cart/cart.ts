import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController,NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { CheckoutPage } from '../../pages/checkout/checkout';
import { CommonProvider } from '../../providers/common';

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
    selector: 'page-cart',
    templateUrl: 'cart.html',
    animations: [
        trigger( 'flyInTopSlow', [
            state( "0", style( {
                transform: 'translate3d(0,0,0)'
            } ) ),
            transition( '* => 0', [
                animate( '500ms ease-in', keyframes( [
                    style( { transform: 'translate3d(0,-500px,0)', offset: 0 } ),
                    style( { transform: 'translate3d(0,0,0)', offset: 1 } )
                ] ) )
            ] )
        ] ),

        trigger( 'flyAlternameSlow', [
            state( "1", style( {
                transform: 'translate3d(0,0,0)'
            } ) ),
            state( "0", style( {
                transform: 'translate3d(0,0,0)'
            } ) ),
            transition( '* => 1', [
                animate( '1000ms ease-in', keyframes( [
                    style( { transform: 'translate3d(500px,0,0', offset: 0 } ),
                    style( { transform: 'translate3d(-10px,0,0)', offset: 0.5 } ),
                    style( { transform: 'translate3d(0,0,0)', offset: 1 } )
                ] ) )
            ] ),
            transition( '* => 0', [
                animate( '1000ms ease-in', keyframes( [
                    style( { transform: 'translate3d(-1000px,0,0', offset: 0 } ),
                    style( { transform: 'translate3d(10px,0,0)', offset: 0.5 } ),
                    style( { transform: 'translate3d(0,0,0)', offset: 1 } )
                ] ) )
            ] )
        ] )

    ]
} )
export class CartPage {
    qty: any = 1;
    checkoutstatus: any = false;
    iscartempty = true;
    totalcartitems = 0;

    constructor( public navParams: NavParams, public navCtrl: NavController, public event: Events, public commonProvider: CommonProvider, public alertCtrl: AlertController, private loadingCtrl: LoadingController ) { }

    ionViewWillEnter() {
        console.log('1cart',this.navParams.get('data'))
        console.log('2cart',this.navParams.get('value'));
        this.event.publish('pageno',3);
        console.log( this.commonProvider.getTotalCartItems() );
        console.log(JSON.parse(localStorage.getItem('check')));
        this.checkoutstatus = ( JSON.parse(localStorage.getItem('check')) && this.commonProvider.getTotalCartItems() > 0 );
        let curr_cartproducts = [];
        console.log(JSON.parse( localStorage.getItem( 'appcartitems' ) ));
        curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
        console.log('3cart',curr_cartproducts);
        if(curr_cartproducts != null && curr_cartproducts.length > 0){
            this.iscartempty = false;
            this.totalcartitems = curr_cartproducts.length;
            console.log(this.totalcartitems)
        }
        this.event.subscribe( 'cart:changed', totalcartitems => {
            if ( totalcartitems !== undefined && totalcartitems !== "" ) {
                this.totalcartitems = totalcartitems;
                console.log(this.totalcartitems)
            }
        } );
    }

    add( order ) {
        this.qty = this.qty + 1; //to add quantity
        console.log('4cart');
    }

    sub( order ) {
        if ( this.qty != 1 )
            this.qty = this.qty - 1;   //to remove quantity
        console.log('5cart');
    }
    
    emptyCart() {
        console.log('6cart');
        let confirm = this.alertCtrl.create( {
            title: 'Empty Cart Confirmation?',
            message: 'Do you agree to empty this cart?',
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
                        let deliveryorders = [];
                        localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
                        this.event.publish( 'cart:changed', 0 );
                        loader.dismiss();
                        this.navCtrl.setRoot( MyDashboardPage );
                    }
                }
            ]
        } );
        confirm.present();
    }
    checkoutCart() {
        console.log('carttttttt : ==========>');
        
        console.log(this.navParams.get('data'))
       // if(this.navParams.get('data') !=null && this.navParams.get('data') !=undefined && this.navParams.get('data').length !=0){
            this.navCtrl.push( CheckoutPage,{temp:this.navParams.get('data'),til:this.navParams.get('value')} );
      //  }
  
    }

}
