import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ToastController, NavController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network/ngx';
import { DatabaseService } from '../../services/database.service';
import { FunctionsService } from '../../services/functions.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
 currentVal=1;
  header: any = {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    }
  }
  userInfoItems: any;
  data: Observable<any>;
  userLoginResDetail: string = 'userLoginResDetail';
  localLat: any;
  localLong: any;
  employeeId: any;
  liveUserCode: any;
  deviceId: any;
  markEmployeeData: any;
  loadingElement: any;
  localisBuffer: any;
  localDate: any;
  my_calendar_menu: string = 'assets/img/menu/my_calendar_menu.png';
  my_events_menu: string = 'assets/img/menu/my_events_menu.png';
  my_marks_menu: string = 'assets/img/menu/my_marks_menu.png';
  my_profile_menu: string = 'assets/img/menu/my_profile_menu.png';
  casino_menu: string = 'assets/img/menu/casino_menu.png';
  enter_mark_menu: string = 'assets/img/menu/enter_mark_menu.png';
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
	public loadingController: LoadingController,
	private __serviceData:DatabaseService,
	private __function:FunctionsService
    ) { }
  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.userInfoItems = val;
      }
    });
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
		    this.employeeId = val['EmployeeId'];
      }
    })

    this.storage.get('liveUserCode').then((val) => {
      if(val != null && val != undefined) {
		this.liveUserCode = val;
      }
    })
    this.storage.get('deviceIdLocalStorage').then((val) => {
		if(val != null && val != undefined) {
			this.deviceId = val;
      	}
    })
    this.storage.get('localLat').then((val) => {
      if(val != null && val != undefined) {
		this.localLat = val;
      }
    })
    this.storage.get('localisBuffer').then((val) => {
      if(val != null && val != undefined) {
		this.localisBuffer = val;
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
            this.markEmployee();
          }
        }
      }
    });
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
    this.navController.navigateRoot(['members', 'profile']);
  }
  logout() {
    this.authService.logout();
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
  async markEmployee() {
	let cargandoMarca=await this.loadingController.create({
		message:'Procesando marca pendiente...',
		spinner:'crescent',
		cssClass:'transparent'
	});
	cargandoMarca.present();
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/MarkEmployee';
    let params = {
      "lat": this.localLat,
      "lon": this.localLong,
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "isBuffer": this.localisBuffer,
      "date": this.localDate
	}
	this.__serviceData.markEmployee(url, params).then((responseMarkPending)=>{
		switch(responseMarkPending['status']){
			case '200':
					cargandoMarca.dismiss();
					this.markEmployeeResponseAlert('Marca satisfactoria');
					this.removeLocalLatLong();
				break;
			case '0':
					cargandoMarca.dismiss();
					this.markEmployeeResponseAlert(responseMarkPending['Message']);
					this.removeLocalLatLong();
				break;
			case '400':
					cargandoMarca.dismiss();
					this.badRequestAlert();
				break;
			case '408':
					cargandoMarca.dismiss();
					this.__function.requireAlert('Tiempo agotado para la respuesta','De acuerdo');
				break;
			}
	})
  }

  async markEmployeeLoaderOff() {
    this.loadingElement.dismiss();
  }
  async markEmployeeResponseAlert(responseMsg) {
   this.__function.requireAlert(responseMsg, 'De acuerdo');
  }
  async badRequestAlert() {
  	this.__function.requireAlert('Error de servicio', 'De acuerdo');
  }
  removeLocalLatLong() {
    this.storage.remove('localLat').then(() => {});
    this.storage.remove('localLong').then(() => {});
    this.storage.remove('localisBuffer').then(() => {});
    this.storage.remove('localDate').then(() => {});
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
