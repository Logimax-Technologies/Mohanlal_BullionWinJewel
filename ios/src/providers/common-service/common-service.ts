import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CommonServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CommonServiceProvider Provider');
  }
  public settingsData(params): any {
        return this.http
            .post( BaseURL + 'index.php/C_mobile/viewsettingsdata', params )
            .map(( response ) => {
                // some response manipulation
                let result = response;
                console.log(result);
                return result;
            } )
            .toPromise();
    }
    public checksettingsData(params): any {
        return this.http
            .post( BaseURL + 'index.php/C_mobile/checksettingsdata', params )
            .map(( response ) => {
                // some response manipulation
                let result = response;
                return result;
            } )
            .toPromise();
    }
    public doRegister(params): any{
      return this.http
          .post( BaseAPIURL + '/registeruserdata', params )
          .map(( response ) => {
              // some response manipulation
              let result = response;
              console.log(result);
              return result;
          } )
          .toPromise();
    }
    public doOTPVerify(params):any{
      return this.http
          .post( BaseAPIURL + '/verifyuserregotp', params )
          .map(( response ) => {
              // some response manipulation
              let result = response;
              console.log(result);
              return result;
          } )
          .toPromise();
    }
    public resendOTP(params):any{
      return this.http
          .post( BaseAPIURL + 'index.php/C_mobile/resendotp', params )
          .map(( response ) => {
              // some response manipulation
              let result = response;
              console.log(result);
              return result;
          } )
          .toPromise();
    }
    public sendEnquiry(params):any{
      return this.http
          .post( BaseURL + 'index.php/C_mobile/enquiry_mail', params )
          .map(( response ) => {
              let result = response;
              console.log(result);
              return result;
          })
          .toPromise();
  }
    public getphonenumbers(){
		return this.http.get( BaseURL + 'api/phonenumberdetails.php').map( res => res );
    }
    public getcontactusdetails(){
		return this.http.get( BaseURL + 'api/contactusdetails.php').map( res => res );
    }
    public getaboutusdetails(){
        return this.http.get( BaseURL + 'api/aboutusdetails.php').map( res => res );
    }
    public getbankdetails(){
      return this.http.get( BaseURL + 'api/bankdetails.php').map(res => res);
    }
    public getlbmarates() {
      return this.http.get( BaseURL + 'api/lbma_rates.php').map( res => res );
    }
    public getTerms(){
      return this.http.get( BaseURL + 'api/terms.php').map( res => res );
  }
}
//export const BaseURL = 'http://52.66.59.239/';
export const BaseURL = 'https://www.mohanlaljewellers.in/';
export const BaseAPIURL =  'https://winjewel.mohanlaljewellers.in/winjewel/winjewel_api/index.php/';
