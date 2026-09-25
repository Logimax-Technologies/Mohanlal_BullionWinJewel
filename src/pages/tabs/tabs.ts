import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { EnquiryPage } from '../enquiry/enquiry';
import { ChartPage } from '../chart/chart';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = LoginPage;
  tab4Root = EnquiryPage;
  tab5Root = ContactPage;

  constructor() {

  }
}
