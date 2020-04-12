import { Time, KeyValue } from '@angular/common';
import { Artist } from './artist';

 

export interface Mv {
    id:number;
    picUrl:string;
    duration:any;
    name:string;
    playCount:number;
    desc:string;
    url:KeyValue<number,string>[];
    subCount:number;
    commentCount:number;
    commendThreadId:string;
    publishTime:any;
    artists:Artist[];
}
