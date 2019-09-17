import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage, 
    private plt: Platform,
    public toastController: ToastController
    ) { 
    this.plt.ready().then(() => {
      this.checkToken();
    })
  }

  login() {
    return this.storage.set(TOKEN_KEY, 'Bearer 123456').then(res => {
      this.authenticationState.next(true);
    })
  }

  logout() { 
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.storage.remove('casinoItem').then(() => {
      })

      this.storage.remove('casinoItemOption').then(() => {
      })

      this.authenticationState.next(false);
      window.location.reload()      
    })
  }

  async signOutToast() {
    const toast = await this.toastController.create({
      message: 'You are now signed out',
      position: 'middle',
      duration: 2500
    });
    toast.present()
  }  

  isAuthenticated() {    
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if(res) {
        this.authenticationState.next(true);
      }
    });
  }

}
