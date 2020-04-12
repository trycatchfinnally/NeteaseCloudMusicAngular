import { Music } from './music';
import { playTrackType } from '../Enums/playTrackType';
 

export class SelectableMusic extends Music
{
    
    pop: string;    duration: Date;
    picUrl: string;
    name: string;
    exclusive: boolean;
    id: number;
    artists: import("./artist").Artist[];
    album: import("./album").Album;
    mvId: number;
    isLike: boolean;
    url: string;
    musicQuality: number;
    isSelected=false;

}