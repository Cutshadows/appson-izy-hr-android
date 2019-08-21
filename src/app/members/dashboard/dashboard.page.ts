import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

import { HttpClient } from '@angular/common/http';

import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }    

  userInfoItems: any
  data: Observable<any>

  userLoginResDetail: string = 'userLoginResDetail'

  localLat: any
  localLong: any

  employeeId: any
  liveUserCode: any
  deviceId: any

  markEmployeeData: any

  loadingElement: any  

  localisBuffer: any
  localDate: any
  
  my_calendar_menu: string = 'assets/img/menu/my_calendar_menu.png'
  my_events_menu: string = 'assets/img/menu/my_events_menu.png'
  my_marks_menu: string = 'assets/img/menu/my_marks_menu.png'
  my_profile_menu: string = 'assets/img/menu/my_profile_menu.png'
  casino_menu: string = 'assets/img/menu/casino_menu.png'
  enter_mark_menu: string = 'assets/img/menu/enter_mark_menu.png'

  constructor(
    private authService: AuthenticationService, 
    private storage: Storage,
    public toastController: ToastController,
    public navController: NavController,
    //public navParams: NavParams,
    private nativePageTransitions: NativePageTransitions,
    private network: Network,
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController    
    ) { 

  }

  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.userInfoItems = val
        // console.log('this.userInfoItems --', this.userInfoItems)
      }
    })

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
    
    this.storage.get('localLat').then((val) => {
      if(val != null && val != undefined) {
        this.localLat = val
      }
    })

    this.storage.get('localisBuffer').then((val) => {
      if(val != null && val != undefined) {
        this.localisBuffer = val
      }
    })
    
    this.storage.get('localDate').then((val) => {
      if(val != null && val != undefined) {
        this.localDate = val
      }
    })    

    this.storage.get('localLong').then((val) => {

      if(val != null && val != undefined) {
        this.localLong = val
    
        if(this.network.type != 'none') {
          
          if(this.localLat != null && this.localLat != undefined && this.localLong != null && this.localLong != undefined) {
            this.markEmployee()
          }
        }         
      }
    })
       
  }

  getData() {
    //console.log('Testing data transfer --', this.navParams.get('title'))    
    console.log('Testing data transfer --')
  }

  async signOutToast() {
    const toast = await this.toastController.create({
      message: 'You are now signed out',
      position: 'middle',
      duration: 2500
    })
    toast.present()
  }  

  entermarkGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'entermark'])
  }

  profileGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'profile'])
  }

  logout() {
    this.authService.logout()
  }

  calendarGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'calendar'])
  }

  testingGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'testing'])
  }

  mymarkGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'mymark'])
  }

  markEmployee() {   
    this.markEmployeeLoaderOn()
    
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/MarkEmployee';

    let params = {
      "lat": this.localLat,
      "lon": this.localLong,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": this.localisBuffer,
      "date": this.localDate      
    }

    this.data = this.http.post(url, params, this.header);

    this.data.subscribe((response) => {      

      this.markEmployeeLoaderOff()

      if(response.status) {
        this.markEmployeeResponseAlert('Marca satisfactoria')
        this.removeLocalLatLong()
      } else {
        this.markEmployeeResponseAlert(response.Message)
        this.removeLocalLatLong()
      }        
    }, (err) => {
      this.markEmployeeLoaderOff()
      this.badRequestAlert()
    });
  }  

  async markEmployeeLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espere servicio de marca...',
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

  removeLocalLatLong() {
    this.storage.remove('localLat').then(() => {      
    })
    
    this.storage.remove('localLong').then(() => {      
    })
    
    this.storage.remove('localisBuffer').then(() => {      
    })
    
    this.storage.remove('localDate').then(() => {      
    })    
  }
  
  myeventsGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'events'])
  }
  
  casinoGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casino'])    
  }

}
