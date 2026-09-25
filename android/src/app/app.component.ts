import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, AlertController, Nav, Events, LoadingController, ModalController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { NavController, App } from "ionic-angular/index";
import { Market } from '@ionic-native/market';
import { AppVersion } from '@ionic-native/app-version';
import { CommonServiceProvider } from '../providers/common-service/common-service';
import { Device } from '@ionic-native/device';
import { RegistrationPage } from '../pages/registration/registration';
import { OtpverifyPage } from '../pages/otpverify/otpverify';
import { LiveratesProvider } from '../providers/liverates/liverates';
import { ImagePopupPage } from '../pages/image-popup/image-popup';
import { BankPage } from '../pages/bank/bank';

// winjewel


import { HomePage } from '../pages/home/home';
import { ProductListPage } from '../pages/product-list/product-list';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { MyWishlistPage } from '../pages/my-wishlist/my-wishlist';
import { MyAccountPage } from '../pages/my-account/my-account';
import { CartPage } from '../pages/cart/cart';
import { NotificationsPage } from '../pages/notifications/notifications';
import { CustomerServicePage } from '../pages/customer-service/customer-service';
import { LoginPage } from '../pages/login/login';
//import { CategoryPage } from '../pages/category/category';
import { CollectionPage } from '../pages/collection/collection';
import { CustomorderPage } from '../pages/customorder/customorder';
import { CommonProvider } from '../providers/common';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { MyDashboardPage } from '../pages/my-dashboard/my-dashboard';
import { RegisterPage } from '../pages/register/register';
import { NewarrivalsPage } from '../pages/newarrivals/newarrivals';
import { Toast } from '@ionic-native/toast';
import { CategoryComponent } from '../components/category/category';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { count } from 'rxjs/operators';
import { normalizeUrl } from 'ionic-angular/umd/navigation/deep-linker';
import { SocialSharing } from '@ionic-native/social-sharing';
import { WinhomePage } from '../pages/winhome/winhome';
import { AboutPage } from '../pages/about/about';
import { EnquiryPage } from '../pages/enquiry/enquiry';
import { ContactPage } from '../pages/contact/contact';




@Component({
    templateUrl: 'app.html',
    providers: [CommonProvider]
})
export class MyApp {
    rootPage: any = HomePage;
    lastBack = 0;
    allowClose: boolean = false;
    toast;
    app_version = "2.0.8";
    package_name;
    versionData: any;
    @ViewChild(Nav) nav: Nav;

    // winjewel

    home: any;
    deals: any;
    loginstatus = false;
    dispname: any;
    totalcartitems = 0;
    pages: any = [];
    overlayHidden: boolean = true;
    // lastBack = 0;
    // allowClose:boolean = false;
    // app_version:any = 0;
    // versionData;
    VAL_INTERVAL = 60000 // in ms
    EXP_INTERVAL = 60000 // in ms
    timer: any;
    exptimer: any;
    count: any = 1;
    excount: any = 1;
    page = 1;
      enter: boolean = false;

    currYear: any;

    constructor(public platform: Platform, public statusBar: StatusBar, public events: Events, public splashScreen: SplashScreen, private _OneSignal: OneSignal, private network: Network, private toastController: ToastController, private app: App, private market: Market, private appVersion: AppVersion, private commonService: CommonServiceProvider, private device: Device, private alertCtrl: AlertController, private liverateservice: LiveratesProvider, private loadingCtrl: LoadingController, public modalCtrl: ModalController, private commonservice: CommonProvider, public menu: MenuController, public socialSharing: SocialSharing) {
          var date = new Date();
    var ddd = date.getDate();
    var mmm = date.getMonth() + 1;
    var yy = date.getFullYear();
    this.currYear = yy;
    console.log(this.currYear);

        platform.ready().then(() => {
      this.events.subscribe('entered', (val) => {
        this.enter = val;
        console.log('Enter value received:', this.enter);
      });
    });

      platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.statusBar.overlaysWebView(false);
            this.statusBar.backgroundColorByHexString('#eaeaea');
            this.splashScreen.hide();
            if (platform.is('cordova')) {
                appVersion.getVersionNumber().then((s) => {
                    this.app_version = s;
                    appVersion.getPackageName().then((p) => {
                        this.package_name = p;
                        //this.initializeApp();
                    });
                });
            }
            //Onesignal device update
            console.log("ready initializeappdatas");
            let pushToken: any = "";

            document.addEventListener('deviceready', OneSignalInit, false);
            var that = this;

            function OneSignalInit() {

                console.log('onseginal inint...')
                window['plugins'].OneSignal.setAppId("f352e217-1085-4b7f-9e9a-bb863f184ca5", "769730541476");
                window['plugins'].OneSignal.setNotificationOpenedHandler(function (jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                });

                window['plugins'].OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
                    console.log("User accepted notifications: " + accepted);
                });

                window['plugins'].OneSignal.addSubscriptionObserver(function (ids) {
                    console.log("Subscribed for OneSignal push notifications!")
                    localStorage.setItem('WLMOHANLALDeviceData', JSON.stringify({ 'uuid': ids.to.userId, 'pushToken': ids.to.pushToken, 'deviceType': 1 }));
                    console.log(localStorage.getItem('WLMOHANLALDeviceData'));
                    console.log("Push Subscription state changed: " + JSON.stringify(ids));

                    if ((JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['uuid'] != null && JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['uuid'] != '') && (JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['pushToken'] != null && JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['pushToken'] != '')) {

                        let initialData = JSON.parse(localStorage.getItem('WLMOHANLALInitialData'));
                        this.devicesetData = JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'));
                        console.log(this.devicesetData)
                        if (initialData == null || initialData == undefined) {
                            that.checkserverappSettings(JSON.stringify({ 'platform': 1, 'app_version': that.app_version, 'uuid': this.devicesetData.uuid, 'pushToken': this.devicesetData.pushToken }));
                        } else {
                            that.checkserverappSettingsChanges(JSON.stringify({ 'platform': 1, 'app_version': that.app_version, 'uuid': this.devicesetData.uuid, 'pushToken': this.devicesetData.pushToken, 'updatetime': initialData.updatetime }));
                        }
                    } else {
                        console.log(';asfdasdas')
                    }
                });
                //window['plugins'].OneSignal.endInit();
            }

            if (JSON.parse(localStorage.getItem('WLMOHANLALDeviceData')) != null) {
                if ((JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['uuid'] != null && JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['uuid'] != '') && (JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['pushToken'] != null && JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'))['pushToken'] != '')) {
                    let initialData = JSON.parse(localStorage.getItem('WLMOHANLALInitialData'));
                    let devicesetData = JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'));
                    console.log("ready initaldata", initialData);
                    console.log("ready devicesetData", devicesetData);
                    if (initialData == null || initialData == undefined) {
                        this.checkserverappSettings(JSON.stringify({ 'platform': 1, 'app_version': this.app_version, 'uuid': devicesetData.uuid, 'pushToken': devicesetData.pushToken }));
                    } else {
                        this.checkserverappSettingsChanges(JSON.stringify({ 'platform': 1, 'app_version': this.app_version, 'uuid': devicesetData.uuid, 'pushToken': devicesetData.pushToken, 'updatetime': initialData.updatetime }));
                    }
                }
            }
            //this.nav.setRoot( this.rootPage, {}  );
            platform.registerBackButtonAction(() => {
                const overlay = this.app._appRoot._overlayPortal.getActive();
                const nav = this.app.getActiveNav();
                const closeDelay = 2000;
                const spamDelay = 500;

                if (overlay && overlay.dismiss) {
                    overlay.dismiss();
                } else if (nav.canGoBack()) {
                    nav.pop();
                } else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
                    this.allowClose = true;
                    let toast = this.toastController.create({
                        message: "Press back again to exit",
                        duration: closeDelay,
                        dismissOnPageChange: true
                    });
                    toast.onDidDismiss(() => {
                        this.allowClose = false;
                    });
                    toast.present();
                } else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
                    platform.exitApp();
                }
                this.lastBack = Date.now();

            });


            // winjewel

            // events.subscribe('entered', (enter) => {
            //     this.enter = enter;
            //     console.log('Enter : ',this.enter);
                
            // });
            events.subscribe('pageno', (no) => {
                this.page = no;
            });

        });
        /* if(this.platform.is('core') || this.platform.is('mobileweb')) {
          this.initializeApp();
        }  */
        // Check internet connection
        this.network.onConnect().subscribe(data => {
            this.events.publish("netowork", 1);
            if (this.toast) {
                this.toast.dismiss();
            }
            this.toast = this.toastController.create({
                message: "You are back Online",
                duration: 3000
            });
            this.toast.present();
        }, error => console.error(error));

        this.network.onDisconnect().subscribe(data => {
            this.events.publish("netowork", 0);
            if (this.toast) {
                this.toast.dismiss();
            }
            this.toast = this.toastController.create({
                message: "You are Offline",
                // showCloseButton:true,
                // closeButtonText: "Ok",
                dismissOnPageChange: false
            });
            this.toast.present();
        }, error => console.error(error));


        // winjewel

        this.loginstatus = JSON.parse(localStorage.getItem('check'));
        console.log("Status" + this.loginstatus);
        if (this.loginstatus == false || this.loginstatus == null) {
            this.home = { title: 'Login', icon: 'lock', component: LoginPage };
            // this.home = { title: 'Home', icon: 'home', component: HomePage };
            // this.rootPage = WinhomePage;
            this.pages = [];
            // this.initvalInterval();
        } else {
            // this.home = { title: 'Dashboard', icon: 'person-add', component: MyDashboardPage };
            //  this.rootPage = WinhomePage;
            this.dispname =  JSON.parse( localStorage.getItem( 'newuser' ))['userdisplayname'];// commonservice.getDisplayName();
            this.pages = this.getpages();
        }
        this.totalcartitems = commonservice.getTotalCartItems();
        events.subscribe('username:changed', (username, status) => {

            console.log("username:changed");
            if (username !== undefined && username !== "") {
                this.dispname = username;
                this.loginstatus = status;
                console.log(this.loginstatus)
                if (status) {
                    // this.putinterval();

                    // this.home = { title: 'Dashboard', icon: 'person-add', component: MyDashboardPage };
                    this.pages = this.getpages();
                    console.log(this.pages);

                } else {
                    this.home = { title: 'Login', icon: 'lock', component: LoginPage };
                    this.pages = [];
                }
            }
        });
        events.subscribe('cart:changed', totalcartitems => {
            if (totalcartitems !== undefined && totalcartitems !== "") {
                this.totalcartitems = totalcartitems;
            }
        });
        let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
        events.subscribe('username:changed', (username, status) => {
            console.log(curuserdet);
            if (curuserdet != null) {
                console.log(curuserdet.validity);
                if (curuserdet.validity != undefined) {
                    if (curuserdet.validity == 0 && curuserdet.is_logged_in == true) {
                        // this.initvalInterval();
                    }
                }
                if (curuserdet.designshow_expiry != undefined) {
                    if (curuserdet.designshow_expiry != null) {
                        const now = Date.now();
                        let exp_period = new Date(curuserdet.designshow_expiry);
                        if (exp_period.getTime() > now) {
                            console.log(exp_period.getTime());
                            this.initDesExpInterval();
                        } else {
                            curuserdet.show_type = curuserdet.default_show_type;
                            localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                        }
                    } else {
                        curuserdet.show_type = curuserdet.default_show_type;
                        localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                    }
                }
            }
        })
    }

    checkserverappSettings(requestdata) {
        //this.statusBar.styleDefault();
        /* let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present(); */
        this.commonService.settingsData(requestdata).then(res => {
            if (res) {
                if (!res.error) {
                    this.versionData = res.resultdata;
                    localStorage.setItem('WLMOHANLALInitialData', JSON.stringify(this.versionData));
                    if (this.versionData.showpopup == 1 && this.versionData.popupimage != "" && this.versionData.popupimage != null) {
                        this.presentPopupModal(this.versionData.popupimage);
                    }
                    localStorage.setItem('stolerance', this.versionData.silverhigh_tol);
                    localStorage.setItem('gtolerance', this.versionData.goldhigh_tol);
                    localStorage.setItem('WLMOHANLALLSData', JSON.stringify({ 'url': this.versionData.url, 'adapter': this.versionData.adapter, 'provider': this.versionData.provider, 'username': this.versionData.username }));
                    if (this.versionData) {
                        if (this.platform.is('android')) {
                            if (this.versionData.updateAvail) {
                                this.presentAlert(this.package_name, this.versionData.message, this.versionData.title);
                                //this.nav.setRoot( RegistrationPage, {} );
                            } else {
                                //this.splashScreen.hide();
                                if (this.versionData.registerstatus == 0 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(RegistrationPage, {});
                                } else if (this.versionData.registerstatus == 1 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(OtpverifyPage, {});
                                } else if (this.versionData.registerstatus == 2 || this.versionData.otrrequired == 0) {
                                    //this.nav.setRoot( this.rootPage, {}  );
                                    //this.liverateservice.subscribeStocks();
                                }

                            }
                        }
                        else if (this.platform.is('ios')) {
                            if (this.versionData.updateAvail) {
                                this.presentAlert(this.versionData.appurl, this.versionData.message, this.versionData.title);
                            } else {
                                if (this.versionData.registerstatus == 0 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(RegistrationPage, {});
                                } else if (this.versionData.registerstatus == 1 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(OtpverifyPage, {});
                                } else if (this.versionData.registerstatus == 2 || this.versionData.otrrequired == 0) {
                                    //this.nav.setRoot( this.rootPage, {}  );
                                    //this.liverateservice.subscribeStocks();
                                }
                            }
                        }
                        /* loading.dismiss(); */
                    }
                } else {
                    console.log(res);
                }
            }
        }, error => {
            /* loading.dismiss(); */
        });
    }
    checkserverappSettingsChanges(requestdata) {
        this.commonService.checksettingsData(requestdata).then(res => {
            if (res) {
                if (!res.error) {
                    if (res.resultdata.update == 0) {
                        this.versionData = JSON.parse(localStorage.getItem('WLMOHANLALInitialData'));
                        this.versionData.updateAvail = false;
                    } else {
                        this.versionData = res.resultdata;
                        localStorage.setItem('WLMOHANLALInitialData', JSON.stringify(this.versionData));
                    }

                    if (this.versionData.showpopup == 1 && this.versionData.popupimage != "" && this.versionData.popupimage != null) {
                        this.presentPopupModal(this.versionData.popupimage);
                    }
                    localStorage.setItem('stolerance', this.versionData.silverhigh_tol);
                    localStorage.setItem('gtolerance', this.versionData.goldhigh_tol);
                    localStorage.setItem('WLMOHANLALLSData', JSON.stringify({ 'url': this.versionData.url, 'adapter': this.versionData.adapter, 'provider': this.versionData.provider, 'username': this.versionData.username }));
                    if (this.versionData) {
                        if (this.platform.is('android')) {
                            if (this.versionData.updateAvail) {
                                this.presentAlert(this.package_name, this.versionData.message, this.versionData.title);
                                //this.nav.setRoot( RegistrationPage, {} );
                            } else {
                                //this.splashScreen.hide();
                                if (this.versionData.registerstatus == 0 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(RegistrationPage, {});
                                } else if (this.versionData.registerstatus == 1 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(OtpverifyPage, {});
                                } else if (this.versionData.registerstatus == 2 || this.versionData.otrrequired == 0) {
                                    //this.nav.setRoot( this.rootPage, {}  );
                                    //this.liverateservice.subscribeStocks();
                                }

                            }
                        }
                        else if (this.platform.is('ios')) {
                            if (this.versionData.updateAvail) {
                                this.presentAlert(this.versionData.appurl, this.versionData.message, this.versionData.title);
                            } else {
                                if (this.versionData.registerstatus == 0 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(RegistrationPage, {});
                                } else if (this.versionData.registerstatus == 1 && this.versionData.otrrequired == 1) {
                                    this.nav.setRoot(OtpverifyPage, {});
                                } else if (this.versionData.registerstatus == 2 || this.versionData.otrrequired == 0) {
                                    //this.nav.setRoot( this.rootPage, {}  );
                                    //this.liverateservice.subscribeStocks();
                                }
                            }
                        }
                    }
                } else {
                    console.log(res);
                }
            }
        }, error => {
        });
    }
    /*     presentAlert(appurl, msg, title) {
            localStorage.removeItem('WLMOHANLALInitialData')
            //this.splashScreen.hide();
            const overlay = this.app._appRoot._overlayPortal.getActive();
            if (overlay && overlay.dismiss) {
                overlay.dismiss();
            }
            let alert = this.alertCtrl.create({
                title: title,
                subTitle: msg,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: 'Ok',
                        handler: data => {
                            this.market.open(appurl);
                            this.platform.exitApp();
                        }
                    }
                ]
            });
            alert.present();
        } */
    presentPopupModal(imgurl) {
        let popupModal = this.modalCtrl.create(ImagePopupPage, { imgurl: imgurl });
        popupModal.present();
    }

    // winjewel


    // to check account validity
    initvalInterval() {
        this.timer = setTimeout(() => {
            this.check_validity();
            console.log(Date.now());
        }, this.VAL_INTERVAL);
    }

    check_validity() {
        const now = Date.now();
        let curuserdet = JSON.parse(localStorage.getItem('newuser'));
        let valid_period = new Date(curuserdet.validity_period);
        console.log(now)
        console.log(valid_period.getTime())

        if (now > valid_period.getTime()) {
            this.expired_logout();
        }
    }
    expired_logout() {
        this.commonservice.updateLogin("", 0, "", false);
        let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
        console.log("expired:" + JSON.parse(localStorage.getItem('appcurrentUser')));
        curuserdet.is_logged_in = false;
        localStorage.setItem('check', JSON.stringify(false));

        localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
        this.events.publish('username:changed', 'Guest', false);
        clearTimeout(this.timer);
        let alert = this.alertCtrl.create({
            title: 'Attention!!',
            subTitle: 'Your account expired, contact admin to activate.',
            buttons: ['ok']
        });
        alert.present();
        this.nav.push(LoginPage);
    }
    // to check design show type expiry
    initDesExpInterval() {
        this.exptimer = setTimeout(() => {
            this.check_typeExpiry();
            console.log(Date.now());
        }, this.EXP_INTERVAL);
    }

    check_typeExpiry() {
        let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
        if (curuserdet.designshow_expiry != null) {
            const now = Date.now();
            let exp_period = new Date(curuserdet.designshow_expiry);
            if (exp_period.getTime() < now) {
                curuserdet.show_type = curuserdet.default_show_type;
                localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                clearTimeout(this.exptimer);
            }
        } else {
            curuserdet.show_type = curuserdet.default_show_type;
            localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
            clearTimeout(this.exptimer);
        }
    }
    getpages() {
        return [
            // { title: 'Dashboard', icon: 'person-add', component: MyDashboardPage },
            { title: 'Dashboard', icon: 'grid', component: MyDashboardPage },
            { title: 'Home', icon: 'home', component: WinhomePage },
           /*  { title: 'Collections', icon: 'bookmarks', component: CollectionPage }, */

            { title: 'Custom Order', icon: 'camera', component: CustomorderPage },
            { title: 'New Arrivals', icon: 'megaphone', component: NewarrivalsPage },
            { title: 'Cart', icon: 'cart', component: CartPage },

            { title: 'My Orders', icon: 'md-basket', component: MyOrdersPage },
            { title: 'My Profile', icon: 'md-people', component: MyAccountPage },

            /*  { title: 'My Wish List', icon: 'paper', component: MyWishlistPage }, */
            // { title: 'Category', icon: 'pricetags', component: CategoryPage },
            /*   { title: 'Notifications', icon: 'md-settings', component: NotificationsPage }, */
            { title: 'Customer Service', icon: 'md-chatboxes', component: CustomerServicePage }

        ];
    }
    presentAlert(msg, title, mypackage) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        if (mypackage != '') {
                            this.market.open(mypackage);
                        }
                        // this.platform.exitApp();
                    }
                }
            ]
        });
        alert.present();
    }
    login() {
        this.menu.close();
        this.nav.push(LoginPage);
    }
    color(no) {

        this.page = no;
        if (no == 1) {
            this.nav.setRoot(HomePage);

        }
        if (no == 2) {

            this.nav.setRoot(AboutPage);

        }
        if (no == 3) {
            if (this.loginstatus == true) {
                this.nav.setRoot(WinhomePage);

            }
            else {
                this.nav.push(LoginPage);
            }

        }
        if (no == 4) {

            this.nav.setRoot(EnquiryPage);

        }
        if (no == 5) {

            this.nav.setRoot(ContactPage);

        }
    }
    logout() {

        let confirm = this.alertCtrl.create({
            title: 'Confirm Logout',
            subTitle: 'Are you sure you want to logout!',
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  console.log('Disagree clicked');
                }
              }, {
                text: 'Ok',
                handler: () => {
                  console.log('Agree clicked');
                  this.commonservice.updateLogin("", 0, "", false);
                  let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
                  curuserdet.is_logged_in = false;
                  this.home = { title: 'Login', icon: 'lock', component: LoginPage };
                  localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                  this.events.publish('username:changed', 'Guest', false);
                  //this.nav.setRoot( WinhomePage );
                  console.log(curuserdet)
                  localStorage.setItem('check', JSON.stringify(false));
                  console.log(JSON.parse(localStorage.getItem('check')));
                  this.nav.push(LoginPage);
                }
              }
            ]
          });
          confirm.present();


    }

    openCart() {
        this.menu.close();
        this.nav.setRoot(CartPage);
    }
    openHome() {
        this.menu.close();
        this.nav.setRoot(WinhomePage);
    }
    register() {
        this.menu.close();
        //this.nav.push( RegisterPage ) //navigate to RegisterPage
        this.nav.push(RegisterPage);
    }
    // category() {
    //     this.menu.close();
    //     //this.nav.push( RegisterPage ) //navigate to RegisterPage
    //     this.nav.setRoot(CategoryPage);
    // }
    openPage(page) {
        this.menu.close();
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
    contactus() {
        this.menu.close();
        this.nav.setRoot(CustomerServicePage);
    }
    Homes() {
        this.menu.close();
        this.nav.setRoot(WinhomePage);
    }

    putinterval() {
        let branchdet = JSON.parse(localStorage.getItem('newuser'));
        if (branchdet != null) {
            setInterval(data => {
                console.log(this.count)
                let branchdet = JSON.parse(localStorage.getItem('newuser'));
                console.log(branchdet.userid)
                this.commonservice.check({ "id_user": branchdet.userid }).then(data => {

                    // console.log(data);
                    if (data.responsedata['status'] == '0') {

                        if (this.count == 1) {
                            this.count++;
                            // console.log(this.count)
                            this.commonservice.updateLogin("", 0, "", false);
                            let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
                            console.log("expired:" + JSON.parse(localStorage.getItem('appcurrentUser')));
                            curuserdet.is_logged_in = false;
                            localStorage.setItem('check', JSON.stringify(false));

                            localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                            this.events.publish('username:changed', 'Guest', false);
                            let alert = this.alertCtrl.create({
                                title: 'Attention!!',
                                subTitle: 'Your account expired, contact admin to activate.',
                                buttons: ['ok']
                            });
                            alert.present();
                            this.nav.setRoot(WinhomePage);
                        }
                    }
                    else {
                        this.count = 1;
                    }
                    if (data.responsedata['is_exist'] == 0) {
                        console.log(this.excount)

                        if (this.excount == 1) {
                            this.excount++;
                            this.commonservice.updateLogin("", 0, "", false);
                            let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
                            console.log("expired:" + JSON.parse(localStorage.getItem('appcurrentUser')));
                            curuserdet.is_logged_in = false;
                            localStorage.setItem('check', JSON.stringify(false));

                            localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                            this.events.publish('username:changed', 'Guest', false);
                            let alert = this.alertCtrl.create({
                                title: 'Attention!!',
                                subTitle: 'Your account not exist, please register.',
                                enableBackdropDismiss: false, // <- Here! :)
                                buttons: [
                                    {
                                        text: 'Register',
                                        handler: () => {
                                            this.nav.setRoot(WinhomePage);
                                        }
                                    }]
                            });
                            alert.present();
                            // this.nav.setRoot( LoginPage );
                        }
                    }
                    else {
                        this.excount = 1;
                    }
                })
            }, 3000);

        }
    }
    whatsapp(data) {
        console.log(data)
        this.socialSharing.shareViaWhatsAppToReceiver(data, '', '', '').then((data) => {
            console.log(data);

            // Success!
        }).catch((err) => {
            console.log(err);

            // Error!
            alert("Sorry! Sharing via WhatsApp is not possible");
        });


    }
}
