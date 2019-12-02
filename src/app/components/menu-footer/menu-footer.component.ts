import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core"; //, Input, Output, EventEmitter
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu-footer',
  templateUrl: './menu-footer.component.html',
  styleUrls: ['./menu-footer.component.scss'],
})
export class MenuFooterComponent implements OnInit {
  buttonChange:any;
  @Input() id: string;
  @Input() valCapa: number;
  @Output() goDashboard = new EventEmitter<string>();
  @Output() profileEmployed = new EventEmitter<string>();
  @Output() logout = new EventEmitter<string>();
  constructor(
    private nativePageTransitions: NativePageTransitions,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.cargarNavegacion();
}
  clickBack() {
    switch (this.id) {
      case 'calendar':
        this.goDashboard.emit();
        break;
      case 'casino':
        this.goDashboard.emit();
      break;
      case 'events':
          this.goDashboard.emit();
      break;
      case 'mymark':
        this.goDashboard.emit();
      break;
      case  'myprofile':
        this.goDashboard.emit();
        break;
      case 'enterMark':
        this.goDashboard.emit();
      break;
      case 'changePassword':
        this.profileEmployed.emit();
      break;
    }
  }
  Logout() {
    this.logout.emit();
  }
  goHome(){
    let options: NativeTransitionOptions = {
      duration: 800
    }
    this.nativePageTransitions.fade(options)
    this.router.navigate(['members', 'dashboard'])
  }
  cargarNavegacion(){
    switch(this.valCapa){
      case 1:
        this.buttonChange=0;
        break;
      case 2:
        this.buttonChange=1;
        break;
      case 3:
        this.buttonChange=2;
        break;
    }
  }
}
