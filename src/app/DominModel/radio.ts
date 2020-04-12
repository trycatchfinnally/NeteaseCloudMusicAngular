import { IPlayableModel } from './IPlayableModel';

export class Radio  implements IPlayableModel {
    name: string;
    picUrl:string;
    title:string;
    copyWriter:string;
    description:string;
    subscribedCount:number;
    id:number;
}
