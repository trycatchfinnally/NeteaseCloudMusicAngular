import { comment } from '../DominModel/comment';

export interface CommentCollection {
    userId:string;
    more:boolean;
    moreHot:boolean;
    total:number;
    comments:comment[];
hotComments :comment[];
topicComments :comment[];

}
