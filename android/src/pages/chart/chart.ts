import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import * as $ from 'jquery';
//import * as TradingView from "../../assets/js/tradingview.js"

/**
 * Generated class for the ChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare const TradingView: any;

//console.log(tradingwidget);
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})

export class ChartPage {
  @Input('script') param:  any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
/*     new TradingView.widget(
      {
        "symbol": "TVC:SILVER",
        "width": 340,
        "height": 300,
        "locale": "in",
        "dateRange": "1d",
        "colorTheme": "light",
        "trendLineColor": "#37a6ef",
        "underLineColor": "#e3f2fd",
        "isTransparent": false,
        "autosize": false,
        "largeChartUrl": "",
        "container_id": "Silver"
      }
      );
      let scripttagElement1 = document.createElement('script');
      scripttagElement1.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      document.body.appendChild(scripttagElement1);

      new TradingView.widget(
        {
          "symbol": "TVC:GOLD",
          "width": 340,
          "height": 300,
          "locale": "in",
          "dateRange": "1d",
          "colorTheme": "light",
          "trendLineColor": "#37a6ef",
          "underLineColor": "#e3f2fd",
          "isTransparent": false,
          "autosize": false,
          "largeChartUrl": "",
          "container_id": "Gold"
        }
        );
        let scripttagElement = document.createElement('script');
        scripttagElement.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        document.body.appendChild(scripttagElement);

        new TradingView.widget(
          {
            "symbol": "OANDA:USDINR",
            "width": 340,
            "height": 300,
            "locale": "in",
            "dateRange": "1d",
            "colorTheme": "light",
            "trendLineColor": "#37a6ef",
            "underLineColor": "#e3f2fd",
            "isTransparent": false,
            "autosize": false,
            "largeChartUrl": "",
            "container_id": "Usdinr"
          }
          );
          let scripttagElement2 = document.createElement('script');
          scripttagElement2.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
          document.body.appendChild(scripttagElement2); */
  }

}
