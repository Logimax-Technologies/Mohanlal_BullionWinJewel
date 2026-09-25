import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { encode } from 'punycode';
import 'rxjs/add/operator/map';


/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CommonProvider {

  private _header: Headers;
  private _imageheader: Headers;
  private _username: string = 'lmxretail';
  private _password: string = 'lmx@2017';
  public UserName: string;
  public UserId: number;
  public DisplayName: string;
  public Loggedin: boolean = false;
  private collectionpagetype: string;
  private collectionpagesubcatid: string;
  constructor(public http: Http) {
    this._header = new Headers();
    this._header.append('Content-Type', 'application/json;charset=UTF-8');
    this._header.append('Authorization', 'Basic ' + btoa(this._username + ':' + this._password));

    this._imageheader = new Headers();
    this._imageheader.append('Authorization', 'Basic ' + btoa(this._username + ':' + this._password));
  }
  public updateLogin(username: string, userid: number, displayname: string, loggedin: boolean) {
    this.UserName = username;
    this.UserId = userid;
    this.DisplayName = displayname;
    this.Loggedin = loggedin;
    var curuserdet = JSON.parse(localStorage.getItem('appcurrentUser'));
    curuserdet.is_logged_in = false;
    localStorage.setItem('appcurrentUser', JSON.stringify(curuserdet));
    console.log(curuserdet)

  }
  getResults(keyword: string) {
    console.log(122222)
    return this.http.get("https://restcountries.eu/rest/v1/name/" + keyword)
      .map(
        result => {
          return result.json()
            .filter(item => item.name.toLowerCase().startsWith(keyword.toLowerCase()))
        });
  }
  public getDisplayName() {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    /*this.commonService.updateLogin(result.responsedata.username, result.
            responsedata.userid, result.responsedata.userdisplayname, true);*/
    return currentUser.userdisplayname;
  }
  public getAuthUserName() {
    return this._username;
  }
  public getAuthUserPwd() {
    return this._password;
  }
  public getAppUserId() {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    return currentUser.userid;
  }
  public getBranchDetails() {
    var currentUser = JSON.parse(localStorage.getItem('newuser'));
    return { 'id_branch': currentUser.id_branch, 'id_state': currentUser.id_state, 'id_city': currentUser.id_city, 'id_country': currentUser.id_country };
  }
  public getBranchName() {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    return currentUser.branchname;
  }
  public getHeader() {
    let options = new RequestOptions({ headers: this._header });
    return options;
  }
  public getImageHeader() {
    let options = new RequestOptions({ headers: this._imageheader });
    return options;
  }
  public getTotalCartItems() {
    if (localStorage.getItem('appcartitems') != null && localStorage.getItem('appcartitems') != undefined) {
      let curr_cartproducts = JSON.parse(localStorage.getItem('appcartitems'));
      return curr_cartproducts.length;
    } else {
      return 0;
    }
  }

  public getTotalWishlist() {
    if (localStorage.getItem('wjappwishlist') != null && localStorage.getItem('wjappwishlist') != undefined) {
      let curr_cartproducts = JSON.parse(localStorage.getItem('wjappwishlist'));
      return curr_cartproducts.length;
    } else {
      return 0;
    }
  }
  public getUserDetails() {
    if (localStorage.getItem('newuser') != null) {
      return JSON.parse(localStorage.getItem('newuser'));
    }
  }
  public doLogin(logindata) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/login_user', logindata, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public doConfirmOrder(orderdetails) {
    orderdetails['is_admin_through'] == 0;
    return this.http
      .post(BaseAPIURL + 'Customer_api/create_customer_order', orderdetails, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        console.log("result" + JSON.stringify(result));
        return result;
      })
      .toPromise();
  }
  public getIsloggedIn() {
    if (localStorage.getItem('appcurrentUser') != '' && localStorage.getItem('appcurrentUser') != null && localStorage.getItem('appcurrentUser') != undefined) {
      console.log(localStorage.getItem('appcurrentUser'));
      console.log(this.Loggedin)
      let userdet = JSON.parse(localStorage.getItem('appcurrentUser'));
      if (userdet == null) {
        return false;
      }
      return userdet.is_logged_in;
    } else {
      return false;
    }
  }
  public updatecollectionpageaction(type, subcatid) {
    this.collectionpagetype = type;
    this.collectionpagesubcatid = subcatid;
  }
  public getcollectionpagedetails() {
    return { 'pagetype': this.collectionpagetype, 'subcatid': this.collectionpagesubcatid };
  }
  public getUserCartDetails() {
    if (localStorage.getItem('appcartitems') != null) {
      return JSON.parse(localStorage.getItem('appcartitems'));
    } else {
      return [];
    }
  }
  public getOrders() {
    var currentUser = JSON.parse(localStorage.getItem('newuser'));
    return this.http
      .post(BaseAPIURL + 'Customer_api/branch_all_orders', { 'userid': currentUser.userid }, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public feedback(feed, des, order) {
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    return this.http
      .post(BaseAPIURL + 'Customer_api/customer_feedback', { 'cusdetails': { 'customer_id': currentUser.userid, 'feedback': feed, 'description': des }, 'orders': order }, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public getDashListData(listtype) {
    var currentUser = JSON.parse(localStorage.getItem('newuser'));
    return this.http
      .post(BaseAPIURL + 'Customer_api/read_dashListData', { 'userid': currentUser.userid, 'listtype': listtype }, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  getDashboardData(): any {
    var currentUser = JSON.parse(localStorage.getItem('newuser'));
    return this.http
      .get(BaseAPIURL + 'Customer_api/branch_dashboarddetails?userid=' + currentUser.userid, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  public doUpdateDeviceIds(deviceinfo) {
    return this.http
      .post(BaseAPIURL + 'Vendor_api/update_deviceinfo', deviceinfo, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public getFilterOptions() {
    /*return this.http.get( 'assets/data/filters.json' )
        .map( x => x.json() )*/
    var currentUser = JSON.parse(localStorage.getItem('appcurrentUser'));
    var id: any;
    if (currentUser != null) {

      id = currentUser.id_branch;
    }
    else {
      id = null;
    }
    return this.http
      .get(BaseAPIURL + 'Customer_api/collection_filterdata?branchid=' + id, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
  }
  getCountryData(): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Master_api/readall_country', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  getActiveDealerData(): any {
    return this.http
      .get(BaseAPIURL + 'Master_api/readactive_dealers', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  getStatebyCountryData(id): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Master_api/readall_state?id_country=' + id, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  getCitybyStateData(id): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Master_api/readall_city?id_state=' + id, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }

  getVillage(): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Master_api/getVillage', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  getCusAppVersion(): any {
    return this.http
      .get(BaseAPIURL + 'Customer_api/getCusAppVersion', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  public doRegister(registerdata) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/create_appuser', registerdata, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }


  public doOTPVerify(params) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/verifyuserregotp', params, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }


  public resendOTP(params) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/resendotp', params, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }

  public userRegisterOtp(params) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/userregistration_otp', params, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }

  getbanner(): any {
    return this.http
      .get(BaseAPIURL + 'Customer_api/banners_detalis', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }
  public checkForgotpassword(forgotpassworddata) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/check_user_details', forgotpassworddata, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public resetpassword(passworddata) {
    return this.http
      .post(BaseAPIURL + 'Customer_api/reset_user_password', passworddata, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  public check(passworddata) {
    console.log(passworddata)
    return this.http
      .post(BaseAPIURL + 'customer_api/user_logged_details', passworddata, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  gethome(id, lastID): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Master_api/category_based_product_images?id_collection=' + id + '&last_id=' + lastID, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
      })
      .toPromise();
  }

  public customImage(data) {
    console.log(data)
    return this.http
      .post(BaseAPIURL + 'master_api/custom_orderimgupload', data, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
  getCountrycode(): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + 'Customer_api/getCountrcode', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.resposeData;
      })
      .toPromise();
  }

  getCollections(): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + "Master_api/quicksell_collection/", this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }

  getProducts(id, lastID): any {
    //let options = new RequestOptions({ headers: this.commonService.getHeader() });
    return this.http
      .get(BaseAPIURL + "Master_api/readall_product_forcategory?catid=" + id + '&last_id=' + lastID, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }

  readall_Branch(): any {
    return this.http
      .get(BaseAPIURL + 'Adminaccount_api/readall_branch', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result.resposeData;
      })
      .toPromise();
  }

  // public resons() {
  //   return this.http
  //     .post(BaseAPIURL + 'Master_api/customer_reject_reason_type', this.getHeader())
  //     .map((response) => {
  //       // some response manipulation
  //       let result = response.json();
  //       return result;
  //     })
  //     .toPromise();
  // }

    resons(): any {
    return this.http
      .get(BaseAPIURL + 'Master_api/customer_reject_reason_type', this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
    public cancelOrder(data) {
    return this.http
      .post(BaseAPIURL + '/customer_api/customer_reject_order_app',data, this.getHeader())
      .map((response) => {
        // some response manipulation
        let result = response.json();
        return result;
      })
      .toPromise();
  }
}


export const BaseAPIURL = 'https://winjewel.mohanlaljewellers.in/winjewel/winjewel_api/index.php/';
export const BaseURL = 'https://winjewel.mohanlaljewellers.in/winjewel/';


