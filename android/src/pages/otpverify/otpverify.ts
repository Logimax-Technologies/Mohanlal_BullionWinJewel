import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Nav } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
import { CommonProvider } from '../../providers/common';
import { TabsPage } from '../tabs/tabs';
import { ResetPassPage } from '../reset-password/reset-password';

import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { WinhomePage } from '../winhome/winhome';

/**
 * Generated class for the OtpverifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-otpverify',
    templateUrl: 'otpverify.html',
})
export class OtpverifyPage {
    rootPage: any = TabsPage;
    public otpverifyForm: FormGroup;
    public receivedotp: AbstractControl;
    public submitted: boolean = false;
    isDisabled: boolean = false;
    errorMessage: string = '';

    countDown;
    counter = 0;
    tick = 1000;
    data: any = '';
    disable = false;
    type: any;

   // @ViewChild(Nav) nav: Nav;
    constructor(public cd: ChangeDetectorRef, public navCtrl: NavController, public navParams: NavParams, private builder: FormBuilder, private toastCtrl: ToastController, private commonservice: CommonProvider, public loadingCtrl: LoadingController,private nav: NavController,) {
        this.nav = nav;
        this.otpverifyForm = builder.group({
            'receivedotp': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.receivedotp = this.otpverifyForm.controls['receivedotp'];
       this.type = this.navParams.get('type');
        // var newDateObj = new Date();
        // newDateObj.setTime(newDateObj.getTime() + (1 * 60 * 1000));

        // var secondBetweenTwoDate = Math.abs((new Date().getTime() - newDateObj.getTime()) / 1000);

        // this.counter = secondBetweenTwoDate;
        // this.countDown = Observable.timer(0, this.tick)
        //     .take(this.counter)
        //     .map(() => {
        //         this.data = this.counter
        //         this.cd.detectChanges();
        //         console.log('count : ' + this.counter)
        //         console.log(this.data)
        //         return --this.counter
        //     })
        this.get_time();
    }

    get_time(){
        var newDateObj = new Date();
        newDateObj.setTime(newDateObj.getTime() + (1 * 60 * 1000));

        var secondBetweenTwoDate = Math.abs((new Date().getTime() - newDateObj.getTime()) / 1000);

        this.counter = secondBetweenTwoDate;
        this.countDown = Observable.timer(0, this.tick)
            .take(this.counter)
            .map(() => {
                this.data = this.counter
                this.cd.detectChanges();
                console.log('count : ' + this.counter)
                console.log(this.data)
                return --this.counter
            })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OtpverifyPage');
    }
    public onSubmit(values: Object): void {
        this.submitted = true;
        if (this.otpverifyForm.valid) {
            this.errorMessage = 'Doing Register...';
            this.isDisabled = true;
            let loader = this.loadingCtrl.create({
                content: "Please wait..."
            });
            loader.present();
            let deviceData = JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'));
            let regData = {
                'status': 0,
                'pushToken': deviceData != undefined ? deviceData.pushToken : null,
                'deviceid': deviceData != undefined ? deviceData.uuid : null,
                'deviceType': deviceData != undefined ? deviceData.deviceType : null,
                'username': this.navParams.get('username')
            }
            let verificationData = Object.assign({}, regData, values);
            this.commonservice.doOTPVerify(JSON.stringify(verificationData)).then(res => {
                if (res) {
                    if (res.success) {

                        this.errorMessage = res.message;
                        let toast = this.toastCtrl.create({
                            message: res.message,
                            duration: 3000
                        });
                        toast.present();
                        if (this.navParams.get('type') == 'new') {
                            this.commonservice.doRegister(JSON.stringify(this.navParams.get('registerData'))).then(res => {
                                if (res) {
                                  if (res.success) {
                                    this.errorMessage = res.message;
                                    let toast = this.toastCtrl.create({
                                      message: res.message,
                                      duration: 3000
                                    });
                                    toast.present();
                                  //  this.navCtrl.push(WinhomePage)
                                   // this.nav.setRoot(WinhomePage);
                                    this.nav.setRoot(LoginPage)
                                  } else {
                                    //this.commonservice.showAlertMSG( 2, res.message );
                                    let toast = this.toastCtrl.create({
                                      message: res.message,
                                      duration: 3000
                                    });
                                    this.errorMessage = res.message;
                                    this.isDisabled = false;
                                  }
                                  loader.dismiss();
                                }
                              }, error => {
                                this.isDisabled = false;
                                loader.dismiss();
                              });
                        } else {
                            this.navCtrl.push(ResetPassPage)
                        }

                    } else {
                        //this.commonservice.showAlertMSG( 2, res.message );
                        let toast = this.toastCtrl.create({
                            message: res.message,
                            duration: 3000
                        });
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
    public resendotp() {
        this.submitted = true;
        this.errorMessage = 'Doing Request...';
        this.isDisabled = true;
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        let deviceData = JSON.parse(localStorage.getItem('WLMOHANLALDeviceData'));
        let regData = {
            'status': 0,
            'pushToken': deviceData != undefined ? deviceData.pushToken : null,
            'deviceid': deviceData != undefined ? deviceData.uuid : null,
            'deviceType': deviceData != undefined ? deviceData.deviceType : null,
            'username': this.navParams.get('username'),
            'type' : this.navParams.get('type'),
            'email': this.navParams.get('email'),
            'whatsappnumber' : this.navParams.get('whatsappno')
        }

        this.commonservice.resendOTP(JSON.stringify(regData)).then(res => {
            if (res) {
                if (res.success) {
                    this.errorMessage = res.message;
                    let toast = this.toastCtrl.create({
                        message: res.message,
                        duration: 3000
                    });
                    toast.present();
                    this.isDisabled = false;
                    this.get_time();
                } else {
                    //this.commonservice.showAlertMSG( 2, res.message );
                    let toast = this.toastCtrl.create({
                        message: res.message,
                        duration: 3000
                    });
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
    skip() {
        this.nav.setRoot(LoginPage);
      }

}
