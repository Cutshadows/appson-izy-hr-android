import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import {
	AlertController,
	LoadingController,
	ToastController,
	Platform
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { FunctionsService } from '../../services/functions.service';
import {DatabaseService} from '../../services/database.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Network } from '@ionic-native/network/ngx';
import {Device} from '@ionic-native/device/ngx';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: number;
  code: string;
  codeLowerCase: any;
  userLoginResDetail: string = 'userLoginResDetail';
  data: Observable<any>;
  loadingElement: any;
  logoUrl: string = 'assets/img/logo.png';
  storageData: any;
  codeArray: any = [];
  addNewCodeButton: boolean = false;
  userPreviousCode: any;
  deviceId: any;
  fcmToken:any;

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public platform: Platform,
    // private uniqueDeviceID: UniqueDeviceID,
    private _function:FunctionsService,
	private _services:DatabaseService,
	private fcm:FCM,
	private network: Network,
	private plt:Platform,
	private device:Device
    ) {  }
  ngOnInit() {
    this.storage.get('userCode').then((val) => {
      if(val != null && val != undefined) {
        for(let j = 0; j < val.length; j++) {
          this.codeArray.push(val[j])
        }
      }
    })
    this.storage.get('liveUserCode').then((val) => {
      if(val != null && val != undefined) {
        this.userPreviousCode = val
      }
    })
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.username = val['Rut']
      }
    })
    this.storage.get('deviceIdLocalStorage').then((val) => {
      if(val != null && val != undefined) {
        this.deviceId = val
      }
  })
  this.getFcmToken();
  }
  getFcmToken(){
    this.fcm.getToken().then(token => {
      	this.storage.set('deviceFcmToken', token);
      	this.fcmToken = token;
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      	this.storage.set('deviceFcmToken', token);
      	this.fcmToken = token;
    });
  }

  async loginWithCode() {
    if(this.code != undefined && this.code != '') {
      this.codeLowerCase = this.code.toLowerCase();
    }
    var keepGoing = true
    if(this.codeArray.length > 0) {
      for(let k = 0; k <= this.codeArray.length; k++) {
        if(keepGoing) {
          if(this.codeLowerCase == this.codeArray[k]) {
            keepGoing = false
          }
        }
      }
    }
    if(this.username == undefined || this.username == '') {
      this.requireAlert();
    } else if(this.password == undefined) {
      this.requireAlert();
    } else if(isNaN(this.password)) {
      this.passwordValid();
    } else if(this.code == undefined || this.code == '') {
      this.requireAlert();
    } else if(keepGoing == false) {
      this.alreadyExistCodeAlert();
    } else if(this.deviceId == undefined) {
      this.getDeviceId();
    }
    else {
		console.log(this.deviceId);
      // save code start
     this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent',
      cssClass: 'transparent'
    });
    this.loadingElement.present();
    var url = 'https://'+this.code+'.izytimecontrol.com/api/external/ValidateEmployee';
      let params = {
        "rut": this.username,
        "password": this.password,
		"imei":this.deviceId,
		"tokenFcm":this.fcmToken
	  }
        this._services.validateLogin(url, params).then(response=>{
        switch(response['status']){
          case '200':
            var responseData = response['response']['data'];
            this.storage.set(this.userLoginResDetail, responseData);
            this.codeArray.push(this.codeLowerCase);
            this.storage.set('userCode', this.codeArray);
            this.storage.set('liveUserCode', this.codeLowerCase);
            this.authService.login();
            this.resetInput();
            this.loadingElement.dismiss();
          break;
          case '400':
              this.loadingElement.dismiss();
              this.wrongInputAlert(response['response']['Message']);
          break;
          case '408':
              this.loadingElement.dismiss();
              this.badRequestTimeoutAlert();
          break;
          case '0':
              this.loadingElement.dismiss();
              this.badRequestAlert();
          break;
        }
      })
    }
  }

  async login() {
    if(this.username == undefined && this.password == undefined && this.code == undefined) {
      this.requireAlert()
    } else if(this.username == '') {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined || this.code == '') {
      this.requireAlert()
    }else {
      this.loadingElement = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        cssClass: 'transparent'
      });
      this.loadingElement.present();
      let url = 'https://demo.izytimecontrol.com/api/external/ValidateEmployee';
      let params = {
        rut: this.username,
		password: this.password,
		tokenId:this.fcmToken,
		emaiId:this.deviceId
      }
      this._services.validateLogin(url, params).then(response=>{
        switch(response['status']){
          case '200':
            var responseData = response['response']['data'];
            this.storage.set(this.userLoginResDetail, responseData);
            this.codeArray.push(this.codeLowerCase);
            this.storage.set('userCode', this.codeArray);
            this.storage.set('liveUserCode', this.codeLowerCase);
            this.authService.login();
            this.resetInput();
            this.loadingElement.dismiss();
          break;
          case '400':
              this.loadingElement.dismiss();
              this.wrongInputAlert(response['response']['Message']);
          break;
          case '0':
              this.loadingElement.dismiss();
              this.badRequestAlert();
          break;
        }
      })
    }
  }
  addNewCodeHideShow() {
    this.addNewCodeButton = !this.addNewCodeButton
    this.password = undefined
    this.code = undefined
  }
 async loginWithSelectCode() {

	if(this.username == undefined || this.username == '') {
      this.requireAlert()
    } else if(this.password == undefined) {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined || this.code == '') {
      this.requireAlert()
    } else if(this.deviceId == undefined) {
      this.getDeviceId()
    }else {
      this.loadingElement = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        cssClass: 'transparent',
      });
	  this.loadingElement.present();
	  if(this.network.type == 'none') {
		this.storage.get(this.userLoginResDetail).then((val) => {
			if(val != null && val != undefined) {
			  if(this.username == val['Rut'] ){
				setTimeout(()=>{
					this.loadingElement.dismiss();
					this.authService.login();
				}, 3000);
			  }
			}
		  })
	}else if(this.network.type!='none'){
      var url = 'https://'+this.code+'.izytimecontrol.com/api/external/ValidateEmployee';
      let params = {
        "rut": this.username,
        "password": this.password,
		"imei": this.deviceId,
		"tokenFcm":this.fcmToken
      }
      this._services.validateLogin(url, params).then(response=>{
        switch(response['status']){
          case '200':
              var responseData = response['response']['data'];
              this.storage.set(this.userLoginResDetail, responseData);
              this.storage.set('liveUserCode', this.code);
              this.authService.login();
              this.resetInput();
              this.loadingElement.dismiss();
          break;
          case '400':
              this.loadingElement.dismiss();
              this.wrongInputAlert(response['response']['Message']);
          break;
          case '408':
              this.loadingElement.dismiss();
              this.badRequestTimeoutAlert();
          break;
          case '0':
              this.loadingElement.dismiss();
              this.badRequestAlert();
          break;
        }
	  })
	}
    }
  }

  async loginWithPreviousCode() {
    if(this.username == undefined || this.username == '') {
      this.requireAlert();
    } else if(this.password == undefined) {
      this.requireAlert();
    } else if(isNaN(this.password)) {
      this.passwordValid();
    } else if(this.deviceId == undefined) {
      this.getDeviceId();
    }
    else {
		this.loadingElement = await this.loadingController.create({
			message: 'Por favor espera...',
			spinner: 'crescent',
			cssClass: 'transparent',

		  });
		  this.loadingElement.present();
			if(this.network.type == 'none') {
				this.storage.get(this.userLoginResDetail).then((val) => {
					if(val != null && val != undefined) {
					  if(this.username == val['Rut'] ){
						setTimeout(()=>{
							this.loadingElement.dismiss();
							this.authService.login();
						}, 3000);
					  }
					}
				  })
			}else if(this.network.type!='none'){
				var url = 'https://'+this.userPreviousCode+'.izytimecontrol.com/api/external/ValidateEmployee';
				let params = {
					"rut": this.username,
					"password": this.password,
					"imei": this.deviceId,
					"tokenFcm":this.fcmToken
				}
				this._services.validateLogin(url, params).then(response=>{
					switch(response['status']){
					case '200':
						var responseData = response['response']['data'];
						this.storage.set(this.userLoginResDetail, responseData);
						this.authService.login();
						this.resetInput();
						this.loadingElement.dismiss();
					break;
					case '400':
						this.loadingElement.dismiss();
						this.wrongInputAlert(response['response']['Message']);
					break;
					case '408':
						this.loadingElement.dismiss();
						this.badRequestTimeoutAlert();
					break;
					case '0':
						this.loadingElement.dismiss();
						this.badRequestAlert();
					break;
					}
				})
			}


    }
  }
  resetInput() {
    this.password = undefined
    this.code = undefined
  }
  passwordValid() {
    this._function.MessageToast('La contraseña debe ser número','top',2000);
  }
  requireAlert() {
    this._function.requireAlert('Por favor llena todos los espacios','De acuerdo');
  }
  alreadyExistCodeAlert() {
    this._function.requireAlert('El código ya existe','De acuerdo');
  }
  wrongInputAlert(resMessage) {
    this._function.requireAlert(resMessage,'De acuerdo');
  }
  badRequestAlert() {
    this._function.requireAlert('Problemas de Conexión, intentelo mas tarde','De acuerdo');
  }
  badRequestTimeoutAlert() {
    this._function.requireAlert('Tiempo de Respuesta Agotado','De acuerdo');
  }
  deviceIdToast() {
    this._function.MessageToast('Permitir ID de dispositivo','top', 2000);
  }
  clearStorage() {
    this.storage.clear().then(() => {
    })
  }
  getDeviceId(){

	if(this.plt.is('android')){
		console.log("DEVICE UID: "+this.device.uuid);
		console.log("DEVICE UID: "+this.device.version);
		if(this.device.uuid!=null){
			this.deviceId=this.device.uuid;
			this.setDeviceLocal();
        	this.loginWithCode();
		}
	}else{
			this.deviceId = 'personal_computer_login';
			this.setDeviceLocal();
			this.loginWithCode();
	}



   /*  this.uniqueDeviceID.get().then((uuid: any) => {
		console.log("UUID DE UNIQUE ID: "+uuid);
      if(this.deviceId != undefined && this.deviceId != uuid) {
      }else if(this.deviceId== undefined){

		// this.deviceId = uuid;
		// this.setDeviceLocal();
        // this.loginWithCode();
	  }

    }).catch((error: any) => {
		console.log(error);
        if(error == 'cordova_not_available') {
			// this.deviceId = 'personal_computer_login';
			// this.setDeviceLocal();
			// this.loginWithCode();
		}

    }) */
  }
  setDeviceLocal() {
    this.storage.set('deviceIdLocalStorage', this.deviceId);
  }
}
