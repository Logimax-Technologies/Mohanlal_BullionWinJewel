import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { SubcategoryPage } from '../../pages/subcategory/subcategory';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { CommonProvider } from '../../providers/common';
import { Keyboard } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category-provider';

@Component({
  selector: 'page-auto',
  templateUrl: 'auto.html',
  providers: [CategoryProvider]
})
export class AutoPage {

  protected searchStr: string;
  protected captain: string;
  protected searchData: any[] = [];
  public input: string = '';
  public temp: any[] = [];
  status: any = false;

  constructor(private keyboard: Keyboard, public commonProvider: CommonProvider, private loadingCtrl: LoadingController, private categoryProvider: CategoryProvider, public navCtrl: NavController) {
    /*     let loader = this.loadingCtrl.create( {
          content: "Please wait..."
      } );
      loader.present(); */
    /*     this.categoryProvider.readall().then(( data ) => {
          this.searchData = data;
          console.log(data);
          loader.dismiss();
      });
     */
  }
  goback() {
    this.navCtrl.pop();
  }
  onItemSelect(selected) {
    console.log(selected['id_design']);
    this.navCtrl.push(ProductDetailPage, { proid: selected['id_design'] });
    // if(selected)
    //     this.model.searchStr = selected.originalObject.value;
    // }
  }


  removeFocus() {
    this.keyboard.close();
  };

  /*   search() {
      this.status = true;
      if (!this.input.trim().length || !this.keyboard.isOpen()) {
        console.log('11111111')
        this.temp = [];
        return;
      }
      this.categoryProvider.readall().then(( data ) => {
        this.searchData = data;
        console.log(data);
    });

    //  this.temp = this.searchData.filter(item => item.name_design.toUpperCase().includes(this.input.toUpperCase()));
    } */

  search() {
    this.status = true;

    // Trim and check length
    const query = this.input.trim();
    if (query.length < 3 || !this.keyboard.isOpen()) {
      console.log('Input too short or keyboard closed');
      this.temp = [];
      return;
    }
    console.log(query);
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    // API call after 3+ characters
    this.categoryProvider.searchprod(query).then((data) => {
      this.searchData = data;
      //this.temp = this.searchData.filter(item =>item.name_design.toUpperCase().includes(query.toUpperCase()));
      this.temp = this.searchData.filter(item => item.name_design && item.name_design.toUpperCase().includes(query.toUpperCase()));
      console.log(this.temp);
      loader.dismiss();
    });
  }

}
