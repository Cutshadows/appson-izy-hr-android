import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  constructor(
    private toastController:ToastController,
    private alertController:AlertController,
    private loadingController:LoadingController,
    ) {}

  async MessageToast(bodyMessage, positionAlert,durationTime){
    const toast = await this.toastController.create({
      message: bodyMessage,
      position:positionAlert,
      duration: durationTime,
      cssClass:'my-custom-toast'
    });
    toast.present()
  }

  async requireAlert(messageBody, options:string) {
    const alert = await this.alertController.create({
      message: messageBody,
      cssClass:'classAlert',
      buttons: [
        {
          text:options,
          cssClass:'cssAlert'
      }
      ]
    });

    await alert.present()
  }
  
  async requireLoading(messageLoading, time) {
    const loadingElement = await this.loadingController.create({
      message: messageLoading,
      spinner: 'crescent',
      cssClass: 'transparent',
    });
    loadingElement.present()

    setTimeout(() => {
      loadingElement.dismiss()
    }, time)
  }

  //loading login personalizado
  /* async startLoginVerify(){
    let loadingElementMessage = await this.loadingController.create({
      message: 'Verificando Usuario',
      spinner: 'crescent',
      cssClass: 'transparent',
    });
    loadingElementMessage.present();
    setTimeout(() => {
      loadingElementMessage.dismiss()
    }, 1200)
  } */
  /* let loadingElement = this.loadingController.create({
    message: 'Verificando Usuario',
    spinner: 'dots',
    cssClass: 'transparent',
  });

  //CARGA EL LOADING
   loadingElement.present();
   loadingElement.dismiss(); */
}
