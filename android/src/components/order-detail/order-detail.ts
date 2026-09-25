import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, LoadingController,NavParams } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category-provider';
import { OrdersPage } from '../../pages/orders/orders';
/*
  Generated class for the CategoryTile component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component( {
    selector: 'order-detail',
    templateUrl: 'order-detail.html',
    providers: [CategoryProvider]
} )
export class OrderDetailComponent {

    text: string;
    @Input() data: any;
    list: any;
    animateItems = [];
    animateClass: { 'zoom-in': true };
	showSpinner = true;
    dashboarddata = {
        allorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
        urgentorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
        catalogorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
        customerorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
        urgentcatalogorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
        urgentcustomerorders: { "deliveryready": 0, "workinprocess": 0, "pendingacceptence": 0, "rejected": 0, "overdue": 0, "todayorder": 0 },
    };

    constructor( public navCtrl: NavController, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController , public navParams: NavParams ) {

    }

    ngAfterViewInit() {
        /* let that = this;
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } ); */
       /*  loader.present(); */
        this.categoryProvider.getDashboardData().then(( data ) => {
            this.dashboarddata = data;
			this.showSpinner = false;
            console.log( data.allorders.deliveryready );
            /* loader.dismiss(); */
        } );
    }

    openList( type:string ) {
        this.navCtrl.push(OrdersPage, { type: type});
    }
	
	openCategory( category ) {
        //this.navCtrl.push(ProductListPage, { category: category});
    }

}
