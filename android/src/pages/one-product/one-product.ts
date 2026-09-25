 // Generated class for the ProductListPage component.

 //  See http://ionicframework.com/docs/v2/components/#navigation for more info on
 //  Ionic pages and navigation.

import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Http } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { ReviewsRatingsPage } from '../../pages/reviews-ratings/reviews-ratings';
//import { ProductsService } from '../../providers/products-service';

@Component({
    selector: 'page-one-product',
    templateUrl: 'one-product.html',
    animations: [
        trigger('flyInTopSlow', [
            state("0", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 0', [
                animate('500ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,-500px,0)', offset: 0 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class OneProduct {
    segment: any = 'color';
    image: any;
    pricelist: any;
    item: any;
    price: any;
    productws: any;
    qty: any = 1;
    max: any;
   
    constructor(private http: Http, public nav: NavController, navParams: NavParams) {

        this.item = navParams.get('item');
        var array = [];
        //loop for rating
        for (var i = 0; i < this.item.allRatings.length; i++)
            array.push(this.item.allRatings[i][5 - i]);
        this.max = Math.max.apply(Math, array);

        //to show bydefault image while opening single product
        this.image = "assets/img/Products/"+this.item.id+"/1.jpeg";
    }

    getWidth(rating) {
        return Math.floor((rating * 100) / this.max);
    }
 //change the image for particular product
    changeImage(image) {
        this.image = 'assets/img/Products/'+ this.item.id + '/' + image;
    }

    showPicture() {
       // PhotoViewer.show(this.image, '', { share: false });
    }

    getClass(rating) {
        if (rating == 5)
            return 'fiveStar'
        if (rating == 4)
            return 'fourStar'
        if (rating == 3)
            return 'threeStar'
        if (rating == 2)
            return 'twoStar'
        if (rating == 1)
            return 'oneStar'
    }

    reviewsratings() {
        this.nav.push(ReviewsRatingsPage, { item: this.item}); //navigate to ReviewRatingPage
    }

}
