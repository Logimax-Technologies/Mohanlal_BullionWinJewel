import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common';

/*
  Generated class for the CustomerService page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
    selector: 'page-customer-service',
    templateUrl: 'customer-service.html',
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
        ] )
    ]
} )
export class CustomerServicePage {

    branchdet: any;
    constructor( public navCtrl: NavController, private commonservice: CommonProvider ) {
        this.branchdet = commonservice.getUserDetails();    
    }
}
