import { Component, OnInit } from '@angular/core';
import { artistsPageInfo } from '../DominModel/pageInfo';
import { DefaultHttpService } from '../service/default-http-service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  public selectedLang=99;
  public selectedCat=99;
  public selectPinYin='99';
  public artistsPages:artistsPageInfo;
  constructor(private httpService:DefaultHttpService) {
    this.artistsPages=new artistsPageInfo(httpService);
   }

  ngOnInit() {
      this.fetchFromServer();
  }
  private fetchFromServer(){
this.artistsPages.init(this.selectedLang,this.selectedCat,this.selectPinYin);
  }
langClick(num:number){
  this.selectedLang=num;
  this.fetchFromServer();
}
catClick(num:number){
  this.selectedCat=num;
  this.fetchFromServer();
}
pinYinClick(pinYinCode:string){
  this.selectPinYin=pinYinCode;
  this.fetchFromServer();
}
}
