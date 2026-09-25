import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { RegisterPage } from '../../pages/register/register';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { LoginPage } from '../../pages/login/login';
import { CommonProvider } from '../../providers/common';
import { OtpverifyPage } from '../otpverify/otpverify';

/*
  Generated class for the ForgotPass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot-pass',
  templateUrl: 'forgot-pass.html'
})
export class ForgotPassPage {
  forgotpasswordForm: FormGroup;
  resetpasswordForm: FormGroup;
  public username: AbstractControl;
  //   public mobileno: AbstractControl;
  public password: AbstractControl;
  public confirmPass: AbstractControl;
  public submitted: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  resetpass: boolean = false;
  userdetails: any;
  public typechecknew = 'password';
  public showPassnew = false;
  public typecheckconfirm = 'password';
  public showPassconfirm = false;

  constructor(public toast: ToastController, private platform: Platform, private builder: FormBuilder, private nav: NavController, private event: Events, private menu: MenuController, private commonService: CommonProvider, private loadingCtrl: LoadingController) {
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;
    this.resetpass = false;
    this.forgotpasswordForm = builder.group({
      username: ['', Validators.required],
      // mobileno: ['', Validators.required]
    });
    this.resetpasswordForm = builder.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'confirmPass': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    }, { validator: this.checkIfMatchingPasswords('password', 'confirmPass') });
    this.username = this.forgotpasswordForm.controls['username'];
    // this.mobileno = this.forgotpasswordForm.controls['mobileno'];

    this.password = this.resetpasswordForm.controls['password'];
    this.confirmPass = this.resetpasswordForm.controls['confirmPass'];
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }
  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.forgotpasswordForm.valid) {
      this.errorMessage = 'Please wait...';
      this.isDisabled = true;
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.commonService.checkForgotpassword(JSON.stringify(values)).then(res => {
        if (res) {
          if (res.success) {
            this.errorMessage = res.message;
            this.resetpass = true;
            this.userdetails = res.responsedata;
            this.isDisabled = false;
            this.nav.setRoot(OtpverifyPage, { username: this.forgotpasswordForm.controls['username'].value, type: 'forgot' });
          } else {
            //this.commonservice.showAlertMSG( 2, res.message );

            let toast = this.toast.create({
              message: res.message,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.errorMessage = res.message;
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
  public onPasswordreset(values: Object): void {
    this.submitted = true;
    if (this.forgotpasswordForm.valid) {
      this.errorMessage = 'Please wait...';
      this.isDisabled = true;
      let loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      this.commonService.resetpassword(JSON.stringify({ 'passworddata': values, 'userdata': this.userdetails })).then(res => {
        if (res) {
          if (res.success) {
            this.errorMessage = res.message;
            this.resetpass = false;

            let toast = this.toast.create({
              message: res.message,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.nav.setRoot(LoginPage);
            this.isDisabled = false;
          } else {
            // this.commonService.showAlertMSG( 2, res.message );
            this.errorMessage = res.message;
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
  ionViewDidLoad() {
    console.log('Hello ForgotPassPage Page');
  }
  mobie_numberOnly(event): boolean {
    console.log(event)

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  register() {
    this.nav.push(RegisterPage) //navigate to RegisterPage
  }

  login() {
    this.nav.setRoot(LoginPage) //navigate to HomePage
  }
  ionViewWillEnter() {
    this.event.publish('entered', true);
  }
  ionViewWillLeave() {
    this.event.publish('entered', false);
  }
  shownewPassword() {
    this.showPassnew = !this.showPassnew;

    if (this.showPassnew) {
      this.typechecknew = 'text';
    } else {
      this.typechecknew = 'password';
    }
  }
  showconfirmPassword() {
    this.showPassconfirm = !this.showPassconfirm;

    if (this.showPassconfirm) {
      this.typecheckconfirm = 'text';
    } else {
      this.typecheckconfirm = 'password';
    }
  }
}
