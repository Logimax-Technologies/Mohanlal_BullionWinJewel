import { Directive, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import { Storage } from '@ionic/storage';

@Directive({
 selector: '[imageCache]'
})
export class ImageCacheDirective implements OnChanges {
 @Input() cache: string;

 constructor(private el: ElementRef, public storage: Storage) {
	 if (!el.nativeElement.src) {
	 el.nativeElement.src = ''; // assets/images/icon.png
	 }
 }

 ngOnChanges(changes: { [propKey: string]: SimpleChange }) {	
	 console.log('checkCache - url');
	 for (let propName in changes) {
	 let changedProp = changes[propName];
	 let to = JSON.stringify(changedProp.currentValue);
	 this.checkCache(to);
	 }
 }

 checkCache(imageSrc: string) {

	 console.log('checkCache - url', imageSrc);

	 if (this.isEmpty(imageSrc)) {
	 return;
	 }

	 if (imageSrc.toLowerCase().includes('assets/images/')) {
	 this.setImageToElement(this.el, JSON.parse(imageSrc));
	 return;
	 }

	 this.storage.ready().then(() => {

	 // Check URI
	 if (this.isUriAbsolute(imageSrc)) {

	 // Check if image is already saved
	 this.storage.get( encodeURIComponent(imageSrc) ).then( (data: any) => {

	 if (data) {

	 //console.log('findPhotoByURL - found', data);

	 // Image found, set image to element
	 this.setImageToElement(this.el, data);

	 } else {

	 //console.log('findPhotoByURL - not found');
	 
	 // Image not found, generate base64 image string, save and set
	 this.setImageBase64String(this.el, imageSrc);
	 }
	 }, (error) => {
	 console.log("-------------------------");
	 console.log('checkCache - error: ', JSON.stringify(error), error);
	 console.log("-------------------------");
	 // Error, generate base64 image string, save and set
	 this.setImageBase64String(this.el, imageSrc);
	 });
	 }

	 });
 }

 setImageBase64String(el: ElementRef, imageSrc: string) {
	 this.getImageBase64String(imageSrc).then( (imageBase64String: any) => {

	 //console.log('setImageBase64String - url', imageSrc, imageBase64String);

	 this.storage.set(encodeURIComponent(imageSrc), imageBase64String);
	 this.setImageToElement(el, imageBase64String);
	 }, (err) => {
	 console.log('setImageBase64String - error', err);
	 });
 }

 getImageBase64String(url: string) {
	 return new Promise((resolve: any, reject: any) => {
	 // Convert image to base64 string
	 var canvas: any = document.createElement('CANVAS'),
	 ctx: any = canvas.getContext('2d'),
	 img: any = new Image;

	 img.crossOrigin = 'Anonymous';

	 img.onload = () => {
	 var dataURL: any = null;
	 canvas.height = img.height;
	 canvas.width = img.width;
	 ctx.drawImage(img, 0, 0);

	 // set image quality
	 dataURL = canvas.toDataURL('image/jpeg', 1.0);
	 canvas = null;
	 resolve(dataURL);
	 };

	 img.onerror = (err) => {
	 console.log('getImageBase64String - error', err);
	 reject(err);
	 };
	 img.src = JSON.parse(url);
	 });
 }

 isUndefined(value: any) {
	return typeof value === 'undefined';
 }

 isEmpty(value: any) {
	return this.isUndefined(value) || value === '' || value === null;
 }

 setImageToElement(el: ElementRef, imageBase64String: string) {
	 el.nativeElement.src = imageBase64String;

	 // if (element[0].nodeName === 'IMG') {
	 // element.attr('src', imageBase64String);
	 // } else {
	 // element.css('background-image', 'url(' + imageBase64String + ')');
	 // }
 }

 isUriAbsolute(uri: string) {
	 let expression: any = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	 let regex = new RegExp(expression);
	 return uri.match(regex);
 }
}