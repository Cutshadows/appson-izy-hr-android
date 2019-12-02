import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string
  password: number
  code: string

  userLoginEmpty: string = ''

  data: Observable<any>
  loadingElement: any

  logoUrl: string = 'assets/img/logo.png'

  storageData: any

  codeArray: any = []

  constructor(
    private authService: AuthenticationService,
    public http: HttpClient,
    public alertController: AlertController,
    private storage: Storage,
    public loadingController: LoadingController,
    public toastController: ToastController
    ) {

  }

  ngOnInit() {
    this.storage.get(this.userLoginEmpty).then((val) => {
      //console.log('val --', val);
      //this.storageData = val['FirstName'];
      //console.log('this.storageData --', this.storageData)
    });

    this.storage.get('userCode').then((val) => {
      if(val != null && val != undefined) {

        //console.log('userCode -- val', val)

        for(let j = 0; j < val.length; j++) {
          this.codeArray.push(val[j])
        }

      }
    });
    //console.log('this.codeArray ngOnInit --', this.codeArray)
  }

  async passwordValid() {
    const toast = await this.toastController.create({
      message: 'Password must be number',
      position: 'middle',
      duration: 2000
    });
    toast.present()
  }

  async loginLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    this.loadingElement.present()
  }

  async loginLoaderOff() {
    this.loadingElement.dismiss()
  }

  async requireAlert() {
    const alert = await this.alertController.create({
      message: 'Please fill all fields',
      buttons: ['OK']
    });

    await alert.present()
  }

  async wrongInputAlert(resMessage) {
    const alert = await this.alertController.create({
      message: resMessage,
      buttons: ['OK']
    });

    await alert.present()
  }

  async badRequestAlert() {
    const alert = await this.alertController.create({
      message: '400 Bad Request',
      buttons: ['OK']
    });

    await alert.present()
  }

  clearStorage() {
    this.storage.clear().then(() => {
    })
  }

  login() {

    /*console.log('this.code', this.code)
    console.log('this.codeArray', this.codeArray)

    this.codeArray.push(this.code)

    console.log('this.codeArray --', this.codeArray)

    this.storage.set('userCode', this.codeArray)*/

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
      let header = {
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
        }
      };

      let url = 'https://demo.izytimecontrol.com/api/external/ValidateEmployee';

      let params = {
        rut: this.username,
        password: this.password
      }

      this.data = this.http.post(url, params, header);

      this.data.subscribe((response) => {

        var responseData = response.data

        this.loginLoaderOff()

        if(response.status) {
          let userLoginData = {
            FirstName: responseData.FirstName,
            LastName: responseData.LastName,
            Rut: responseData.Rut,
            Department: responseData.Department,
            EmployeeId: responseData.EmployeeId
          }

          this.storage.set(this.userLoginEmpty, userLoginData)

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

        this.storage.set(this.userLoginEmpty, userLoginData)

        this.codeArray.push(this.code)

        this.storage.set('userCode', this.codeArray)

        this.authService.login()


      })
    }
  }

}
