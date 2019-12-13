import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { OptionmodalPage } from '../optionmodal/optionmodal.page';

import { Storage } from '@ionic/storage';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

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
    private navParams: NavParams,
    private modalController: ModalController,
    private storage: Storage,
    private nativePageTransitions: NativePageTransitions
  ) {

  }

  ngOnInit() {

    this.storage.get(this.casinoItem).then((val) => {
      if(val != null && val != undefined) {
        this.casinoItemStoreA = val
      }
    })

    this.storage.get(this.casinoItemService).then((val) => {
      if(val != null && val != undefined) {
        this.casinoItemServiceStoreA = val
      }
    })

    this.servicesDetail = this.navParams.get('itemData')
  }

  closeModal() {
    this.modalController.dismiss()

    let options: NativeTransitionOptions = {
      duration: 800
     }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'testing'])
  }

  async optionsList() {
    this.closeModal()
    this.storage.get(this.casinoItemOption).then((val) => {

      if(val != null && val != undefined) {

        this.casinoItemOptionStoreA = val

      }

    })
    const modal = await this.modalController.create({
      component: OptionmodalPage
    })

    modal.present()
  }

}
