import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonProvider, BaseAPIURL } from '../providers/common';

@Injectable()
export class CategoryProvider {
    categories = [
        { name: 'fashion', image: 'assets/img/earings.jpg' },
        { name: 'groceries', image: 'assets/img/necklace.jpg' },
        { name: 'gifts', image: 'assets/img/bangles.jpg' },
        { name: 'kids', image: 'assets/img/pendant.jpg' },
        { name: 'home', image: 'assets/img/coins.jpg' },
        { name: 'sports', image: 'assets/img/rings.jpg' }
    ];

    getCategories() {
        return this.categories;
    }
    constructor( private http: Http, private commonService: CommonProvider ) { }
    getCategoryData(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );

        //let options = new RequestOptions({ headers: this.commonService.getHeader() });
        if(currentUser != null){
            return this.http
            .get( BaseAPIURL + 'Master_api/readactive_category?id_customer='+currentUser.userid, this.commonService.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result.responseData;
            } )
            .toPromise();
        }
        if(currentUser == null){
            return this.http
            .get( BaseAPIURL + 'Master_api/readactive_category?id_customer='+'', this.commonService.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result.responseData;
            } )
            .toPromise();
        }
    }
    getSubCategoryData( catid ): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );

        //let options = new RequestOptions({ headers: this.commonService.getHeader() });
        if(currentUser != null){
            return this.http
                .get( BaseAPIURL + 'Master_api/readall_subcategorybycatid?id_category=' + catid +'&id_customer=' + currentUser.userid, this.commonService.getHeader() )
                .map(( response ) => {
                    // some response manipulation
                    let result = response.json();
                    return result.responseData;
                } )
                .toPromise();
        }
        if(currentUser == null){
            return this.http
                .get( BaseAPIURL + 'Master_api/readall_subcategorybycatid?id_category=' + catid +'&id_customer=' + '', this.commonService.getHeader() )
                .map(( response ) => {
                    // some response manipulation
                    let result = response.json();
                    return result.responseData;
                } )
                .toPromise();
            }
    }
    readall(): any {
        //let options = new RequestOptions({ headers: this.commonService.getHeader() });
        return this.http
            .get( BaseAPIURL + 'Master_api/readall_design', this.commonService.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result.responseData;
            } )
            .toPromise();
    }
    getProductData(product): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        // var product=JSON.parse(localStorage.getItem( 'product'));
        // if(product==null){
        //     product=1;
        // }
        console.log("product:"+product);
        // console.log("current:"+currentUser.show_type);
        //let options = new RequestOptions({ headers: this.commonService.getHeader() });

        if ( this.commonService.getcollectionpagedetails().subcatid == null ) {
            return this.http
                .get( BaseAPIURL + 'Master_api/readall_appproduct?id_customer='+currentUser.userid+'&show_type=' + currentUser.show_type+'&product_id='+product, this.commonService.getHeader() )
                /* console.log() */
                .map(( response ) => {
                    // some response manipulation
                    let result = response.json();
                    return result.responseData;
                } )
                .toPromise();
        } else {
            if(currentUser != null){
            return this.http
                .get( BaseAPIURL + 'Master_api/readall_product_forsubcategory?subcatid=' + this.commonService.getcollectionpagedetails().subcatid+'&show_type=' + currentUser.show_type+'&id_customer='+currentUser.userid,this.commonService.getHeader() )
                .map(( response ) => {
                    // some response manipulation
                    let result = response.json();
                    return result.responseData;
                } )
                .toPromise();
            }
            else{
                return this.http
                    .get( BaseAPIURL + 'Master_api/readall_product_forsubcategory?subcatid=' + this.commonService.getcollectionpagedetails().subcatid+'&show_type=' + null+'&id_customer='+null,this.commonService.getHeader() )
                    .map(( response ) => {
                        // some response manipulation
                        let result = response.json();
                        return result.responseData;
                    } )
                    .toPromise();
                }
        }
    }
    getProductFilterData(filterquery): any {
        return this.http
        .post( BaseAPIURL + 'Customer_api/ProductFilterData', filterquery, this.commonService.getHeader() )
        .map(( response ) => {
            let result = response.json();
            return result.responseData;
        } )
        .toPromise();
    }
    getProductById( id ): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );

        if(currentUser !=null){
        return this.http
            .get( BaseAPIURL + 'Master_api/read_appproduct?id_product=' + id +'&id_customer='+currentUser.userid, this.commonService.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result;
            } )
            .toPromise();}

        if(currentUser ==null){
            return this.http
                .get( BaseAPIURL + 'Master_api/read_appproduct?id_product=' + id +'&id_customer='+'', this.commonService.getHeader() )
                .map(( response ) => {
                    // some response manipulation
                    let result = response.json();
                    return result;
                } )
                .toPromise();}
    }
    getPurities():any{
        return this.http
        .get( BaseAPIURL + 'Master_api/readactive_purity', this.commonService.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result;
        } )
        .toPromise();
    }
    getNewArrivalsData(id):any{
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );

        if(currentUser !=null){
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
        .get( BaseAPIURL + 'Customer_api/read_all_newarrival?show_type=' + currentUser.show_type+'&id_customer='+currentUser.userid+'&last_id='+id, this.commonService.getHeader() )
        .map(( response ) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
        } )
        .toPromise();
    }
    if(currentUser ==null){
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
        .get( BaseAPIURL + 'Customer_api/read_all_newarrival?show_type=' + '1'+'&id_customer='+''+'&last_id='+id, this.commonService.getHeader() )
        .map(( response ) => {
        // some response manipulation
        let result = response.json();
        return result.responseData;
        } )
        .toPromise();
    }
        }
	getOpenProductData():any{
		 var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
        .get( BaseAPIURL + 'Customer_api/read_all_open_design', this.commonService.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result.responseData;
        } )
        .toPromise();
    }
    getDashboardData(): any {
        var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
        return this.http
            .get( BaseAPIURL + 'Customer_api/branch_dashboarddetails?userid=' + currentUser.userid, this.commonService.getHeader() )
            .map(( response ) => {
                // some response manipulation
                let result = response.json();
                return result.responseData;
            } )
            .toPromise();
    }
	getCusSpecificProducts(): any {
		var currentUser = JSON.parse( localStorage.getItem( 'newuser' ) );
		return this.http
		.get( BaseAPIURL + 'Master_api/readCusSpecificProd?id_customer='+currentUser.userid+'&show_type=' + currentUser.show_type, this.commonService.getHeader() )
		.map(( response ) => {
			let result = response.json();
			return result.responseData;
		} )
		.toPromise();
	}
  searchprod(data): any {
    return this.http
        .get( BaseAPIURL + 'Master_api/autocompletedesign?search='+ data, this.commonService.getHeader() )
        .map(( response ) => {
            // some response manipulation
            let result = response.json();
            return result.responseData;
        } )
        .toPromise();
}

}
