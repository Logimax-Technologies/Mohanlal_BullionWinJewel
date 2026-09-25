import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController ,ToastController} from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MyDashboardPage } from '../../pages/my-dashboard/my-dashboard';
import { CommonProvider } from '../../providers/common';
import { LoginPage } from '../login/login';

/*
  Generated class for the ForgotPass page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component( {
    selector: 'page-reset-password',
    templateUrl: 'reset-password.html'
} )
export class ResetPassPage {
    resetpasswordForm: FormGroup;
    public username: AbstractControl;
    public mobileno: AbstractControl;
    public password: AbstractControl;
    public confirmPass: AbstractControl;
    public submitted: boolean = false;
    isDisabled: boolean = false;
    errorMessage: string = 'Please Enter New Password';
    resetpass: boolean = false;
    userdetails: any;
    public typechecknew = 'password';
    public showPassnew = false;
    public typecheckconfirm = 'password';
    public showPassconfirm = false;

    constructor(private toastCtrl: ToastController, private platform: Platform, private builder: FormBuilder, private nav: NavController, private event: Events, private menu: MenuController, private commonService: CommonProvider, private loadingCtrl: LoadingController ) {
        this.nav = nav;
        this.menu = menu;
        this.platform = platform;
        this.resetpass = false;
        this.resetpasswordForm = builder.group( {
            'password': ['', Validators.compose( [Validators.required, Validators.minLength( 4 )] )],
            'confirmPass': ['', Validators.compose( [Validators.required, Validators.minLength( 4 )] )],
        } , { validator: this.checkIfMatchingPasswords( 'password', 'confirmPass' ) } );

        this.password = this.resetpasswordForm.controls['password'];
        this.confirmPass = this.resetpasswordForm.controls['confirmPass'];
    }
	checkIfMatchingPasswords( passwordKey: string, passwordConfirmationKey: string ) {
        return ( group: FormGroup ) => {
            let passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if ( passwordInput.value !== passwordConfirmationInput.value ) {
                return passwordConfirmationInput.setErrors( { notEquivalent: true } )
            }
            else {
                return passwordConfirmationInput.setErrors( null );
            }
        }
    }
	private presentToast( text ) {
        let toast = this.toastCtrl.create( {
            message: text,
            duration: 3000,
            position: 'bottom'
        } );
        toast.present();
    }

    public onPasswordreset( values: Object ): void {
        this.submitted = true;
        if ( this.resetpasswordForm.valid ) {
            this.errorMessage = 'Please wait...';
            this.isDisabled = true;
            let loader = this.loadingCtrl.create( {
                content: "Please wait..."
            } );
            loader.present();
			this.userdetails = this.commonService.getUserDetails();
            this.commonService.resetpassword( JSON.stringify( { 'passworddata': values, 'userdata': this.userdetails } ) ).then( res => {
                if ( res ) {
                    if ( res.success ) {
                        this.errorMessage = res.message;
                        this.resetpass = false;
						this.presentToast( res.message);
                        this.isDisabled = false;

                        console.log('Agree clicked');
                        this.commonService.updateLogin("", 0, "", false);
                        let curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
                        curuserdet.is_logged_in = false;
                        localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
                        this.event.publish('username:changed', 'Guest', false);
                        //this.nav.setRoot( WinhomePage );
                        console.log(curuserdet)
                        localStorage.setItem('check', JSON.stringify(false));
                        console.log(JSON.parse(localStorage.getItem('check')));
                        this.nav.push(LoginPage);
                    } else {
                        //this.commonservice.showAlertMSG( 2, res.message );
						this.presentToast( res.message );
                        this.errorMessage = res.message;
                        this.isDisabled = false;
                    }
                    loader.dismiss();
                }
            }, error => {
                this.isDisabled = false;
                loader.dismiss();
            } );
        }else{
            this.presentToast('New password and Confirm password are mismatch');
        }
    }
    ionViewDidLoad() {
        console.log( 'Hello ForgotPassPage Page' );
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
