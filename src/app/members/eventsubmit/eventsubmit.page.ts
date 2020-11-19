import {
	Component,
	OnInit,
	ViewChild
} from '@angular/core';
import { Storage } from '@ionic/storage';
import {
	LoadingController,
	NavController,
	IonSelect,
	IonDatetime,
	IonTextarea,
	IonButton
} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Module } from '../../interfaces/interfaces';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FunctionsService } from '../../services/functions.service';
import { EventSubmitService } from '../../services/event-submit.service';





@Component({
  selector: 'app-eventsubmit',
  templateUrl: './eventsubmit.page.html',
  styleUrls: ['./eventsubmit.page.scss'],
})
export class EventsubmitPage implements OnInit {
	//@ViewChild('buttonConfig') button:IonSelectOption;
	@ViewChild('SelectOptionEvents') selectEvents: IonSelect;
	@ViewChild('SelectDateStart') selectDateStart: IonDatetime;
	@ViewChild('SelectDateEnd') selectDateEnd: IonDatetime;
	@ViewChild('textAreaDetail') textAreaDetail: IonTextarea;
	@ViewChild('buttonSendEvent') buttonEventSend: IonButton;

	userLoginResDetail: string = 'userLoginResDetail';
	currentVal=2;
	submit_event: string = 'assets/img/menu/submit_event.png';
	employeeId: any;
	liveUserCode: any;
	deviceId: any;
	date_select_form: string;
	eventsType: any;
	date_event_start:any;
	date_event_end:any;



	constructor(
		private nativePageTransitions: NativePageTransitions,
		private navController:NavController,
		private authService:AuthenticationService,
		private storage: Storage,
		private _functionService:FunctionsService,
		public http: HttpClient,
		private _events:EventSubmitService,
		private LoadingController:LoadingController
		) {


		 }
		 ngOnInit(){
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
				//this.EmployeeScheduleList()
				this.getEvents();
				}
			})
		}




  getEvents(){
	  this.http.get('https://'+this.liveUserCode+'.izytimecontrol.com/autoconsulta/GetEvents', {headers:{'Content-Type':'application/json'}})
	  .pipe(
		catchError(
			error=>of(408)
		)
	  ).subscribe(
		  (respuestaEventos:Module)=>{
			  if(respuestaEventos){
				this.eventsType=respuestaEventos;
			  }
		  },
		  (erro)=>{
			  this._functionService.MessageToast("Problemas, intente mas tarde", 'bottom', 2000)
		  }).closed;
  }

  validate_date_start(ev){

			var date_now=this.date_format('','min');
			var date_select_form=this.date_format(ev.detail.value,'min');
			var max_date_select_form=this.date_format(ev.detail.value,'max');

			if(date_select_form >= date_now){
				this.selectDateEnd.disabled=false;
				this.selectDateEnd.doneText="Seleccionar";
				this.selectDateEnd.cancelText="Cancelar";
				this.selectDateEnd.min=date_select_form;
				this.selectDateEnd.max=max_date_select_form
			}

  }
  validate_date_end(event){
		var date_selected_year_start=this.date_format(this.selectDateStart.value, 'min');
		var date_select_form_end=this.date_format(event.detail.value, 'min');
	  		if(date_select_form_end>=date_selected_year_start){
				this.textAreaDetail.disabled=false;
		  	}else{
				this.textAreaDetail.disabled=true;
				this.textAreaDetail.value='';
			}
		this.date_event_start=date_selected_year_start;
		this.date_event_end=date_select_form_end;
  }


  validate_select(){
	  if(this.selectEvents.value!=''){
		this.selectDateStart.disabled=false;
		if(this.selectDateStart.disabled==false){
			this.selectDateStart.doneText="Seleccionar";
			this.selectDateStart.cancelText="Cancelar";
			/**MAX DATE */
			var max_date=this.date_format('','max');
			/** MIN DATE */
			var min_date=this.date_format('','min');
			this.selectDateStart.min=min_date;
			this.selectDateStart.max=max_date;
		}
	  }

  }

  date_format(val?, type?){
		if(val==''){
			var date_now_max=new Date();
			var nday_now=(date_now_max.getDate()<10)?'0'+date_now_max.getDate():date_now_max.getDate();
			var nmonth_now=((date_now_max.getMonth()+1) < 10)?'0'+(date_now_max.getMonth()+1):date_now_max.getMonth()+1;
			var nyear_now;
			if(type=='max'){
				nyear_now=date_now_max.getFullYear()+2;
			}else if(type=='min'){
				nyear_now=date_now_max.getFullYear();
			}
			var max_date=nyear_now+"-"+nmonth_now+"-"+nday_now;
			return max_date;
		}else if(val!=''){
			var date_validate=new Date(val);
			var day_dv=(date_validate.getDate()<10)?'0'+date_validate.getDate():date_validate.getDate();
			var month_dv=((date_validate.getMonth()+1) < 10)?'0'+(date_validate.getMonth()+1):date_validate.getMonth()+1;
			var year_dv;
			if(type=='max'){
				year_dv=date_validate.getFullYear()+2;
			}else if(type=='min'){
				year_dv=date_validate.getFullYear();
			}
			var date_select_form=year_dv+"-"+month_dv+"-"+day_dv;
			return date_select_form;
		}
  }

  validate_textarea(eventoTextArea){
		this.textAreaDetail.maxlength=500;
		if(this.textAreaDetail.value==''){
			this.buttonEventSend.disabled=true;
		}else{
			this.buttonEventSend.disabled=false;
		}
  }

  async send_event_request(){
	  let ElementLoading= await this.LoadingController.create({
		message: 'Ingresando solicitud...',
		spinner: 'crescent',
		cssClass:'transparent'
	  });
	  ElementLoading.present();
	  let url="https://"+this.liveUserCode+".izytimecontrol.com/autoconsulta/saveEvent";
	  let params={
		EmployeeId: this.employeeId,
		EventConfigId: this.selectEvents.value,
		From: this.date_event_start+"T03:00:00.000Z",
		To: this.date_event_end+"T03:00:00.000Z",
		Description: this.textAreaDetail.value
	  }
	  this._events.sumbitEvent(url, params)
	  .then((response)=>{
		switch(response['status']){
			case '200':
				ElementLoading.dismiss();
				this._functionService.MessageToast('Evento ingresado con exito', 'middle', 1500);
				setTimeout(()=>{
					this.dashboardGo()}, 2000)
				break;
			case '0':
				ElementLoading.dismiss();
				this._functionService.MessageToast('Error de conexion intente mas tarde', 'middle', 1500);
				setTimeout(()=>{
					this.dashboardGo()}, 2000)
				break;
			case '473':
				ElementLoading.dismiss();
				this._functionService.MessageToast('Existe evento para rango de fechas seleccionadas', 'middle', 1500);
				break;
		}
	  })

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
