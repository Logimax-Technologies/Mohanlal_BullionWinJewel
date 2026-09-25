import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Nav } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonServiceProvider } from '../../providers/common-service/common-service';

/**
 * Generated class for the EnquiryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-enquiry',
  templateUrl: 'enquiry.html',
})
export class EnquiryPage {
  public enquiryForm: FormGroup;
  public name: AbstractControl;
  public mobile: AbstractControl;
  public address: AbstractControl;
  public emailid: AbstractControl;
  public message: AbstractControl;
  public submitted: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private builder: FormBuilder, private toastCtrl: ToastController, private commonservice: CommonServiceProvider, public loadingCtrl: LoadingController) {
    this.enquiryForm = builder.group( {
            'name': ['', Validators.compose( [Validators.required, Validators.minLength( 4 )] )],
            'mobile': ['', Validators.compose( [Validators.required, Validators.minLength( 10 )] )],
            'emailid': [''],
            'address': [''],
            'message': ['', Validators.compose( [Validators.required, Validators.minLength( 10 )] )],
        } );
        this.name = this.enquiryForm.controls['name'];
        this.mobile = this.enquiryForm.controls['mobile'];
        this.emailid = this.enquiryForm.controls['emailid'];
        this.address = this.enquiryForm.controls['address'];
        this.message = this.enquiryForm.controls['message'];
  }

  ionViewDidEnter() {
    this.errorMessage= '';
  }
  public onSubmit( values: Object ): void {
          this.submitted = true;
          if ( this.enquiryForm.valid ) {
              this.errorMessage = 'Doing Register...';
              this.isDisabled = true;
              let loader = this.loadingCtrl.create( {
                  content: "Please wait..."
              } );
              loader.present();
        let deviceData = JSON.parse(localStorage.getItem( 'WLMOHANLALDeviceData'));
        let regData = {
            'status':0,
            'pushToken':deviceData !=undefined ? deviceData.pushToken : null,
            'uuid':deviceData !=undefined ? deviceData.uuid : null,
            'deviceType':deviceData !=undefined ? deviceData.deviceType : null
          }
        let enquiryData = Object.assign({}, regData, values);
        console.log(enquiryData);
              this.commonservice.sendEnquiry( JSON.stringify( enquiryData ) ).then( res => {
                  if ( res ) {
                      if ( res.success ) {
                          this.errorMessage = res.message;
                          let toast = this.toastCtrl.create( {
                              message: res.message,
                              duration: 3000
                          } );
                          toast.present();
                          this.isDisabled = false;
                      } else {
                          //this.commonservice.showAlertMSG( 2, res.message );
                          let toast = this.toastCtrl.create( {
                              message: res.message,
                              duration: 3000
                          } );
                          this.errorMessage = res.message;
                          this.isDisabled = false;
                      }
                      loader.dismiss();
                  }
              }, error => {
                  this.isDisabled = false;
                  loader.dismiss();
              } );
          }
          this.enquiryForm.reset();
      }

  onNumberInput(event: any) {
  let input = event.value || '';
  // Remove all non-digit characters
  input = input.replace(/\D/g, '');

  // Trim to 10 digits
  if (input.length > 10) {
    input = input.substring(0, 10);
  }

  this.mobile.setValue(input, { emitEvent: false });
}
}
