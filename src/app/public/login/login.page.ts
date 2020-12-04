import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { FunctionsService } from '../../services/functions.service';
import {DatabaseService} from '../../services/database.service';
import { Network } from '@ionic-native/network/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { async } from '@angular/core/testing';




const loginFinger='loginFingerCredencial';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: number;
  code: string;
  availible:boolean;
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
  dataLogin=[];
  regevaluateRut=new RegExp(`^0*(\\d{1,3}(\\.?\\d{3})*)\\-?([\\dkK])`, 'i');
  regexValuateEmail=new RegExp(`/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`);

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public platform: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private _function:FunctionsService,
	private _services:DatabaseService,
	private network:Network,
	private fingerPrint:FingerprintAIO
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
	  this.storage.get('deviceFcmToken').then((val) => {
		if(val != null && val != undefined) {
		  this.fcmToken = val
		}
	})
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
		"imei": this.deviceId,
		"tokenFcm":this.fcmToken
      }
        this._services.validateLogin(url, params).then(response=>{
        switch(response['status']){
          case '200':
            this.loadingElement.dismiss();
			var responseData = response['response'];
			this.storage.set(this.userLoginResDetail, responseData);
			this.dataLogin.push({"email":this.username, "password":this.password, "code":this.code});
			this.storage.set(loginFinger, this.dataLogin);
            this.codeArray.push(this.codeLowerCase);
            this.storage.set('userCode', this.codeArray);
            this.storage.set('liveUserCode', this.codeLowerCase);
            this.authService.login();
            this.resetInput();
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
  ionViewWillEnter(){
	  this.storage.keys().then((keyStorage)=>{
		  keyStorage.map(userData=>{
			  console.log(userData);
		  })
	  })
  }




/**
 * LOGIN CREADO PARA LA MUESTRA
 */
  async login() {
    if(this.username == undefined && this.password == undefined && this.code == undefined) {
      this.requireAlert()
    } else if(this.username == '') {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined || this.code == '') {
      this.requireAlert()
	}
	else {
      this.loadingElement = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        cssClass: 'transparent'
      });
      this.loadingElement.present();
      let url = 'https://demo.izytimecontrol.com/api/external/ValidateEmployee';
      let params = {
        rut: this.username,
        password: this.password
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
  /**
 * LOGIN CREADO PARA LA MUESTRA NOSE PESCA PARECE
 */
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
	}
	else {
      this.loadingElement = await this.loadingController.create({
        message: 'Por favor espera...',
        spinner: 'crescent',
        cssClass: 'transparent',
      });
	  this.loadingElement.present();
	  if(this.network.type=='none'){
		this.storage.get(this.userLoginResDetail).then((val)=>{
			if(val != null && val != undefined){
				if(this.username == val['Rut']){
					setTimeout(()=>{
						this.loadingElement.dismiss();
						this.authService.login();
					},3000)
				}
			}
		})
	  }else if(this.network.type!='none'){

    var url = 'https://'+this.code+'.izytimecontrol.com/api/external/ValidateEmployee';
    console.log(url)
		let params = {
		  "rut": this.username,
		  "password": this.password,
		  "imei": this.deviceId,
		  "tokenFcm":this.fcmToken
    }
    console.log(params)
		this._services.validateLogin(url, params).then(response=>{
		  switch(response['status']){
			case '200':
				var responseData = response['response'];
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
	let emailUserFinger, passwordUserFinger, codeUserFinger;
	this.storage.get(loginFinger).then((valueFinger)=>{
		const [email, password, code]= valueFinger[0];
		emailUserFinger=email;
		passwordUserFinger=password;
		codeUserFinger=code;
	})

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
	  if(this.network.type=='none'){
		this.storage.get(this.userLoginResDetail).then((val)=>{
			if(val != null && val != undefined){
				if(this.username == val['Rut']){
					setTimeout(()=>{
						this.loadingElement.dismiss();
						this.authService.login();
					},3000)
				}
			}
		})
	  }else if(this.network.type!='none'){

      if(this.platform.is('cordova')){
        this.fingerPrint.isAvailable().then(typeAuth=>{
          this.availible=true;
          switch(typeAuth){
            case 'finger':
              this.fingerPrint.show({
                description:'inicie sesion con la huella biometrica',
                fallbackButtonTitle:'Use respaldo',
                disableBackup:true
              }).then(async (resultFingerAuth:any)=>{
                if(resultFingerAuth=='Success'){
                      let loadingElementMessages=await this.loadingController.create({
                        message: 'Verficando usuario',
                        spinner:'crescent',
                        cssClass:'transparent'
                      });
                      loadingElementMessages.present();

                      var url = 'https://'+this.userPreviousCode+'.izytimecontrol.com/api/external/ValidateEmployee';
                      console.log(url)
                      let params = {
                        "rut": this.username,
                        "password": this.password,
                        "imei": this.deviceId,
                        "tokenFcm":this.fcmToken
                      }
                      console.log(params)

                      this._services.validateLogin(url, params).then(response=>{
                        switch(response['status']){
                        case '200':
                          var responseData = response['response'];
                          this.storage.set(this.userLoginResDetail, responseData);
                          this.authService.login();
                          this.resetInput();
                          this.loadingElement.dismiss();
                          loadingElementMessages.dismiss();
                        break;
                        case '400':
                          this.loadingElement.dismiss();
                          loadingElementMessages.dismiss();
                          this.wrongInputAlert(response['response']['Message']);
                        break;
                        case '408':
                          this.loadingElement.dismiss();
                          loadingElementMessages.dismiss();
                          this.badRequestTimeoutAlert();
                        break;
                        case '0':
                          this.loadingElement.dismiss();
                          loadingElementMessages.dismiss();
                          this.badRequestAlert();
                        break;
                        }
                      })




                }
              }).then((error:any)=>{
                this._function.MessageToast('Autentificación no valida, intente mas tarde', 'top', 2000);

              })
            break;
            case 'face':
              this.fingerPrint.show({
                description:'inicie sesion con la huella biometrica',
                fallbackButtonTitle:'Use respaldo',
                disableBackup:true
              }).then(async(resultFaceAuth)=>{
                if(resultFaceAuth=='Success'){
                  let loadingElementMessage=await this.loadingController.create({
                        message: 'Verficando usuario',
                        spinner:'crescent',
                        cssClass:'transparent'
                  })
                  loadingElementMessage.present();
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
                          var responseData = response['response'];
                          this.storage.set(this.userLoginResDetail, responseData);
                          this.authService.login();
                          this.resetInput();
                          this.loadingElement.dismiss();
                          loadingElementMessage.dismiss();
                        break;
                        case '400':
                          this.loadingElement.dismiss();
                          loadingElementMessage.dismiss();
                          this.wrongInputAlert(response['response']['Message']);
                        break;
                        case '408':
                          this.loadingElement.dismiss();
                          loadingElementMessage.dismiss();
                          this.badRequestTimeoutAlert();
                        break;
                        case '0':
                          this.loadingElement.dismiss();
                          loadingElementMessage.dismiss();
                          this.badRequestAlert();
                        break;
                        }
                      })
                }
              }).catch(err=>{
                  this._function.MessageToast('Autenticación no valida, intente mas tarde', 'top', 2000);

              })
            break;
          }
        }).catch(async(errors:any)=>{
            console.log(errors);
            this.loadingElement.dismiss();
            this.availible=false;
                const {code, message}=errors;
                this._function.requireAlert(`Error ${code} : No tiene huella activada, inicie sesión en forma normal`, 'De acuerdo');
                const alert=await this.alertController.create({
                  header:'Sin huella',
                  message: '¿Desea continuar <strong>sin registro metodo de autentificación</strong>',
				  cssClass:'classAlert',
				  buttons:[
					{
						text:'SI',
						cssClass:'classAlert',
						handler:async()=>{
							if(this.username==undefined || this.username==''){
								this.requireAlert();
							}else if(this.password==undefined){
								this.requireAlert();
							}else{
								let loadingElementMessage=await this.loadingController.create({
									message: 'Verficando usuario',
									spinner:'crescent',
									cssClass:'transparent'
							  })
							  loadingElementMessage.present();
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
									  var responseData = response['response'];
									  this.storage.set(this.userLoginResDetail, responseData);
									  this.authService.login();
									  this.resetInput();
									  this.loadingElement.dismiss();
									  loadingElementMessage.dismiss();
									break;
									case '400':
									  this.loadingElement.dismiss();
									  loadingElementMessage.dismiss();
									  this.wrongInputAlert(response['response']['Message']);
									break;
									case '408':
									  this.loadingElement.dismiss();
									  loadingElementMessage.dismiss();
									  this.badRequestTimeoutAlert();
									break;
									case '0':
									  this.loadingElement.dismiss();
									  loadingElementMessage.dismiss();
									  this.badRequestAlert();
									break;
									}
								  })
							}
						}
					},{
						text:'NO',
						cssClass:'cssAlert',
						handler:()=>{
							this.resetInput();
						}
					}

				  ]

				});
				await alert.present();

        })

      }

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
  getDeviceId() {
    this.uniqueDeviceID.get().then((uuid: any) => {
      if(this.deviceId != undefined && this.deviceId != uuid) {
      }else if(this.deviceId== undefined){
		this.deviceId = uuid;
		this.setDeviceLocal();
        this.loginWithCode();
	  }

    }).catch((error: any) => {
      if(error == 'cordova_not_available') {
        this.deviceId = 'personal_computer_login';
        this.setDeviceLocal();
        this.loginWithCode();
      }
    })
  }
  setDeviceLocal() {
    this.storage.set('deviceIdLocalStorage', this.deviceId);
  }

}
