import { User } from '../DominModel/user';
import { Music } from '../DominModel/music';

export interface PlayListDetail {
    picUrl:string;
    name:string;
    createUser:User;
    createDate:Date;
    collectionCount:number;
    commentCount:number;
    tags:string[];
    description:string;
    musics:Music[];id:number;
}
