import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Nav } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  contactusdetails:any = [];
  public enquiryForm: FormGroup;
  public name: AbstractControl;
  public mobile: AbstractControl;
  public address: AbstractControl;
  public emailid: AbstractControl;
  public message: AbstractControl;
  public submitted: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  //public showAboutus: boolean = true;
  public showContact: boolean = true;
  public showEnquiry: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, private builder: FormBuilder, private toastCtrl: ToastController, private commonservice: CommonServiceProvider, public loadingCtrl: LoadingController) {
	 this.enquiryForm = builder.group( {
            'name': ['', Validators.compose( [Validators.required, Validators.minLength( 4 )] )],
            'mobile': ['', Validators.compose( [Validators.required, Validators.maxLength( 10 )] )],
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
  ionViewDidLoad() {
	this.commonservice.getcontactusdetails().subscribe( res => {console.log(res);
       this.contactusdetails = res['contactus'];
    });
  }
	public ContactDiv(){
        this.showContact = !this.showContact;
        console.log("status===>"+this.showContact);
	}
	public EnquiryDiv(){
		this.showEnquiry = !this.showEnquiry;
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
            'pushToken':deviceData.pushToken,
            'uuid':deviceData.uuid,
            'deviceType':deviceData.deviceType
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
}
