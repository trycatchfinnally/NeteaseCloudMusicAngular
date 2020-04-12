import { Music } from '../DominModel/music';
import { Artist } from '../DominModel/artist';
import { Album } from '../DominModel/album';
 
import { PlayList } from '../DominModel/play-list';
import { User } from '../DominModel/user';
import { Mv } from '../DominModel/mv';
import { Radio } from '../DominModel/radio';
import { KeyValue } from '@angular/common';

export interface SearchResultModel{
    musics:KeyValue<number,Music[]>;
    artists:KeyValue<number,Artist[]>;
    albums:KeyValue<number,Album[]>;
    playLists:KeyValue<number,PlayList[]>;
    users:KeyValue<number,User[]>;
    mvs:KeyValue<number,Mv[]>;
    radios:KeyValue<number,Radio[]>;
}