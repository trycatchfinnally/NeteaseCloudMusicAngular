import { Injectable,EventEmitter } from '@angular/core';
import { AudioService } from './audio.service';
 

@Injectable({
  providedIn: 'root'
})
export class CommentChangeService {
  public  get commentUpdateEvent (){
    return new EventEmitter<string>();
  }
  constructor(private audioService:AudioService) {


    this.audioService.trackChangeEventEmitter.subscribe(x=>
      {
      this.commentUpdateEvent.emit("");
      }
      )
   }
}
