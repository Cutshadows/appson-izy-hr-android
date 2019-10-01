import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertController, LoadingController, ToastController, NavController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-casino',
  templateUrl: './casino.page.html',
  styleUrls: ['./casino.page.scss'],
})
export class CasinoPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  userLoginResDetail: string = 'userLoginResDetail'
  currentVal=2;

  employeeId: any
  liveUserCode: any   

  data: Observable<any>
  
  loadingElement: any

  deviceId: any
  
  getCasinoDummyItems: any
  getCasinoItems: any

  casinoItem: string = 'casinoItem'

  casinoItemService: string = 'casinoItemService'

  casinoItemOption: string = 'casinoItemOption'

  casino_page: string = 'assets/img/page/casino_page.png'

  canEditFreelyRsp: any

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public http: HttpClient,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions,
    private modalController: ModalController    
  ) { 

  }

  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
        this.employeeId = val['EmployeeId']        
      }
    })

    this.storage.get('deviceIdLocalStorage').then((val) => {
      if(val != null && val != undefined) {
        this.deviceId = val                
      }
    })    

    this.storage.get('liveUserCode').then((val) => {
      if(val != null && val != undefined) {
        this.liveUserCode = val
        this.getCasinoService()
      }
    })
    
    //this.dummyData()
  }

  getCasinoService() {
    this.casinoServiceLoaderOn()

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/GetCasino'
    
    let employeeId = this.employeeId
    let imei = this.deviceId

    this.data = this.http.get(url+'?employeeId='+employeeId+'&imei='+imei, this.header)

    this.data.subscribe((response) => {

      this.casinoServiceLoaderOff()

      this.getCasinoItems = response.Data

      this.canEditFreelyRsp = response.CanEditFreely

      //console.log('this.getCasinoItems --', this.getCasinoItems)

      if(this.getCasinoItems.length == 0) {
        this.noDataToast()
      }
    
    }, (err) => {
      this.casinoServiceLoaderOff()
      this.badRequestAlert()
    })
  }

  async getCasinoItemDetail(item) {
    
    this.storage.set(this.casinoItem, item)

    let casinoItemServiceDetail = {
      From: item.Services[0].From,
      Id: item.Services[0].Id,
      Name: item.Services[0].Name,
      Status: item.Services[0].Status
    }

    this.storage.set(this.casinoItemService, casinoItemServiceDetail)

    this.storage.set(this.casinoItemOption, item.Services[0].Options)

    this.storage.set('canEditFreelyStorage', this.canEditFreelyRsp)

    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casinoservice'])
  }

  async openModel() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        custom_id: 'test'
      }
    })

    modal.present()
  }

  dummyData() {
    this.getCasinoDummyItems = 
      {
        "Data": [
            {
                "Date": "2019-04-04T13:00:00",
                "Status": 0,
                "Services": [
                    {
                        "Id": 17,
                        "Name": "DESAYUNO",
                        "From": "13:00",
                        "Status": 0,
                        "Options": [
                            {
                                "Id": 3374,
                                "Name": "1 Filetillo de pollo al jugo con ",
                                "Status": 1
                            },
                            {
                                "Id": 3375,
                                "Name": "2 Salsa de carne con quifaros",
                                "Status": 0
                            },
                            {
                                "Id": 3376,
                                "Name": "3 Lentejas guisadas a la charcuteria",
                                "Status": 0
                            },
                            {
                                "Id": 3377,
                                "Name": "4 Croqueta de atun y jurel c/ ensaladas",
                                "Status": 0
                            }
                        ]
                    }
                ]
            },
            {
                "Date": "2019-05-05T13:00:00",
                "Status": 1,
                "Services": [
                    {
                        "Id": 17,
                        "Name": "ALMUERZO",
                        "From": "13:00",
                        "Status": 1,
                        "Options": [
                            {
                                "Id": 3379,
                                "Name": "2 - 1 Chorrillana",
                                "Status": 0
                            },
                            {
                                "Id": 3380,
                                "Name": "2 - 2 Asado mechado con arroz",
                                "Status": 1
                            },
                            {
                                "Id": 3381,
                                "Name": "2 - 3 Garbanzos guisadas con chorizo",
                                "Status": 0
                            },
                            {
                                "Id": 3382,
                                "Name": "2 - 4 Asado al horno c/ensaladas",
                                "Status": 0
                            }
                        ]
                    }
                ]
            },
            {
              "Date": "2019-06-06T13:00:00",
              "Status": 0,
              "Services": [
                  {
                      "Id": 17,
                      "Name": "CENA",
                      "From": "13:00",
                      "Status": 2,
                      "Options": [
                          {
                              "Id": 3379,
                              "Name": "3 - 1 Chorrillana",
                              "Status": 0
                          },
                          {
                              "Id": 3380,
                              "Name": "3 - 2 Asado mechado con arroz",
                              "Status": 0
                          },
                          {
                              "Id": 3381,
                              "Name": "3 - 3 Garbanzos guisadas con chorizo",
                              "Status": 1
                          },
                          {
                              "Id": 3382,
                              "Name": "3 - 4 Asado al horno c/ensaladas",
                              "Status": 0
                          }
                      ]
                  }
              ]
          }            
        ]
      }       

    this.getCasinoItems = this.getCasinoDummyItems.Data
  }  

  async casinoServiceLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)    
  }
  
  async casinoServiceLoaderOff() {
    this.loadingElement.dismiss()
  }
  
  async badRequestAlert() {
    const alert = await this.alertController.create({
      message: 'Error de servicio',
      buttons: ['De acuerdo']
    })

    await alert.present()
  }  

  async noDataToast() {
    const toast = await this.toastController.create({
      message: 'Datos no encontrados',
      position: 'middle',
      duration: 2000
    })
    
    toast.present()
  }  

  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
     }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }

  logout() {
    this.authService.logout()
  }  

}
