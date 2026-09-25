import { Component, trigger, state, style, transition, animate, keyframes,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category-provider';
import { CollectionPage } from '../../pages/collection/collection';
import { Toast } from '@ionic-native/toast';
import { CommonProvider, BaseAPIURL } from '../../providers/common';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CartPage } from '../../pages/cart/cart';
import { ScrollHideConfig } from '../../directives/hide-footer/hide-footer';
import { LoginPage } from '../../pages/login/login';
import { RegisterPage } from '../../pages/register/register';

declare var cordova: any;

/**
 * Generated class for the ProductDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component( {
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html',
    providers: [CategoryProvider],
    animations: [
        trigger( 'flyInTopSlow', [
            state( "0", style( {
                transform: 'translate3d(0,0,0)'
            } ) ),
            transition( '* => 0', [
                animate( '500ms ease-in', keyframes( [
                    style( { transform: 'translate3d(0,-500px,0)', offset: 0 } ),
                    style( { transform: 'translate3d(0,0,0)', offset: 1 } )
                ] ) )
            ] )
        ] )
    ]
} )
export class ProductDetailPage {
    private _header: Headers;
    private _username: string = 'lmxretail';
    private _password: string = 'lmx@2017';
    checkStatus: boolean =false;
    /* public photos : any;
    public base64Image : string; */
    public targetPaths = [];
    public filenames = [];
    purityname: String = "";
    subcategory:any;
    categoryId: any;
    proid: any;
    lastImage: string = null;
    productdet:any = this.getEmptyProduct();
    footerScrollConfig: ScrollHideConfig= { cssProperty: 'margin-bottom', maxValue: undefined };

    totalcartitems = 0;

    constructor( private commonservice: CommonProvider,public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private categoryProvider: CategoryProvider, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private ftransfer: FileTransfer, private file: File, public http: Http, private alertCtrl: AlertController ) {
        this.proid = navParams.get( 'proid' );
        this._header = new Headers();
        this._header.append( 'Authorization', 'Basic ' + btoa( this._username + ':' + this._password ) );

        this.totalcartitems = commonservice.getTotalCartItems();
      }

	/* takePhoto() {
		const options : CameraOptions = {
		  quality: 50, // picture quality
		  destinationType: this.camera.DestinationType.DATA_URL,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE
		}
		this.camera.getPicture(options) .then((imageData) => {
			this.base64Image = "data:image/jpeg;base64," + imageData;
			this.photos.push(this.base64Image);
			this.photos.reverse();
		  }, (err) => {
			console.log(err);
		  });
	} */

    deletePhoto( index ) {
        let confirm = this.alertCtrl.create( {
            title: 'Sure you want to delete this photo? There is no undo!',
            message: '',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log( 'Disagree clicked' );
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log( 'Agree clicked' );
                        this.targetPaths.splice( index, 1 );
                        this.filenames.splice( index, 1 );
                        this.lastImage == '';
                    }
                }
            ]
        } );
        confirm.present();
    }
    ionViewDidLoad() {
        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();
        this.categoryProvider.getProductById( this.proid ).then(( data ) => {
            if ( data.success ) {
                this.productdet = this.setProductentry( data.responseData );
                this.subcategory=data.responseData.parent_data;
                console.log(JSON.stringify(data.responseData.parent_data));
                if(data.responseData.purities.length == 1){
                    this.purityname = data.responseData.purities[0].purity;
                }
            }
            loader.dismiss()
        } );
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create( {
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Gallery',
                    handler: () => {
                        this.takePicture( this.camera.PictureSourceType.PHOTOLIBRARY, 1 );
                    }
                },
                {
                    text: 'Take Picture',
                    handler: () => {
                        this.takePicture( this.camera.PictureSourceType.CAMERA, 2 );
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        } );
        actionSheet.present();
    }

    public takePicture( sourceType, pictype ) {
        // Create options for the Camera Dialog
        if ( pictype == 2 ) {
            var options = {
                quality: 75,
                sourceType: sourceType,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };

            // Get the data of an image
            this.camera.getPicture( options ).then(( imagePath ) => {
                /* if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
                     this.filePath.resolveNativePath( imagePath )
                         .then( filePath => {
                             let correctPath = filePath.substr( 0, filePath.lastIndexOf( '/' ) + 1 );
                             let currentName = imagePath.substring( imagePath.lastIndexOf( '/' ) + 1, imagePath.lastIndexOf( '?' ) );
                             this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                         } );
                     this.uploadImage();
                 } else {*/
                var currentName = imagePath.substr( imagePath.lastIndexOf( '/' ) + 1 );
                var correctPath = imagePath.substr( 0, imagePath.lastIndexOf( '/' ) + 1 );
                this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
                this.uploadImage();
                // }
            }, ( err ) => {
                this.presentToast( 'Error while selecting image.' );
            } );
        }else{
            const options: CameraOptions = {
                    quality: 75,
                    destinationType: this.camera.DestinationType.DATA_URL,
                    sourceType: sourceType,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };
        this.camera.getPicture(options).then((imageData) => {

        });
        }
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir( namePath, currentName, newFileName ) {
        this.file.copyFile( namePath, currentName, cordova.file.dataDirectory, newFileName ).then( success => {
            this.lastImage = newFileName;
            this.targetPaths.push( this.pathForImage( this.lastImage ) );
            this.filenames.push( this.lastImage );
        }, error => {
            this.presentToast( 'Error while storing file.' );
        } );
    }

    private presentToast( text ) {
        let toast = this.toastCtrl.create( {
            message: text,
            duration: 3000,
            position: 'bottom'
        } );
        toast.present();
    }
    // Always get the accurate path to your apps folder
    public pathForImage( img ) {
        if ( img === null ) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = BaseAPIURL + 'master_api/custom_orderimgupload';

        // File for Upload
        var targetPath = this.pathForImage( this.lastImage );
        // File name only
        var filename = this.lastImage;
        var options = {
            fileKey: "cusproduct",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename },
            headers: { 'Authorization': 'Basic ' + btoa( this._username + ':' + this._password ) }
        };
        const fileTransfer: TransferObject = this.transfer.create();

        let loader = this.loadingCtrl.create( {
            content: "Uploading..."
        } );
        loader.present();
        // Use the FileTransfer to upload the image
        fileTransfer.upload( targetPath, url, options ).then(( data ) => {
            //alert( JSON.stringify( data ) );
            let result = JSON.parse( data.response );
            //alert( result.responsedata.imgpath );
            this.productdet.customimages = this.filenames;
            loader.dismissAll();
            this.presentToast( 'Image succesfully uploaded.' );
        }, err => {
            loader.dismissAll()
            //alert( JSON.stringify( err ) );
            this.presentToast( 'Error while uploading file.' );
        } );
    }

    getEmptyProduct() {
        return {
            id_product: '',
            id_item: '',
            name: '',
            description: '',
            code: '',
            gold_value: '',
            tax: '',
            stone_charges: '',
            making_charges: '',
            id_metal: '',
            allowed_order_qty: '',
            status: '',
            weight: '',
            prodefaultimg: '',
            qty: 1,
            reqweight: '',
            order_minweight: '',
            sizeorlen: '',
            productimgdetails: [],
            isurgent: false,
            deliverydate: '',
            is_customeitem: 0,
            customerordertype: 3,
            customimages: [],
            purities: [],
            remarks: "",
			is_chain:0,
			s_hook_type:'',
			m_hook_type:'',
            hook_type:'',
            id_purity:'',
            ortertype:3
        }
    }
    checkqty(){
        // console.log(this.productdet['qty'].length)
        if(this.productdet['qty'].length == 0){
            this.productdet['qty'] = 1;
            console.log(this.productdet['qty'])
        }
    }
    setProductentry( productdetails ) {
        console.log( productdetails );
        return {
            id_purity:productdetails.purities[0].id_purity,
            id_product: productdetails.id_product,
            id_item: productdetails.id_item,
            name: productdetails.name,
            description: productdetails.description,
            code: productdetails.code,
            gold_value: productdetails.gold_value,
            tax: productdetails.tax,
            stone_charges: productdetails.stone_charges,
            making_charges: productdetails.making_charges,
            id_metal: productdetails.id_metal,
            allowed_order_qty: productdetails.allowed_order_qty,
            status: productdetails.status,
            weight: productdetails.weight,
            prodefaultimg: productdetails.prodefaultimg,
            qty: 1,
            reqweight: productdetails.weight,
            order_minweight: productdetails.minweight,
            sizeorlen: productdetails.sizeorlen,
            productimgdetails: productdetails.productimgdetails,
            isurgent: productdetails.isurgent,
            deliverydate: productdetails.deliverydate,
            purities: productdetails.purities,
            is_customeitem: 0,
            customerordertype: 3,
            customimages: [],
            remarks: "",
      			is_chain:productdetails.is_chain,
      			s_hook_type:productdetails.s_hook_type,
      			m_hook_type:productdetails.m_hook_type,
      			hook_type:'',
            is_new:productdetails.is_new,
            is_stock_avail:productdetails.is_stock_avail,
            ortertype:3
        }
    }

    changeImage( image ) {
        this.productdet.prodefaultimg = image;
    }
    add(){
        this.productdet['qty'] = parseInt(this.productdet['qty']) + 1;
    }
    sub(){
        if(this.productdet['qty'] != 1){
        this.productdet['qty'] = parseInt(this.productdet['qty']) - 1;
        }
    }

    addtocart( product ) {
        var loginstatus = JSON.parse( localStorage.getItem( 'check' ));


        if( loginstatus == false || loginstatus == null){

            // let toast = this.toastCtrl.create( {
            //     message: 'Please Login / Register Your Account to Checkout Your Item',
            //     duration: 4000,
            //     position: 'bottom'
            // } );
            // toast.present();
            let alert = this.alertCtrl.create({
                title: 'Mohanlal Jewellers',
                message: 'Please Login / Register Your Account to View Item',
                enableBackdropDismiss: false, // <- Here! :)

                buttons: [
                  {
                    text: 'SignIn',
                    role: 'cancel',
                    handler: () => {
                        this.navCtrl.push(LoginPage)
                    }
                  },
                  {
                    text: 'Register',
                    handler: () => {
                        this.navCtrl.push(RegisterPage);
                    }
                  }
                ]
              });
              alert.present();
        }
        if( loginstatus == true){

        let loader = this.loadingCtrl.create( {
            content: "Please wait..."
        } );
        loader.present();

        if ( (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) || product.id_purity == undefined ) {
            console.log( product );
            if (product.is_chain && parseFloat(product.reqweight) < parseFloat(product.order_minweight) ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Minimum order weight is '+product.order_minweight+' g', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Minimum order weight is '+product.order_minweight+' g',
                        duration: 5000,
                        position: 'bottom'
                    } );
                    toast.present();
                }
            }
            else if ( product.id_purity == undefined ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Select purity', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Select purity',
                        duration: 4000,
                        position: 'bottom'
                    } );
                    toast.present();
                }
            }
            /* else if ( product.sizeorlen == undefined ) {
                if ( this.platform.is( 'cordova' ) ) {
                    this.toast.show( 'Enter size or length', 'short', 'center' ).subscribe(
                        toast => {
                            console.log( toast );
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create( {
                        message: 'Enter size or length',
                        duration: 5000,
                        position: 'bottom'
                    } );
                    toast.present();
                }
            } */
            loader.dismiss();
        }
        else {
            if ( localStorage.getItem( 'appcartitems' ) != null ) {
                let curr_cartproducts = JSON.parse( localStorage.getItem( 'appcartitems' ) );
                let deliveryorders = [];
                let prodavail = true;
                curr_cartproducts.forEach(( orders ) => { // foreach statement
                    if ( orders.id_product == product.id_product && orders.id_purity == product.id_purity && product.sizeorlen == orders.sizeorlen && product.reqweight == orders.reqweight) {
                        orders.qty = parseInt(orders.qty) + parseInt(product.qty);

                        prodavail = false;
                    }
                    deliveryorders.push( orders );
                } );
                if ( prodavail ) {
                    deliveryorders.push( product );
                }
                localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
            } else {
                let deliveryorders = [];
                deliveryorders.push( product );
                localStorage.setItem( 'appcartitems', JSON.stringify( deliveryorders ) );
            }

            loader.dismiss();
            // if ( this.platform.is( 'cordova' ) ) {
            //     this.toast.show( 'Item added to cart', 'short', 'center' ).subscribe(
            //         toast => {
            //             console.log( toast );
            //         }
            //     );
            // } else {
            //     let toast = this.toastCtrl.create( {
            //         message: 'Item added to cart',
            //         duration: 3000,
            //         position: 'bottom'
            //     } );
            //     toast.present();
            // }
            let toast = this.toastCtrl.create( {
                message: 'Item added to cart',
                duration: 3000,
                position: 'bottom'
            } );
            toast.present();
            this.event.publish( 'cart:changed', ( JSON.parse( localStorage.getItem( 'appcartitems' ) ).length ) );
            this.navCtrl.setRoot( CartPage,{value:''} );
            //this.navCtrl.pop();
        }
    }
    }
    grid()
    {
        console.log("grid");
        this.checkStatus = true;
    }
    setpur(data,name){
        this.productdet['id_purity'] = data;
        this.purityname = name;
        console.log(this.productdet['id_purity'])
    }
    listgrid()
    {
        console.log("listgrid");
        this.checkStatus = false;
    }
    openProductdetails( id_design ) {
        this.navCtrl.push( ProductDetailPage, { proid: id_design } );
    }
}
