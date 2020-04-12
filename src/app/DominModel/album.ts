import { Data } from '@angular/router';
import { Music } from './music';
import { Artist } from './artist';
import { SelectableMusic } from './SelectableMusic';

export interface Album {
    id:number;
    picUrl:string;
    name:string;
    createDate :Data;
    description:string;
    musics:SelectableMusic[];
    artists :Artist[];
    artist:Artist;
    collectionCount:number;
    commentCount:number;
    trackCount:number;
}
