import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController, IonSlides } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FunctionsService } from 'src/app/services/functions.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mymark',
  templateUrl: './mymark.page.html',
  styleUrls: ['./mymark.page.scss'],
})
export class MymarkPage implements OnInit {

  /* header: any = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    }
  }   */
  @ViewChild('slidesMymark')slide: IonSlides;
  userLoginResDetail: string = 'userLoginResDetail'
  currentVal=2;
  employeeId: any
  liveUserCode: any

  data: Observable<any>

  loadingElement: any

  deviceId: any

  employeeMarkItems: any

  employeeMarkLeftRight: any

  increaseValue: number = 0

  leftCount: number = 0
  rightCount: number = 0

  entry_hour_img: string = 'assets/img/entry_hour_img.png'
  exit_hour_img: string = 'assets/img/exit_hour_img.png'
  entry_lunch_img: string = 'assets/img/entry_lunch_img.png'
  exit_lunch_img: string = 'assets/img/exit_lunch_img.png'
  location_img: string = 'assets/img/location_img.png'

  arregloNumbers:any=[];

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public http: HttpClient,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions,
    private _function:FunctionsService,
    private _socketService:DatabaseService

  ) {
  }

  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.employeeId = val['EmployeeId']
      }
    })

    this.storage.get('liveUserCode').then((val) => {
      if(val != null && val != undefined) {
		this.liveUserCode = val
      }
    })

    this.storage.get('deviceIdLocalStorage').then((val) => {
      if(val != null && val != undefined) {
        this.deviceId = val
		this.employeeMarkService();
      }
	})

  }


  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }

  logout() {
    this.authService.logout()
  }

  async employeeMarkServiceLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present();

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)
  }

  async employeeMarkServiceLoaderOff() {
    this.loadingElement.dismiss()
  }

  async badRequestAlert() {
    this._function.requireAlert('Error de servicio', 'De acuerdo');
  }

  async noDataToast() {
    this._function.MessageToast('Datos no encontrados', 'bottom', 2000);
  }

  async employeeMarkService() {
    let loadingMarkEmployed = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent',
      cssClass:'transparent'
    });
    loadingMarkEmployed.present();
    let employeeId = this.employeeId
    let imei = this.deviceId
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeMarks?employeeId='+employeeId+'&imei='+imei;
	this._socketService.serviceMarkEmployeed(url)
	.then((response)=>{
      switch(response['status']){
        case '200':
            loadingMarkEmployed.dismiss();
            this.employeeMarkItems = response['response'];
            this.employeeMarkLeftRight = this.employeeMarkItems[0]
            if(this.employeeMarkItems.length > 1) {
			  this.rightCount = this.employeeMarkItems.length - 1;
			  let arreglo:any=[];
        		for(let sumcont=1;sumcont<=this.employeeMarkItems.length;sumcont++){
					arreglo.push(sumcont);
				}
				this.arregloNumbers=arreglo;
            } else {
              this.rightCount = 0
              this.leftCount = 0
            }
          break;
        case '400':
            loadingMarkEmployed.dismiss();
            this.noDataToast();
          break;
        case '0':
            loadingMarkEmployed.dismiss();
            this.badRequestAlert();
            break;
        }
    })
  }


  	slideLeftMark(){
		this.increaseValue = this.increaseValue - 1
		this.employeeMarkLeftRight = this.employeeMarkItems[this.increaseValue]
		this.leftCount = this.leftCount - 1
		this.rightCount = this.rightCount + 1
  	}
	slideRightMark(){
		this.increaseValue = this.increaseValue + 1
		this.employeeMarkLeftRight = this.employeeMarkItems[this.increaseValue]
		this.rightCount = this.rightCount - 1
		this.leftCount = this.leftCount + 1
  	}
  leftMark() {
    this.increaseValue = this.increaseValue - 1
    this.employeeMarkLeftRight = this.employeeMarkItems[this.increaseValue]
    this.leftCount = this.leftCount - 1
    this.rightCount = this.rightCount + 1
  }

  rightMark() {
    this.increaseValue = this.increaseValue + 1
    this.employeeMarkLeftRight = this.employeeMarkItems[this.increaseValue]
    this.rightCount = this.rightCount - 1
    this.leftCount = this.leftCount + 1
  }


}
