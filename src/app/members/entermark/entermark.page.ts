import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { FunctionsService } from 'src/app/services/functions.service';
import { DatabaseService } from 'src/app/services/database.service';

//LOCALIZATION
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-entermark',
  templateUrl: './entermark.page.html',
  styleUrls: ['./entermark.page.scss'],
})
export class EntermarkPage implements OnInit {

  header: any = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    }
  }
  currentVal=2;
  locationData: string = '';
  data: Observable<any>;
  markEmployeeData: any;
  userLoginResDetail: string = 'userLoginResDetail';
  lat: any;
  long: any;
  employeeId: any;
  liveUserCode: any;
  deviceId: any;
  validgetLocationDataArray: any;
  buttonDisabled: boolean = false;
  localLat: any;
  localLong: any;
  localisBuffer: any;
  localDate: any;
  entermark_page: string = 'assets/img/page/entermark_page.png';
  mark_button_page: string = 'assets/img/page/mark_button_page.png';
  back_button_mark_page: string = 'assets/img/page/back_button_mark_page.png';

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    private geolocation: Geolocation,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private locationAccuracy: LocationAccuracy,
    public http: HttpClient,
    private backgroundGeolocation: BackgroundGeolocation,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions,
    private network: Network,
    private _function:FunctionsService,
    private _socketService:DatabaseService
    ){  }
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
      }
    })
  }

  async getLocationLoaderOn() {
    this._function.requireLoading('Procesando ubicación...',2000);
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
  async locationErrorAlert(errorMsg) {
    this._function.requireAlert(errorMsg,'De acuerdo');
  }

  async getCurrentLocation() {
    let loadingGeolocation = await this.loadingController.create({
      message: 'Verificando ubicación...',
      spinner: 'crescent',
      cssClass:'transparent'
    });
    loadingGeolocation.present();

    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option)
    .then((resp) => {
      if(resp.coords) {
        loadingGeolocation.dismiss();
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.markEmployee();
      }
     }).catch((error) => {
       if(error) {
        loadingGeolocation.dismiss();
        this.locationErrorAlert(error.message);
       }
     });
  }

  async markEmployeeResponseAlert(responseMsg) {
    this._function.requireAlert(responseMsg,'De acuerdo');
  }

  async badRequestAlert() {
    this._function.requireAlert('Error de servicio','De acuerdo');
  }

  async mockLocationErrorAlert() {
    this._function.requireAlert('Dispositivo de uso de ubicación simulada por favor desactivado', 'De acuerdo');
  }

  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          this.getLatLongMobile();
          this.buttonDisabled = true;
        },(error)=> {
          this.locationErrorAlert(error);
        }
      );
    });
  }


  async getLatLongMobile(){
	let loadingLatLongElement = await this.loadingController.create({
		message: 'Procesando ubicación...',
		spinner: 'crescent',
		cssClass:'transparent'
	  })
	   loadingLatLongElement.present();

    let option = {
      timeout: 10000,
      enableHighAccuracy: true
	}

    this.geolocation.getCurrentPosition(option).then((resp) => {
      if(resp.coords) {
		loadingLatLongElement.dismiss();
        this.lat = resp.coords.latitude;
		this.long = resp.coords.longitude;
        this.checkMockLocation();
      }
     }).catch((error) => {
	  this.buttonDisabled = false;
      loadingLatLongElement.dismiss();
       if(error) {
        this.locationErrorAlert(error.message);
       }
     });
  }
  checkMockLocation(){
    const config: BackgroundGeolocationConfig = {
			desiredAccuracy: 65,
            stationaryRadius: 20,
			distanceFilter: 30,
            debug: false,
            stopOnTerminate: true,
			postTemplate: null,
			//notificationsEnabled:false
	};
    this.backgroundGeolocation.configure(config)
    .then((location: BackgroundGeolocationResponse) => {
      this.backgroundGeolocation.finish();
	});
	this.backgroundGeolocation.start();
	this.backgroundGeolocation.stop();
    this.backgroundGeolocation.getLocations()
    .then((validgetLocationData) => {
      if(validgetLocationData.length > 0) {
		this.validgetLocationDataArray = validgetLocationData[validgetLocationData.length - 1];
        this.mockLocationCheck();
      } else {
        this.getLatLongMobile();
	  }
    });
  }

  offlineAlert() {
    this._function.requireAlert('Marca capturada, será validada una vez encontremos conexión al sistema.','De acuerdo');
  }

  async mockLocationCheck() {

    this.localDate = new Date();
    this.localDate = this.localDate.getFullYear() + "-" + ('0' + (this.localDate.getMonth() + 1)).slice(-2) + "-" + ('0' + this.localDate.getDate()).slice(-2) + " " + this.localDate.getHours() + ":" + ('0' + this.localDate.getMinutes()).slice(-2) + ":" + ('0' + this.localDate.getSeconds()).slice(-2);

	if(this.validgetLocationDataArray.isFromMockProvider) {
	  this.buttonDisabled = false;

      this.deleteStoreLocation();
      this.mockLocationErrorAlert();

	} else if(this.network.type == 'none') {
	  this.buttonDisabled = false;

	  this.deleteStoreLocation();

      this.storage.set('localLat', this.lat);
      this.storage.set('localLong', this.long);
      this.storage.set('localisBuffer', 'true');
      this.storage.set('localDate', this.localDate);
      this.offlineAlert();

	} else if(this.network.type!='none'){
	  this.buttonDisabled = false;
      this.deleteStoreLocation();
      this.markEmployee();
    }
  }

  async markEmployee(){
    let loadingMarkEmployeed = await this.loadingController.create({
      message: 'Ingresando marca empleado...',
      spinner: 'crescent',
      cssClass:'transparent'
    });
    loadingMarkEmployeed.present();
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/MarkEmployee';
    let params = {
      "lat": this.lat,
      "lon": this.long,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": 'false',
      "date": this.localDate
	}
	this._socketService.markEmployee(url, params)
	.then((response)=>{
		switch(response['status']){
			case '200':
					this.markEmployeeData=response;
					loadingMarkEmployeed.dismiss();
					this.buttonDisabled=false;
					this.markEmployeeResponseAlert(response['onmessage']);
					this.buttonDisabled = false;
					let options: NativeTransitionOptions = {
					  duration: 800
					}
					this.nativePageTransitions.fade(options);
					this.navController.navigateRoot(['members', 'mymark']);
				break;
			case '0':
					this.badRequestAlert();
					this.buttonDisabled = false;
				break;
			case '400':
					loadingMarkEmployeed.dismiss();
					this.markEmployeeResponseAlert(response['response']);
					this.buttonDisabled = false;
				break;
			case '408':
					loadingMarkEmployeed.dismiss();
					this._function.requireAlert('Tiempo agotado para la respuesta.', 'De Acuerdo');
					this.buttonDisabled = false;
				break;
		}
	})
	}

  showLocalLatLong() {
    this.storage.get('localLat').then((val) => {
      if(val != null && val != undefined) {
        this.localLat = val;
      }
    })

    this.storage.get('localLong').then((val) => {
      if(val != null && val != undefined) {
        this.localLong = val;
      }
    })

    this.storage.get('localisBuffer').then((val) => {
    })

    this.storage.get('localDate').then((val) => {
    })
  }

  removeLocalLatLong() {
    this.storage.remove('localLat').then(() => {
    })
  }

  deleteStoreLocation() {
    this.backgroundGeolocation.deleteAllLocations()
    .then((deleteAllLocationsData) => {
    });
  }

 async getCurrentLocationWeb() {
	let getCurrentLocationWeb = await this.loadingController.create({
		message: 'Verificando Localizacion Web...',
		spinner: 'crescent',
		cssClass:'transparent'
	  });
	  getCurrentLocationWeb.present();
    this.getLocationLoaderOn();
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option).then((resp) => {
	  getCurrentLocationWeb.dismiss();
      if(resp.coords) {
        this.locationData = 'Lat: ' + resp.coords.latitude + '<br>' + 'Long: ' + resp.coords.longitude;
      }

     }).catch((error) => {
       if(error) {
		getCurrentLocationWeb.dismiss();
        this.locationErrorAlert(error.message);
       }
     });
  }
}
