import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FunctionsService } from 'src/app/services/functions.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})

export class ChangepasswordPage implements OnInit {
  currentVal=3;
  oldPassword: number
  newPassword: number
  rePassword: number
  userLoginResDetail: string = 'userLoginResDetail'
  employeeId: any
  liveUserCode: any
  data: Observable<any>
  loadingElement: any
  changePasswordData: any
  deviceId: any
  @ViewChild("InputPassword") inputPassword;
  @ViewChild("InputRepeatPassword") inputRepeat;
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
    ) { }

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
      }
    })

  }

  logout() {
    this.authService.logout();
  }

  profileGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'profile'])
  }

  async changePasswordLoaderOn() {
    this._function.requireLoading('Por favor espera...',2000);
  }

  async changePasswordResponseAlert(responseMsg) {
    this._function.requireAlert(responseMsg,'De acuerdo');
  }

  async badRequestAlert() {
    this._function.requireAlert('Error de servicio','De acuerdo');
  }

  async requireAlert() {
    this._function.requireAlert('Por favor llena todos los espacios','De acuerdo');
  }

  async passwordValid() {
    this._function.MessageToast('La contraseña debe ser número','top',2000);
  }

  async passwordMatchAlert() {
    this._function.requireAlert('No coincide','De acuerdo');
  }

  changePassword() {
    if(this.oldPassword == undefined) {
      this.requireAlert()
    } else if(isNaN(this.oldPassword)) {
      this.passwordValid()
    } else if(this.newPassword == undefined) {
      this.requireAlert()
    } else if(isNaN(this.newPassword)) {
      this.passwordValid()
    } else if(this.rePassword == undefined) {
      this.requireAlert()
    } else if(isNaN(this.rePassword)) {
      this.passwordValid()
    } else if(this.newPassword != this.rePassword) {
      this.passwordMatchAlert()
    } else {
      this.changePasswordService()
    }
  }

  async changePasswordService() {
    let loadingElementChangePassword = await this.loadingController.create({
      message: 'Procesando Información ...',
      spinner: 'crescent',
      cssClass: 'transparent'
    });
    loadingElementChangePassword.present();

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/ChangePassword'
    let params = {
      "oldPassword": this.oldPassword,
      "newPassword": this.newPassword,
      "employeeId": this.employeeId,
      "imei": this.deviceId
    }

    this._socketService.serviceChangePassword(url, params).then((response)=>{
      loadingElementChangePassword.dismiss();
      switch(response['status']){
        case '200':
            loadingElementChangePassword.dismiss();
            this.changePasswordData = response['response'];
            this.changePasswordResponseAlert('Clave cambiada exitosamente')
            let options: NativeTransitionOptions = {
              duration: 800
            }
            this.nativePageTransitions.fade(options);
            this.navController.navigateRoot(['members', 'profile']);
          break;
        case '400':
            loadingElementChangePassword.dismiss();
            this.changePasswordResponseAlert(response['resposne']['Message']);
          break;
        case '0':
            loadingElementChangePassword.dismiss();
            this.badRequestAlert();
          break;
      }
    });
  }
  oldPasswordNotRepeat(){
    if(this.oldPassword==this.newPassword){
      this._function.MessageToast("No se puede usar la misma clave antigua", "bottom", 2000);
      this.newPassword=undefined;
      this.inputPassword.setFocus();
    }else if(this.oldPassword==this.rePassword){
      this._function.MessageToast("No se puede usar la misma clave antigua", "bottom", 2000);
      this.rePassword=undefined;
      this.inputRepeat.setFocus();
    }
  }
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }


}
