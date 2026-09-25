import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, MenuController, Events, LoadingController, ToastController, IonicPage, NavParams, ModalController, Content } from 'ionic-angular';
import { Toast, Diagnostic, NativeStorage } from 'ionic-native';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CommonProvider } from '../../providers/common';
import { HomePage } from '../../pages/home/home';
import { DatePicker } from '@ionic-native/date-picker';
import { CountrymodelPage } from '../countrymodel/countrymodel';
import { GeneraltermsPage } from '../generalterms/generalterms';
import { OtpverifyPage } from '../otpverify/otpverify';


/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  @ViewChild(Content) content: Content;
  public registerForm: FormGroup;
  public username: AbstractControl;
  public passwd: AbstractControl;
  public cpasswd: AbstractControl;
  public firstname: AbstractControl;
  public lastname: AbstractControl;
  public countryname: AbstractControl;
  public statename: AbstractControl;
  public cityname: AbstractControl;
  public village_name: AbstractControl;
  public id_country: AbstractControl;
  public id_state: AbstractControl;
  public id_city: AbstractControl;
  public id_village: AbstractControl;
  public email: AbstractControl;
  public company: AbstractControl;
  public gstnumber: AbstractControl;
  public company_register_date: AbstractControl;
  public company_address2: AbstractControl;
  public check: AbstractControl;
  public whatsappnumber: AbstractControl;
  public is_email: AbstractControl;
  public branchname: AbstractControl;
  public adhaar_no: AbstractControl;
  public pan: AbstractControl;


  type = "p";
  count = 0;
  animateClass = { 'zoom-in': true };
  countries = [];
  states = [];
  cities = [];
  public submitted: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = '';
  public typechecknew = 'password';
  public showPassnew = false;
  public typecheckconfirm = 'password';
  public showPassconfirm = false;
  reg: any = /^[a-zA-Z ]*$/;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  gstPattern = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$" // "^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$";
  panPattern = "[A-Z]{5}[0-9]{4}[A-Z]{1}";
  votterPattern = "^([a-zA-Z]){3}([0-9]){7}?$";
  rationPattern = "^([a-zA-Z0-9]){8,12}\s*$";
  passportPattern = "^[A-PR-WY][1-9]\\d\\s?\\d{4}[1-9]$";
  // adhar_pattern = "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$";
  adhar_pattern = "^[2-9][0-9]{11}$";
  pwd: any = false;
  accept: any = false;
  deviceid = JSON.parse(localStorage.getItem('DeviceData'));
  details: any = { 'countryname': 'India', 'id_country': '101', 'statename': '', 'id_state': '', 'cityname': '', 'id_city': '' };
  country: any[] = [];
  state: any = [];
  city: any = [];
  village: any = [];
  address1: any = '';
  address2: any = '';
  passport: any = '';
  dl_number: any = '';
  // adhaar_no: any = '';
  pincode: any = [];
  religion: any = [];
  customertype: any = [];
  date_of_birth: any = [];
  date_of_wed: any = [];
  selected = 0;
  showinput: any = false;
  cty_code: any = [];
  country_code: any = '';
  empData = JSON.parse(localStorage.getItem('empDetail'));

  branches: any = [];
  id_branch: any = null;

  constructor(private datePicker: DatePicker, private platform: Platform, private builder: FormBuilder, private nav: NavController, private events: Events, private menu: MenuController, private commonservice: CommonProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private event: Events, public modal: ModalController, public common: CommonProvider) {
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;
    this.registerForm = builder.group({
      'firstname': ['', Validators.compose([Validators.required])],
      'lastname': ['', Validators.compose([Validators.required])],
      'username': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      /* 'email': ['', Validators.compose([Validators.pattern(this.emailPattern)])], */
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'passwd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      'cpasswd': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
      'address1': ['', Validators.compose([Validators.required]), this.address1 != null ? this.address1['address1'] : null],
      'address2': this.address2 != null ? this.address1['address2'] : null,
      'check': false,
      // 'customertype': this.customertype != null ? this.customertype['customertype'] : null,
      'customertype': ['', Validators.compose([Validators.required])],
      'date_of_birth': this.date_of_birth != null ? this.date_of_birth['date_of_birth'] : null,
      'countryname': this.details['countryname'],
      'id_country': this.details['id_country'],
      'statename': this.details['statename'],
      'id_state': [this.details['id_state'], Validators.required],
      'cityname': this.details['cityname'],
      'id_city': [this.details['id_city'], Validators.required],
      /*       'countryname': ['', Validators.compose([Validators.required])],
            'statename': ['', Validators.compose([Validators.required])],
            'cityname': ['', Validators.compose([Validators.required])],
            'id_country': this.id_country != null ? this.id_country['id_country'] : null,
            'id_state': this.id_state != null ? this.id_state['id_state'] : null,
            'id_city': this.id_city != null ? this.id_city['id_city'] : null, */
      'village_name': ['', this.village_name != null ? this.village_name['village_name'] : null],
      'id_village': this.details['id_village'],
      'company': ['', Validators.compose([Validators.required, Validators.minLength(3)]), this.company != null ? this.company : null],
      'gstnumber': ['', Validators.compose([Validators.required, Validators.pattern(this.gstPattern)]), this.gstnumber != null ? this.gstnumber : null],
      'company_register_date': ['', Validators.compose([Validators.required]), this.company_register_date != null ? this.company_register_date['company_register_date'] : null],
      //'company_register_date': this.company_register_date != null ? this.company_register_date['company_register_date'] : null,
      'company_address2': ['', Validators.compose([Validators.required]), this.company_address2 != null ? this.company_address2 : null],
      'country_code': ['', Validators.compose([Validators.required])],
      'whatsappnumber': ['', Validators.compose([Validators.required])],
      'is_email': '1',
      'branchname': ['', Validators.compose([Validators.required]), this.branchname != null ? this.branchname['branchname'] : null],
      'id_branch': this.id_branch,
      //'adhaar_no': ['', Validators.compose([Validators.required, Validators.pattern(this.adhar_pattern)])],
      'adhaar_no': [''],
      'pan': ['', Validators.compose([Validators.required, Validators.pattern(this.panPattern)])],
    },
    );

    this.firstname = this.registerForm.controls['firstname'];
    this.lastname = this.registerForm.controls['lastname'];
    this.username = this.registerForm.controls['username'];
    this.email = this.registerForm.controls['email'];
    this.passwd = this.registerForm.controls['passwd'];
    this.cpasswd = this.registerForm.controls['cpasswd'];
    this.address1 = this.registerForm.controls['address1'];
    this.address2 = this.registerForm.controls['address2'];
    this.check = this.registerForm.controls['check'];
    this.date_of_birth = this.registerForm.controls['date_of_birth'];
    this.countryname = this.registerForm.controls['countryname'];
    this.statename = this.registerForm.controls['statename'];
    this.cityname = this.registerForm.controls['cityname'];
    this.village_name = this.registerForm.controls['village_name'];
    this.id_country = this.registerForm.controls['id_country'];
    this.id_state = this.registerForm.controls['id_state'];
    this.id_city = this.registerForm.controls['id_city'];
    this.id_village = this.registerForm.controls['id_village'];
    this.company = this.registerForm.controls['company'];
    this.gstnumber = this.registerForm.controls['gstnumber'];
    this.company_register_date = this.registerForm.controls['company_register_date'];
    this.company_address2 = this.registerForm.controls['company_address2'];
    this.customertype = this.registerForm.controls['customertype'];
    this.whatsappnumber = this.registerForm.controls['whatsappnumber'];
    this.country_code = this.registerForm.controls['country_code'];
    this.is_email = this.registerForm.controls['is_email']
    this.branchname = this.registerForm.controls['branchname'];
    this.id_branch = this.registerForm.controls['id_branch'];
    this.adhaar_no = this.registerForm.controls['adhaar_no'];
    this.pan = this.registerForm.controls['pan'];

/*     let loader = this.loadingCtrl.create({
      content: 'Please Wait',
      spinner: 'bubbles',
    });
    loader.present(); */

    this.common.getCountryData().then(data => {
    //  loader.dismiss();
      this.country = data;
      this.common.getStatebyCountryData(this.details['id_country']).then(data => {
        // loader.dismiss();
        this.registerForm.controls['countryname'].setValue(this.details['countryname']);
        this.registerForm.controls['id_country'].setValue(this.details['id_country']);
        this.state = data;

        this.common.getCitybyStateData(this.details['id_state']).then(data => {
          // loader.dismiss();
          this.registerForm.controls['statename'].setValue(this.details['statename']);
          this.registerForm.controls['id_state'].setValue(this.details['id_state']);
          this.registerForm.controls['cityname'].setValue(this.details['cityname']);
          this.registerForm.controls['id_city'].setValue(this.details['id_city']);
          this.city = data;


        })
      })

    })

    /*     this.common.getVillage().then(data => {
          this.village = data;
          console.log(this.village);
        }) */

    this.common.readall_Branch().then(data => {
      this.branches = data;
      console.log(this.branches);
    })

    this.common.getCountrycode().then(data => {
      console.log(data);
      this.cty_code = data;
      console.log(this.cty_code);
      this.cty_code.forEach((code) => {
        // console.log(code);
        if (code.is_default_code == 1) {
          this.registerForm.controls['country_code'].setValue(code.cty_codeno);
        }
      })

    })
  }
  // ionViewWillLeave(){
  //     this.nav.setRoot(HomePage)
  // }
  home() {
    this.nav.setRoot(HomePage) //navigate to HomePage
  }
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    console.log('1111111')
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        // this.errorMessage = 'PasswordMismatch';

        this.pwd = true;
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        // this.errorMessage = '';
        this.pwd = false;
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  segmentChanged(e) {
    this.content.scrollToTop();
  }
  next(e) {
    this.type = 'o';
    this.content.scrollToTop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  skip() {
    this.nav.pop();
  }
  validateCaptilize(e, type) {
    console.log(e['value']);
    console.log(type);
    console.log((e['value']).toUpperCase());
    if (type == 'gstno') {
      this.registerForm.controls['gstnumber'].setValue(e['value'].toUpperCase());
      if (this.registerForm.controls['gstnumber'].value.length > 15) {
        let v: any = this.registerForm.controls['gstnumber'].value.slice(0, 15);
        this.registerForm.controls['gstnumber'].setValue(v.toUpperCase());
      }
    } else if (type == 'pancard') {
      this.registerForm.controls['pan'].setValue(e['value'].toUpperCase());
      if (this.registerForm.controls['pan'].value.length > 10) {
        let v: any = this.registerForm.controls['pan'].value.slice(0, 10);
        this.registerForm.controls['pan'].setValue(v.toUpperCase());
      }
    } else if (type == 'voter') {
      this.registerForm.controls['voterid'].setValue(e['value'].toUpperCase());

      if (this.registerForm.controls['voterid'].value.length > 10) {
        let v: any = this.registerForm.controls['voterid'].value.slice(0, 10);
        this.registerForm.controls['voterid'].setValue(v.toUpperCase());
      }
    }
    else if (type == 'adhar') {
      if (this.registerForm.controls['adhaar_no'].value.length > 12) {
        let v: any = this.registerForm.controls['adhaar_no'].value.slice(0, 12);
        this.registerForm.controls['adhaar_no'].setValue(v.toUpperCase());
      }
    }
    else if (type == 'pass') {
      this.registerForm.controls['passport'].setValue(e['value'].toUpperCase())
      console.log('000000');
    }
    else if (type == 'dl_num') {
      this.registerForm.controls['dl_number'].setValue(e['value'].toUpperCase())
      console.log('999999');
    }
    else {
      if (type == 'ration') {
        this.registerForm.controls['rationcard'].setValue(e['value'].toUpperCase());
      }
    }
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

  birth(type, index) {
    console.log(type, index, '111111111111');

    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.details['date_of_birth'] = yy + "-" + mmm + "-" + ddd;
      this.details['spouse_dob'] = yy + "-" + mmm + "-" + ddd;
      this.details['child_dob'] = yy + "-" + mmm + "-" + ddd;
      console.log(this.details['date_of_birth'], '222222222222');

      if (type == 'common') {
        console.log('33333333333333');

        this.registerForm.controls['date_of_birth'].setValue(ddd + "-" + mmm + "-" + yy);
      } else if (type == 'spouse') {
        this.registerForm.controls['spouse_dob'].setValue(ddd + "-" + mmm + "-" + yy);
      }
      // console.log( this.productdet.due_date)
    });
  }
  wed(type) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(date => {

      var ddd = date.getDate();
      var mmm = date.getMonth() + 1;
      var yy = date.getFullYear();
      //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
      var today = date.toISOString().substring(0, 10);
      //this.fromdate= today;
      this.details.date_of_wed = yy + "-" + mmm + "-" + ddd;
      //  this.details.spouse_wed = yy + "-" + mmm + "-" + ddd;
      // this.registerForm.controls['date_of_wed'].setValue(yy + "-" + mmm + "-" + ddd);
      this.registerForm.controls['date_of_wed'].setValue(ddd + "-" + mmm + "-" + yy);
      // console.log( this.productdet.due_date)
    });
  }

  onSelectChange(selectedValue: any) {
    console.log(selectedValue)
    this.selected = selectedValue;
    console.log(this.selected);
  }

  /*   public onSubmit(values: any): void {
      console.log(this.registerForm);
      console.log(values);
      console.log(this.registerForm.controls['id_branch'].valid);
      console.log(this.registerForm.controls['branchname']);

  const customerType = this.registerForm.controls['customertype'].value;

      if (this.registerForm.controls["customertype"].valid) {
        if (this.registerForm.get('firstname').valid) {
          if (this.registerForm.get('lastname').valid) {
            if (this.registerForm.get('country_code').valid) {
              if (this.registerForm.get('username').valid) {
                if (this.registerForm.get('whatsappnumber').valid) {
                  if (this.registerForm.get('email').valid) {
                    if (this.registerForm.controls['address1'].valid) {
                      if (this.registerForm.controls['id_state'].valid) {
                        if (this.registerForm.controls['id_city'].valid) {
                          if (this.registerForm.controls['branchname'].valid) {
                            if (this.registerForm.get('passwd').valid && this.registerForm.get('cpasswd').valid && this.registerForm.controls['passwd'].value == this.registerForm.controls['cpasswd'].value) {
                              if (customerType === '1' && this.registerForm.controls['adhaar_no'].valid) {
                                if (this.registerForm.controls['pan'].valid) {
                                  if (this.registerForm.controls['company'].valid) {
                                    if (this.registerForm.controls['gstnumber'].valid) {
                                      if (this.registerForm.controls['company_register_date'].valid) {
                                        if (this.registerForm.controls['company_address2'].valid) {
                                          if (this.registerForm.controls['check'].value == true) {
                                            //  if (this.registerForm.controls['rationcard'].valid) {
                                            this.errorMessage = 'Doing Register...';
                                            this.isDisabled = true;
                                            let loader = this.loadingCtrl.create({
                                              content: 'Please Wait',
                                              spinner: 'bubbles',
                                            });
                                            loader.present();
                                            let postData = Object.assign({}, values);
                                            postData['company_gstno'] = this.registerForm.controls['gstnumber'].value;
                                            postData['cus_id_branch'] = this.registerForm.controls['id_branch'].value;
                                            postData['prefix'] = this.registerForm.controls['branchname'].value;
                                            console.log(JSON.stringify(postData));


                                            var post = {
                                              'username': this.registerForm.controls['username'].value,
                                              'email': this.registerForm.controls['email'].value,
                                              'whatsappnumber': this.registerForm.controls['whatsappnumber'].value,
                                            }
                                            console.log('post : ', post);

                                            this.commonservice.userRegisterOtp(JSON.stringify(post)).then(res => {
                                              if (res['success']) {
                                                let toast = this.toastCtrl.create({
                                                  message: res.message,
                                                  duration: 3000
                                                });
                                                toast.present();
                                                this.nav.setRoot(OtpverifyPage, { username: this.registerForm.controls['username'].value, type: 'new', registerData: postData, email: this.registerForm.controls['email'].value, whatsappno: this.registerForm.controls['whatsappnumber'].value });
                                              } else {
                                                let toast = this.toastCtrl.create({
                                                  message: res.message,
                                                  duration: 3000
                                                });
                                                toast.present();
                                              }
                                              loader.dismiss();

                                            })

                                          } else {
                                            let toast = this.toastCtrl.create({
                                              message: 'Please accept Terms and the Conditions',
                                              position: 'bottom',
                                              duration: 6000
                                            });
                                            toast.present();
                                          }
                                        }
                                        else {
                                          console.log('gst');
                                          let toast = this.toastCtrl.create({
                                            message: 'Please Enter Company Address',
                                            position: 'bottom',

                                            duration: 6000
                                          });
                                          toast.present();
                                        }
                                      }
                                      else {
                                        console.log('gst');
                                        let toast = this.toastCtrl.create({
                                          message: 'Please Select Reg Date',
                                          position: 'bottom',

                                          duration: 6000
                                        });
                                        toast.present();
                                      }

                                    }
                                    else {
                                      console.log('gst');
                                      let toast = this.toastCtrl.create({
                                        message: 'Please Enter Correct Gst Number',
                                        position: 'bottom',

                                        duration: 6000
                                      });
                                      toast.present();
                                    }
                                  }
                                  else {
                                    console.log('company name');
                                    let toast = this.toastCtrl.create({
                                      message: 'Please Enter Company Name',
                                      position: 'bottom',

                                      duration: 6000
                                    });
                                    toast.present();
                                  }
                                }
                                else {
                                  console.log('company name');
                                  let toast = this.toastCtrl.create({
                                    message: 'Please Enter Valid Pancard',
                                    position: 'bottom',
                                    duration: 6000
                                  });
                                  toast.present();
                                }
                              } else {
                                console.log('company name');
                                let toast = this.toastCtrl.create({
                                  message: 'Please Enter Valid Aadhaar No',
                                  position: 'bottom',
                                  duration: 6000
                                });
                                toast.present();
                              }
                            }
                            else {
                              if (this.registerForm.controls['passwd'].value != this.registerForm.controls['cpasswd'].value) {

                                let toast = this.toastCtrl.create({
                                  message: 'Password and Confirm Password Mismatch',
                                  position: 'bottom',
                                  duration: 6000
                                });
                                toast.present();
                              }
                              else {
                                let toast = this.toastCtrl.create({
                                  message: 'Minimum 8 to 16 Characters Only Allowed',
                                  position: 'bottom',
                                  duration: 6000
                                });
                                toast.present();
                              }
                            }
                          } else {
                            let toast = this.toastCtrl.create({
                              message: 'Please Select Branch',
                              position: 'bottom',
                              duration: 6000
                            });
                            toast.present();
                          }
                        } else {
                          let toast = this.toastCtrl.create({
                            message: 'Please Select City',
                            position: 'bottom',
                            duration: 6000
                          });
                          toast.present();
                        }
                      } else {
                        let toast = this.toastCtrl.create({
                          message: 'Please Select State',
                          position: 'bottom',
                          duration: 6000
                        });
                        toast.present();
                      }
                    } else {
                      let toast = this.toastCtrl.create({
                        message: 'Please Enter Address',
                        position: 'bottom',

                        duration: 6000
                      });
                      toast.present();
                    }
                  }
                  else {
                    let toast = this.toastCtrl.create({
                      message: 'Enter Valid Email Id',
                      position: 'bottom',

                      duration: 6000
                    });
                    toast.present();
                  }
                } else {
                  let toast = this.toastCtrl.create({
                    message: 'Enter Valid WhatsApp Number',
                    position: 'bottom',
                    duration: 6000
                  });
                  toast.present();
                }
              }
              else {
                let toast = this.toastCtrl.create({
                  message: ' Enter Valid Mobile Number',
                  position: 'bottom',
                  duration: 6000
                });
                toast.present();
              }
            } else {
              let toast = this.toastCtrl.create({
                message: 'Please Select Your Country Code',
                position: 'bottom',
                duration: 6000
              });
              toast.present();
            }
          } else {
            let toast = this.toastCtrl.create({
              message: 'LastName Must Contain Alphabets Only',
              position: 'bottom',

              duration: 6000
            });
            toast.present();
          }
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'FirstName Must Contain Alphabets Only',
            position: 'bottom',

            duration: 6000
          });
          toast.present();
        }
      }
      else {
        console.log('Customer type');
        let toast = this.toastCtrl.create({
          message: 'Please Select Customer type',
          position: 'bottom',
          duration: 6000
        });
        toast.present();
      }
    } */
  public onSubmit(values: any): void {
    console.log(this.registerForm);
    console.log(values);
    console.log(this.registerForm.controls['id_branch'].valid);
    console.log(this.registerForm.controls['branchname']);

    const customerType = this.registerForm.controls['customertype'].value;

    if (this.registerForm.controls['customertype'].valid) {
      if (this.registerForm.get('firstname').valid) {
        if (this.registerForm.get('lastname').valid) {
          if (this.registerForm.get('country_code').valid) {
            if (this.registerForm.get('username').valid) {
              if (this.registerForm.get('whatsappnumber').valid) {
                if (this.registerForm.get('email').valid) {
                  if (this.registerForm.controls['address1'].valid) {
                    if (this.registerForm.controls['id_state'].valid) {
                      if (this.registerForm.controls['id_city'].valid) {
                        if (this.registerForm.controls['branchname'].valid) {
                          if (
                            this.registerForm.get('passwd').valid &&
                            this.registerForm.get('cpasswd').valid &&
                            this.registerForm.controls['passwd'].value ==
                            this.registerForm.controls['cpasswd'].value
                          ) {
                            if (customerType === '1') {
                              if (this.registerForm.controls['adhaar_no'].valid) {
                                if (this.registerForm.controls['pan'].valid) {
                                  this.submitCompanyFields(values);
                                } else {
                                  this.presentToast('Please Enter Valid Pancard');
                                }
                              } else {
                                this.presentToast('Please Enter Valid Aadhaar No');
                              }
                            } else {
                              if (this.registerForm.controls['pan'].valid) {
                                this.submitCompanyFields(values);
                              } else {
                                this.presentToast('Please Enter Valid Pancard');
                              }
                            }
                          } else {
                            if (
                              this.registerForm.controls['passwd'].value !=
                              this.registerForm.controls['cpasswd'].value
                            ) {
                              this.presentToast('Password and Confirm Password Mismatch');
                            } else {
                              this.presentToast('Minimum 8 to 16 Characters Only Allowed');
                            }
                          }
                        } else {
                          this.presentToast('Please Select Branch');
                        }
                      } else {
                        this.presentToast('Please Select City');
                      }
                    } else {
                      this.presentToast('Please Select State');
                    }
                  } else {
                    this.presentToast('Please Enter Address');
                  }
                } else {
                  this.presentToast('Enter Valid Email Id');
                }
              } else {
                this.presentToast('Enter Valid WhatsApp Number');
              }
            } else {
              this.presentToast('Enter Valid Mobile Number');
            }
          } else {
            this.presentToast('Please Select Your Country Code');
          }
        } else {
          this.presentToast('LastName Must Contain Alphabets Only');
        }
      } else {
        this.presentToast('FirstName Must Contain Alphabets Only');
      }
    } else {
      this.presentToast('Please Select Customer type');
    }
  }

  submitCompanyFields(values: any) {
    if (
      this.registerForm.controls['company'].valid &&
      this.registerForm.controls['gstnumber'].valid &&
      this.registerForm.controls['company_register_date'].valid &&
      this.registerForm.controls['company_address2'].valid
    ) {
      if (this.registerForm.controls['check'].value == true) {
        this.errorMessage = 'Doing Register...';
        this.isDisabled = true;
        let loader = this.loadingCtrl.create({
          content: 'Please Wait',
          spinner: 'bubbles'
        });
        loader.present();

        let postData = Object.assign({}, this.registerForm.value);
        postData['company_gstno'] = this.registerForm.controls['gstnumber'].value;
        postData['cus_id_branch'] = this.registerForm.controls['id_branch'].value;
        postData['prefix'] = this.registerForm.controls['branchname'].value;

        let post = {
          username: this.registerForm.controls['username'].value,
          email: this.registerForm.controls['email'].value,
          whatsappnumber: this.registerForm.controls['whatsappnumber'].value
        };

        this.commonservice.userRegisterOtp(JSON.stringify(post)).then((res) => {
          if (res['success']) {
            this.toastCtrl.create({
              message: res.message,
              duration: 3000
            }).present();
            this.nav.setRoot(OtpverifyPage, {
              username: this.registerForm.controls['username'].value,
              type: 'new',
              registerData: postData,
              email: this.registerForm.controls['email'].value,
              whatsappno: this.registerForm.controls['whatsappnumber'].value
            });
          } else {
            this.presentToast(res.message);
          }
          loader.dismiss();
        });
      } else {
        this.presentToast('Please accept Terms and the Conditions');
      }
    } else if (!this.registerForm.controls['company'].valid) {
      this.presentToast('Please Enter Company Name');
    } else if (!this.registerForm.controls['gstnumber'].valid) {
      this.presentToast('Please Enter Correct Gst Number');
    } else if (!this.registerForm.controls['company_register_date'].valid) {
      this.presentToast('Please Select Reg Date');
    } else {
      this.presentToast('Please Enter Company Address');
    }
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 6000
    });
    toast.present();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  ionViewWillEnter() {
    this.event.publish('entered', true);
  }
  ionViewWillLeave() {
    this.event.publish('entered', false);
  }

  getmodal(name, details) {
    console.log(name);
    console.log(details);

    let mod = this.modal.create(CountrymodelPage, { data: details, name: name })
    mod.present();
    mod.onDidDismiss((dataa, name) => {
      if (dataa != undefined) {
        let loader = this.loadingCtrl.create({
          content: 'Please Wait',
          spinner: 'bubbles',
        });
        loader.present();
        if (name == 'Country') {
          this.common.getStatebyCountryData(dataa['id_country']).then(data => {
            this.registerForm.controls['countryname'].setValue(dataa['name']);
            this.registerForm.controls['id_country'].setValue(dataa['id_country']);
            this.registerForm.controls['statename'].setValue('');
            this.registerForm.controls['id_state'].setValue('');
            this.state = data;
            loader.dismiss();
          })
        }
        if (name == 'State') {
          this.common.getCitybyStateData(dataa['id_state']).then(data => {
            this.registerForm.controls['statename'].setValue(dataa['name']);
            this.registerForm.controls['id_state'].setValue(dataa['id_state']);
            this.registerForm.controls['cityname'].setValue('');
            this.registerForm.controls['id_city'].setValue('');
            this.city = data;
            loader.dismiss();

          })
        }
        if (name == 'Country Code') {
          this.common.getCountrycode().then(data => {
            this.registerForm.controls['country_code'].setValue(dataa['cty_codeno']);
            this.cty_code = data;
            loader.dismiss();

          })
        }
        if (name == 'City') {
          this.registerForm.controls['cityname'].setValue(dataa['name']);
          this.registerForm.controls['id_city'].setValue(dataa['id_city']);
          loader.dismiss();
        }

        if (name == 'Village') {
          this.registerForm.controls['village_name'].setValue(dataa['village_name']);
          this.registerForm.controls['id_village'].setValue(dataa['id_village']);
          loader.dismiss();
        }
        if (name == 'Branch') {
          this.registerForm.controls['branchname'].setValue(dataa['name']);
          this.registerForm.controls['id_branch'].setValue(dataa['id_branch']);
          loader.dismiss();
        }

      }
    });
  }

  goto() {
    this.nav.setRoot(HomePage);
  }
  /*   typecheck() {
      console.log('123');

      console.log(this.registerForm.controls["customertype"].value);

      if (this.registerForm.controls["customertype"].value == '3') {
        this.registerForm.controls["gstnumber"].setValidators([Validators.required, Validators.pattern(this.gstPattern)]);
        this.registerForm.controls['gstnumber'].updateValueAndValidity();
        this.registerForm.controls["email"].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
        this.registerForm.controls['email'].updateValueAndValidity();
        this.type = 'o'
        console.log(this.type);
      }
      else if (this.registerForm.controls["customertype"].value == '1') {
        this.registerForm.controls['company'].clearValidators();
        this.registerForm.controls['company'].updateValueAndValidity();
        this.registerForm.controls['gstnumber'].clearValidators();
        this.registerForm.controls['gstnumber'].updateValueAndValidity();
        this.registerForm.controls['company_register_date'].clearValidators();
        this.registerForm.controls['company_register_date'].updateValueAndValidity();
        this.registerForm.controls['company_address2'].clearValidators();
        this.registerForm.controls['company_address2'].updateValueAndValidity();

        this.type = 'p'
        console.log(this.type);
      }
    } */

  typecheck() {
    const customerType = this.registerForm.controls["customertype"].value;

    if (customerType == '3') { // Company
      this.type = 'o';
      this.registerForm.controls["gstnumber"].setValidators([Validators.required, Validators.pattern(this.gstPattern)]);
      this.registerForm.controls['gstnumber'].updateValueAndValidity();
      this.registerForm.controls["email"].setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      this.registerForm.controls['email'].updateValueAndValidity();

      // Aadhaar not required
      this.registerForm.controls['adhaar_no'].clearValidators();
      this.registerForm.controls['adhaar_no'].updateValueAndValidity();

      // Pan required
      this.registerForm.controls['pan'].setValidators([Validators.required, Validators.pattern(this.panPattern)]);
      this.registerForm.controls['pan'].updateValueAndValidity();

    } else if (customerType == '1') { // Individual
      this.type = 'p';

      this.registerForm.controls['company'].clearValidators();
      this.registerForm.controls['company'].updateValueAndValidity();
      this.registerForm.controls['gstnumber'].clearValidators();
      this.registerForm.controls['gstnumber'].updateValueAndValidity();
      this.registerForm.controls['company_register_date'].clearValidators();
      this.registerForm.controls['company_register_date'].updateValueAndValidity();
      this.registerForm.controls['company_address2'].clearValidators();
      this.registerForm.controls['company_address2'].updateValueAndValidity();

      // Aadhaar required
      this.registerForm.controls['adhaar_no'].setValidators([Validators.required, Validators.pattern(this.adhar_pattern)]);
      this.registerForm.controls['adhaar_no'].updateValueAndValidity();

      // Pan required
      this.registerForm.controls['pan'].setValidators([Validators.required, Validators.pattern(this.panPattern)]);
      this.registerForm.controls['pan'].updateValueAndValidity();
    }
  }

  checkseg() {
    if (this.type == 'o') {
      this.registerForm.controls['customertype'].setValue(2);
      this.typecheck();
    }
    else {
      this.registerForm.controls['customertype'].setValue(1);
      this.typecheck();
    }
  }
  texto(event, name) {
    console.log(event, name)

    const NUMBER_REGEXP = /^[a-zA-Z ]*$/;
    let newValue = event.target.value;
    let regExp = new RegExp(NUMBER_REGEXP);
    console.log(regExp)
    var withNoDigits = event.target.value.replace(/[0-9]/g, '');
    if (name == 'firstname') {
      this.registerForm.controls['firstname'].setValue(withNoDigits);
    } else if (name == 'company') {
      this.registerForm.controls['company'].setValue(withNoDigits);
    }

    //  if (!regExp.test(newValue)) {
    //   let v:any = this.registerForm.controls['firstname'].value.slice(0, -1);
    //   this.registerForm.controls['firstname'].setValue(v);
    //  }

  }
  terms() {
    this.nav.push(GeneraltermsPage)
  }



  onNumberInput(event: any) {
    let input = event.value || '';
    // Remove all non-digit characters
    input = input.replace(/\D/g, '');

    // Trim to 10 digits
    if (input.length > 10) {
      input = input.substring(0, 10);
    }

    this.username.setValue(input, { emitEvent: false });
  }
}
