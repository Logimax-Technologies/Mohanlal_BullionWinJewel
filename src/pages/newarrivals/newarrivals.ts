import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,Events,LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { CategoryProvider } from '../../providers/category-provider';
import { FilterModalPage } from '../../pages/filter-modal/filter-modal';
/**
 * Generated class for the NewarrivalsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component( {
    selector: 'page-newarrivals',
    templateUrl: 'newarrivals.html',
	providers: [CategoryProvider],
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
export class NewarrivalsPage {
    mySearch: any = '';
	productitems = [];
	//filter
	filters :object [];
	filter_options  :object [];
	filterargs  :object; 
	
    constructor( public navCtrl: NavController, public navParams: NavParams, private commProvider: CommonProvider ,private modalCtrl:ModalController, private event: Events, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController) {
        if ( navParams.get( 'subcatid' ) != undefined ) {
            commProvider.updatecollectionpageaction( 'subcategory', navParams.get( 'subcatid' ) );
        } else {
            commProvider.updatecollectionpageaction( 'collection', null );
        }
		
		/*  let that = this;
		 this.commProvider.getFilterOptions().subscribe(function(res){
			 that.filters = res.filters;
			 that.filter_options = res.filter_options;
			 that.filterargs = res.filterargs;			 
			 
             let obj ={filters:res.filters,filter_options:res.filter_options,filterargs:res.filterargs}
			 localStorage.setItem( 'resetFilterData',JSON.stringify( obj ) );
		 }); */
    }
	
	/* // open filter modal 
    openModal() {
        let myModal = this.modalCtrl.create(FilterModalPage,{'filters':this.filters,'filter_options':this.filter_options,'filterargs':this.filterargs});
		
	   //on closing modal
		 myModal.onDidDismiss(data => {
			if(data == undefined){
				console.log("onDidDismiss - undefined ");
			
			}
			else{				
				console.log("onDidDismiss - else - call service ");
				let that = this;
				let loader = this.loadingCtrl.create( {
					content: "Please wait..."
				} );
				loader.present();
				this.categoryProvider.getProductFilterData(data).then(( data ) => {
				    that.productitems = [];
					for ( let i = 0; i < data.length; i++ ) {
						setTimeout( function() {
							that.productitems.push( data[i] );
						}, 0 * i );
					}
					loader.dismiss();
					this.event.publish( 'collection:updated', that.productitems );
					
				} );
				
			}
		 });
	  
      myModal.present();
    } */

    ionViewDidLoad() {
        console.log( 'ionViewDidLoad NewarrivalsPage' );
    }
    searchCollection() {
        console.log( this.mySearch );
    }

}
