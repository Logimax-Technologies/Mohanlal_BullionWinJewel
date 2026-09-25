import { Component } from '@angular/core';

import { CarouselProvider } from '../../providers/carousel-provider';
import { CommonProvider } from '../../providers/common';

export interface Slide {
  image: string;
}

@Component({
  selector: 'carousel',
  templateUrl: 'carousel.html',
  providers: [CarouselProvider]
})
export class CarouselComponent {
  slides: any[];
  text: string;
  animateClass = { 'zoom-in': true };
  
  constructor(private CarouselProvider: CarouselProvider,public comman:CommonProvider) {

   /* take images from carousel provider*/
      this.slides = CarouselProvider.getSlides();
    //     this.comman.getbanner().then(data=>{

    //   this.slides = data
    //   console.log(this.slides)
    //   // return data;

    // })
  
  }

}
