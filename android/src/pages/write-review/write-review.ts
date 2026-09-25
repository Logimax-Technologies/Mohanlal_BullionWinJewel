import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController,ViewController,ToastController, NavParams ,Events} from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { CommonProvider } from '../../providers/common';


/*
  Generated class for the WriteReview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
  providers:[CommonProvider],
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
export class WriteReviewPage {
item: any;
rating: any = 0;
description: any = '';

  constructor(public commonProvider: CommonProvider, public toastCtrl: ToastController,public event: Events,public navCtrl: NavController, navParams: NavParams,public viewCtrl:ViewController) {
      this.item = navParams.get('data');
      console.log(this.item);
      this.event.subscribe('details', (temp) =>{
        console.log(temp)
    });
      this.event.subscribe('star-rating:changed', (starRating) =>{
          this.rating = starRating;
        console.log(starRating)});
  }
  closeModal(){
    this.viewCtrl.dismiss();
    this.event.publish('close',true);
  }
  submit(){
    if(this.rating !=0){
        this.commonProvider.feedback(this.rating,this.description,this.item).then(data =>{
            let toast = this.toastCtrl.create( {
                message: 'Review Submitted',
                duration: 2000,
                position: "bottom"
            } );
        
            toast.present( toast );
            this.viewCtrl.dismiss();
            this.event.publish('close',true)
        })
    }
    else{
        let toast = this.toastCtrl.create( {
            message: 'Please Rate It',
            duration: 2000,
            position: "bottom"
        } );
        toast.present( toast );
    }
    //   this.navCtrl.setRoot( HomePage );
  }
}
