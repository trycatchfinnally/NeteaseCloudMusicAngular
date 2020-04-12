import { Injectable } from "@angular/core";
import { DefaultHttpService } from "./default-http-service";
import { Music } from "../DominModel/music";
import { KeyValue } from "@angular/common";
import { SelectableMusic } from '../DominModel/SelectableMusic';

@Injectable({
  providedIn: "root"
})
export class MusicUrlAvailableCheckerService {
  constructor(private httpService: DefaultHttpService) {}
  //检查给定的音乐url是否可用
  public async CheckMusicsAsync(musics: Music[] ) {
    try {
      let temp = await this.httpService
        .PostToServer<KeyValue<number, boolean>[]>("Music", "CheckMusics", {
          ids: musics.map(x => x.id).toString()
        })
        .toPromise();
      temp.forEach(x => (musics.find(y => y.id == x.key).available      = x.value));
    } catch (error) {
      console.warn("批量检查音乐可用功能发生了错误，将在播放时候进行检查");
      musics.forEach(x => (x.available = true));
    }
  }
  public async CheckOneMusicAsync(music:Music){
   let temp= await this.httpService
        .GetFromServer<KeyValue<number, boolean>[]>("Music", "CheckMusics", {
          ids: [music.id]
        })
        .toPromise();
        music.available=temp[0].value;
  }
}
