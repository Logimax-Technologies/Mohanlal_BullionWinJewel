import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Events, LoadingController,FabContainer ,NavParams} from 'ionic-angular';
import { CommonProvider } from '../../providers/common';

/*
  Generated class for the YourOrders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
    selector: 'page-orders',
    templateUrl: 'orders.html',

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
export class OrdersPage {
    item: any;

    orders: any = [];
    myorders: any = [];
	listType;
	title;
    constructor( public navCtrl: NavController, private event: Events, private loadingCtrl: LoadingController, private commonService: CommonProvider,public navParams: NavParams ) {
        this.listType = navParams.data.type;
		if(this.listType == 'RD'){
			this.title = 'Ready Orders';
		}else if(this.listType == 'RJ'){
			this.title = 'Rejected Orders';
		}else if(this.listType == 'IP'){
			this.title = 'In Progress Orders';
		}else if(this.listType == 'TO'){
			this.title = 'Today Orders';
		}else if(this.listType == 'OD'){
			this.title = 'Overdue Orders';
		}else if(this.listType == 'PD'){
			this.title = 'Pending Orders';
		}else if(this.listType == 'PO'){
			this.title = 'Partial Orders';
		}else{
			this.title = 'Orders';
		}
    }
    ionViewDidLoad() {
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        this.commonService.getDashListData(this.listType ).then(( data ) => {
            if ( data.success ) {
                this.orders = data.responseData ;
                this.myorders = data.responseData ;
            }
            loader.dismiss();
        } );
    }

}
