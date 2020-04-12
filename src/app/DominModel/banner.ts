import { bannerType } from '../Enums/bannerType';

export interface Banner {
    picUrl:string;
    url:string;
    targetId:number;
    bannerType:bannerType
}
