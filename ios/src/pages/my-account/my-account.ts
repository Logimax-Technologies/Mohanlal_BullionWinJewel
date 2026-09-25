import { Component, Pipe, PipeTransform, trigger, state, style, transition, animate, keyframes, ElementRef  } from '@angular/core';
import { NavController, Platform, MenuController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPassPage } from '../../pages/reset-password/reset-password';
import { MyOrdersPage } from '../../pages/my-orders/my-orders';

/*
Generated class for the YourAccount page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
   animations: [
        trigger('flyInTopSlow', [
            state("0", style({
                transform: 'translate3d(0,0,0)'
            })),
            transition('* => 0', [
                animate('500ms ease-in', keyframes([
                    style({ transform: 'translate3d(0,-500px,0)', offset: 0 }),
                    style({ transform: 'translate3d(0,0,0)', offset: 1 })
                ]))
            ])
        ])
    ]
})
export class MyAccountPage {
  loginForm: FormGroup;
  password: any;
  testdata: any = "hello";
  type: any;
  text: any;
  user: any = { email: '', password: '' };
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(private platform: Platform, private builder: FormBuilder, private nav: NavController, private event: Events, private menu: MenuController,) {
    this.nav = nav;
    this.menu = menu;
    this.platform = platform;
    this.type = "User";

    this.loginForm = builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ionViewWillEnter(){
    this.event.publish('pageno',3);
}
  resetpass() {
	   this.nav.push( ResetPassPage );
  }
  myorders() {
	   this.nav.push( MyOrdersPage );
  }


}
