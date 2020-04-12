import {
  DefaultHttpService
} from '../service/default-http-service';
import {
  SearchResultModel
} from '../JsonResultModel/SearchResultModel';
import {
  KeyValue
} from '@angular/common';
import {
  Album
} from './album';
import {
  Mv
} from './mv';
import {
  PlayList
} from './play-list';
import { Artist } from './artist';
import { cloudDisk, fileSize } from '../JsonResultModel/cloudDisk';
export abstract class pageInfoBase {
  protected _limit = 30;
  protected _currentPage = 0;
  protected _isLoading = false;
  protected _data: any[] = [];
  public get data() {
    return this._data;
  }
  public get limit() {
    return this._limit;
  }
  public get offset() {
    return this.limit * this._currentPage;
  }
  public get isLoading() {
    return this._isLoading;
  }
  public abstract get more(): boolean;
  public abstract fetchNextPage(): void;
}

export class searchPageInfo extends pageInfoBase {

  constructor(private httpservice: DefaultHttpService, private searchType: searchType) {
    super();

    this.init('', 0, []);
  }


  public get more() {
    return this.limit * (this._currentPage + 1) < this._total;
  }
  public get isLoading() {
    return this._isLoading;
  }


  private _total = 0;

  private _keyWord = '';

  public toModel(keyWord ? : string) {
    if (keyWord == null)
      keyWord = this._keyWord;
    return {
      keyWord: keyWord,
      limit: this.limit,
      offset: this.offset,
      searchType: this.searchType.toString()
    };
  }
  public init(keyWord: string, total: number, data: any[]) {
    this._keyWord = keyWord;
    this._total = total;
    this._currentPage = 0;
    this._isLoading = false;
    this._data = data;
  }
  public fetchNextPage() {
    if (!this.more) return;
    this._currentPage = 1 + this._currentPage;
    this._isLoading = true;
    this.httpservice.GetFromServer < SearchResultModel > ('Search', 'Search', this.toModel()).subscribe(x => {
      switch (this.searchType) {
        case searchType.Music:
          this._total = x.musics.key;
          this._data = this._data.concat(x.musics.value);
          break;
        case searchType.Artist:
          this._total = x.artists.key;
          this._data = this._data.concat(x.artists.value);
          break;
        case searchType.MV:
          this._total = x.mvs.key;
          this._data = this._data.concat(x.mvs.value);
          break;
        case searchType.Album:
          this._total = x.albums.key;
          this._data = this._data.concat(x.albums.value);
          break;
        case searchType.User:
          this._total = x.users.key;
          this._data = this._data.concat(x.users.value);
          break;
        case searchType.PlayList:
          this._total = x.playLists.key;
          this._data = this._data.concat(x.playLists.value);
          break;
        case searchType.Radio:
          this._total = x.radios.key;
          this._data = this._data.concat(x.radios.value);
          break;
        default:
          break;
      }
      this._isLoading = false;
    });
  }
}
export const enum searchType {
  Music = 1,
    Artist = 100,
    Album = 10,
    PlayList = 1000,
    User = 1002,
    MV = 1004,
    LRC = 1006,
    Radio = 1009,
    All = 1023
}
export abstract class genericPageInfo < T > extends pageInfoBase {
  private _more = false;
  private _id = 0;
  protected _data: T[] = [];
  public get data() {
    return this._data;
  }
  protected abstract get actionName(): string;
  protected abstract get controlName(): string;
  constructor(private httpservice: DefaultHttpService) {
    super();
  }
  protected toModel(): any {
    return {
      id: this._id,
      offset: this.offset,
      limit: this.limit
    };
  }
  public get more() {
    return this._more;
  }
  public init(id: any) {
    this._more = false;
    this._currentPage = 0;
    this._isLoading = true;
    this._data = [];
    this._id = id;
    this.httpservice.GetFromServer < KeyValue < boolean, T[] >> (this.controlName, this.actionName, this.toModel()).subscribe(x => {

      this._more = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
  public async initAsync(id: any){
    this._more = false;
    this._currentPage = 0;
    this._isLoading = true;
    this._data = [];
    this._id = id;
  let x=  await this.httpservice.GetFromServer < KeyValue < boolean, T[] >> (this.controlName, this.actionName, this.toModel()).toPromise();
  this._more = x.key;
  this._data = this._data.concat(x.value);
  this._isLoading = false;  
}
  public fetchNextPage() {
    if (!this.more) return;
    this._currentPage = 1 + this._currentPage;
    this._isLoading = true;

    this.httpservice.GetFromServer < KeyValue < boolean, T[] >> (this.controlName, this.actionName, this.toModel()).subscribe(x => {

      this._more = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
}
export class artistAlbumPageInfo extends genericPageInfo < Album > {
  protected get actionName(): string {
    return "GetArtistAlbum";
  }
  protected get controlName() {
    return "Artist";
  }

  constructor(httpservice: DefaultHttpService) {
    super(httpservice);
  }


}
export class artistMvPageInfo extends genericPageInfo < Mv > {
  protected get actionName(): string {
    return "GetArtistMv";
  }
  protected get controlName() {
    return "Artist";
  }
  constructor(httpservice: DefaultHttpService) {
    super(httpservice);
  }


}
export class userPlayListPageInfo extends genericPageInfo < PlayList > {
  public get limit() {
    return this._limit * 2;
  }
  protected get actionName(): string {
    return "GetUserPlayList";
  }
  protected get controlName() {
    return "User";
  }
  constructor(httpservice: DefaultHttpService) {
    super(httpservice);
  }

}
export class loginUserPlayListPageInfo extends userPlayListPageInfo{
  constructor(httpservice: DefaultHttpService) {
    super(httpservice);
  }
  public clear(){
    this._data=[];
    this._isLoading=false;
     
  }
}
export class topCategoryPlaylistPageInfo extends genericPageInfo < PlayList > {

  private _cat: string;
  constructor(httpservice: DefaultHttpService) {
    super(httpservice);
  }
  public toModel() {
    return {
      cat: this._cat,
      offset: this.offset,
      limit: this.limit
    };
  }
  public init(cat: string) {
    this._cat = cat;
    super.init(0);


  }

  protected get actionName(): string {
    return "GetTopPlayListByTag";
  }
  protected get controlName() {
    return "FindMusic";
  }
}
export class topAlbumsPageInfo extends pageInfoBase {

  constructor(private httpService: DefaultHttpService) {
    super();

  }
  private _total = 2147483647;
  protected get actionName() {
    return "TopAlbum";

  }
  protected get controlName() {
    return "FindMusic";

  }
  public get more() {
    return this._data.length < this._total;
  }
  protected toModel() {
    return {
      limit: this._limit,
      offset: this.offset
    };
  }
  public init() {

    this._currentPage = 0;
    this._isLoading = true;
    this._data = [];

    this.httpService.GetFromServer < KeyValue < number, Album[] >> (this.controlName, this.actionName, this.toModel()).subscribe(x => {

      this._total = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
  public fetchNextPage() {
    if (!this.more) return;
    this._currentPage = 1 + this._currentPage;
    this._isLoading = true;

    this.httpService.GetFromServer < KeyValue < number, Album[] >> (this.controlName, this.actionName, this.toModel()).subscribe(x => {

      this._total = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
}
export class artistsPageInfo extends pageInfoBase {
  private _more = true;
  private _lang = 99;
  private _cat = 99;
  private _pinYin = '99';

  constructor(private httpService: DefaultHttpService) {
    super();

  }
  protected get actionName() {
    return "ArtistsList";

  }
  protected get controlName() {
    return "FindMusic";

  }
  public get more(): boolean {
    return this._more;
  }
  public init(lang: number, cat: number, pinYin: string) {
    this._currentPage = 0;
    this._isLoading = true;
    this._data = [];
    this._cat = cat;
    this._lang = lang;
    this._pinYin = pinYin;
    this.httpService.GetFromServer<KeyValue < boolean, Artist[]> >(this.controlName,this.actionName,this.toModel()).subscribe(x=>{
      this._more = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
  protected toModel() {
    let relLang = this._lang == 99 ? 10 : this._lang;
    let relCat = this._cat == 99 ? 1 : this._cat;
    let relPinYinCode = 0;
    if (this._pinYin == '99') relPinYinCode = 0;
    else relPinYinCode = this._pinYin.charCodeAt(0);
    return {
      limit: this._limit,
      offset: this.offset,
      cat: relLang * 100 + relCat,
      initial: relPinYinCode
    };
  }
  public fetchNextPage() {
    if (!this.more) return;
    this._currentPage = 1 + this._currentPage;
    this._isLoading = true;

    this.httpService.GetFromServer < KeyValue < boolean, Artist[] >> (this.controlName, this.actionName, this.toModel()).subscribe(x => {

      this._more = x.key;
      this._data = this._data.concat(x.value);
      this._isLoading = false;
    });
  }
}
export class userCloudMusicsPageInfo extends pageInfoBase{
  private _more = true;
  private _size:fileSize;
  private _maxSize:fileSize;
  protected _limit =100;
  public get more(){return this._more;}
  public get usedSizeString(){
    return this.stringDescriptionSize(this._size);
  }
  public get totalSizeString(){
   return this.stringDescriptionSize(this._maxSize);
  }
  public get usePercent(){
    if(this._size==null||this._maxSize==null)return 1;
    return this._size.size/this._maxSize.size;
  }
  protected get actionName() {
    return "UserCloud";

  }
  protected get controlName() {
    return "User";

  }
  private stringDescriptionSize(size:fileSize){
    if(size==null)return "0Bytes";
    if (size.gigabyteSize > 1)
    return size.gigabyteSize.toFixed(2) + "G";
  if (size.megaByteSize > 1)
    return size.megaByteSize.toFixed(2) + "M";
  if (size.kiloByteSize > 1)
    return size.kiloByteSize.toFixed(2) + "K";
  return size.size + "Bytes";
  }
  constructor(private httpService: DefaultHttpService) {
    super();
  }
  protected toModel() {
     
    return {
      limit: this._limit,
      offset: this.offset,
    };
  }
  public init(){
    this._currentPage = 0;
    this._isLoading = true;
    this._data = [];
    this.httpService.GetFromServer<cloudDisk>(this.controlName,this.actionName,this.toModel()).subscribe(x=>{
      this._more = x.hasMore;
      this._data = this._data.concat(x.cloudMusics);
      this._isLoading = false;
      this._size=x.size;
      this._maxSize=x.maxSize;
    });
  }
  public fetchNextPage(){
    if (!this.more) return;
    this._currentPage = 1 + this._currentPage;
    this._isLoading = true;
    this.httpService.GetFromServer <cloudDisk> (this.controlName, this.actionName, this.toModel()).subscribe(x => {
      this._more = x.hasMore;
      this._data = this._data.concat(x.cloudMusics);
      this._isLoading = false;
      this._size=x.size;
      this._maxSize=x.maxSize;
    });
  }
}
