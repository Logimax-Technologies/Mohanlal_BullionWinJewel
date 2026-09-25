import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { CommonProvider ,BaseURL} from '../../providers/common';
import { ParseTreeResult } from '@angular/compiler/src/ml_parser/parser';
import { CustomPopupPage } from '../../pages/custom-popup/custom-popup';
import {Events, IonicPage, NavController,ModalController, NavParams,AlertController,ToastController,LoadingController } from 'ionic-angular';


/**
 * Generated class for the CheckoutComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component( {
    selector: 'checkout',
    templateUrl: 'checkout.html',
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
export class CheckoutComponent {
    order: any;
    text: string;
    checkoutitems: any = [];
    baseURL: string = BaseURL;
    private items: Array<any>;
    private totalAmount:number;
    private totalQuantity:number;
      total_weight = 0.00;

    constructor(public event:Events, private commonprovider: CommonProvider,public modal:ModalController  ) {
        this.checkoutitems = commonprovider.getUserCartDetails();
        for(var i=0; i<this.checkoutitems.length; i++){
            var wgt = Number(this.checkoutitems[i].reqweight);
            var qty = this.checkoutitems[i].qty ;
            this.total_weight +=qty*wgt;
        }
        console.log(this.checkoutitems);  
    }
    orderisurgent( e, order ) {
        if ( e.checked ) {
            let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
            let deliveryorders = [];
            curr_cartproducts.forEach(( orders ) => { // foreach statement
                if ( orders.id_product == order.id_product ) {
                    orders.isurgent = true;
                }
                deliveryorders.push( orders );
                this.checkoutitems = deliveryorders;
            } );
            localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );

        } else {
            let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
            let deliveryorders = [];
            curr_cartproducts.forEach(( orders ) => { // foreach statement
                if ( orders.id_product == order.id_product ) {
                    orders.isurgent = false;
                    orders.deliverydate = "";
                }
                deliveryorders.push( orders );
                this.checkoutitems = deliveryorders;
            } );
            localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
        }
    }
    changeDate(order){
        let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
        let deliveryorders = [];
        curr_cartproducts.forEach(( orders ) => { // foreach statement
            if ( orders.id_product == order.id_product ) {
                orders.deliverydate = order.deliverydate;
            }
            deliveryorders.push( orders );
            this.checkoutitems = deliveryorders;
        } );
        localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
    }

    view(data){
        let modal = this.modal.create(CustomPopupPage,{'data':data},{showBackdrop:true, enableBackdropDismiss:true});
        modal.present();
    }
}
