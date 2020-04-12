import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DefaultHttpService } from '../service/default-http-service';
import { cloudDisk, fileSize, cloudMusic } from '../JsonResultModel/cloudDisk';
import { AddtoplayService } from '../service/addtoplay.service';
import { AudioService } from '../service/audio.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { userCloudMusicsPageInfo } from '../DominModel/pageInfo';
import { Music } from '../DominModel/music';
import { playTrackType } from '../Enums/playTrackType';

@Component({
  selector: 'app-usercloud',
  templateUrl: './usercloud.component.html',
  styleUrls: ['./usercloud.component.css']
})
export class UsercloudComponent implements OnInit {
  private _isSelectedMode=false;
  private _selectedCloudMusics:cloudMusic[]=[];
  public userCloudMusic:userCloudMusicsPageInfo;
  constructor(private htpService:DefaultHttpService,private audioService:AudioService) {
   this.userCloudMusic=new userCloudMusicsPageInfo(htpService);
   }
// ngAfterViewInit(): void {
//   if(this.eventAdded||!this.searchInput)return;
//   fromEvent(this.searchInput.nativeElement, 'input').pipe(debounceTime(500), distinctUntilChanged())
//     .subscribe(x => {
//       this.displayMusicCollection=[];
//       if (this.searchKey == undefined || this.searchKey.length === 0) {
//         this.prepareForDisplay(this.playListDetailModel.musics);
//         return;
//       }
//       let searchResult: Music[] = [];
//       this.playListDetailModel.musics.forEach(y => {
//         if (y.name.indexOf(this.searchKey) != -1)
//           searchResult.push(y);
//         else if (y.album.name.indexOf(this.searchKey) != -1)
//           searchResult.push(y);
//         else{
//           for (let index = 0; index < y.artists.length; index++) {
//             let element = y.artists[index];
//             if(element.name.indexOf(this.searchKey) != -1)
//           searchResult.push(y);

//           }
//         }
//       }
     

//       );
//       this.prepareForDisplay(searchResult);
      
//     });
//     this.eventAdded=true;
  
// }
  ngOnInit() {
   this.userCloudMusic.init();
  }
  private playSingleOne(cloudmusc:cloudMusic){
    // let tempMusic=new Music();
    // tempMusic.id=cloudmusc.id;
    // tempMusic.name=cloudmusc.name;
     
    this.audioService.play(cloudmusc,playTrackType.cloudDiskMusic);
  }
  playOrSelected(cloudmusc:cloudMusic){
if(this._isSelectedMode)
this._selectedCloudMusics.push(cloudmusc);
else this.playSingleOne(cloudmusc);
  }

  
}
