import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-casinoservice',
  templateUrl: './casinoservice.page.html',
  styleUrls: ['./casinoservice.page.scss'],
})
export class CasinoservicePage implements OnInit {

  servicesDetail = null

  breakfast: string = 'assets/img/page/breakfast.png'
  lunch: string = 'assets/img/page/lunch.png'
  dinner: string = 'assets/img/page/dinner.png'
  casino_page: string = 'assets/img/page/casino_page.png'
  menu_1: string = 'assets/img/page/menu_1.png'

  casinoItem: string = 'casinoItem'

  casinoItemStoreA: any

  casinoItemService: string = 'casinoItemService'

  casinoItemServiceStoreA: any  

  casinoItemOption: string = 'casinoItemOption'

  casinoItemOptionStoreA: any  

  constructor(
    private navController: NavController,
    private storage: Storage,
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
      //console.log('this.casinoItemServiceStoreA --', this.casinoItemServiceStoreA)            
    })    

  }

  casinoGo() {

    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casino'])    
  }

  async optionsList() {

    this.storage.get(this.casinoItemOption).then((val) => {

      if(val != null && val != undefined) {

        this.casinoItemOptionStoreA = val

      }

    })
    
    let options: NativeTransitionOptions = {
      duration: 800
    }
  
    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'casinooption'])    

  }    

}
