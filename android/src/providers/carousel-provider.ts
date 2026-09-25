import { Injectable } from '@angular/core';

@Injectable()
export class CarouselProvider {
    slides = [
        // { image: 'assets/img/slides/slide6.jpg' },
        { image: 'assets/img/slides/one.jpg' },
        { image: 'assets/img/slides/two.jpg' },
        { image: 'assets/img/slides/three.jpg' },
        // { image: 'assets/img/slides/four.jpg' },

        // { image: 'assets/img/slides/slide5.jpg' },
    ];

    getSlides() {
        return this.slides;
    }

}
