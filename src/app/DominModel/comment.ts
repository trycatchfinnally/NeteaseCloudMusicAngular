import { User } from './user';

export interface comment {
    commentId:number;
    content:string;
    isRemoveHotComment:boolean;
    likedCount :number;
    time:Date;
    status :number;
    user:User;
    liked:boolean;
    beReplied:comment[];
    hasReplied:boolean;
}
