import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Events, LoadingController,FabContainer } from 'ionic-angular';
import { ReviewsRatingsPage } from '../../pages/reviews-ratings/reviews-ratings';
import { CommonProvider } from '../../providers/common';
import { stringify } from '@angular/core/src/util';
import { AlertController } from 'ionic-angular';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { JobDetailPage } from '../../pages/job-detail/job-detail';

/*
  Generated class for the YourOrders page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
    selector: 'page-my-orders',
    templateUrl: 'my-orders.html',

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
export class MyOrdersPage {
    item: any;
    orders: any = [];
    myorders: any = [];
    quotes: any[] = [];
    loginstatus: any = false;
    relationship:any = 'cat';
    checkStatus: boolean =false;

    constructor( public navCtrl: NavController,private alertCtrl: AlertController, private event: Events, private loadingCtrl: LoadingController, private commonService: CommonProvider ) {
    }

    ionViewDidLoad() {
        console.log(JSON.parse( localStorage.getItem( 'appcurrentUser' ) ));

        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        this.commonService.getOrders( ).then(( data ) => {
            if ( data.success ) {
                this.orders = data.responseData ;
                this.myorders = data.responseData ;
                console.log("Myoders"+JSON.stringify(this.myorders));   
            }
            loader.dismiss();
        } );
    }
	
	//filter
	filterbyStatus(orderstatus: string, fab: FabContainer) {
	  fab.close();
	  if(orderstatus){
		  if(orderstatus =='ALL'){
			 this.myorders = this.orders;
		  }
		  else{
			 let filteredOrders = this.orders.filter(o => o.status == orderstatus);
			 this.myorders = filteredOrders;
		  } 
	  }
	}

    // to provide Review And Rating
    reviewsratings() {
        var newObj = { name: "Fashion Line Casual Short Sleeve Solid Women's Black Top", rating: 3.5, reviews: 23 }
        this.navCtrl.push( ReviewsRatingsPage, { item: newObj } );
    }
    viewdetails(order,index) {
         this.navCtrl.push( JobDetailPage, { 'jobdetails':order } );
    }
    segmentChanged(e){

    }
    Ascending()
    {
        console.log("Ascending");
        this.myorders.sort(this.sortByProperty('id','ASC'));
        this.checkStatus = true;
    }
    Descending()
    {
        console.log("Decending");
        this.myorders.sort(this.sortByProperty('id','DESC'));
        this.checkStatus = false;
    }
    sortByProperty(property,orderBy){
		return function (x, y) {
			if(orderBy == 'ASC'){
			return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
			}else{
			return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
			}
		};
    }
}
