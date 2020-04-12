import { User } from './user';

export interface PlayList {
    id:number;
    picUrl:string;
    name:string;
    copyWriter:string;
    playCount:number;
    trackCount:number;
    createUser:User;
}
