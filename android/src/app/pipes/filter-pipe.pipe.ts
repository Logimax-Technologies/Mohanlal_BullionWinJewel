import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class FilterPipe implements PipeTransform {
   /*  transform(filter_options: any[], filterargs: Object): any {
        if (!filter_options || !filterargs) {
            return filter_options;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return filter_options.filter(item => item.id_filter == 1);
		//return filter_options;
    } */
	
	transform(filter_options: any[], filterargs: {[field: string]: any}): any[] {
        return filter_options.filter(item => {
            for (let field in filterargs) {
                if (item[field] !== filterargs[field]) {
                    return false;
                }
            }
            return true;
        });
    }
}

