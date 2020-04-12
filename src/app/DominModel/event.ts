import { User } from "./user";
import { Music } from "./music";
import { Mv } from "./mv";
import { commentThread } from "./commentThread";
import { Album } from './album';
import { playTrackType } from '../Enums/playTrackType';
import { PlayList } from './play-list';

export interface eventResult {
  more: boolean;
  lastTime: number;
  code: number;
  aEvents: aEvent[];
}
export interface aEvent {
  actName: string;
  forwardCount: number;
  user: User;
  json: string;
  jsonMessage: eventMessage;
  uuid: string;
  expireTime: number;
  eventTime: number;
  actId: number;
  showTime: number;
  id: number;
  type: number;
  topEvent: number;
  insiteForwardCount: number;
  info: eventInfo;
  pics: eventPicture[];
  pendantData: eventPendantData;
}
export interface eventMessage {
  msg: string;
  music: Music;
  mv: Mv;
  album: Album;
  playList: PlayList;
  aEvent: aEvent;
}
export interface eventInfo {
  commentThread: commentThread;
  liked: boolean;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  hotCount: number;
  resourceOwnerId: number;
  resourceTitle: string;
  resourceId: number;
  threadId:string;
}
export interface eventPicture {
  width: number;
  height: number;
  originUrl: string;
  squareUrl: string;
  rectangleUrl: string;
  pcSquareUrl: string;
  pcRectangleUrl: string;
  format: string;
}
export interface eventPendantData {
  id: number;
  imageUrl: string;
  imageAndroidUrl: string;
  imageIosUrl: string;
}
