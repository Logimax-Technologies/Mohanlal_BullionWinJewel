import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import { CommonServiceProvider } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  aboutusdetails:any = [];
  constructor(private menu: MenuController,public navCtrl: NavController,private commonservice: CommonServiceProvider) {

  }
  ngAfterViewInit() {
    this.commonservice.getaboutusdetails().subscribe( res => {
         this.aboutusdetails = res['aboutus'];
      });
    }

    ionViewDidEnter() {
      this.menu.swipeEnable(false);
      // If you have more than one side menu, use the id like below
      // this.menu.swipeEnable(false, 'menu1');
    }
  
    ionViewWillLeave() {
      // Don't forget to return the swipe to normal, otherwise
      // the rest of the pages won't be able to swipe to open menu
      this.menu.swipeEnable(true);
      // If you have more than one side menu, use the id like below
      // this.menu.swipeEnable(true, 'menu1');
    }
}
