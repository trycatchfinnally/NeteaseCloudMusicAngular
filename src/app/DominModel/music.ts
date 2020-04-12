import { Artist } from './artist';
import { Album } from './album';
import { MusicQuality } from '../Enums/music-quality.enum';
import { IPlayableModel } from './IPlayableModel';
import { playTrackType } from '../Enums/playTrackType';

export class Music implements IPlayableModel {
   
     typeDiv:playTrackType;
    
    pop:string;
    duration: Date;
    picUrl:string;
    name:string;
    exclusive:boolean;
    id:number;
    artists:Artist[];
    album:Album;
    mvId:number;
    isLike:boolean;
    url:string;
    musicQuality:number;
    available?:boolean;
}


