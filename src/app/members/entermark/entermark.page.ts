import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HttpClient } from '@angular/common/http';

import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

import { Network } from '@ionic-native/network/ngx';

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
  locationData: string = ''

  loadingElement: any

  data: Observable<any>

  markEmployeeData: any

  userLoginResDetail: string = 'userLoginResDetail'

  lat: any
  long: any
  employeeId: any
  liveUserCode: any

  deviceId: any

  validgetLocationDataArray: any

  buttonDisabled: boolean = false

  localLat: any
  localLong: any
  localisBuffer: any
  localDate: any

  entermark_page: string = 'assets/img/page/entermark_page.png'
  mark_button_page: string = 'assets/img/page/mark_button_page.png'
  back_button_mark_page: string = 'assets/img/page/back_button_mark_page.png'

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
    private network: Network    
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
      }
    })    
  }  

  async getLocationLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()
  }
  
  async getLocationLoaderOff() {
    this.loadingElement.dismiss()
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
    const alert = await this.alertController.create({
      message: errorMsg,
      buttons: ['De acuerdo']
    });

    await alert.present()
  }  
  
  getCurrentLocation() {
    this.getLocationLoaderOn()
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }

    this.geolocation.getCurrentPosition(option).then((resp) => {
      
      this.getLocationLoaderOff()

      if(resp.coords) {
        this.lat = resp.coords.latitude
        this.long = resp.coords.longitude
        this.markEmployee()
        console.log('resp.coords.latitude --', resp.coords.latitude)
        console.log('resp.coords.longitude --', resp.coords.longitude)
      }

     }).catch((error) => {
       if(error) {
        this.getLocationLoaderOff()
        this.locationErrorAlert(error.message)
       }
       console.log('Error getting location', error)
     });
  }

  async markEmployeeLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    });
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)    
  }
  
  async markEmployeeLoaderOff() {
    this.loadingElement.dismiss()
  }

  async markEmployeeResponseAlert(responseMsg) {
    const alert = await this.alertController.create({
      message: responseMsg,
      buttons: ['De acuerdo']
    });

    await alert.present()
  }  
  
  async badRequestAlert() {
    const alert = await this.alertController.create({
      message: 'Error de servicio',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }  
  
  // mock location function

  async mockLocationErrorAlert() {
    const alert = await this.alertController.create({
      message: 'Dispositivo de uso de ubicación simulada por favor desactivado',
      buttons: ['De acuerdo']
    });

    await alert.present()
  } 
  
  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      // the accuracy option will be ignored by iOS
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => { 
          console.log('Request successful')
          this.getLatLongMobile()
          this.buttonDisabled = true
          this.getLocationLoaderOn()           
        },error => {
          this.locationErrorAlert(error)
        }
      );
    
    });    
  }
  
  getLatLongMobile() {
    
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }

    this.geolocation.getCurrentPosition(option).then((resp) => {

      if(resp.coords) {
        console.log('getLatLongMobile resp.coords --', resp.coords)
        this.lat = resp.coords.latitude
        this.long = resp.coords.longitude        

        this.checkMockLocation()
      }

     }).catch((error) => {
      this.buttonDisabled = false
      this.getLocationLoaderOff()
       if(error) {
        this.locationErrorAlert(error.message)
       }
       console.log('Error getting location', error)
     });    
  }  

  checkMockLocation() {

    const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true,
            stopOnTerminate: true,
            postTemplate: null
    }

    this.backgroundGeolocation.configure(config)
    .then((location: BackgroundGeolocationResponse) => {

      console.log('location -', location)

      this.backgroundGeolocation.finish(); // FOR IOS ONLY

    })

    // start recording location
    this.backgroundGeolocation.start()
    
    this.backgroundGeolocation.stop()

    this.backgroundGeolocation.getLocations()
    .then((validgetLocationData) => {
      
      console.log('validgetLocationData --', validgetLocationData)
      
      if(validgetLocationData.length > 0) {

        this.validgetLocationDataArray = validgetLocationData[validgetLocationData.length - 1]

        this.mockLocationCheck()

      } else {
        this.getLatLongMobile()
      }
      
    })    

  }

  async offlineAlert() {
    const alert = await this.alertController.create({
      message: 'Tu marca es capturada',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }  

  mockLocationCheck() {

    this.localDate = new Date()

    this.localDate = this.localDate.getFullYear() + "-" + ('0' + (this.localDate.getMonth() + 1)).slice(-2) + "-" + ('0' + this.localDate.getDate()).slice(-2) + " " + this.localDate.getHours() + ":" + ('0' + this.localDate.getMinutes()).slice(-2) + ":" + ('0' + this.localDate.getSeconds()).slice(-2)    

    if(this.validgetLocationDataArray.isFromMockProvider) {
      this.buttonDisabled = false
      this.getLocationLoaderOff()
      this.deleteStoreLocation()
      this.mockLocationErrorAlert()      
    } else if(this.network.type == 'none') {
      this.buttonDisabled = false
      this.getLocationLoaderOff()
      this.deleteStoreLocation()
      this.storage.set('localLat', this.lat)
      this.storage.set('localLong', this.long)
      this.storage.set('localisBuffer', 'true')
      this.storage.set('localDate', this.localDate)
      this.offlineAlert()
    } else {
      this.buttonDisabled = false
      this.getLocationLoaderOff()
      this.deleteStoreLocation()
      this.markEmployee()
    }
  }

  markEmployee() {  
    
    this.markEmployeeLoaderOn()
    
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/MarkEmployee';

    let params = {
      "lat": this.lat,
      "lon": this.long,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": 'false',
      "date": this.localDate
    }

    this.data = this.http.post(url, params, this.header);

    this.data.subscribe((response) => {

      this.markEmployeeData = response.data

      this.markEmployeeLoaderOff()
      this.buttonDisabled = false

      if(response.status) {
        this.markEmployeeResponseAlert('Marca satisfactoria')
        this.buttonDisabled = false      
        
        let options: NativeTransitionOptions = {
          duration: 800
        }
      
        this.nativePageTransitions.fade(options);
        this.navController.navigateRoot(['members', 'mymark'])

      } else {
        this.markEmployeeResponseAlert(response.Message)
        this.buttonDisabled = false
      }        
    }, (err) => {
      this.markEmployeeLoaderOff()
      this.badRequestAlert()
      this.buttonDisabled = false
    });
  }  

  showLocalLatLong() {
    console.log('showLocalLatLong --')
    this.storage.get('localLat').then((val) => {
      console.log('localLat', val)
      if(val != null && val != undefined) {
        this.localLat = val
      }
    })

    this.storage.get('localLong').then((val) => {
      console.log('localLong', val)
      if(val != null && val != undefined) {
        this.localLong = val
      }
    })
    
    this.storage.get('localisBuffer').then((val) => {
      console.log('localisBuffer', val)
    })
    
    this.storage.get('localDate').then((val) => {
      console.log('localDate', val)
    })    
  }

  removeLocalLatLong() {
    console.log('removeLocalLatLong --')
    this.storage.remove('localLat').then(() => {      
    })    
  }

  deleteStoreLocation() {
    this.backgroundGeolocation.deleteAllLocations()
    .then((deleteAllLocationsData) => {
        console.log('deleteAllLocationsData --', deleteAllLocationsData)
    })    
  }  

  getCurrentLocationWeb() {
    this.getLocationLoaderOn()
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option).then((resp) => {
    
      this.getLocationLoaderOff()

      if(resp.coords) {        
        
        console.log('resp --', resp)
        // resp.coords.latitude
        // resp.coords.longitude
        this.locationData = 'Lat: ' + resp.coords.latitude + '<br>' + 'Long: ' + resp.coords.longitude
      }

     }).catch((error) => {
       if(error) {
        this.getLocationLoaderOff()
        this.locationErrorAlert(error.message)
       }
       console.log('Error getting location', error)
     });
  }

  testParams() {

    this.localDate = new Date()

    this.localDate = this.localDate.getFullYear() + "-" + ('0' + (this.localDate.getMonth() + 1)).slice(-2) + "-" + ('0' + this.localDate.getDate()).slice(-2) + " " + this.localDate.getHours() + ":" + ('0' + this.localDate.getMinutes()).slice(-2) + ":" + ('0' + this.localDate.getSeconds()).slice(-2)
    
    if(this.network.type == 'none') {
      this.localisBuffer = false
    } else {
      this.localisBuffer = true
    }

    let params = {
      "lat": this.lat,
      "lon": this.long,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": this.localisBuffer,
      "date": this.localDate
    }
    
    console.log('this.network.type --', this.network.type)
    console.log('testparams params --', params)
  }

}
