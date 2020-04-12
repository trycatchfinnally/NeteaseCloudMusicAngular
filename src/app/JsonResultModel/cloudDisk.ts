import {
  Music
} from '../DominModel/music';
import {
  IPlayableModel
} from '../DominModel/IPlayableModel';
import { playTrackType } from '../Enums/playTrackType';
export class fileSize {
  size: number;
  kiloByteSize: number;
  megaByteSize: number;
  gigabyteSize: number;
   

}
export class cloudMusic implements  IPlayableModel {
 
  picUrl: string;
   id: number;
   name: string;
  artist: string;
  album: string;
  simpleMusic: Music;
  fileName: string;
}
export interface cloudDisk {
  count: number;
  size: fileSize;
  maxSize: fileSize;
  hasMore: boolean;
  cloudMusics: cloudMusic[];
}
