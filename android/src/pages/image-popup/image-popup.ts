import { Component, Renderer  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'page-image-popup',
  templateUrl: 'image-popup.html',
})
export class ImagePopupPage {
  popupimg:any;
  popup:any
	constructor(public navCtrl: NavController,public Dom:DomSanitizer, public navParams: NavParams, public renderer: Renderer, public viewCtrl: ViewController) {
		this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
    console.log('ImgURL:', navParams.get('imgurl'));
    this.popupimg = navParams.get('imgurl');
    this.popup=this.Dom.bypassSecurityTrustUrl(this.popupimg);
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagePopupPage');
  }
  closeModal(){
	  this.navCtrl.pop();
  }

}
