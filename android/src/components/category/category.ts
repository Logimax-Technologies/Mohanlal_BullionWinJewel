import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { CategoryProvider } from '../../providers/category-provider';
import { NavController, LoadingController,Events } from 'ionic-angular';
import { SubcategoryPage } from '../../pages/subcategory/subcategory';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';

/**
 * Generated class for the CategoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component( {
    selector: 'category',
    templateUrl: 'category.html',
    providers: [CategoryProvider]
} )
export class CategoryComponent {
    checkStatus: boolean =false;
    text: string;
    @Input() data: any;
    list: any;
    show: any = true;


    animateItems = [];
    categoryItems = [];
    animateClass: { 'zoom-in': true };
    constructor(public events: Events, public navCtrl: NavController, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController ) {
        this.events.subscribe( 'collection:updat', productitems => {
           this.categoryItems = [];
           this.categoryItems = productitems
            console.log(productitems)
            this.show = false;
        });
    }

    ngAfterViewInit() {
        let that = this;
        var categories = that.categoryProvider.getCategories();

        for ( let i = 0; i < categories.length; i++ ) {
            setTimeout( function() {
                that.animateItems.push( categories[i] );
            }, 0 * i );
        }
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        this.categoryProvider.getCategoryData().then(( data ) => {
            for ( let i = 0; i < data.length; i++ ) {
                setTimeout( function() {
                    that.categoryItems.push( data[i] );
                }, 0 * i );
            }
            loader.dismiss();
        } );
        console.log(that.categoryItems)
    }
    opensubCategories( category ) {
        this.navCtrl.push( SubcategoryPage, { category: category } );
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
    doRefresh(refresher){
        this.categoryItems = [];
        this.categoryProvider.getCategoryData().then(( data ) => {
            this.categoryItems=data;
            this.show = true;
        console.log("results:"+JSON.stringify(data));
        /* var product=JSON.parse(localStorage.getItem( 'product')); */
        refresher.complete();
        })  
    }
    openProductdetails( product_id ) {
        this.navCtrl.push( ProductDetailPage, { proid: product_id } );
    }
}
