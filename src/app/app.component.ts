import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Storage } from '@ionic/storage';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthenticationService,
    private storage: Storage,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions    
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.authenticationState.subscribe(state => {

        console.log('state --', state)
        
        if(state) {
          let options: NativeTransitionOptions = {
            duration: 800
          }
        
          this.nativePageTransitions.fade(options);
          this.navController.navigateRoot(['members', 'dashboard'])       
          //this.navController.navigateRoot(['members', 'casino'])       
        } else {
          let options: NativeTransitionOptions = {
            duration: 800
          }
        
          this.nativePageTransitions.fade(options);
          this.navController.navigateRoot(['login'])
        }
      });      

    });

  }
}
