import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  userLoginResDetail: string = 'userLoginResDetail'
  currentVal=2;
  employeeId: any
  liveUserCode: any   

  data: Observable<any>
  
  loadingElement: any

  deviceId: any
  
  getEventsItems: any

  my_events_page: string = 'assets/img/page/my_events_page.png'
  my_marks_info: string = 'assets/img/my_marks_info.png'
  my_marks_tic: string = 'assets/img/my_marks_tic.png'

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public http: HttpClient,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions    
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
        this.getEventsService()
      }
    })
    
    //this.dummyData()
  }

  dummyData() {
    this.getEventsItems = [
      {
        "Id": 12,
        "From": "2019-01-16T03:00:00",
        "To": "2019-01-17T03:00:00",
        "TypeEvent": "Dia del churrasco",
        "Description": "asdfsdfasdfasdf",
        "FullName": "TEST 2 APE",
        "Branch": "IZYTECH DEMO 1 GPS",
        "CanDeleteByEmployee": false,
        "EventRequestStatus": 1,
        "GlosaApproved": "",
        "InsertBy": 0
      },
      {
        "Id": 13,
        "From": "2019-01-19T03:00:00",
        "To": "2019-01-20T03:00:00",
        "TypeEvent": "Dia del churrasco 2",
        "Description": "asdfsdfasdfasdf 2",
        "FullName": "TEST 3 APE",
        "Branch": "IZYTECH DEMO 2 GPS",
        "CanDeleteByEmployee": false,
        "EventRequestStatus": 1,
        "GlosaApproved": "",
        "InsertBy": 0
      }                  
    ]
  }
  
  getEventsService() {
    this.eventsServiceLoaderOn()

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/GetEvents'
    
    let employeeId = this.employeeId
    let imei = this.deviceId

    this.data = this.http.get(url+'?employeeId='+employeeId+'&imei='+imei, this.header)

    this.data.subscribe((response) => {

      this.eventsServiceLoaderOff()

      this.getEventsItems = response

      console.log('this.getEventsItems --', this.getEventsItems)

      if(this.getEventsItems.length == 0) {
        this.noDataToast()
      }
    
    }, (err) => {
      this.eventsServiceLoaderOff()
      this.badRequestAlert()
    })    
  }
  
  async eventsServiceLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)    
  }
  
  async eventsServiceLoaderOff() {
    this.loadingElement.dismiss()
  }
  
  async badRequestAlert() {
    const alert = await this.alertController.create({
      message: 'Error de servicio',
      buttons: ['De acuerdo']
    })

    await alert.present()
  }  

  async noDataToast() {
    const toast = await this.toastController.create({
      message: 'Datos no encontrados',
      position: 'middle',
      duration: 2000
    })
    
    toast.present()
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

}
