import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ViewController,LoadingController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';


/**
 * Generated class for the GeneraltermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-generalterms',
  templateUrl: 'generalterms.html',
})
export class GeneraltermsPage {
  companyName = JSON.parse(localStorage.getItem( 'company'))
  general:any = [];

  constructor(public events: Events,public load:LoadingController, public commonservice: CommonServiceProvider,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
    let loader = this.load.create({
     // content: 'Please Wait',
      spinner: 'crescent',
    });
    loader.present();
    loader.dismiss();

    this.commonservice.getTerms().subscribe( res => {
      this.general = res['terms']['content']['displaytext'];
   });
/*     this.comman.termscondi().then(data=>{

      this.general = data['general_terms'];
      console.log(this.general);
      loader.dismiss();
      console.log(this.general);
    }) */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneraltermsPage');
    let user = false;
    this.events.publish('user:created', user);
  }

}
