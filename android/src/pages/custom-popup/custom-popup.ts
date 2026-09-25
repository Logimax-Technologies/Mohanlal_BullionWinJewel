import { Component,Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events,  ViewController,ToastController ,LoadingController} from 'ionic-angular';

/**
 * Generated class for the CustomPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-custom-popup',
  templateUrl: 'custom-popup.html',
})
export class CustomPopupPage {

  product:any;
  purityname:any;
  
  constructor(public event:Events,public navCtrl: NavController,public renderer: Renderer,public viewCtrl: ViewController, public navParams: NavParams) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'custom-popup', true);
    this.product = this.navParams.get('data');
    if(this.product.purities.length == 1){
      this.purityname = this.product.purities[0].purity; 
  }
   console.log(this.navParams.get('data'))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomPopupPage');
  }

}
