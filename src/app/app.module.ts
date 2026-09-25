declare var socketurl;
import { NgModule, ErrorHandler, Injectable, Injector,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { EnquiryPage } from '../pages/enquiry/enquiry';
import { RegistrationPage } from '../pages/registration/registration';
import { OtpverifyPage } from '../pages/otpverify/otpverify';
import { ImagePopupPage } from '../pages/image-popup/image-popup';
import { ChartPage } from '../pages/chart/chart';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { LiveratesProvider } from '../providers/liverates/liverates';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Market } from '@ionic-native/market';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { BankPage } from '../pages/bank/bank';
import { SafeHtmlPipe } from '../pipes/safe-html/safe-html';
//import { Pro } from '@ionic/pro';
import { CommonServiceProvider } from '../providers/common-service/common-service';
const config: SocketIoConfig = { url: 'http://3.109.80.6:3000/', options: {} };

// winjewel

import { IonicImageViewerModule } from 'ionic-img-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileTransfer } from '@ionic-native/file-transfer'
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { StarRatingModule } from 'ionic3-star-rating';
//import { HomePage } from '../pages/home/home';
import { ProductListPage } from '../pages/product-list/product-list';
//import { CategoryPage } from '../pages/category/category';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { CheckoutPage } from '../pages/checkout/checkout';
import { CollectionPage } from '../pages/collection/collection';
import { CustomorderPage } from '../pages/customorder/customorder';
import { ReviewsRatingsPage } from '../pages/reviews-ratings/reviews-ratings';
import { WriteReviewPage } from '../pages/write-review/write-review';
import { OneProduct } from '../pages/one-product/one-product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { MyWishlistPage } from '../pages/my-wishlist/my-wishlist';
import { MyAccountPage } from '../pages/my-account/my-account';
import { CartPage } from '../pages/cart/cart';
import { NotificationsPage } from '../pages/notifications/notifications';
import { CustomerServicePage } from '../pages/customer-service/customer-service';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPassPage } from '../pages/forgot-pass/forgot-pass';
import { ResetPassPage } from '../pages/reset-password/reset-password';
import { MyDashboardPage } from '../pages/my-dashboard/my-dashboard';
import { FilterModalPage } from '../pages/filter-modal/filter-modal';
import { NewarrivalsPage } from '../pages/newarrivals/newarrivals';
import { OrdersPage } from '../pages/orders/orders';
import { JobDetailPage } from '../pages/job-detail/job-detail';
import { AutoPage } from '../pages/auto/auto';
import { QuotePage } from '../pages/quote/quote';
import { CustomPopupPage } from '../pages/custom-popup/custom-popup';
//import { MbscTimerOptions } from '@mobiscroll/angular';
//import { AutoCompleteModule } from 'ionic2-auto-complete';
import { ImagePicker } from '@ionic-native/image-picker';
import { DatePicker } from '@ionic-native/date-picker';
//Components
import { ProductsLayoutComponent } from '../components/products-layout/products-layout';
import { CarouselComponent } from '../components/carousel/carousel';
import { DealsComponent } from '../components/deals/deals';
import { CartComponent } from '../components/cart/cart';
import { CategoryTileComponent } from '../components/category-tile/category-tile';
import { CategoryComponent } from '../components/category/category';
import { CollectionComponent } from '../components/collection/collection';
import { SubcategoryComponent } from '../components/subcategory/subcategory';
import { CheckoutComponent } from '../components/checkout/checkout';
import { HomecollectionComponent } from '../components/homecollection/homecollection';
import { OrderDetailComponent } from '../components/order-detail/order-detail';
import { NewarrivalsComponent } from '../components/newarrivals/newarrivals';
import { ImageCacheDirective } from '../directives/imagecache/imagecache';
import { Ionic2RatingModule } from 'ionic2-rating/';
import { Toast } from '@ionic-native/toast';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SocialSharing } from '@ionic-native/social-sharing';
//Pipes
import { FilterPipe } from '../app/pipes/filter-pipe.pipe';
import { FormattimePipe } from '../pipes/formattime/formattime';
import { WinhomePage } from '../pages/winhome/winhome';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CountrymodelPage } from '../pages/countrymodel/countrymodel';
import { ScrollHideDirective } from '../directives/hide-footer/hide-footer';
import { GeneraltermsPage } from '../pages/generalterms/generalterms';
import { CategorylistPage } from '../pages/categorylist/categorylist';
//import { ResetPassComponent } from '../components/resetpass/resetpass';

//import { AndroidFullScreen } from '@ionic-native/android-full-screen';

let pages = [
  MyApp,
  HomePage,
  ProductListPage,
 // CategoryPage,
  SubcategoryPage,
  CollectionPage,
  CustomorderPage,
  CheckoutPage,
  ReviewsRatingsPage,
  WriteReviewPage,
  OneProduct,
  ProductDetailPage,
  MyOrdersPage,
  MyWishlistPage,
  MyAccountPage,
  CartPage,
  NotificationsPage,
  CustomerServicePage,
  LoginPage,
  RegisterPage,
  ForgotPassPage,
  ResetPassPage,
  MyDashboardPage,
  FilterModalPage,
  NewarrivalsPage,
  OrdersPage,
  JobDetailPage,
  AutoPage,
  QuotePage,
  CustomPopupPage,
  WinhomePage,
  CountrymodelPage,
  ResetPassPage,
  GeneraltermsPage,

  //lite

  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  TabsPage,
  EnquiryPage,
  RegistrationPage,
  OtpverifyPage,
  ImagePopupPage,
  BankPage,
  ChartPage,
  CategorylistPage,
  //ResetPassComponent
];


export function declarations() {
  return [pages, ProductsLayoutComponent, CarouselComponent, CategoryTileComponent, CategoryComponent, CollectionComponent, SubcategoryComponent, CheckoutComponent, HomecollectionComponent /* ResetPassComponent */ , DealsComponent, CartComponent, FilterPipe, FormattimePipe, OrderDetailComponent, NewarrivalsComponent, ImageCacheDirective, ScrollHideDirective,
    MyApp,
    SafeHtmlPipe,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    EnquiryPage,
    RegistrationPage,
    OtpverifyPage,
    ImagePopupPage,
    BankPage,
    ChartPage,
    GeneraltermsPage,

    //lite

    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    EnquiryPage,
    RegistrationPage,
    OtpverifyPage,
    ImagePopupPage,
    BankPage,
    ChartPage,
    CategorylistPage,
   // ResetPassComponent
  ];
}

export function entryComponents() {
  return pages;
}


export function providers() {
  return [
    // Keep this to enable Ionic's runtime error handling during development
    Device,/*AndroidFullScreen,*/SocialSharing, ImagePicker, DatePicker, AndroidPermissions, StatusBar, SplashScreen, Toast, FileTransfer, File, Transfer, Camera, FilePath, Network, AppVersion, Market,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    IonicErrorHandler,
    StatusBar,
    SplashScreen,
    LiveratesProvider,
    Network,
    Market,
    AppVersion,
    CommonServiceProvider,
    Device,
    NgxImageCompressService,
    Device,
   //AndroidFullScreen
  ];
}



@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    //Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp), IonicStorageModule.forRoot(), BrowserModule, StarRatingModule,
       /* AutoCompleteModule, */ HttpModule, BrowserAnimationsModule, Ionic2RatingModule, IonicImageViewerModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers(),
  schemas: [CUSTOM_ELEMENTS_SCHEMA]


  /* @NgModule({
    declarations: [
      MyApp,
      SafeHtmlPipe,
      AboutPage,
      ContactPage,
      HomePage,
      TabsPage,
      EnquiryPage,
      RegistrationPage,
      OtpverifyPage,
      ImagePopupPage,
      BankPage,
      ChartPage
    ],
    imports: [
      HttpModule,
      BrowserModule,
      IonicModule.forRoot(MyApp),
      HttpClientModule,
      SocketIoModule.forRoot(config),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
      MyApp,
      AboutPage,
      ContactPage,
      HomePage,
      TabsPage,
      EnquiryPage,
      RegistrationPage,
      OtpverifyPage,
      ImagePopupPage,
      BankPage,
      ChartPage
    ],
    providers: [
      IonicErrorHandler,
      StatusBar,
      SplashScreen,
      {provide: ErrorHandler, useClass: MyErrorHandler },
      LiveratesProvider,
      OneSignal,
      Network,
      Market,
      AppVersion,
      CommonServiceProvider,
      Device
    ] */
})
export class AppModule { }
