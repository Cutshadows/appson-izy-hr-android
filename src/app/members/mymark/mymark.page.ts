import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-mymark',
  templateUrl: './mymark.page.html',
  styleUrls: ['./mymark.page.scss'],
})
export class MymarkPage implements OnInit {

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
        this.employeeMarkService()
      }
    })
    
    //this.dummyData()
  }

  dummyData() {
    this.employeeMarkItems = [
      {
        "BranchName": "TRANSLOGIC",
        "Date": "29-01-2019",
        "EntryDate": "09:51",
        "GoOutForLunch": "13:37",
        "ArriveFromLunch": "14:02",
        "ExitDate": "19:55"
      },
      {
        "BranchName": "TRANSLOGIC",
        "Date": "30-01-2019",
        "EntryDate": "09:49",
        "GoOutForLunch": "13:41",
        "ArriveFromLunch": "14:06",
        "ExitDate": "19:14"
      },
      {
        "BranchName": "TRANSLOGIC",
        "Date": "31-01-2019",
        "EntryDate": "09:42",
        "GoOutForLunch": "13:37",
        "ArriveFromLunch": "15:01",
        "ExitDate": "19:47"
      }  
    ]

    this.employeeMarkLeftRight = this.employeeMarkItems[0]

    if(this.employeeMarkItems.length > 1) {
      this.rightCount = this.employeeMarkItems.length - 1
    } else {
      this.rightCount = 0
      this.leftCount = 0
    }    
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
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)    
  }
  
  async employeeMarkServiceLoaderOff() {
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

  employeeMarkService() {
    this.employeeMarkServiceLoaderOn()
    
    //let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeMarks'

    /*let url = 'https://dimercqa.izytimecontrol.com/api/external/EmployeeMarks'
    
    let employeeId = "sgV8tUf7wmezDF7PZnF8oQ=="
    let imei = "01dfbf8c-0afb-2fdd-f356-060071893881"*/

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeMarks'
    
    let employeeId = this.employeeId
    let imei = this.deviceId

    this.data = this.http.get(url+'?employeeId='+employeeId+'&imei='+imei, this.header)

    this.data.subscribe((response) => {

      this.employeeMarkServiceLoaderOff()

      this.employeeMarkItems = response

      if(this.employeeMarkItems.length == 0) {
        this.noDataToast()
      }

      this.employeeMarkLeftRight = this.employeeMarkItems[0]

      if(this.employeeMarkItems.length > 1) {
        this.rightCount = this.employeeMarkItems.length - 1
      } else {
        this.rightCount = 0
        this.leftCount = 0
      }      
    }, (err) => {
      this.employeeMarkServiceLoaderOff()
      this.badRequestAlert()
    })    
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
