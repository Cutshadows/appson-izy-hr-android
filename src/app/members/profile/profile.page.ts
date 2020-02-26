import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavController } from '@ionic/angular';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userInfoItems:any
  currentVal=2;

  userLoginResDetail: string = 'userLoginResDetail'

  my_profile_page: string = 'assets/img/page/my_profile_page.png'

  constructor(
    private authService: AuthenticationService,
    private storage: Storage,
    public navController: NavController,
    private nativePageTransitions: NativePageTransitions
    ) {

  }

  ngOnInit() {
    this.storage.get(this.userLoginResDetail).then((val) => {
      if(val != null && val != undefined) {
		this.userInfoItems = val
      }
    })
  }

  dashboardGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'dashboard'])
  }

  logout() {
    this.authService.logout();
  }

  changepasswordGo() {
    let options: NativeTransitionOptions = {
      duration: 800
    }

    this.nativePageTransitions.fade(options);
    this.navController.navigateRoot(['members', 'changepassword'])
  }

}
