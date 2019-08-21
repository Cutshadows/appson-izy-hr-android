import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  username: string
  password: number
  code: string
  codeLowerCase: any

  userLoginResDetail: string = 'userLoginResDetail'
  
  data: Observable<any>
  loadingElement: any

  logoUrl: string = 'assets/img/logo.png'

  storageData: any

  codeArray: any = []

  addNewCodeButton: boolean = false

  userPreviousCode: any

  deviceId: any

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public platform: Platform,
    private uniqueDeviceID: UniqueDeviceID
    ) {     

  }

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
    
  }

  resetInput() {
    this.password = undefined
    this.code = undefined
  }
  
  async passwordValid() {
    const toast = await this.toastController.create({
      message: 'La contraseña debe ser número',
      position: 'middle',
      duration: 2000
    });
    toast.present()
  }

  async loginLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    });
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)
  }
  
  async loginLoaderOff() {
    this.loadingElement.dismiss()
  }  

  async requireAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor llena todos los espacios',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }
  
  async alreadyExistCodeAlert() {
    const alert = await this.alertController.create({
      message: 'El código ya existe',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }  

  async wrongInputAlert(resMessage) {
    const alert = await this.alertController.create({
      message: resMessage,
      buttons: ['De acuerdo']
    });

    await alert.present()
  }
  
  async badRequestAlert() {
    const alert = await this.alertController.create({
      message: 'El código no es correcto',
      buttons: ['De acuerdo']
    });

    await alert.present()
  }

  async deviceIdToast() {
    const toast = await this.toastController.create({
      message: 'Permitir ID de dispositivo',
      position: 'middle',
      duration: 2000
    });
    toast.present()
  }  
  
  clearStorage() {
    this.storage.clear().then(() => {
    })    
  }

  login() {

    if(this.username == undefined && this.password == undefined && this.code == undefined) {
      this.requireAlert()   
    } else if(this.username == '') {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined) {
      this.requireAlert()
    } else if(this.code == '') {
      this.requireAlert()
    }
    else {
      this.loginLoaderOn()
      
      let url = 'https://demo.izytimecontrol.com/api/external/ValidateEmployee';

      let params = {
        rut: this.username,
        password: this.password
      }

      this.data = this.http.post(url, params, this.header);

      this.data.subscribe((response) => {

        var responseData = response.data

        this.loginLoaderOff()

        if(response.status) {
          
          this.storage.set(this.userLoginResDetail, responseData)

          this.codeArray.push(this.code)

          this.storage.set('userCode', this.codeArray)

          this.authService.login()
        } else {
          this.wrongInputAlert(response.Message)
        }        
      }, (err) => {
        /*this.loginLoaderOff()
        this.badRequestAlert()*/

        this.loginLoaderOff()

        let userLoginData = {
          FirstName: 'Hello',
          LastName: 'test',
          Rut: 'rut',
          Department: 'department',
          EmployeeId: 'employeeId'
        }
        
        this.storage.set(this.userLoginResDetail, userLoginData)

        this.codeArray.push(this.code)

        this.storage.set('userCode', this.codeArray)        

        this.authService.login()

      })
    }
  }

  addNewCodeHideShow() {
    this.addNewCodeButton = !this.addNewCodeButton
    this.password = undefined
    this.code = undefined
  }

  loginWithSelectCode() {

    if(this.username == undefined) {
      this.requireAlert()   
    } else if(this.username == '') {
      this.requireAlert()
    } else if(this.password == undefined) {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined) {
      this.requireAlert()
    } else if(this.code == '') {
      this.requireAlert()
    } else if(this.deviceId == undefined) {
      this.getDeviceId()
    }
    else {
      this.loginLoaderOn()
      
      var url = 'https://'+this.code+'.izytimecontrol.com/api/external/ValidateEmployee';

      let params = {
        "rut": this.username,
        "password": this.password,
        "imei": this.deviceId
      }

      this.data = this.http.post(url, params, this.header);

      this.data.subscribe((response) => {

        var responseData = response.data

        this.loginLoaderOff()

        if(response.status) {
          
          this.storage.set(this.userLoginResDetail, responseData)

          this.storage.set('liveUserCode', this.code)

          this.authService.login()

          this.resetInput()
        } else {
          this.wrongInputAlert(response.Message)
        }        
      }, (err) => {
        this.loginLoaderOff()
        this.badRequestAlert() 
      })
    }
  }  

  loginWithCode() {

    if(this.code != undefined && this.code != '') {
      this.codeLowerCase = this.code.toLowerCase()
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
   

    if(this.username == undefined) {
      this.requireAlert()   
    } else if(this.username == '') {
      this.requireAlert()
    } else if(this.password == undefined) {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.code == undefined) {
      this.requireAlert()
    } else if(this.code == '') {
      this.requireAlert()
    } else if(keepGoing == false) {
      this.alreadyExistCodeAlert()
    } else if(this.deviceId == undefined) {
      this.getDeviceId()
    }
    else {      
      // save code start        
      this.loginLoaderOn()
    
      var url = 'https://'+this.code+'.izytimecontrol.com/api/external/ValidateEmployee';

      let params = {
        "rut": this.username,
        "password": this.password,
        "imei": this.deviceId
      }

      this.data = this.http.post(url, params, this.header);

      this.data.subscribe((response) => {

        var responseData = response.data

        this.loginLoaderOff()

        if(response.status) {
          
          this.storage.set(this.userLoginResDetail, responseData)

          this.codeArray.push(this.codeLowerCase)

          this.storage.set('userCode', this.codeArray)          

          this.storage.set('liveUserCode', this.codeLowerCase)

          this.authService.login()

          this.resetInput()
        } else {
          this.loginLoaderOff()
          this.wrongInputAlert(response.Message)
        }        
      }, (err) => {
        this.loginLoaderOff()
        this.badRequestAlert()
      })
      // save code end
    }
  }
  
  loginWithPreviousCode() {
    if(this.username == undefined) {
      this.requireAlert()   
    } else if(this.username == '') {
      this.requireAlert()
    } else if(this.password == undefined) {
      this.requireAlert()
    } else if(isNaN(this.password)) {
      this.passwordValid()
    } else if(this.deviceId == undefined) {
      this.getDeviceId()
    }
    else {
      this.loginLoaderOn()
      
      var url = 'https://'+this.userPreviousCode+'.izytimecontrol.com/api/external/ValidateEmployee';

      let params = {
        "rut": this.username,
        "password": this.password,
        "imei": this.deviceId
      }

      this.data = this.http.post(url, params, this.header);

      this.data.subscribe((response) => {

        var responseData = response.data

        this.loginLoaderOff()

        if(response.status) {
          
          this.storage.set(this.userLoginResDetail, responseData)

          this.authService.login()

          this.resetInput()
        } else {
          this.wrongInputAlert(response.Message)
        }        
      }, (err) => {
        this.loginLoaderOff()
        this.badRequestAlert()    
      })
    }
  }  

  getDeviceId() {

    this.uniqueDeviceID.get().then((uuid: any) => {
      
      this.deviceId = uuid

      if(this.deviceId) {
        this.setDeviceLocal()
        this.loginWithCode()
      }

    }).catch((error: any) => {

      console.log('uuid', error)
      if(error == 'cordova_not_available') {
        this.deviceId = 'personal_computer_login'
        this.setDeviceLocal()
        this.loginWithCode()
      }

    })

  }

  setDeviceLocal() {
    this.storage.set('deviceIdLocalStorage', this.deviceId)
  }
    

}
