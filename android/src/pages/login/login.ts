import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { RegisterPage } from '../../pages/register/register';
import { ForgotPassPage } from '../../pages/forgot-pass/forgot-pass';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { CommonProvider } from '../../providers/common';
import { HomePage } from '../../pages/home/home';
import { Toast } from '@ionic-native/toast';
import { WinhomePage } from '../winhome/winhome';


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  isDisabled: boolean = false;
  getuserLoginURL: string = '';
  errorMessage: string = '';
  type: any;
  text: any;
  facebook: any;
  user: any = { username: '', password: '' };
  emailChanged: boolean = false;
  //passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  animateClass = { 'zoom-in': true };
  VAL_INTERVAL = 60000 // in ms
  EXP_INTERVAL = 60000 // in ms
  timer: any;
  exptimer: any;
  token: any = JSON.parse(localStorage.getItem('DeviceData'));
  public typecheck = 'password';
  public showPass = false;
  contact_store_no:any;

  constructor(private platform: Platform, private builder: FormBuilder, private nav: NavController, private event: Events, private menu: MenuController, private commonService: CommonProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private toast: Toast) {
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;
    this.type = "User";

    if (this.token != null) {

      this.loginForm = builder.group({
        username: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        pushToken: this.token['pushToken'],

        password: ['', Validators.required]
      });
    }
    if (this.token == null) {

      this.loginForm = builder.group({
        username: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        // pushToken: this.token['pushToken'],
        password: ['', Validators.required]
      });
    }
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
    console.log(this.token)
  }
  // ionViewWillLeave(){
  //     this.nav.setRoot(WinhomePage)
  // }
  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.typecheck = 'text';
    } else {
      this.typecheck = 'password';
    }
  }
  public onSubmit(values: Object): void {
    console.log(values);
    this.submitted = true;
    if (this.loginForm.valid) {
      this.errorMessage = 'Logging in...';
      this.isDisabled = true;
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.commonService.doLogin(JSON.stringify(values)).then(res => {
        if (res) {
          if (res.success) {
            this.errorMessage = res.message;
            this.contact_store_no = res.store_no;
            if (res.responsedata.validity != undefined && res.responsedata.validity == 0) {
              // this.initInterval();
            }
            if (res.responsedata.designshow_expiry != null) {
              const now = Date.now();
              let exp_period = new Date(res.responsedata.designshow_expiry);
              console.log(exp_period.getTime());
              if (exp_period.getTime() > now) {
                console.log('login- trigger initDesExpInterval');
                this.initDesExpInterval();
              } else {
                res.responsedata.show_type = res.responsedata.default_show_type;
              }
            } else {
              res.responsedata.show_type = res.responsedata.default_show_type;
            }
            localStorage.setItem('appcurrentUser', JSON.stringify(res.responsedata));
            localStorage.setItem('newuser', JSON.stringify(res.responsedata));

            localStorage.setItem('check', JSON.stringify(true));
            console.log(JSON.parse(localStorage.getItem('check')));
            console.log(JSON.parse(localStorage.getItem('newuser')));


            console.log(JSON.parse(localStorage.getItem('appcurrentUser')));
            this.commonService.updateLogin(res.responsedata.username, res.
              responsedata.userid, res.responsedata.userdisplayname, true);
            this.event.publish('username:changed', res.responsedata.userdisplayname, true);
            this.nav.setRoot(WinhomePage);
          } else {
            //this.commonservice.showAlertMSG( 2, res.message );
            this.errorMessage = res.message;
            this.contact_store_no = res.store_no;
            this.isDisabled = false;
          }
          loader.dismiss();
        }
      }, error => {
        this.isDisabled = false;
        loader.dismiss();
      });
    }
  }
  register() {
    this.nav.push(RegisterPage) //navigate to RegisterPage
  }

  forgotpass() {
    this.nav.push(ForgotPassPage) //navigate to ForgetPassPage
  }

  login() {
    this.nav.setRoot(LoginPage) //navigate to WinhomePage
  }
  ionViewWillEnter() {
    console.log('will enter:',this.event);
    this.event.publish('entered', true); // HIDE footer

  }
  ionViewWillLeave() {
    console.log('will leave:',this.event);
    this.event.publish('entered', false); // SHOW footer after login

  }
  skip() {
    //  this.nav.pop();
    this.nav.setRoot(HomePage)
  }
  // to check account validity
  initInterval() {
    this.timer = setTimeout(() => {
      this.check_validity();
      console.log(Date.now());
    }, this.VAL_INTERVAL);
  }

  check_validity() {
    const now = Date.now();
    let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
    let valid_period = new Date(curuserdet.validity_period);
    if (now > valid_period.getTime()) {
      this.expired_logout();
    }
  }
  expired_logout() {
    this.commonService.updateLogin("", 0, "", false);
    let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
    curuserdet.is_logged_in = false;
    localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
    this.event.publish('username:changed', 'Guest', false);
    clearTimeout(this.timer);
    let toast = this.toastCtrl.create({
      message: 'Your account expired, contact admin to activate.',
      duration: 6000,
      position: 'bottom'
    });
    toast.present();
    this.nav.setRoot(WinhomePage);
  }
  // to check design show type expiry
  initDesExpInterval() {
    this.exptimer = setTimeout(() => {
      this.check_typeExpiry();
      console.log(Date.now());
    }, this.VAL_INTERVAL);
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
        console.log(this.exptimer);
        alert(this.exptimer);
      }
    } else {
      curuserdet.show_type = curuserdet.default_show_type;
      localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
      clearTimeout(this.exptimer);
      console.log(this.exptimer);
      alert(this.exptimer);
    }
  }

}
