import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FunctionsService } from '../../services/functions.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  userLoginResDetail: string = 'userLoginResDetail'
  currentVal=2;
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
    private nativePageTransitions: NativePageTransitions,
    private _function:FunctionsService,
    private _socketService:DatabaseService
  ) {   }

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

  }

  EmployeeScheduleListDummy() {

    this.allMonthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    let currentDate = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.currentday = weekdays[currentDate.getDay()];
    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[0];

    this.testDateRange = '08/04/2019 - 14/04/2019';

    this.testDateRangeSplit = this.testDateRange.split(' - ');

    this.dateTestFrom = '17/04/2019';
    this.dateTestTo = '20/04/2019';
    this.dateConvertFrom = this.testDateRangeSplit[0].split('/');
    this.dateConvertTo = this.testDateRangeSplit[1].split('/');
    if(this.employeeScheduleListDatas.length > 1) {
      this.rightCount = this.employeeScheduleListDatas.length - 1;
    } else {
      this.rightCount = 0;
      this.leftCount = 0;
    }

  }
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
     }
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard']);
  }

  logout() {
    this.authService.logout();
  }
  badRequestAlert() {
	  this._function.requireAlert('Error de servicio','De acuerdo');
  }

  noDataToast() {
    this._function.MessageToast('Horario no cargado, contactar al administrador','middle',4000);
  }
  badRequestTimeoutAlert() {
    this._function.requireAlert('Tiempo de Respuesta Agotado','De acuerdo');
  }
  async EmployeeScheduleList() {
    this.allMonthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let loadingMessage = await this.toastController.create({
      message: 'Cargando Información ...',
	  cssClass:'my-custom-toast',
	  position:'bottom'
    });
    loadingMessage.present();
    let currentDate = new Date();
    let weekdays = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
    this.currentday = weekdays[currentDate.getDay()];
    let employeeId = this.employeeId;
    let imei = this.deviceId;
	let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/EmployeeSchedule?employeeId='+employeeId+'&imei='+imei;

   this._socketService.serviceEmployeeScheduleList(url).then((response)=>{
      switch(response['status']){
        case '200':
            this.employeeScheduleListDatas = response['response'];
            loadingMessage.dismiss();
            this.employeeScheduleLeftRight = this.employeeScheduleListDatas[0];
            // show date range start
            this.testDateRange = this.employeeScheduleLeftRight.DateRange
            this.testDateRangeSplit = this.testDateRange.split(' - ')
            this.dateConvertFrom = this.testDateRangeSplit[0].split('/')
            this.dateConvertTo = this.testDateRangeSplit[1].split('/')
            // show date range end
            if(this.employeeScheduleListDatas.length > 1) {
              this.rightCount = this.employeeScheduleListDatas.length - 1;
            } else {
              this.rightCount = 0
              this.leftCount = 0
            }
        break;
		case '400':
            loadingMessage.dismiss();
			this.noDataToast();
			setTimeout(()=>{
				this.dashboardGo();
			}, 6000);
		break;
		case '408':
		  loadingMessage.dismiss();
		  this.badRequestTimeoutAlert();
		  setTimeout(()=>{
			this.dashboardGo();
		}, 11000);
		break;
        case '0':
            loadingMessage.dismiss();
            this.badRequestAlert();
          break;

      }
    })
  }

  leftSchedule() {
    this.increaseValue = this.increaseValue - 1;
    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[this.increaseValue];
    // show date range start
    this.testDateRange = this.employeeScheduleLeftRight.DateRange;

    this.testDateRangeSplit = this.testDateRange.split(' - ');

    this.dateConvertFrom = this.testDateRangeSplit[0].split('/');
    this.dateConvertTo = this.testDateRangeSplit[1].split('/') ;
    // show date range end

    this.leftCount = this.leftCount - 1;

    this.rightCount = this.rightCount + 1;
  }

  rightSchedule() {
    this.increaseValue = this.increaseValue + 1;

    this.employeeScheduleLeftRight = this.employeeScheduleListDatas[this.increaseValue];

    // show date range start
    this.testDateRange = this.employeeScheduleLeftRight.DateRange;

    this.testDateRangeSplit = this.testDateRange.split(' - ');

    this.dateConvertFrom = this.testDateRangeSplit[0].split('/');
    this.dateConvertTo = this.testDateRangeSplit[1].split('/');
    // show date range end

    this.rightCount = this.rightCount - 1;

    this.leftCount = this.leftCount + 1;
  }

}
