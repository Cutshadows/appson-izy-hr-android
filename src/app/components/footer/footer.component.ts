import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footer_izy_hr: string = 'assets/img/footer_izy_hr.png'

  constructor() { }

  ngOnInit() {
  }

}
