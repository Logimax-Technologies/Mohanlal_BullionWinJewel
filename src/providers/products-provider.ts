import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductsProvider {

  constructor(public http: Http) {}


    filterProducts(products){
        return this.http.get('assets/data/products.json')
        .map(x => x.json().filter(c => (products.filter(id => id == c.id).length > 0)))
    }

    getCategory(category) {
        return this.http.get('assets/data//products.json')
        .map(x => x.json().filter(c => c.category == category))
    }

}
