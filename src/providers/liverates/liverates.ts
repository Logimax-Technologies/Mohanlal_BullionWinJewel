import { Injectable } from '@angular/core';
  import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Socket, SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { Observable } from 'rxjs/Observable';
import { Subscription as Sub } from 'rxjs/Subscription';
import 'rxjs/Rx';
import 'rxjs/add/observable/interval';

/*
  Generated class for the LiveratesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var LightstreamerClient: any;
declare var Subscription: any;
declare var baserateapiurl:any;
declare var socketurl:any;
declare var symbols:any;
declare var flag_settings:any;
declare var bcurl:any;
declare var bcclient:any;
declare var bcusername:any;
declare var bcpassword:any;

@Injectable()
export class LiveratesProvider {
  fncallback:any;
  rfcallback: any;
  lsClient: any;
  subscription : any;
  sub:Sub;
  itemNames = Array.isArray(symbols) ?  symbols.map(contract=>contract.contract_symbol) : [];
  fieldNames = ["desc", "bid", "ask", "high", "low", "ltp"];
  stocks: string[][];
  config: SocketIoConfig = {
		url: socketurl,
		options: {},
		};
  constructor(public http: Http, private socket: Socket, private loadingCtrl: LoadingController) {
    if(flag_settings == 0){
      this.getsettingData();
    }
    else{
    this.refreshData();
    setInterval(() => {
      this.refreshData();
    }, 800);
    this.socket = new Socket(this.config);
    }
  }


   setcallback(fn){
     this.fncallback = fn;
   }
/*    public getcommodityupdatescallback(){
    let observable = new Observable(observer => {
        this.socket.on("MOHANLALupdatecommodity:App\\Events\\MOHANLALCommodityUpdates", function(data){
          console.log(data.updatedata);
         observer.next(data.updatedata);
       });
     })
     return observable;
  } */

  public getcommodityupdatescallback() {
    let observable = new Observable(observer => {
      this.socket.on("mohanlalupdatecommodity:App\\Events\\MOHANLALCommodityUpdates",function(data){
      observer.next(data.updatedata);
         console.log(data.updatedata);
    });
  })
  return observable;
  }
  public getrpanelrateupdatescallback(){
    let observable = new Observable(observer => {
      this.socket.on("mohanlalupdaterpanel:App\\Events\\MOHANLALRpanelUpdates", function(data){
         observer.next(data.updatedata);
         console.log(data.updatedata);
       });
     })
     return observable;
  }
  public getmarqueeupdatescallback(){
    let observable = new Observable(observer => {
        this.socket.on("mohanlalupdatemarquee:App\\Events\\MOHANLALMarqueeUpdates", function(data){
         observer.next(data.updatedata.mrq_text);
       });
     })
     return observable;
  }
  public getnewsupdatescallback(){
    let observable = new Observable(observer => {
        this.socket.on("mohanlalupdatenews:App\\Events\\MOHANLALNewsUpdates", function(data){
         observer.next(data.updatedata);
       });
     })
     return observable;
  }
  getCurrentRates(): any {
		return this.http
		 .get(
		  baserateapiurl
		 )
		 .map(res => {
		let result = res.json();
		console.log(result)
		return result;
		 })
		 .catch(err => {
		// Do messaging and error handling here
		return Observable.throw(err);
		 });
  }
   public getcommodities(){
     return this.http.get( BaseURL + 'index.php/C_booking/getcommodities').map( res => res.json() );
   }

   public getmarqueetext(){
     return this.http.get( BaseURL + 'index.php/C_booking/getmarqueetext').map( res => res.json() );
   }
   public getmjdmarates() {
    return this.http.get( BaseURL + 'api/getmjdmarates.php?version=1').map( res => res.json() );
   }

   public getcjarates() {
     return this.http.get( BaseURL + 'api/getcjarates.php?version=1').map( res => res.json() );
   }
  public refreshData() {
    //console.log(bcurl);
    let data = JSON.stringify({
      client: bcclient,
      username: bcusername,
      password: bcpassword,
    });
    // headers.append("Access-Control-Allow-Origin", "*");
    //headers.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
    //headers.append("Accept", "application/json");
    let headers = new Headers();
    headers.append("content-type", "application/json");
    let options = new RequestOptions({ headers: headers });
    this.http
    .post(bcurl,
      JSON.stringify({
        client: bcclient,
        username: bcusername,
        password: bcpassword,
      }),
      options
    )
    .map((response) => {
      let result = response;
      this.rfcallback(result['_body']);
      return result;
    })
    .toPromise();
  }
  getrfcallback(fn) {
    this.rfcallback = fn;
  }
   public getsettingData(): any {
    console.log(1);
    var my_Date = new Date();
    return this.http
      .get(BaseURL + "api/getsettings.php" + "?nocache=" + my_Date.getUTCSeconds())
      .map((response) => {
        let result = response.json();

        bcurl = result.bcurl;
        bcclient = result.bcclient;
        bcusername = result.bcusername;
        bcpassword = result.bcpassword;

        this.refreshData();
        setInterval(() => {
          this.refreshData();
        }, 800);

        this.socket = new Socket(this.config);
      }).toPromise();
  }
}
export const BaseURL = 'https://www.mohanlaljewellers.in/';
//export const BaseURL = 'http://52.66.59.239/';
