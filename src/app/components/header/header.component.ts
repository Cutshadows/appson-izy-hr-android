import { Component, OnInit, Input} from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})

export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  footer_izy_hr: string = 'assets/img/footer_izy_hr.png'

  constructor() {}

  ngOnInit() {}
}
