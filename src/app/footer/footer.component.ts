import { Component, OnInit } from '@angular/core';
import { DefaultHttpService } from '../service/default-http-service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public serviceInfo = "";
  constructor(private httpService:DefaultHttpService) { }

  ngOnInit() {
    this.httpService
      .GetFromServer<KeyValue<string,string>>("Common", "GetServiceInfo", {})
      .subscribe(x => (this.serviceInfo = "运行在 " + x.value));
  }

}
