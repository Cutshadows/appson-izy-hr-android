import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  userLoginResDetail: string = 'userLoginResDetail'

  employeeId: any
  liveUserCode: any   

  data: Observable<any>

  loadingElement: any

  deviceId: any

  employeeScheduleListDatas: any

  employeeScheduleLeftRight: any

  increaseValue: number = 0

  leftCount: number = 0
  rightCount: number = 0

  currentday: string

  my_calendar_page: string = 'assets/img/page/my_calendar_page.png'

  dateTestFrom: any
  dateTestTo: any

  dateConvertFrom: any
  dateConvertTo: any

  allMonthName: any

  testDateRange: any

  testDateRangeSplit: any

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
        this.EmployeeScheduleList()
      }
    })    

    //this.EmployeeScheduleListDummy()
  }

  EmployeeScheduleListDummy() {

    // this.allMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    this.allMonthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']    

    let currentDate = new Date()
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    this.currentday = weekdays[currentDate.getDay()]
    
    console.log('this.currentday --', this.currentday)

    this.employeeScheduleListDatas = [
      {
          "WeekNumber": 9,
          "DateRange": "25/02/2019 - 03/03/2019",
          "DateFrom": "25/04/2019",
          "DateTo": "28/04/2019",
          "TotalHours": 45,
          "Days": [
              {
                  "Name": "Monday",
                  "Letter": "A",
                  "Hour": "08:00 | 18:00"
              },
              {
                  "Name": "Tuesday",
                  "Letter": "A",
                  "Hour": "08:00 | 18:00"
              },
              {
                  "Name": "Wednesday",
                  "Letter": "A",
                  "Hour": "08:00 | 18:00"
              },
              {
                  "Name": "Thursday",
                  "Letter": "A",
                  "Hour": "08:00 | 18:00"
              },
              {
                  "Name": "Friday",
                  "Letter": "A",
                  "Hour": "08:00 | 18:00"
              },
              {
                  "Name": "Saturday",
                  "Letter": "L",
                  "Hour": "00:00 | 00:00"
              },
              {
                  "Name": "Sunday",
                  "Letter": "L",
                  "Hour": "00:00 | 00:00"
              }
          ]
      },
    //   {
    //     "WeekNumber": 10,
    //     "DateRange": "25/02/2019 - 03/03/2019",
    //     "DateFrom": "12/04/2019",
    //     "DateTo": "20/04/2019",        
    //     "TotalHours": 45,
    //     "Days": [
    //         {
    //             "Name": "Monday",
    //             "Letter": "A",
    //             "Hour": "08:00 | 18:00"
    //         },
    //         {
    //             "Name": "Tuesday",
    //             "Letter": "A",
    //             "Hour": "08:00 | 18:00"
    //         },
    //         {
    //             "Name": "Wednesday",
    //             "Letter": "A",
    //             "Hour": "08:00 | 18:00"
    //         },
    //         {
    //             "Name": "Thursday",
    //             "Letter": "A",
    //             "Hour": "08:00 | 18:00"
    //         },
    //         {
    //             "Name": "Friday",
    //             "Letter": "A",
    //             "Hour": "08:00 | 18:00"
    //         },
    //         {
    //             "Name": "Saturday",
    //             "Letter": "L",
    //             "Hour": "00:00 | 00:00"
    //         },
    //         {
    //             "Name": "Sunday",
    //             "Letter": "L",
    //             "Hour": "00:00 | 00:00"
    //         }
    //     ]
    // }      
      
    ]

    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[0]

    this.testDateRange = '08/04/2019 - 14/04/2019'

    this.testDateRangeSplit = this.testDateRange.split(' - ')

    this.dateTestFrom = '17/04/2019'
    this.dateTestTo = '20/04/2019'

    // this.dateConvertFrom = this.dateTestFrom.split('/')
    // this.dateConvertTo = this.dateTestTo.split('/')

    this.dateConvertFrom = this.testDateRangeSplit[0].split('/')
    this.dateConvertTo = this.testDateRangeSplit[1].split('/')

    //console.log('this.dateConvertFrom --', this.dateConvertFrom)
    //console.log('this.dateConvertFrom --', this.dateConvertFrom)

    console.log('this.testDateRange --', this.testDateRange)
    console.log('this.testDateRangeSplit --', this.testDateRangeSplit)

    if(this.employeeScheduleListDatas.length > 1) {
      this.rightCount = this.employeeScheduleListDatas.length - 1
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

  async employeeScheduleLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)    
  }
  
  async employeeScheduleLoaderOff() {
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

  EmployeeScheduleList() {

    this.allMonthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']    

    this.employeeScheduleLoaderOn()
    
    let currentDate = new Date()
    //let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let weekdays = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"]
    this.currentday = weekdays[currentDate.getDay()]
    
    //let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeSchedule'

    /*let url = 'https://demo.izytimecontrol.com/api/external/EmployeeSchedule'
    
    let employeeId = "0hwNYXS3pfjU/aZQee/xUw=="
    let imei = "01dfbf8c-0afb-2fdd-f356-060071893881"*/

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeSchedule'
    
    let employeeId = this.employeeId
    let imei = this.deviceId

    this.data = this.http.get(url+'?employeeId='+employeeId+'&imei='+imei, this.header)

    this.data.subscribe((response) => {

      this.employeeScheduleLoaderOff()

      this.employeeScheduleListDatas = response

      if(this.employeeScheduleListDatas.length == 0) {
        this.noDataToast()
      } else {
        this.employeeScheduleLeftRight = this.employeeScheduleListDatas[0]

        // show date range start
        this.testDateRange = this.employeeScheduleLeftRight.DateRange

        this.testDateRangeSplit = this.testDateRange.split(' - ')
    
        this.dateConvertFrom = this.testDateRangeSplit[0].split('/')
        this.dateConvertTo = this.testDateRangeSplit[1].split('/')        
        // show date range end
    
        if(this.employeeScheduleListDatas.length > 1) {
          this.rightCount = this.employeeScheduleListDatas.length - 1
        } else {
          this.rightCount = 0
          this.leftCount = 0
        }        
      }

      //console.log('this.employeeScheduleListDatas --', this.employeeScheduleListDatas)
    }, (err) => {
      this.employeeScheduleLoaderOff()
      this.badRequestAlert()
    })
  }
  
  leftSchedule() {    
    this.increaseValue = this.increaseValue - 1

    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[this.increaseValue]

    // show date range start
    this.testDateRange = this.employeeScheduleLeftRight.DateRange

    this.testDateRangeSplit = this.testDateRange.split(' - ')

    this.dateConvertFrom = this.testDateRangeSplit[0].split('/')
    this.dateConvertTo = this.testDateRangeSplit[1].split('/')        
    // show date range end    

    this.leftCount = this.leftCount - 1    

    this.rightCount = this.rightCount + 1        
  }

  rightSchedule() {
    this.increaseValue = this.increaseValue + 1
    
    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[this.increaseValue]

    // show date range start
    this.testDateRange = this.employeeScheduleLeftRight.DateRange

    this.testDateRangeSplit = this.testDateRange.split(' - ')

    this.dateConvertFrom = this.testDateRangeSplit[0].split('/')
    this.dateConvertTo = this.testDateRangeSplit[1].split('/')        
    // show date range end    
    
    this.rightCount = this.rightCount - 1

    this.leftCount = this.leftCount + 1
  }  

}
