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
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  
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
    
    console.log('this.deviceId --', this.deviceId)
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
    /* this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    });
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000) */    
  }
  
  /* async changePasswordLoaderOff() {
    this.loadingElement.dismiss()
  } */
  
  async changePasswordResponseAlert(responseMsg) {
    this._function.requireAlert(responseMsg,'De acuerdo');
    /* const alert = await this.alertController.create({
      message: responseMsg,
      buttons: ['De acuerdo']
    }); 

    await alert.present()*/
  }  
  
  async badRequestAlert() {
    
    const alert = await this.alertController.create({
      message: 'Error de servicio',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }
  
  async requireAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor llena todos los espacios',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }
  
  async passwordValid() {
    const toast = await this.toastController.create({
      message: 'La contraseña debe ser número',
      position: 'middle',
      duration: 2000
    });
    toast.present()
  }
  
  async passwordMatchAlert() {
    const alert = await this.alertController.create({
      message: 'No coincide',
      buttons: ['De acuerdo']
    });

    await alert.present()
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

  changePasswordService() {
    this.changePasswordLoaderOn()
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/ChangePassword'
    let params = {
      "oldPassword": this.oldPassword,
      "newPassword": this.newPassword,
      "employeeId": this.employeeId,
      "imei": this.deviceId
    }
    this.data = this.http.post(url, params, this.header);
    this.data.subscribe((response) => {
      //this.changePasswordLoaderOff()
      this.changePasswordData = response

      if(response.status) {
        this.changePasswordResponseAlert('Exitosamente')
        let options: NativeTransitionOptions = {
          duration: 800
        }
      
        this.nativePageTransitions.fade(options);
        this.navController.navigateRoot(['members', 'profile'])   

      } else {
        this.changePasswordResponseAlert(response.Message)
      }        
    }, (err) => {
      //this.changePasswordLoaderOff()
      this.badRequestAlert()
    })
  }
  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])    
  }


}
