import { Component } from '@angular/core';
import { IonicPage, Keyboard, Events, NavController, NavParams, LoadingController, ToastController, Platform, ActionSheetController, Loading, AlertController } from 'ionic-angular';
import { CommonProvider, BaseAPIURL } from '../../providers/common';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CategoryProvider } from '../../providers/category-provider';
import { CollectionPage } from '../../pages/collection/collection';
import { FilePath } from '@ionic-native/file-path';
import { CartPage } from '../../pages/cart/cart';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DatePicker } from '@ionic-native/date-picker';
import { ImagePicker } from '@ionic-native/image-picker';
import { NgxImageCompressService } from 'ngx-image-compress';

declare var cordova: any;
declare let window: any;

/**
 * Generated class for the CustomorderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-customorder',
    templateUrl: 'customorder.html',
    providers: [CategoryProvider],
})
export class CustomorderPage {
    public targetPaths: any[] = [];
    public filenames = [];
    deletephotos: any[] = [];
    mindate: string;
    proid: any;
    lastImage: string = null;
    public isShown: boolean = false;
    loader: any;
    count = 1;
    productdet = this.getEmptyProduct();
    constructor(private imageCompress: NgxImageCompressService, public keyboard: Keyboard, private datePicker: DatePicker, private androidPermissions: AndroidPermissions, private categoryProvider: CategoryProvider, private imagePicker: ImagePicker, private commonservice: CommonProvider, public navCtrl: NavController, public platform: Platform, public navParams: NavParams, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private event: Events, private toast: Toast, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: Transfer, private ftransfer: FileTransfer, private file: File, public http: Http, private filePath: FilePath, private alertCtrl: AlertController) {
        var today = new Date();
        this.deletephotos = []
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        this.mindate = yyyy + '-' + mm + '-' + dd;
        this.productdet.due_date = new Date().toISOString();
        localStorage.setItem('dp', null)
        this.productdet = this.getEmptyProduct();
    }

    load() {
        this.loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        this.loader.present();
    }
    show() {
        // this.keyboard.close();
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(date => {
            /*date => console.log('Got date: ', date),
            err => console.log('Error occurred while getting date: ', err),*/
            /*console.log('Got date: '+ date);
            var curDate = new Date();
            curDate.setDate(curDate.getDate() - 10);*/
            var ddd = date.getDate();
            var mmm = date.getMonth() + 1;
            var yy = date.getFullYear();
            //var today = new Date(yy+"-"+mmm+"-"+ddd).toISOString().substring(0, 10);
            var today = date.toISOString().substring(0, 10);
            //this.fromdate= today;
            this.productdet.due_date = yy + "-" + mmm + "-" + ddd;
            console.log(this.productdet.due_date)
        });
    }

    ionViewDidLoad() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        this.categoryProvider.getPurities().then((data) => {
            if (data.success) {
                this.productdet.purities = data.responseData;
                this.productdet.purities.forEach((purity)=>{
                    if(purity.is_default == 1){
                        this.productdet['id_purity'] = purity.id_purity;
                      }
                })
            }
            loader.dismiss();
        });
    }
    deletePhoto(index) {
        let confirm = this.alertCtrl.create({
            title: 'Sure you want to delete this photo?',
            message: '',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Agree clicked');
                        this.targetPaths.splice(index, 1);
                        this.filenames.splice(index, 1);
                        this.deletephotos.push(this.filenames[index])
                        this.lastImage == '';
                    }
                }
            ]
        });
        confirm.present();
    }
    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Load from Gallery',
                    handler: () => {
                        // this.loadgallery();
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Take Picture',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }
    // not used..
    loadgallery() {
        var options = {
            maximumImagesCount: 10,
            width: 500,
            height: 500,
            quality: 80
        };
        this.imagePicker.getPictures(options).then(results => {
            console.log('111111111111111');
            for (var i = 0; i < results.length; i++) {
                //   this.filePath.resolveNativePath( results[i] )
                //  .then( filePath => {
                let correctPath = results[i].substr(0, results[i].lastIndexOf('/') + 1);
                let currentName = results[i].substr(results[i].lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                if (this.count == 1) {
                    this.load();
                    this.count++;
                }
                //  } );
            };
        }, (err => {
            console.log(err)
        }));
    }
    // public takePicture( sourceType ) {
    //     // Create options for the Camera Dialog
    //     var options = {
    //         quality: 50,
    //         sourceType: sourceType,
    //         saveToPhotoAlbum: false,
    //         correctOrientation: true,
    // 		allowEdit:true
    //     };
    //     // Get the data of an image
    //     if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.CAMERA ) {
    //     this.camera.getPicture( options ).then(( imagePath ) => {
    //         //  if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY ) {
    //             // this.loadgallery();
    //         //  }
    //          if ( this.platform.is( 'android' ) && sourceType === this.camera.PictureSourceType.CAMERA ) {
    // 			var currentName = imagePath.substr( imagePath.lastIndexOf( '/' ) + 1 );
    // 			var correctPath = imagePath.substr( 0, imagePath.lastIndexOf( '/' ) + 1 );
    // 			this.copyFileToLocalDir( correctPath, currentName, this.createFileName() );
    // 		 	// this.uploadImage();
    //         }
    //     }, ( err ) => {
    //         this.presentToast( 'Error while selecting image.' );
    //     })
    // }
    // }
    public takePicture(sourceType) {
        // Create options for the Camera Dialog
        var options = {
            quality: 100,
            //  destinationType: this.camera.DestinationType.FILE_URI,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: false,
            correctOrientation: true,
        };

        console.log(options)
        // Get the data of an image
        this.camera.getPicture(options).then((imagePath) => {
            console.log(imagePath)
            let base64Image = 'data:image/jpeg;base64,' + imagePath;
            console.log(base64Image)
            var orientation = -1
            this.imageCompress.compressFile(base64Image, orientation, 50, 50) // 50% ratio, 50% quality
                .then(compressedImage => {
                    this.targetPaths.push(compressedImage);
                    console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
                    console.log(this.targetPaths);
                    //this.uploadImage1(this.targetPaths);
                     this.productdet.customimages = this.targetPaths;
                });
        }, (err) => {
            this.presentToast('Error while selecting image.');
        });
    }
    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }

    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.targetPaths.push(this.pathForImage(this.lastImage));
            this.filenames.push(this.lastImage);
            this.uploadImage1(this.targetPaths);
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }
    private copyFileToLocalDir1(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.targetPaths.push(this.pathForImage(this.lastImage));
            this.filenames.push(this.lastImage);
            this.uploadImage1(this.targetPaths);
        }, error => {
            this.presentToast('Error while storing file.');
        });
    }
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

    // Always get the accurate path to your apps folder
    public pathForImage(img) {
        if (img === null) {
            return '';
        } else {
            return cordova.file.dataDirectory + img;
        }
    }

    public uploadImage() {
        // Destination URL
        var url = BaseAPIURL + 'master_api/custom_orderimgupload';
        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);
        // File name only
        var filename = this.lastImage;
        var options = {
            fileKey: "cusproduct",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename },
            headers: { 'Authorization': 'Basic ' + btoa(this.commonservice.getAuthUserName() + ':' + this.commonservice.getAuthUserPwd()) }
        };

        const fileTransfer: TransferObject = this.transfer.create();
        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then((data) => {
            console.log(data)
            let result = JSON.parse(data.response);
            this.productdet.customimages = this.filenames;
            var count = 1;
            if (count == 1) {
                this.loader.dismissAll();
                count++
                this.presentToast('Images succesfully uploaded.');
            }
        }, err => {
            console.log()
            const indexp: number = this.targetPaths.indexOf(this.lastImage);
            const indexf: number = this.targetPaths.indexOf(this.lastImage);
            this.targetPaths.splice(indexp, 1);
            this.filenames.splice(indexf, 1);
            this.presentToast('Error while uploading file.');
        });
    }

    public uploadImage1(targetPaths) {
        console.log('Fun : ', targetPaths);
        var post = {
            'imageData': targetPaths
        }
        this.commonservice.customImage(JSON.stringify(post)).then(data => {
            console.log(data);
        })
    }

    public uploadImageg(i) {
        // Destination URL
        var url = BaseAPIURL + 'master_api/custom_orderimgupload';
        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);
        console.log(targetPath)
        // File name only
        var filename = this.lastImage;
        var options = {
            fileKey: "cusproduct",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: { 'fileName': filename },
            headers: { 'Authorization': 'Basic ' + btoa(this.commonservice.getAuthUserName() + ':' + this.commonservice.getAuthUserPwd()) }
        };

        const fileTransfer: TransferObject = this.transfer.create();
        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then((data) => {
            console.log(data)
            let result = JSON.parse(data.response);
            this.productdet.customimages = this.filenames;
            var count = 1;
            if (count == 1) {
                this.loader.dismissAll();
                count++
                this.presentToast('Images succesfully uploaded.');
            }
        }, err => {
            this.loader.dismissAll()
            const indexp: number = this.targetPaths.indexOf(this.lastImage);
            const indexf: number = this.targetPaths.indexOf(this.lastImage);
            this.targetPaths.splice(indexp, 1);
            this.filenames.splice(indexf, 1);
            this.presentToast('Error while uploading file.');
        });
    }

    getEmptyProduct() {
        var d = new Date();
        var nowmilisec = d.getTime();
        return {
            id_product: nowmilisec,
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
            is_customeitem: 1,
            customerordertype: 3,
            customimages: [],
            remarks: "",
            purities: [],
            is_chain: 0,
            hook_type: '',
            due_date: '',
            customer_ref_no: '',
            ortertype: '3',
            qty_type : ''
        }
    }
    addtocart(product) {
        product.id_purity = '1';
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        if (product.is_customeitem == 1 && (product.id_purity == '')) {
            console.log(product);
            if (product.is_customeitem == 1 && product.reqweight <= 0) {
                if (this.platform.is('cordova')) {
                    this.toast.show('You have entered weight below minimum weight', 'short', 'center').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'You have entered weight below minimum weight',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                }
            }
            else if (product.id_purity == undefined) {
                if (this.platform.is('cordova')) {
                    this.toast.show('Select purity', 'short', 'center').subscribe(
                        toast => {
                            console.log(toast);
                        }
                    );
                } else {
                    let toast = this.toastCtrl.create({
                        message: 'Select purity',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                }
            }
            loader.dismiss();
        }
        else {
            console.log('elseeeeee')
            console.log(JSON.parse(localStorage.getItem('appcartitems')));
            if (JSON.parse(localStorage.getItem('appcartitems')) != null && JSON.parse(localStorage.getItem('appcartitems')).length != 0) {
                console.log('11111');
                let curr_cartproducts = JSON.parse(localStorage.getItem('appcartitems'));
                let deliveryorders = [];
                let prodavail = true;
                curr_cartproducts.forEach((orders) => { // foreach statement
                    if (orders.id_product == product.id_product && orders.id_purity == product.id_purity && product.sizeorlen == orders.sizeorlen && product.reqweight == orders.reqweight) {
                        orders.qty += product.qty;
                        prodavail = false;
                    }
                    deliveryorders.push(orders);
                });
                if (prodavail) {
                    deliveryorders.push(product);
                }
                localStorage.setItem('appcartitems', JSON.stringify(deliveryorders));
            } else {
                console.log('22222');
                let deliveryorders = [];
                deliveryorders.push(product);
                localStorage.setItem('appcartitems', JSON.stringify(deliveryorders));
            }
            loader.dismiss();
            this.event.publish('cart:changed', (JSON.parse(localStorage.getItem('appcartitems')).length));
            console.log('DEL PHOto : ',this.deletephotos);
            this.navCtrl.setRoot(CartPage, { data: this.deletephotos, value: 2 });
            localStorage.setItem('dp', JSON.stringify(this.deletephotos));
        }
    }
}
