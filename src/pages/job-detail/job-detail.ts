import { Component, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { IonicPage, Events, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { MyOrdersPage } from '../../pages/my-orders/my-orders';
import { CommonProvider } from '../../providers/common';
import { DisplayWhen } from 'ionic-angular/components/show-hide-when/display-when';

@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail.html',
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
export class JobDetailPage {
  proid: any;
  productdet: any = [];
  reference: any = [];
  disablebtn = false;
  resons: any = [];
  otherReasonText: string = '';
  selectedReason: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private commonService: CommonProvider, public alertCtrl: AlertController, public toastCtrl: ToastController, private event: Events) {
    this.productdet = navParams.get('jobdetails');
    console.log(navParams.get('jobdetails'));

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    if (this.productdet['status'] == 0) {
      this.commonService.resons().then((data) => {
        if (data.success) {
          this.resons = data['responseData'];
        }
        loader.dismiss();
      });
    }
    loader.dismiss();
  }
  changeImage(image) {
    this.productdet.image = image;
  }

  getResonKeys() {
    return Object.keys(this.resons);
  }

  confirmCancel() {
    let reasonText = '';
    var currentUser = JSON.parse(localStorage.getItem('newuser'));
    if (this.selectedReason === '4') {
      reasonText = this.otherReasonText.trim();
      if (!reasonText) {
        this.toastCtrl.create({
          message: 'Please enter reason',
          duration: 2000,
          position: 'top'
        }).present();
        return;
      }
    } else {
      reasonText = this.resons[this.selectedReason];
    }

    const alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Cancelled with reason:', reasonText);
            // Call API or emit event here
            var postData = {
              'rejectorders': {
                "id_orderdetails": this.productdet['id_orderdetails'],
                "customers_reject_user_id": currentUser.userid,
                "reject_reason": this.otherReasonText,
                "reject_reason_type": this.selectedReason
              }
            }

            this.commonService.cancelOrder(postData).then((data) => {
              if (data.success) {
                let toast = this.toastCtrl.create({
                        message: data['message'],
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                    this.navCtrl.setRoot(MyOrdersPage);
              }
            });

          }
        }
      ]
    });
    alert.present();
  }




}
