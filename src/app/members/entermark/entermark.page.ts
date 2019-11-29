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
  //loadingElement: any;
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
  loadingLatLongElement:any;

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
       console.log('Error al obtener Location ++', error)
     });
  }

  async markEmployeeResponseAlert(responseMsg) {
    this._function.requireAlert(responseMsg,'De acuerdo');
  }

  async badRequestAlert() {
    this._function.requireAlert('Error de servicio','De acuerdo');
  }

  // mock location function

  async mockLocationErrorAlert() {
    this._function.requireAlert('Dispositivo de uso de ubicación simulada por favor desactivado', 'De acuerdo');
  }

  //EJECUTA GEOLOCALIZACION DEL BOTON
  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      // the accuracy option will be ignored by iOS
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          console.log('Request successful');
          this.getLatLongMobile(); //CON ESTA FUNCION OBTIENE LATITUD Y LONGITUD DEL EQUIPO MOVIL
          this.buttonDisabled = true;
          //this.getLocationLoaderOn(); //MENSAJE DE PANTALLA OBTENIENDO GEOLOCALIZACION
        },(error)=> {
          this.locationErrorAlert(error);
        }
      );
    });
  }

  // LUEGO CUANDO SE ESTE EJECUTANDO enableLocation() SE EJECUTA GetLatLongMobile()
  	async loadingLatLongElementOn(){
		this.loadingLatLongElement = await this.loadingController.create({
			message: 'Procesando ubicación...',
			spinner: 'crescent',
			cssClass:'transparent'
		  })
		  await this.loadingLatLongElement.present();
	  }
  async loadingLatLongElementOff(){
		await this.loadingLatLongElement.dismiss();
	}

  getLatLongMobile(){
	this.loadingLatLongElementOn();
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option).then((resp) => {
      if(resp.coords) {
        console.log('getLatLongMobile resp.coords --', resp.coords);
        this.lat = resp.coords.latitude;
		this.long = resp.coords.longitude;
		// Mientras se ejecuta o se obtiene la latitud y la longitud se Ejecuta CheckMockLocation()
		console.log("Mientras se ejecuta o se obtiene la latitud y la longitud se Ejecuta CheckMockLocation()");
        this.checkMockLocation();
		this.loadingLatLongElementOn();
      }
     }).catch((error) => {
	  this.buttonDisabled = false;
	  this.loadingLatLongElementOff();
      //loadingLatLongElement.dismiss();
       if(error) {
        this.locationErrorAlert(error.message);
       }
       console.log('Error getting location', error);
     });
  }
  checkMockLocation(){
    const config: BackgroundGeolocationConfig = {
			desiredAccuracy: 10,
            stationaryRadius: 100,
			distanceFilter: 100,
			notificationText: 'Habilitado',
            debug: true,
            notificationTitle:'Geolocalización activada',
            stopOnTerminate: true,
			postTemplate: null,
			interval: 1000,
			fastestInterval: 5000,
			activitiesInterval: 1000,
	};
    this.backgroundGeolocation.configure(config)
    .then((location: BackgroundGeolocationResponse) => {
      console.log('location -', location);
      this.backgroundGeolocation.finish(); // FOR IOS ONLY
	});
	console.log("start recording location");
    // start recording location
    this.backgroundGeolocation.start();
    this.backgroundGeolocation.stop();
    this.backgroundGeolocation.getLocations()
    .then((validgetLocationData) => {
      console.log('validgetLocationData --', validgetLocationData);
      if(validgetLocationData.length > 0) {
		this.validgetLocationDataArray = validgetLocationData[validgetLocationData.length - 1];
        this.mockLocationCheck();
      } else {
        this.getLatLongMobile();
      }
    }).finally(()=>{
		this.backgroundGeolocation.stop();
	});
  }

  async offlineAlert() {
    this._function.requireAlert('Tu marca es capturada','De acuerdo');
  }

  mockLocationCheck() {
    this.localDate = new Date();
    this.localDate = this.localDate.getFullYear() + "-" + ('0' + (this.localDate.getMonth() + 1)).slice(-2) + "-" + ('0' + this.localDate.getDate()).slice(-2) + " " + this.localDate.getHours() + ":" + ('0' + this.localDate.getMinutes()).slice(-2) + ":" + ('0' + this.localDate.getSeconds()).slice(-2);
    if(this.validgetLocationDataArray.isFromMockProvider) {
	  this.buttonDisabled = false;
	  this.loadingLatLongElementOff();
      //this.getLocationLoaderOff()
      this.deleteStoreLocation();
      this.mockLocationErrorAlert();
    } else if(this.network.type == 'none') {
		debugger
		console.log("PASANDO SIN INTERNET ------ ####");
	  this.buttonDisabled = false;
	  this.loadingLatLongElementOff();
      //this.getLocationLoaderOff()
      this.deleteStoreLocation();
      this.storage.set('localLat', this.lat);
      this.storage.set('localLong', this.long);
      this.storage.set('localisBuffer', 'true');
      this.storage.set('localDate', this.localDate);
      this.offlineAlert();
    } else {
	  this.buttonDisabled = false;
	  this.loadingLatLongElementOff();
      //this.getLocationLoaderOff()
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
	console.log("PARAMS ---"+JSON.stringify(params));


    /* this.data = this.http.post(url, params, this.header);
    this.data.subscribe((response) => { */
	this._socketService.markEmployee(url, params).then((response)=>{


		console.log("Lo que trae el response despues de hacer la marca  -- "+JSON.stringify(response));
		switch(response['status']){
			case '200':
					this.markEmployeeData=response;
					loadingMarkEmployeed.dismiss();
					this.buttonDisabled=false;
					this.markEmployeeResponseAlert('Marca satisfactoria');
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
					this.markEmployeeResponseAlert(response['Message']);
					this.buttonDisabled = false;
				break;
			case '408':
					loadingMarkEmployeed.dismiss();
					this._function.requireAlert('Tiempo agotado para la respuesta.', 'De Acuerdo');
					this.buttonDisabled = false;
				break;
		}



	//this.markEmployeeData = response.data
      //this.markEmployeeLoaderOff();
      /* loadingMarkEmployeed.dismiss();

      this.buttonDisabled = false

      if(response.status) {
        this.markEmployeeResponseAlert('Marca satisfactoria');
        this.buttonDisabled = false;

        let options: NativeTransitionOptions = {
          duration: 800
        }

        this.nativePageTransitions.fade(options);
        this.navController.navigateRoot(['members', 'mymark'])

      } else {
        this.markEmployeeResponseAlert(response.Message);
        this.buttonDisabled = false;
      }
    }, (err) => {
      //this.markEmployeeLoaderOff()
      loadingMarkEmployeed.dismiss();
      this.badRequestAlert();
      this.buttonDisabled = false;
    }); */
	})
	}

  showLocalLatLong() {
    console.log('showLocalLatLong --')
    this.storage.get('localLat').then((val) => {
      console.log('localLat', val);
      if(val != null && val != undefined) {
        this.localLat = val;
      }
    })

    this.storage.get('localLong').then((val) => {
      console.log('localLong', val);
      if(val != null && val != undefined) {
        this.localLong = val;
      }
    })

    this.storage.get('localisBuffer').then((val) => {
      console.log('localisBuffer', val);
    })

    this.storage.get('localDate').then((val) => {
      console.log('localDate', val);
    })
  }

  removeLocalLatLong() {
    console.log('removeLocalLatLong --');
    this.storage.remove('localLat').then(() => {
    })
  }

  deleteStoreLocation() {
    this.backgroundGeolocation.deleteAllLocations()
    .then((deleteAllLocationsData) => {
        console.log('deleteAllLocationsData --', deleteAllLocationsData);
    });
  }

  getCurrentLocationWeb() {
    this.getLocationLoaderOn();
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option).then((resp) => {

	  //this.getLocationLoaderOff()
	  this.loadingLatLongElementOff();

      if(resp.coords) {

        console.log('resp --', resp);
        // resp.coords.latitude
        // resp.coords.longitude
        this.locationData = 'Lat: ' + resp.coords.latitude + '<br>' + 'Long: ' + resp.coords.longitude;
      }

     }).catch((error) => {
       if(error) {
		//this.getLocationLoaderOff()
		this.loadingLatLongElementOff();
        this.locationErrorAlert(error.message);
       }
       console.log('Error getting location', error);
     });
  }

  /*testParams() {

    this.localDate = new Date();

    this.localDate = this.localDate.getFullYear() + "-" + ('0' + (this.localDate.getMonth() + 1)).slice(-2) + "-" + ('0' + this.localDate.getDate()).slice(-2) + " " + this.localDate.getHours() + ":" + ('0' + this.localDate.getMinutes()).slice(-2) + ":" + ('0' + this.localDate.getSeconds()).slice(-2);

    if(this.network.type == 'none') {
      this.localisBuffer = false;
    } else {
      this.localisBuffer = true;
    }

    let params = {
      "lat": this.lat,
      "lon": this.long,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": this.localisBuffer,
      "date": this.localDate
    }

    console.log('this.network.type --', this.network.type);
    console.log('testparams params --', params);
  }*/

}
