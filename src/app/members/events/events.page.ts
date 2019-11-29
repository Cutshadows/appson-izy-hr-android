import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FunctionsService } from 'src/app/services/functions.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

 /*  header: any = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    }
  }   */

  userLoginResDetail: string = 'userLoginResDetail'
  currentVal=2;
  employeeId: any
  liveUserCode: any
  data: Observable<any>
  loadingElement: any
  deviceId: any
  getEventsItems: any
  EventStatus:any;
  my_events_page: string = 'assets/img/page/my_events_page.png'
  my_marks_info: string = 'assets/img/my_marks_info.png'
  my_marks_tic: string = 'assets/img/my_marks_tic.png'
  imgStatus:string;
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
        this.employeeId = val['EmployeeId'];
      }
    });
    this.storage.get('liveUserCode').then((val) => {
      if(val != null && val != undefined) {
        this.liveUserCode = val;
      }
    });
    this.storage.get('deviceIdLocalStorage').then((val) => {
      if(val != null && val != undefined) {
        this.deviceId = val;
        this.getEventsService();
      }
    });
  }
  /* dummyData() {
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
  } */
  async getEventsService() {
  let LoadingEvents = await this.toastController.create({
    	message: 'Cargando Eventos...',
		position:'bottom',
	    //spinner: 'crescent',
        cssClass:'my-custom-toast'
    });
    LoadingEvents.present();
    let employeeId = this.employeeId;
    let imei = this.deviceId;
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/GetEvents?employeeId='+employeeId+'&imei='+imei;
	this._socketService.serviceViewEvents(url)
	.then((response)=>{
      switch(response['status']){
        case '200':
            LoadingEvents.dismiss();
			this.getEventsItems = response['response'];
          break;
        case '400':
            LoadingEvents.dismiss();
			this.noDataToast();
			setTimeout(()=>{
				this.dashboardGo();
			}, 6000);
		  break;
		case '408':
            LoadingEvents.dismiss();
            this.badRequestTimeoutAlert();
        break;
        case '0':
            LoadingEvents.dismiss();
            this.badRequestAlert();
          break;
      }
    })
  }
  validarImagen(stateEvents){
		switch(stateEvents){
			case 0:
				this.imgStatus=this.my_marks_info;
			break;
			case 1:
				this.imgStatus=this.my_marks_tic;
			break;
			case 2:
				this.imgStatus=this.my_events_page;
			break;
			case 3:
				this.imgStatus=this.my_events_page;
			break;
		}
		return this.imgStatus;
  }
  badRequestAlert() {
    this._function.requireAlert('Error de servicio','De acuerdo');
  }

  noDataToast() {
    this._function.MessageToast('No hay información de eventos','bottom',2000);
  }
  badRequestTimeoutAlert() {
    this._function.requireAlert('Tiempo de Respuesta Agotado','De acuerdo');
  }
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
     }
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }
  logout() {
    this.authService.logout();
  }

}
