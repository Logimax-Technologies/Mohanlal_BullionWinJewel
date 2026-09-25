import { CollectionPage } from '../../pages/collection/collection';
import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController,Events,LoadingController} from 'ionic-angular';
import { CommonProvider } from '../../providers/common';
import { FilterModalPage } from '../../pages/filter-modal/filter-modal';
import { CategoryProvider } from '../../providers/category-provider';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';

/**
 * Generated class for the SubcategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
    selector: 'page-subcategory',
    templateUrl: 'subcategory.html',
    providers: [CategoryProvider]
} )
export class SubcategoryPage {
    categoryId: any;
    subcategoryItems = [];
    filters :object [];
	filter_options  :object [];
    filterargs  :object;
    show = true;
    constructor(private modalCtrl:ModalController, private event: Events, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController, private commonService: CommonProvider,public navCtrl: NavController, public navParams: NavParams ) {
        this.categoryId = navParams.data.category;
        localStorage.setItem('catid', this.categoryId);
        let that = this;
        this.commonService.getFilterOptions().subscribe(function(res){
            that.filters = res.filters;
            that.filter_options = res.filter_options;
            that.filterargs = res.filterargs;
            let obj ={filters:res.filters,filter_options:res.filter_options,filterargs:res.filterargs}
            localStorage.setItem( 'resetFilterData',JSON.stringify( obj ) );
        });
    }

    ionViewDidLoad() {
        let that = this;
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        this.categoryProvider.getSubCategoryData( this.categoryId ).then(( data ) => {
            for ( let i = 0; i < data.length; i++ ) {
                setTimeout( function() {
                    that.subcategoryItems.push( data[i] );
                }, 0 * i );
            }
            loader.dismiss();
        } );
    }
    opensubCategories( category ) {
        this.navCtrl.push( SubcategoryPage, { category: category } );
    }
    openproducts( subcatid ) {
        console.log(subcatid)
        this.navCtrl.push( CollectionPage, { subcatid: subcatid } );
    }
    openProductdetails( product_id ) {
        this.navCtrl.push( ProductDetailPage, { proid: product_id } );
    }
    // open filter modal
    openModal() {
        var currentUser = JSON.parse( localStorage.getItem( 'appcurrentUser' ) );
        console.log("dddwd"+currentUser);
        console.log( this.filters)
        if(currentUser == null){
            var temp = 1;
        }
        else{
            temp = currentUser.show_type;
        }

        let myModal = this.modalCtrl.create(FilterModalPage,{'show_type':temp,'filters':this.filters,'filter_options':this.filter_options,'filterargs':this.filterargs});
        console.log(myModal)
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
                this.subcategoryItems = [];

                this.categoryProvider.getProductFilterData(data).then(( data ) => {
                    this.show = false;
                    this.subcategoryItems = data;

                  loader.dismiss();
                } );
            }
         });
      myModal.present();
    }
    doRefresh(refresher){
        this.subcategoryItems = [];
        this.categoryProvider.getSubCategoryData(JSON.parse(localStorage.getItem('catid'))).then(( data ) => {
            this.subcategoryItems=data;
            this.show = true;
        console.log("results:"+JSON.stringify(data));
        /* var product=JSON.parse(localStorage.getItem( 'product')); */
        refresher.complete();
        })  
    }
}
