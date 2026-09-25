import { Content } from 'ionic-angular';
import { Directive, ElementRef, Input, Renderer, SimpleChanges } from '@angular/core';
import { retryWhen } from 'rxjs/operator/retryWhen';


@Directive({
    selector: '[scrollHide]'
})
export class ScrollHideDirective {

    @Input('scrollHide') config: ScrollHideConfig;
    @Input('scrollContent') scrollContent: Content;

    contentHeight: number;
    scrollHeight: number;
    lastScrollPosition: number=0;
    lastValue: number =0;
    scrollTop: number = 0;

    constructor(private element: ElementRef, private renderer: Renderer) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.scrollContent && this.config) {
            this.scrollContent.ionScrollStart.subscribe((ev) => {
                this.contentHeight = this.scrollContent.getScrollElement().offsetHeight;
                this.scrollHeight = this.scrollContent.getScrollElement().scrollHeight;
                if (this.config.maxValue === undefined) {
                    this.config.maxValue = this.element.nativeElement.offsetHeight;
                }
                this.lastScrollPosition = ev.scrollTop;
            });
            this.scrollContent.ionScroll.subscribe((ev) => this.adjustElementOnScroll(ev));
            this.scrollContent.ionScrollEnd.subscribe((ev) => this.adjustElementOnScroll(ev));
        }
    }

    private adjustElementOnScroll(ev) {
        if (ev) {
            ev.domWrite(() => {
                let scrollTop: number = ev.scrollTop >350?ev.scrollTop:0;
                console.log("scrollTop:"+scrollTop);
                let scrolldiff: number = scrollTop - this.lastScrollPosition ;
                this.lastScrollPosition = scrollTop;
                console.log("lastScroll:"+this.lastScrollPosition)
                let newValue = this.lastValue + scrolldiff;
                newValue = Math.max(0, Math.min(newValue, this.config.maxValue));
                console.log(newValue);
                this.renderer.setElementStyle(this.element.nativeElement, this.config.cssProperty, `-${newValue}px`);
                this.lastValue = newValue;
                console.log("aasasas"+this.lastValue)
            });
        }else{
          console.log("sdsd");
        }
    }
}
/* export class ScrollHideDirective {

  @Input('scrollHide') config: ScrollHideConfig;
  @Input('scrollContent') scrollContent: Content;
  scrollHide;
  oldScrollTop:number=0;

  constructor(private element: ElementRef, private renderer: Renderer) {
  }
ngonInit(){
this.scrollHide =this.element.nativeElement.getElementByClassName("scroll")[0];
this.renderer.setElementStyle(this.scrollHide,"webkitTransition","transform 500ms,opacity 500ms")
}

onContentScroll(ev) {
if(ev.scrollTop-this.oldScrollTop>400){
console.log("up")
this.renderer.setElementStyle(this.scrollHide,"opacity","0");
this.renderer.setElementStyle(this.scrollHide,"webkitTransform","scale3d(.1,.1,.1)")
}else if(ev.scrollTop-this.oldScrollTop<400){
console.log("down")
this.renderer.setElementStyle(this.scrollHide,"opacity","1");
this.renderer.setElementStyle(this.scrollHide,"webkitTransform","scale3d(1,1,1)")
}
this.oldScrollTop=ev.scrollTop;
  }
} */
export interface ScrollHideConfig {
    cssProperty: string;
    maxValue: number;
}