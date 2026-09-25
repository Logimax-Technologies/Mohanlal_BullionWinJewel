import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { ProductsProvider } from '../../providers/products-provider';
import { BaseURL} from '../../providers/common';

import { OneProduct } from '../../pages/one-product/one-product';

@Component( {
    selector: 'cart',
    templateUrl: 'cart.html',
    providers: [ProductsProvider],
    animations: [

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
export class CartComponent {

    qty:any= 1;
    text: string;
    items = [];
    total_weight=0.00;
    orders:Number;

    baseURL: string = BaseURL;
    qty_type: any;
    productname: any;
    length: any;
    remarks: any;
    customer_ref_no: any;
    constructor( private productsProvider: ProductsProvider, public event: Events, private navCtrl: NavController ) {
        this.text = 'Hello World';
    }

    add( product ) {
        this.total_weight = 0.00;
        this.items.forEach(( orders ) => { // foreach statement
            console.log(orders);
            if ( orders.id_product == product.id_product && orders.sizeorlen == product.sizeorlen ) {
                orders.qty = parseFloat(product.qty) + 1;
            }
            var wgt = Number(orders.reqweight);
            console.log('add',typeof wgt,wgt);
            var qty =(orders.qty);
            console.log('add',typeof qty,qty);
            this.total_weight +=qty*wgt;
            console.log('add',typeof this.total_weight,this.total_weight);
            console.log(wgt+"--"+qty+"--"+this.total_weight);
        } );
        localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
    }

    sub( product ) {
        this.total_weight = 0.00;
        this.items.forEach(( orders ) => { // foreach statement
            if ( orders.id_product == product.id_product && orders.sizeorlen == product.sizeorlen ) {
                if ( product.qty != 1 )
                    orders.qty = product.qty - 1;
            }
            var wgt =Number(orders.reqweight);
            console.log('sub',typeof wgt,wgt);
            var qty = orders.qty ;
            console.log('sub',typeof qty,qty);
            this.total_weight +=qty*wgt;
            console.log('sub',typeof this.total_weight,this.total_weight);
            console.log(wgt+"--"+qty+"--"+this.total_weight);
        } );
        localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
    }
    remove( product ) {
        let index: number = this.items.indexOf( product );
        if ( index !== -1 ) {
            this.items.splice( index, 1 );
        }
        localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
        let curr_cartproducts = [];
        curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
        if(curr_cartproducts != null && curr_cartproducts.length > 0){
            this.event.publish( 'cart:changed', curr_cartproducts.length );
        }else{
            // this.navCtrl.push( MyDashboardPage);
            this.event.publish( 'cart:changed', 0 );
        }
        this.total_weight = 0.00;
        this.items.forEach(( orders ) => { // foreach statement
            if ( orders.id_product == product.id_product ) {
                if ( product.qty != 1 )
                    orders.qty = product.qty - 1;
            }
            var wgt =Number(orders.reqweight);
            console.log('remove',typeof wgt,wgt);
            var qty = orders.qty ;
            console.log('remove',typeof qty,qty);
            this.total_weight +=qty*wgt;
            console.log('remove',typeof this.total_weight,this.total_weight);
            console.log(wgt+"--"+qty+"--"+this.total_weight);
        } );
        localStorage.setItem( 'appcartitems', JSON.stringify( this.items ) );
    }

    ngAfterViewInit() {
        let that = this;
        /*var products = [2,4,9];
        that.productsProvider.filterProducts(products).subscribe(function(res){
          that.items = res;
      })*/
        if ( JSON.parse( localStorage.getItem( 'appcartitems' ) ) != null && JSON.parse( localStorage.getItem( 'appcartitems' ) ) != 'null' ) {
            that.items = JSON.parse( localStorage.getItem( 'appcartitems' ) );
            console.log(that.items);
            for(var i=0; i<that.items.length; i++){
                var wgt=Number(that.items[i].reqweight);
                console.log('new',typeof wgt,wgt);
                var qty=that.items[i].qty ;
                console.log('new',typeof qty,qty);
                this.total_weight +=qty*wgt;
                console.log('new',typeof this.total_weight,this.total_weight);
                console.log("hgvhb"+wgt+"--"+qty+"--"+this.total_weight);
            }
          return 0;
        }
    }

    openProduct( item ) {
        this.navCtrl.push( OneProduct, { item: item } );
    }

}
