import { Music } from './music';
import { SelectableMusic } from './SelectableMusic';

export interface Artist {
    id:number;
    name:string;
    alias:string;
    picUrl:string;
    hotMusics:SelectableMusic[];
    mvCount:number;
    musicCount:number;
    albumCount:number;
    hotScore:number;
    accountId:number;
}
