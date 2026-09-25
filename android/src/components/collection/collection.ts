import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef,ViewChild } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';
import { NavController, LoadingController,ToastController,Platform,Events,Nav,  } from 'ionic-angular';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { CartPage } from '../../pages/cart/cart';
import { CommonProvider } from '../../providers/common';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the CollectionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component( {
    selector: 'collection',
    templateUrl: 'collection.html',
    providers: [CategoryProvider]
} )
export class CollectionComponent {

    checkStatus: boolean =false;
    text: string;
    @Input() data: any;
    list: any;
    @ViewChild( Nav ) nav: Nav;
    animateItems = [];
    productItems = [];
    selectedproducts: any = [];
    myproductschecked = false;
    isquickselect = false;
    loginstatus: any = false;
    load: any = false;
    productid: any = 0;
    subpage: any = true;
    animateClass: { 'zoom-in': true };
    constructor( public navCtrl: NavController, private commonservice: CommonProvider, private categoryProvider: CategoryProvider, public platform: Platform,private loadingCtrl: LoadingController,  public events: Events,public toastCtrl: ToastController ) {

      if(this.commonservice.getcollectionpagedetails().subcatid != null ){
        this.subpage= false;
      }
      // var loader = this.loadingCtrl.create( {
      //       content: "Please wait..."
      //   } );
      //   loader.present();
      this.events.subscribe( 'collection:updated', productitems => {
        // console.log('ccccccccc')
        console.log(this.commonservice.getcollectionpagedetails().subcatid)

        // loader.dismiss();
        if(productitems.length == 0){
          this.load = true;
        }else{
          this.load = false;
        }
        if ( productitems) {
          let that = this;
          let data = productitems;
          that.productItems = [];
          for ( let i = 0; i <data.length; i++ ) {
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
              purities:data[i].purities,
              status: data[i].status,
              stock_manage: data[i].stock_manage,
              weight: data[i].weight
            };
            let productItems=[];
            that.productItems.push( prod);
            console.log(that.productItems)
            if( productItems.length==0){
              console.log(that.productItems.length);
              var datas =+that.productItems.length
              console.log(datas);
              localStorage.setItem( 'product', JSON.stringify(1));
            }else{
              localStorage.setItem( 'product', JSON.stringify( that.productItems.length));
            }
          }
          console.log("collection:updated");
        }
      });
      this.events.subscribe( 'quickselect:changed',  (isquickselect) =>{
        if(isquickselect != undefined){
          console.log(">>>s>>>  quickselect:changed "+isquickselect);
          this.isquickselect = (isquickselect == 'Y' ? true:false);
          if(this.isquickselect == false){
            this.selectedproducts = [];
            this.myproductschecked = false;
          }
        }
      });
      this.events.subscribe( 'addqcart:clicked',  (flag) =>{
        if(flag != undefined){
          console.log("addcart:clicked");
          console.log(this.selectedproducts);
          if( this.selectedproducts.length > 0){
            this.addtocart();
          }else{
            console.log("Select atleast one item to proceed");
            let toast = this.toastCtrl.create( {
              message: 'Select atleast one item to proceed',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
        }
      });
        /* for(let i=0;i<30; i++){
            this.productItems.push(this.productItems.length);
        } */
    }
    ionViewDidLoad() {
      this.loginstatus = this.commonservice.getIsloggedIn();
    }
    ngAfterViewInit() {

      this.productid = 0;
      if(this.commonservice.getcollectionpagedetails().subcatid == null){
        let that = this;
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        console.log(this.productid);
        this.categoryProvider.getProductData(this.productid).then(( data ) => {
          console.log(data)
          for ( let i = 0; i <data.length; i++ ) {
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
                                purities:data[i].purities,
                                status: data[i].status,
                                stock_manage: data[i].stock_manage,
                                weight: data[i].weight
                };
                that.productItems.push( prod);
            },0*i)
          }
          loader.dismiss();
          if(data.length > 0){
            this.productid = data[data.length - 1]['id_product'];
          }
        })
        console.log(that.productItems)
      }
      if(this.commonservice.getcollectionpagedetails().subcatid != null){
        // console.log('1111111111111111111111');

        let that = this;
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        console.log(this.productid);
        this.categoryProvider.getProductData(this.productid).then(( data ) => {
          console.log(data)
          for ( let i = 0; i <data.length; i++ ) {
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
                                  purities:data[i].purities,
                                  status: data[i].status,
                                  stock_manage: data[i].stock_manage,
                                  weight: data[i].weight
                };
                that.productItems.push( prod);
            },0*i)
          }
          loader.dismiss();
          if(data.length > 0){
            this.productid = data[data.length - 1]['id_product'];
          }
        })
        console.log(that.productItems)

      }
    }

  doInfinite(infiniteScroll:any){
    console.log('11111111111111111111')
    let that = this;
    console.log(this.productItems)
    console.log( this.productid);

        this.categoryProvider.getProductData(this.productItems[this.productItems.length - 1]['id_product']).then(( data ) => {
          return new Promise<void>((resolve) => {
              setTimeout( function() {
                for ( let i = 0; i <data.length; i++ ) {
                  let prod = {
                              deliverydate:'',
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
                              purities:data[i].purities,
                              stock_manage: data[i].stock_manage,
                            };
                  that.productItems.push( prod);

                  if( that.productItems.length==0){
                    localStorage.setItem( 'product', JSON.stringify(1));
                  }else{
                  localStorage.setItem( 'product', JSON.stringify( that.productItems.length));
                          }
                          // if(data.length > 0){

                          //   this.productid = data[data.length - 1]['id_product'];
                          //   }
                          } resolve();
                          infiniteScroll.complete();
              },500);
            })
        } );
    }

    productschange( e, product ) {
       if( e.checked ) {
           this.selectedproducts.push( product );
       }else {
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
                  //  orders.qty += product.qty;
                  orders.qty = parseInt(orders.qty) + parseInt(product.qty);

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
    grid()
    {
        console.log("grid");
        this.checkStatus = true;
    }
    listgrid()
    {
        console.log("listgrid");
        this.checkStatus = false;
    }

    doRefresh(refresher) {

      this.productid = 0;
      this.productItems = [];
      let that = this;
      let loader = this.loadingCtrl.create( {
          content: "Please wait..."
      } );
      loader.present();
      console.log(this.productid);
          this.categoryProvider.getProductData(this.productid).then(( data ) => {
            console.log(data)
            for ( let i = 0; i <data.length; i++ ) {
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
                                purities:data[i].purities,
                                status: data[i].status,
                                stock_manage: data[i].stock_manage,
                                weight: data[i].weight
                              };
                              that.productItems.push( prod);
              },0*i)
            }loader.dismiss();
            if(data.length > 0){

              this.productid = data[data.length - 1]['id_product'];

              }
              refresher.complete();

          })
          console.log(that.productItems)

        }
}
