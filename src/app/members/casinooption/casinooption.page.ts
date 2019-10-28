import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-casinooption',
  templateUrl: './casinooption.page.html',
  styleUrls: ['./casinooption.page.scss'],
})
export class CasinooptionPage implements OnInit {

  header: any = { 
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "BE6JVujuYvtWCSilKrRF1A1Rc+Zeyl4dZOG2VCWm9Uk="
    } 
  }  

  userLoginResDetail: string = 'userLoginResDetail';
  employeeId: any;
  liveUserCode: any ;  
  data: Observable<any>;
  loadingElement: any;
  deviceId: any;  
  menu_1: string = 'assets/img/page/menu_1.png';
  menu_2: string = 'assets/img/page/menu_2.png';
  menu_3: string = 'assets/img/page/menu_3.png';
  menu_4: string = 'assets/img/page/menu_4.png';
  // casino item
  casinoItem: string = 'casinoItem';
  casinoItemStoreA: any;
  // casino service
  casinoItemService: string = 'casinoItemService';
  casinoItemServiceStoreA: any;  
  // casino option
  casinoItemOption: string = 'casinoItemOption';
  casinoItemOptionStoreA: any;  
  setCasinoSrvRes: any;
  casinoItemOptionZeroStatus: any = [];
  canEditFreelyStorageV: any;
  casinoItemServiceStatus: any = [];  

  constructor(
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public http: HttpClient,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions    
  ) { 

  }

  ngOnInit() {

    this.storage.get(this.casinoItem).then((val) => {
      if(val != null && val != undefined) {
        this.casinoItemStoreA = val
      }
      //console.log('this.casinoItemStoreA --', this.casinoItemStoreA)            
    })    

    this.storage.get(this.casinoItemService).then((val) => {
      if(val != null && val != undefined) {
        this.casinoItemServiceStoreA = val
      }
    })    

    this.storage.get(this.casinoItemOption).then((val) => {
      if(val != null && val != undefined) {
        this.casinoItemOptionStoreA = val
      }
      //console.log('this.casinoItemOptionStoreA --', this.casinoItemOptionStoreA)            
    })

    this.storage.get('canEditFreelyStorage').then((val) => {
      if(val != null && val != undefined) {
        this.canEditFreelyStorageV = val
      }
      //console.log('this.canEditFreelyStorageV --', this.canEditFreelyStorageV)            
    })    
    
    // service parameter getting local storage start
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
    // service parameter getting local storage end    

  }

  // set casino status 1 start
  optionsListClick(casinoOptionClickId) {

    var giveDate = new Date(this.casinoItemStoreA.Date)

    var giveMonth = giveDate.getMonth()

    var date = new Date()
    var currentMonth = date.getMonth()

    if(this.canEditFreelyStorageV == true) {
      this.setCasinoStatusZeroOn()
    
      for(let i = 0; i < this.casinoItemOptionStoreA.length; i++) {
  
        if(casinoOptionClickId == this.casinoItemOptionStoreA[i].Id) {
          var optionObject = {
            Id: this.casinoItemOptionStoreA[i].Id,
            Name: this.casinoItemOptionStoreA[i].Name,
            Status: 1
          }
  
          this.setCasinoEmployeeService(casinoOptionClickId)
        } else {
          var optionObject = {
            Id: this.casinoItemOptionStoreA[i].Id,
            Name: this.casinoItemOptionStoreA[i].Name,
            Status: 0
          }
        }
  
        this.casinoItemOptionZeroStatus.push(optionObject)
      }   
  
      this.casinoItemOptionStoreA = this.casinoItemOptionZeroStatus
      
      this.storage.set(this.casinoItemOption, this.casinoItemOptionStoreA)
  
      this.casinoItemOptionZeroStatus = []

      // service object status select start      
      var serviceObject = {
        From: this.casinoItemServiceStoreA.From,
        Id: this.casinoItemServiceStoreA.Id,
        Name: this.casinoItemServiceStoreA.Name,
        Status: 1
      }

      this.storage.set(this.casinoItemService, serviceObject)
      // service object status select end      
  
      if(this.casinoItemOptionZeroStatus.length == this.casinoItemOptionStoreA.length) {
        this.setCasinoStatusZeroOff()
      }      
    } else {
      if(giveMonth > currentMonth) {
        this.optionsListEditFalseClick(casinoOptionClickId)
      } else {
        this.canNotEditToast()
      }       
    }
    
  }

  // option list click for can edit freely false start
  optionsListEditFalseClick(casinoOptionClickId) {
    this.setCasinoStatusZeroOn()
    
    for(let i = 0; i < this.casinoItemOptionStoreA.length; i++) {

      if(casinoOptionClickId == this.casinoItemOptionStoreA[i].Id) {
        var optionObject = {
          Id: this.casinoItemOptionStoreA[i].Id,
          Name: this.casinoItemOptionStoreA[i].Name,
          Status: 1
        }

        this.setCasinoEmployeeService(casinoOptionClickId)
      } else {
        var optionObject = {
          Id: this.casinoItemOptionStoreA[i].Id,
          Name: this.casinoItemOptionStoreA[i].Name,
          Status: 0
        }
      }

      this.casinoItemOptionZeroStatus.push(optionObject)
    }        

    this.casinoItemOptionStoreA = this.casinoItemOptionZeroStatus
    
    this.storage.set(this.casinoItemOption, this.casinoItemOptionStoreA)

    this.casinoItemOptionZeroStatus = []

    // service object status select start      
    var serviceObject = {
      From: this.casinoItemServiceStoreA.From,
      Id: this.casinoItemServiceStoreA.Id,
      Name: this.casinoItemServiceStoreA.Name,
      Status: 1
    }

    this.storage.set(this.casinoItemService, serviceObject)
    // service object status select end    

    if(this.casinoItemOptionZeroStatus.length == this.casinoItemOptionStoreA.length) {
      this.setCasinoStatusZeroOff()
    }

  }
  // option list click for can edit freely false end

  setCasinoEmployeeService(optionDetailId) {
    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/SetCasinoEmployee'
    let params = {
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "optionDetailId": optionDetailId
    }
    
    this.data = this.http.post(url, params, this.header)

    this.data.subscribe((response) => {

      this.setCasinoSrvRes = response
    
    }, (err) => {
      this.badRequestAlert()
    })
  }
  // set casino status 1 end

  // set casino status 2 start  
  cancelCasinoClick() {

    var giveDate = new Date(this.casinoItemStoreA.Date)

    var giveMonth = giveDate.getMonth()

    var date = new Date()
    var currentMonth = date.getMonth()

    if(this.canEditFreelyStorageV == true) {
      this.setCasinoStatusCancelOn()
    
      for(let i = 0; i < this.casinoItemOptionStoreA.length; i++) {
  
        if(this.casinoItemOptionStoreA[i].Status == '1') {
          var optionObject = {
            Id: this.casinoItemOptionStoreA[i].Id,
            Name: this.casinoItemOptionStoreA[i].Name,
            Status: 2
          }
  
          this.cancelCasinoEmployeeService(this.casinoItemOptionStoreA[i].Id)
        } else {
          var optionObject = {
            Id: this.casinoItemOptionStoreA[i].Id,
            Name: this.casinoItemOptionStoreA[i].Name,
            Status: 0
          }
        }
  
        this.casinoItemOptionZeroStatus.push(optionObject)
      }        
  
      this.casinoItemOptionStoreA = this.casinoItemOptionZeroStatus
      
      this.storage.set(this.casinoItemOption, this.casinoItemOptionStoreA)
  
      this.casinoItemOptionZeroStatus = []

      // service object status cancel start      
      var serviceObject = {
        From: this.casinoItemServiceStoreA.From,
        Id: this.casinoItemServiceStoreA.Id,
        Name: this.casinoItemServiceStoreA.Name,
        Status: 2
      }

      this.storage.set(this.casinoItemService, serviceObject)
      // service object status cancel end      
  
      if(this.casinoItemOptionZeroStatus.length == this.casinoItemOptionStoreA.length) {
        this.setCasinoStatusCancelOff()
      }      
    } else {
      if(giveMonth > currentMonth) {
        this.cancelCasinoEditFalseClick()
      } else {
        this.canNotEditToast()
      }       
    }
  }

  // cancel casino for can edit freely false start
  cancelCasinoEditFalseClick() {
    this.setCasinoStatusCancelOn()
    
    for(let i = 0; i < this.casinoItemOptionStoreA.length; i++) {

      if(this.casinoItemOptionStoreA[i].Status == '1') {
        var optionObject = {
          Id: this.casinoItemOptionStoreA[i].Id,
          Name: this.casinoItemOptionStoreA[i].Name,
          Status: 2
        }

        this.cancelCasinoEmployeeService(this.casinoItemOptionStoreA[i].Id)
      } else {
        var optionObject = {
          Id: this.casinoItemOptionStoreA[i].Id,
          Name: this.casinoItemOptionStoreA[i].Name,
          Status: 0
        }
      }

      this.casinoItemOptionZeroStatus.push(optionObject)
    }    

    this.casinoItemOptionStoreA = this.casinoItemOptionZeroStatus
    
    this.storage.set(this.casinoItemOption, this.casinoItemOptionStoreA)

    this.casinoItemOptionZeroStatus = []

    // service object status cancel start      
    var serviceObject = {
      From: this.casinoItemServiceStoreA.From,
      Id: this.casinoItemServiceStoreA.Id,
      Name: this.casinoItemServiceStoreA.Name,
      Status: 2
    }

    this.storage.set(this.casinoItemService, serviceObject)
    // service object status cancel end    

    if(this.casinoItemOptionZeroStatus.length == this.casinoItemOptionStoreA.length) {
      this.setCasinoStatusCancelOff()
    }    
  }
  // cancel casino for can edit freely false end

  cancelCasinoEmployeeService(optionDetailId) {

    let url = 'https://'+this.liveUserCode+'.izytimecontrol.com/api/external/CancelCasinoEmployee'

    let params = {
      "employeeId": this.employeeId,
      "imei": this.deviceId,
      "optionDetailId": optionDetailId
    }

    this.data = this.http.post(url, params, this.header)

    this.data.subscribe((response) => {

      this.setCasinoSrvRes = response
    
    }, (err) => {
      this.badRequestAlert()
    })
  }  
  // set casino status 2 end

  async setCasinoStatusCancelOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)     
  }
  
  async setCasinoStatusCancelOff() {
    this.loadingElement.dismiss()
  }  

  async setCasinoStatusZeroOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)     
  }
  
  async setCasinoStatusZeroOff() {
    this.loadingElement.dismiss()
  }

  async setCasinoEmpLoaderOn() {
    this.loadingElement = await this.loadingController.create({
      message: 'Por favor espera...',
      spinner: 'crescent'
    })
    this.loadingElement.present()

    setTimeout(() => {
      this.loadingElement.dismiss()
    }, 3000)     
  }
  
  async setCasinoEmpLoaderOff() {
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
  
  async canNotEditToast() {
    const toast = await this.toastController.create({
      message: 'No se puede editar',
      position: 'middle',
      duration: 2000
    })
    
    toast.present()
  }  

  casinoserviceGo() {
    let options: NativeTransitionOptions = {
      duration: 800
     }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casinoservice'])
  }  
  

}
