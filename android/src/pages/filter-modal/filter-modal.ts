import { Component, Input, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { LoadingController, ModalController, ViewController, NavParams } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products-provider';

@Component({
  selector: 'filter',
  templateUrl: 'filter-modal.html',
  providers: [ProductsProvider]
})
export class FilterModalPage {

  @Input() data: any;
  animateItems = [];
  categoryItems = [];
  animateClass: { 'zoom-in': true };
  filters: object[];
  filter_options: object[];
  filterargs: object;
  //cur_selected = 1;
  select_option: any = []
  default_select: any = 0;

  constructor(private navParams: NavParams, private loadingCtrl: LoadingController, public modalCtrl: ModalController, private viewCtrl: ViewController, private productsProvider: ProductsProvider) {

    this.filters = this.navParams.get('filters');
    this.filter_options = this.navParams.get('filter_options');
    this.filterargs = this.navParams.get('filterargs');
    console.log('111', this.filters);
    console.log('222', this.filter_options);
    console.log('333', this.filterargs);

  }

  showfilterOptions(filter_id: number) {
    this.filterargs = { 'id_filter': filter_id, 'show': 1 };
  }

  get_filterAndOptions(filter_id: number, option_id: number) {
    this.filterargs = { 'id_filter': filter_id, 'show': 1 };
  }

  reset_filter() {
    let resetData = JSON.parse(localStorage.getItem('resetFilterData'));
    this.filters = resetData.filters;
    console.log(resetData.filters);
    this.filter_options = resetData.filter_options;
    this.filterargs = resetData.filterargs;
    console.log(JSON.parse(localStorage.getItem('resetFilterData')));
  }

  apply_filter() {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    if (currentUser == null) {
      var temp = 1;
    }
    else {
      temp = currentUser.show_type;
    }
    let obj = { filters: this.filters, filter_options: this.filter_options, filterargs: this.filterargs };
    localStorage.setItem('appliedFilter', JSON.stringify(obj));
    console.log(JSON.parse(localStorage.getItem('appliedFilter')));
    this.filter_options.forEach(element => {
      if (element['is_selected']) {
        this.select_option.push(element)
      }
    });
    console.log(this.select_option, 'option');

    this.viewCtrl.dismiss({ show_type: temp, filters: this.filters, filter_options: this.select_option, filterargs: this.filterargs, 'lazy_load': 1, 'last_id': 0 });
  }

  dismiss_modal() {
    let appliedFilter = JSON.parse(localStorage.getItem('appliedFilter'));
    if (appliedFilter != null && appliedFilter != undefined) {
      this.filters = appliedFilter.filters;
      this.filter_options = appliedFilter.filter_options;
      this.filterargs = appliedFilter.filterargs;
      console.log('dismiss_modal');
      console.log(JSON.parse(localStorage.getItem('appliedFilter')));
    }
    this.viewCtrl.dismiss();
  }

  ionViewWillEnter() {
    console.log(' ngOnInit filter modal');
    console.log(JSON.parse(localStorage.getItem('appliedFilter')));
  }

}
