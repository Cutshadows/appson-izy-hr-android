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
  @Output() attendanceView = new EventEmitter<string>();
  @Output() attendanceDetail = new EventEmitter<string>();
  @Output() goInformation = new EventEmitter<string>();
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
      case 'selectSucursal':
        this.goDashboard.emit();
        break;
      case 'attendanceView':
        this.attendanceView.emit();
        break;
      case 'attendanceDetail':
        this.attendanceDetail.emit();
        break;
      case 'information':
         this.goInformation.emit();
         break;
      case  'mydevices':
        this.goDashboard.emit();
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
