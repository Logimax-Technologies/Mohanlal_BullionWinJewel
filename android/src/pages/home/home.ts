import { Component, NgZone,ApplicationRef } from '@angular/core';
import { NavController, AlertController,Events, LoadingController,MenuController } from 'ionic-angular';
import { LiveratesProvider } from '../../providers/liverates/liverates';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { CommonServiceProvider } from '../../providers/common-service/common-service';
/* import { SocialSharing } from '@ionic-native/social-sharing'; */
export interface IBidAskRate {
	desc: string;
	bid: string;
	ask: string;
	high: string;
	low: string;
	ltp: string;
}
export interface IBidAskRates {
	rates: Array<IBidAskRate>;
}
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	private onResumeSubscription: Subscription;
	baserates: { [id: string]: any; } = [];
	oldbaserates: { [id: string]: any; } = [];
	rates: Array<IBidAskRate> = [];
	current_rates: any = [];
	old_current_rates: any = [];
	base_rates: any = [];
	old_base_rates: any = [];
	public isShown: boolean = true;
	bidaskrates: any = {};
	oldbidaskrates: any = {};
	olddisplaycontracts: any = [];
	displaycontracts: any = [];
	liverates: any = [];
	oldliverates: any = [];
	commodities: any = [];
	rpaneldifferences: any = [];
	rpanelsettings: any = {};
	rpaneldata: any = [];
	rpanelbankrates: any = [];
	rpanelcontract: any = [];
	rpanelcommodities: any = [];
	sliders: any = [];
	marqueetext: any = "";
	booknos: any = "";
	marketclosedmsg: any = "";
	marketstatus: number = 1;
	loader:any=true;
	lbmarates:any={};
	trade_enable: any = 0;
	mjdmarates:any ={ 'goldrate_22ct' : '-', 'goldrate_24ct' : '', 'silverrate_1gm' : '-', 'silverrate_1kg' : '', 'updatetime' : '', 'display' : 0 };
	touchtocalldetails: any = [];
	touchtowhatsappdetails: any = [];
	overlayHidden: boolean = false;
	oldData: any;

	constructor(private menu: MenuController,public navCtrl: NavController, private network: Network, private event: Events,private commonservice: CommonServiceProvider, public liverateservice: LiveratesProvider, private zone: NgZone, platform: Platform, public alertCtrl: AlertController, private loadingCtrl: LoadingController, private applicationRef: ApplicationRef) {
		this.onResumeSubscription = platform.resume.subscribe(() => {
			// do something meaningful when the app is put in the foreground
			liverateservice.getcommodities().subscribe(res => {
				this.rpanelbankrates = res.rpanelbank;
				this.rpaneldata = res.rpaneldata;
				this.rpanelsettings = res.rpanelsettings;
				this.rpanelcontract = res.rpanel_contracts;
				this.rpanelcommodities = res.rpanel_commodities;
				this.commodities = res.commoditydetails;
			});
		});
		platform.pause.subscribe(() => {
			liverateservice.getcommodities().subscribe(res => {
				this.rpanelbankrates = res.rpanelbank;
				this.rpaneldata = res.rpaneldata;
				this.rpanelsettings = res.rpanelsettings;
				this.rpanelcontract = res.rpanel_contracts;
				this.rpanelcommodities = res.rpanel_commodities;
				this.commodities = res.commoditydetails;
			});
		});
		this.network.onConnect().subscribe(data => {
			liverateservice.getcommodities().subscribe(res => {
				this.rpanelbankrates = res.rpanelbank;
				this.rpaneldata = res.rpaneldata;
				this.rpanelsettings = res.rpanelsettings;
				this.rpanelcontract = res.rpanel_contracts;
				this.rpanelcommodities = res.rpanel_commodities;
				this.commodities = res.commoditydetails;
			});
		}, error => console.error(error));
	}
	public hideOverlay() {
		this.overlayHidden = true;
	let scripttagElement = document.createElement('script');
    scripttagElement.src = "http://calendar.fxstreet.com/scripts/mini";
    document.body.appendChild(scripttagElement);
	}
	ionViewDidLoad() {
		this.baserateInit();
		// console.log('ttttttttttttttttttttt');
		this.overlayHidden = true;
		let scripttagElement = document.createElement('script');
		scripttagElement.src = "http://calendar.fxstreet.com/scripts/mini";
		document.body.appendChild(scripttagElement);
		/* this.liverateservice.getcommodities().subscribe( res => {
			console.log(res);
		  this.rpanelbankrates = res.rpanelbank;
		  this.rpaneldata = res.rpaneldata;
		  this.rpanelsettings = res.rpanelsettings;
		  this.rpanelcontract = res.rpanel_contracts;
		  this.rpanelcommodities = res.rpanel_commodities;
		  this.commodities = res.commoditydetails;
		} ); */
		/* 	 this.commonservice.sliderimgs().then((data)=>{
				console.log("Slider:"+JSON.stringify(data));
				this.sliders = data;
				console.log("Slider:"+JSON.stringify(this.sliders));
			}); */
		this.commonservice.getphonenumbers().subscribe(res => {
			this.touchtocalldetails = res['phone'];
			this.touchtowhatsappdetails = res['whatsapp'];
		});
		this.liverateservice.getmarqueetext().subscribe(res => {
			this.marqueetext = res.marquee;
			this.booknos = res.booknos;
		});
		this.liverateservice.getcommodityupdatescallback().subscribe(data => {
			this.zone.run(() => {
				if (data != null) {
					this.commodities = data['commodity'];
					// console.log(this.commodities); //when update happened socket will update this in next time
					this.rpanelcontract = data['rpanel_contracts'];
				}
			});
			this.baserateInit();
		});
/* 		   this.liverateservice.getmjdmarates().subscribe( res => {
				this.mjdmarates = res;
				console.log(this.mjdmarates);
			});  */
			this.commonservice.getlbmarates().subscribe(res => {
				this.lbmarates = res['lbmarates'];
			});
		this.liverateservice.getrpanelrateupdatescallback().subscribe(data => {
			this.zone.run(() => {
				if (data != null) {
					this.rpanelbankrates = data['rpanelbank'];
					this.rpaneldata = data['rpaneldata'];
					this.rpanelcommodities = data['rpanel_commodities'];
				}
			});
			this.baserateInit();
		});
		this.liverateservice.getmarqueeupdatescallback().subscribe(data => {
			this.zone.run(() => {
				if (data != null) {
					this.marqueetext = data;
				}
			});
		});
		// this.liverateservice.getcommodities().then( res => {
		//   this.commodities = res;
		//   console.log(this.commodities);
		// });
	}

	ionViewWillEnter() {
		this.overlayHidden = true;
	let scripttagElement = document.createElement('script');
    scripttagElement.src = "http://calendar.fxstreet.com/scripts/mini";
    document.body.appendChild(scripttagElement);
// console.log('qqqqqqqqqqqqqqqqqq');
		this.event.publish('pageno', 1);
	   }
	baserateInit() {
		this.liverateservice.getrfcallback((data) => {
		  let messagesDesktopp = data.split("\n");
		//   console.log(messagesDesktopp)
		  let tmp_bidaskrates: any = [];
		  let curr_bidaskrates: any = [];
		//   console.log(this.oldData)
		  if (typeof this.oldData != "undefined") {
			// this.oldData = data.toString();
		  } else {
			// console.log('dsfsdf')
			this.oldData = data.toString();
		  }
		   var messagesOldDesktop = this.oldData.split("\n");
		  for (var i = 0; i < messagesDesktopp.length; i++) {
			var retDesktop = messagesDesktopp[i].split("\t");
			//console.log(retDesktop)
			var oldRetDesktop;
			oldRetDesktop = messagesOldDesktop[i].split("\t");
			if (typeof retDesktop[1] != "undefined") {
			  if (retDesktop[0] == 2) {
				let bid_class = "ratenormal";
				let ask_class = "ratenormal";
				if (retDesktop[3] > oldRetDesktop[3]) {
				  bid_class = "ratehigh";
				} else if (retDesktop[3] < oldRetDesktop[3]) {
				  bid_class = "ratelow";
				}
				if (retDesktop[4] > oldRetDesktop[4]) {
				  ask_class = "ratehigh";
				} else if (retDesktop[4] < oldRetDesktop[4]) {
				  ask_class = "ratelow";
				}
				tmp_bidaskrates.push({
				  symbol: retDesktop[2],
				  bid: retDesktop[3],
				  ask: retDesktop[4],
				  high: retDesktop[5],
				  low: retDesktop[6],
				  askclass: ask_class,
				  bidclass: bid_class,
				});
			  }
			  if (typeof retDesktop[1] != "undefined") {
				if (retDesktop[0] == 1) {
				  let bid_class1 = "ratenormal";
				  let ask_class1 = "ratenormal";
				  if (retDesktop[3] > oldRetDesktop[3]) {
					bid_class1 = "ratehigh";
				  } else if (retDesktop[3] < oldRetDesktop[3]) {
					bid_class1 = "ratelow";
				  }
				  if (retDesktop[4] > oldRetDesktop[4]) {
					ask_class1 = "ratehigh";
				  } else if (retDesktop[4] < oldRetDesktop[4]) {
					ask_class1 = "ratelow";
				  }
				  curr_bidaskrates.push({
					symbol: retDesktop[2],
					bid: retDesktop[3],
					ask: retDesktop[4],
					high: retDesktop[5],
					low: retDesktop[6],
					askclass: ask_class1,
					bidclass: bid_class1,
				  });
				}
			  }
			  if (retDesktop[0] == 4) {
				if (retDesktop[3] == 0 || retDesktop[4] == 1) {
				  this.marketstatus = 0;
				  this.event.publish("marketstatus:changed", this.marketstatus);
				  if (retDesktop[4] == 1) {
					this.marketclosedmsg = retDesktop[5];
				  } else {
					this.marketclosedmsg =
					  "Please wait market will be open shortly.";
				  }
				} else {
				  this.marketstatus = 1;
				  this.event.publish("marketstatus:changed", this.marketstatus);
				}
			  }
			}
		  }
		  if (typeof this.base_rates != "undefined") {
		  } else {
			//alert("1");
			this.old_base_rates = this.base_rates;
		  }
		  this.old_base_rates = this.base_rates;
		  this.base_rates = tmp_bidaskrates;
		  if (typeof this.current_rates != "undefined") {
		  } else {
			//alert("1");
			this.old_current_rates = this.current_rates;
		  }
		  this.old_current_rates = this.current_rates;
		   this.current_rates = curr_bidaskrates;
		 //  console.log(this.current_rates)
		  //console.log( this.old_current_rates)
		  //console.log( this.current_rates)
		  this.applicationRef.tick();
		  //this.changeRef.detectChanges();
		  let currentliverates: any = [];
		  let allliverates: any = [];
		  for (var i = 0; i < messagesDesktopp.length; i++) {
			var liveretDesktop = messagesDesktopp[i].split("\t");
			var liveoldRetDesktop;
			liveoldRetDesktop = messagesOldDesktop[i].split("\t");
			if (typeof liveretDesktop[1] != "undefined") {
			  if (liveretDesktop[0] == 3) {
				this.commodities.forEach((value, key) => {
				  if (liveretDesktop[1] == value.com_id) {
					let com_id = parseInt(value.com_id);
					let com_name = value.com_name;
					let com_type = parseInt(value.com_type);
					let com_weight = parseFloat(value.com_weight);
					let com_sel_active = parseInt(value.com_sel_active);
					let com_buy_active = parseInt(value.com_buy_active);
					let deliverydays = value.deliverydays;
				   // console.log(deliverydays)
					let prem_comsell_active = parseInt(value.prem_comsell_active);
					let prem_combuy_active = parseInt(value.prem_combuy_active);
					let displyname = value.displyname;
					let com_roundoff = parseInt(value.com_roundoff);
					let com_selretail_active = value.com_selretail_active;
					let com_selretail_premium = parseInt(
					  value.com_selretail_premium
					);
					let rtgs_rate: any = 0;
					let selling_rate: any = 0;
					let buying_rate: any = 0;
					let retail_rate: any = 0;
					let buy_status = "0";
					let sell_status = "0";
					let retail_status = "0";
					/* let user_buy_active: any = "0";
					let user_sell_active: any = "0";
					let user_sellretail_active: any = "0"; */
					let prem_buy_premium = parseInt(value.prem_buy_premium);
					let prem_sel_premium = parseInt(value.prem_sel_premium);
					let prem_selretail_premium = parseInt(
					  value.prem_selretail_premium
					);
					selling_rate = liveretDesktop[4];
					buying_rate = liveretDesktop[3];
					let currentsell = "ratenormal1";
					let currentbuy = "ratenormal1";
					if (liveretDesktop[3] > liveoldRetDesktop[3]) {
					  currentbuy = "ratehigh1";
					} else if (liveretDesktop[3] < liveoldRetDesktop[3]) {
					  currentbuy = "ratelow1";
					}
					if (liveretDesktop[4] > liveoldRetDesktop[4]) {
					  currentsell = "ratehigh1";
					} else if (liveretDesktop[4] < liveoldRetDesktop[4]) {
					  currentsell = "ratelow1";
					}
					/* console.log(
					  liveoldRetDesktop[4] +
						" : " +
						selling_rate +
						" : " +
						currentsell
					); */

					if (localStorage.getItem("MOHANLAL_userlogged") == "1") {
					  let commodity_array = JSON.parse(
						localStorage.getItem("MOHANLAL_user_commodityData")
					  );
					  //console.log(commodity_array)
					  var buy_active: any = 0;
					  var sell_active: any = 0;
					  var sellretail_active: any = 0;
					  if (commodity_array.length > 0) {
						commodity_array.forEach((value1, key1) => {
						  buy_active = value1.buy_active;
						  sell_active = value1.sell_active;
						  sellretail_active = value1.sellretail_active;
						  prem_buy_premium = value1.prem_buy_premium;
						  prem_selretail_premium = value1.prem_selretail_premium;
						  prem_sel_premium = value1.prem_sel_premium;
						  //console.log(prem_sel_premium)
						  if (value1.comid == com_id) {
							if (
							  value1.com_buy_trade == 1 &&
							  value1.cus_com_status_buy == 1
							) {
							  buy_status = "1";
							}
							if (
							  value1.com_sel_trade == 1 &&
							  value1.cus_com_status_sell == 1
							) {
							  sell_status = "1";
							}
							if (
							  value1.com_retail_trade == 1 &&
							  value1.cus_com_status_sell == 1
							) {
							  retail_status = "1";
							}
							/* if (value1.buy_active == 1) {
							  user_buy_active = 1;
							}
							if (value1.sell_active == 1) {
							  user_sell_active = 1;
							}
							if (value1.sellretail_active == 1) {
							  user_sellretail_active = 1;
							} */
						  }
						});
					  } else {
						buy_status = "0";
						sell_status = "0";
					  }
					} else {
						if(selling_rate!='-'){
							let selling=selling_rate.toString();
							let currentdata=[];
							var spandata:any=[];
							var sellingdata:any=[];
							for(var i=0,len=selling.length;i<len;i+=1){
								currentdata.push(+selling.charAt(i));
								spandata=`<span style='font-size:${4*currentdata.length+10}px !important;'>${currentdata[i]}</span>`;
								//console.log(`<span style='font-size:${4*currentdata[i]+14}px'>${currentdata[i]}</span>`);
								sellingdata.push(spandata);
								//console.log(sellingdata);
							}
							sellingdata=sellingdata.join("")
						  }else{
							  sellingdata=`<span style='font-size:20px !important;padding-top:10px'>-</span>`;
						  }
						  if(buying_rate!='-'){
							let buying=buying_rate.toString();
							let currentdata1=[];
							var spandata:any=[];
							var buyingdata:any=[];
							for(var i=0,len=buying.length;i<len;i+=1){
								currentdata1.push(+buying.charAt(i));
								spandata=`<span style='font-size:${4*currentdata1.length+10}px !important;'>${currentdata1[i]}</span>`;
								//console.log(`<span style='font-size:${4*currentdata[i]+14}px'>${currentdata[i]}</span>`);
								buyingdata.push(spandata);
								//console.log(buyingdata);
							}
							buyingdata=buyingdata.join("")
						  }else{
							  buyingdata=`<span style='font-size:20px !important;padding-top:10px'>-</span>`;
						  }
					}

					if (localStorage.getItem("MOHANLAL_userlogged") == "1") {
					  allliverates.push({
						deliverydays:deliverydays,
						prem_buy_premium: prem_buy_premium,
						prem_sel_premium: prem_sel_premium,
						trade_enable: this.trade_enable,
						prem_selretail_premium: prem_selretail_premium,
						buy_active: buy_active,
						sell_active: sell_active,
						sellretail_active: sellretail_active,
						com_id: com_id,
						com_name: com_name,
						buying_rate: buying_rate,
						selling_rate: selling_rate,
						delivery: deliverydays,
						com_type: com_type,
						rselling_rate: retail_rate,
						buy_status: buy_status,
						sell_status: sell_status,
						retail_status: retail_status,
						trade: 1,
						/* user_sell_active: user_sell_active,
						user_buy_active: user_buy_active, */
						prem_comsell_active: prem_comsell_active,
						prem_combuy_active: prem_combuy_active,
						currentbuy: currentbuy,
						currentsell: currentsell,
					  });
					 // if (user_sell_active == 1 || user_buy_active == 1) {
					  if (buying_rate != "-" || selling_rate != "-") {
						currentliverates.push({
							deliverydays:deliverydays,
							prem_buy_premium: prem_buy_premium,
							prem_sel_premium: prem_sel_premium,
							trade_enable: this.trade_enable,
							prem_selretail_premium: prem_selretail_premium,
							buy_active: buy_active,
							sell_active: sell_active,
							sellretail_active: sellretail_active,
							com_id: com_id,
							com_name: com_name,
							buying_rate: buying_rate,
							selling_rate: selling_rate,
							delivery: deliverydays,
							com_type: com_type,
							rselling_rate: retail_rate,
							buy_status: buy_status,
							sell_status: sell_status,
							retail_status: retail_status,
							currentbuy: currentbuy,
							currentsell: currentsell,
						});
					  }
					 // }
					  /* if (user_sell_active == 1 || user_buy_active == 1) {
						if (buying_rate != "-" || selling_rate != "-") {
						  currentliverates.push({
							deliverydays:deliverydays,
							prem_buy_premium: prem_buy_premium,
							prem_sel_premium: prem_sel_premium,
							trade_enable: this.trade_enable,
							prem_selretail_premium: prem_selretail_premium,
							buy_active: buy_active,
							sell_active: sell_active,
							sellretail_active: sellretail_active,
							com_id: com_id,
							com_name: com_name,
							buying_rate: buying_rate,
							selling_rate: selling_rate,
							delivery: deliverydays,
							com_type: com_type,
							rselling_rate: retail_rate,
							buy_status: buy_status,
							sell_status: sell_status,
							retail_status: retail_status,
							currentbuy: currentbuy,
							currentsell: currentsell,
						  });
						  //	console.log(currentliverates);
						}
					  } */
					} else {
					  allliverates.push({
						com_id: com_id,
						deliverydays:deliverydays,
						com_name: com_name,
						buying_rate: buying_rate,
						selling_rate: selling_rate,
						delivery: deliverydays,
						com_type: com_type,
						rselling_rate: retail_rate,
						buy_status: buy_status,
						sell_status: sell_status,
						retail_status: retail_status,
						trade: 0,
						/* user_sell_active: user_sell_active,
						user_buy_active: user_buy_active, */
						prem_comsell_active: prem_comsell_active,
						prem_combuy_active: prem_combuy_active,
						currentbuy: currentbuy,
						currentsell: currentsell,
					  });
					  if (prem_comsell_active == 0) {
						selling_rate = "-";
						currentsell = "ratenormal";
					  }
					  if (prem_combuy_active == 0) {
						buying_rate = "-";
						currentbuy = "ratenormal";
					  }
					  if (buying_rate != "-" || selling_rate != "-") {
						currentliverates.push({
						  com_id: com_id,
						  deliverydays:deliverydays,
						  com_name: com_name,
						  buying_rate: buying_rate,
						  selling_rate: selling_rate,
						  delivery: deliverydays,
						  com_type: com_type,
						  rselling_rate: retail_rate,
						  buy_status: buy_status,
						  sell_status: sell_status,
						  retail_status: retail_status,
						  currentbuy: currentbuy,
						  currentsell: currentsell,
						});
					  }
					}
				  }
				});
			  }
			}
		  }
		  if (typeof this.liverates != "undefined") {
		  } else {
			this.oldliverates = this.liverates;
		  }
		  this.oldliverates = Object.create(this.liverates);
		  this.liverates = currentliverates;
	// console.log(this.oldliverates)
		  this.applicationRef.tick();
		  //this.changeRef.detectChanges();
		  if (
			this.oldliverates == "" ||
			this.oldliverates == undefined ||
			this.oldliverates == null ||
			this.oldliverates.length != this.liverates.length
		  ) {
			this.oldliverates = this.liverates;
		  }
		  localStorage.setItem(
			"MOHANLAL_Liverates",
			JSON.stringify(this.liverates)
		  );
		  localStorage.setItem(
			"WLMOHANLALAllLivePrice",
			JSON.stringify(allliverates)
		  );
		  this.event.publish("liverate:changed", this.liverates);
		});
	}
	deepClone(oldArray: Object[]) {
		let newArray: any = [];
		oldArray.forEach((item) => {
			newArray.push(Object.assign({}, item));
		});
		return newArray;
	}

	ionViewDidEnter() {
		this.liverateservice.getcommodities().subscribe(res => {
			this.rpanelbankrates = res.rpanelbank;
			this.rpaneldata = res.rpaneldata;
			this.rpanelsettings = res.rpanelsettings;
			this.rpanelcontract = res.rpanel_contracts;
			this.rpanelcommodities = res.rpanel_commodities;
			this.commodities = res.commoditydetails;
			//console.log(this.commodities);
		});
		this.menu.swipeEnable(false);
		// If you have more than one side menu, use the id like below
		// this.menu.swipeEnable(false, 'menu1');
	}

	ionViewWillLeave() {
		// Don't forget to return the swipe to normal, otherwise
		// the rest of the pages won't be able to swipe to open menu
		this.menu.swipeEnable(true);
		// If you have more than one side menu, use the id like below
		// this.menu.swipeEnable(true, 'menu1');
	  }

	openCallMenu() {
		let dtitle: any;
		let calldetails = '<ion-grid>';
		this.touchtocalldetails.forEach(function (value, key) {
			dtitle = value.title;
			value.content.forEach(function (cvalue, ckey) {
				calldetails += '<div class="row"><div class="col-10"><img src="./assets/imgs/pointer.svg"/></div><div class="col-90" [innerHTML]="' + cvalue.displaytext + '  | safeHtml">' + cvalue.displaytext + '</div></div>';
			});
		});
		calldetails += '</ion-grid>';
		const alert = this.alertCtrl.create({
			title: dtitle,
			subTitle: calldetails,
			buttons: ['CLOSE']
		});
		alert.present();
	}
	openWhatsappMenu() {
		console.log("Whats app");
		let dtitle: any;
		let calldetails = '<ion-grid>';
		this.touchtowhatsappdetails.forEach(function (value, key) {
			dtitle = value.title;
			value.content.forEach(function (cvalue, ckey) {
				calldetails += '<div class="row"><div class="col-10"><img src="./assets/imgs/pointer.svg"/></div><div class="col-90" [innerHTML]="' + cvalue.displaytext + '  | safeHtml">' + cvalue.displaytext + '</div></div>';
			});
		});
		calldetails += '</ion-grid>';
		const alert = this.alertCtrl.create({
			title: dtitle,
			subTitle: calldetails,
			buttons: ['CLOSE']
		});
		alert.present();
	}
	scrollStart(event) {
		console.log(event);
		if (event.scrollTop == 0) {
			this.isShown = true;
		} else {
			this.isShown = false;
		}
	}

	// public gold_conversion(con_value, com_weight) {
	//   console.log(con_value);
	//  	return parseFloat((con_value / 10) * com_weight).toFixed(2);
	//  }
	//  public silver_conversion(con_value, com_weight) {
	//  	return parseFloat((con_value / 1000) * com_weight).toFixed(2);
	//  }
	//
	//  public manual_roundoff(round_value, round_method, type) {
	//  	let convert_value = 0;
	//  	if(type == 'ask')
	//  	{
	//  		convert_value = Math.ceil(round_value / round_method) * round_method;
	//  	} else {
	//  		convert_value = Math.floor(round_value / round_method) * round_method;
	//  	}
	//  	return parseFloat(convert_value).toFixed(2);
	//  }
	gethighlowclass(current, old) {
		//console.log("current : " + current, " Old : " + old);
		if (current > old) {
			return 'ratehigh';
		} else if (current < old) {
			return 'ratelow';
		} else {
			return 'ratenormal';
		}
	}
}
