import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ToastController,Platform,Events } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { CategoryProvider } from '../../providers/category-provider';
import { ProductDetailPage } from '../product-detail/product-detail';
import { CartPage } from '../cart/cart';

/**
 * Generated class for the MyDashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
    selector: 'page-my-dashboard',
    templateUrl: 'my-dashboard.html',
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
export class MyDashboardPage {

    branchname: any;
	productItems = [];
    selectedproducts: any = [];
    myproductschecked = false;
    isquickselect = false;
	addcartbtn = false;
    dispname: any;

    constructor(public events: Events,private categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams, private commonService: CommonProvider, public platform: Platform, private loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    }

    ionViewDidLoad() {
        console.log( 'ionViewDidLoad MyDashboardPage' );
        this.branchname = this.commonService.getBranchName();
    }
	ngAfterViewInit() {
        let that = this;
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();


this.dispname = JSON.parse( localStorage.getItem( 'newuser' ))['userdisplayname'];
console.log(this.dispname);

        this.categoryProvider.getCusSpecificProducts().then(( data ) => {
          for ( let i = 0; i < data.length; i++ ) {
              setTimeout( function() {
                  let prod = {deliverydate:'',
                              isurgent:0,
                              is_customeitem:0,
                              sizeorlen:data[i].sizeorlen,
                              id_product :data[i].id_product,
                              name:data[i].name,
                              is_chain:data[i].is_chain,
                              hook_type:data[i].hook_type,
                              reqweight:data[i].weight,
                              id_purity:data[i].id_purity,
                              imgurl:data[i].imgurl,
                              code:data[i].code,
                              customimages:[],
                              prodefaultimg:data[i].imgurl,
                              productimgdetails:[],
                              qty:data[i].qty,
                              is_new:data[i].is_new,
                              is_quickorder:1,
                              remarks:'Quick order',
                              is_stock_avail:data[i].is_stock_avail,
                              purities:data[i].purities
                            };
                  that.productItems.push( prod);
              }, 0 * i );
          }
            loader.dismiss();
        } );
    }
	productschange( e, product ) {
       if ( e.checked ) {
           this.selectedproducts.push( product );
       } else {
           let index: number = this.selectedproducts.indexOf( product );
           if ( index !== -1 ) {
               this.selectedproducts.splice( index, 1 );
           }
       }
       if ( this.selectedproducts.length > 0 ) {
           this.myproductschecked = true;
       } else {
           this.myproductschecked = false;
       }
       console.log( this.selectedproducts);
   }

   addtocart(  ) {
     let loader = this.loadingCtrl.create( {
       content: "Please wait..."
     } );
     loader.present();
     if(this.selectedproducts.length > 0){
         this.selectedproducts.forEach(( product ) => { // foreach statement
           if ( localStorage.getItem( 'appcartitems' ) != null ) {
               let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
               let deliveryorders = [];
               let prodavail = true;
               curr_cartproducts.forEach(( orders ) => { // foreach statement
                 if ( orders.id_product == product.id_product && orders.id_purity == product.id_purity && product.sizeorlen == orders.sizeorlen && product.reqweight == orders.reqweight ) {
                   orders.qty += product.qty;
                   prodavail = false;
                 }
                 deliveryorders.push( orders );
               } ); // end of foreach
               if ( prodavail ) {
                 deliveryorders.push( product );
               }
              localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
           } else {
             let deliveryorders = [];
             deliveryorders.push( product );
             localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
           }
         }); // end of foreach
           this.myproductschecked = false;
           console.log("Before empty"+this.selectedproducts);
           this.selectedproducts = [];
           console.log("After empty"+this.selectedproducts);
           loader.dismiss();
           if ( this.platform.is( 'cordova' ) ) {
          //     this.toast.show( 'Item added to cart', 'short', 'center' ).subscribe(
          //    toast => {
          //  }
          // );
          } else {
            console.log("****** Item added to cart");
            let toast = this.toastCtrl.create( {
              message: 'Item added to cart',
              duration: 3000,
              position: 'bottom'
            } );
            toast.present();
          }
          this.events.publish( 'cart:changed', ( JSON.parse( localStorage.getItem( 'appcartitems' ) ).length ) );
          this.navCtrl.setRoot( CartPage );
          //this.navCtrl.pop();
        }else{
			loader.dismiss();
		}
    }
    openProductdetails( product_id ) {
        this.navCtrl.push( ProductDetailPage, { proid: product_id } );
    }

	quickselect(){
      this.isquickselect = !this.isquickselect;
      this.addcartbtn = (this.isquickselect == true ? true:false);
    }
}
