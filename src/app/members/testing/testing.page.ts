import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { HttpClient } from '@angular/common/http';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.page.html',
  styleUrls: ['./testing.page.scss'],
})
export class TestingPage implements OnInit {

  header: any = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    }
  }

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

  buttonDisabled: boolean = false

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    private geolocation: Geolocation,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private locationAccuracy: LocationAccuracy,
    public http: HttpClient,
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

    let options: NativeTransitionOptions = {
      duration: 800
     }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casino'])
  }

  async getLocationLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 4000)
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

  enableLocation() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          this.getCurrentLocation()
        },error => {
          this.locationErrorAlert(error)
        }
      )

    })
  }

  getCurrentLocation() {
    this.buttonDisabled = true
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }

    this.geolocation.getCurrentPosition(option).then((resp) => {

      this.buttonDisabled = false

      if(resp.coords) {
        this.lat = resp.coords.latitude
        this.long = resp.coords.longitude
        //this.markEmployee()
      }

     }).catch((error) => {
        this.buttonDisabled = false
        if(error) {
          this.locationErrorAlert(error.message)
        }
     })
  }

  async markEmployeeLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
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

  markEmployee() {
    this.markEmployeeLoaderOn()

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/MarkEmployee';

    let params = {
      "lat": this.lat,
      "lon": this.long,
      "employeeId": this.employeeId,
      "imei": this.deviceId
    }

    /*let params = {
      "lat": "-33.440385672239167",
      "lon": "-70.628768827242709",
      "employeeId": "0hwNYXS3pfjU/aZQee/xUw=="
    }*/

    this.data = this.http.post(url, params, this.header);

    this.data.subscribe((response) => {

      this.markEmployeeData = response.data

      this.markEmployeeLoaderOff()

      this.buttonDisabled = false

      if(response.status) {
        this.markEmployeeResponseAlert('Marca satisfactoria')
        this.buttonDisabled = false
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

  getCurrentLocationWeb() {
    this.getLocationLoaderOn()
    let option = {
      timeout: 30000,
      enableHighAccuracy: true
    }
    this.geolocation.getCurrentPosition(option).then((resp) => {

      this.getLocationLoaderOff()

      if(resp.coords) {

        // resp.coords.latitude
        // resp.coords.longitude
        this.locationData = 'Lat: ' + resp.coords.latitude + '<br>' + 'Long: ' + resp.coords.longitude
      }

     }).catch((error) => {
       if(error) {
        this.getLocationLoaderOff()
        this.locationErrorAlert(error.message)
       }
     });
  }

  checkInternetConnection() {


    if(this.network.type == 'none') {
    //   console.log('local storage save to database')
    } else {
    //   console.log('not save local storage')
    }

  }

}
