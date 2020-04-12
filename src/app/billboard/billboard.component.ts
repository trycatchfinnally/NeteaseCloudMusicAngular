import { Component, OnInit } from '@angular/core';
import { billBoard } from '../DominModel/billBoard';
import { DefaultHttpService } from '../service/default-http-service';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.css']
})
export class BillboardComponent implements OnInit {
 private _billBoards:billBoard[]=[];
 public get officialBillBoards(){
return this._billBoards.filter(x=>x.someTracksName&&x.someTracksName.length>0);
 }
 public get globalBillBoards(){
  return this._billBoards.filter(x=>x.someTracksName==null||x.someTracksName.length==0);
 }
  constructor(private httpService:DefaultHttpService) { }

  ngOnInit() {
    this.httpService.GetFromServer<billBoard[]>('BillBoard','GetTopList',{}).subscribe(x=>this._billBoards=x);
  }

}
