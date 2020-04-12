import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  DefaultHttpService
} from '../service/default-http-service';
import {
  HotkeywordResultRoot
} from '../DominModel/hotkeyword';
import {
  fromEvent,
  Observable,
  of ,
  Subject
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  retry,
  map,
  filter
} from 'rxjs/operators';
import {
  Album
} from '../DominModel/album';
import {
  Mv
} from '../DominModel/mv';
import {
  Music
} from '../DominModel/music';
import {
  PlayList
} from '../DominModel/play-list';

import {
  SearchResultModel
} from '../JsonResultModel/SearchResultModel';
import {
  AudioService
} from '../service/audio.service';
import {
  NzIconService
} from 'ng-zorro-antd';
import {
  searchPageInfo,
  searchType
} from '../DominModel/pageInfo';
import {   ActivatedRoute } from '@angular/router';
const searchHistoryKey = "search.history";
const searchHistoryMaxCacheLength = 10;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {
  @ViewChild("inputKeyWord") inputKeyWord: ElementRef;
 public searchKey: string;
 public searchHots: string[];
 public searchHistory: string[] = [];
 public searchKeyWordSuggest: string[] = [];
 public searchKeyWordSuggestLoading = false;
 public searchResultShow = false;
 public inputKeyWordObservable: Observable < string > ;
    
 public  loadingMoreMusic = false;
 
 public searchPageInfos: searchPageInfo[];
  private searchSubject: Subject < string >= new Subject < string > ();
  
  constructor(private httpservice: DefaultHttpService, private audioService: AudioService, 
    private iconService: NzIconService,private route: ActivatedRoute) {
    this.searchPageInfos = [new searchPageInfo(httpservice, searchType.Music),
      new searchPageInfo(httpservice, searchType.Artist),
      new searchPageInfo(httpservice, searchType.Album),
      new searchPageInfo(httpservice, searchType.MV),
      new searchPageInfo(httpservice, searchType.PlayList),
      new searchPageInfo(httpservice, searchType.Radio),
      new searchPageInfo(httpservice, searchType.User)
    ];
   
    this.iconService.fetchFromIconfont({
      scriptUrl: "https://at.alicdn.com/t/font_1368309_ainxci6xwb.js"
    });
  }

  ngOnInit() {

    this.subScribeEvent();
    //  const searchHistoryKey = "search.history";
    this.httpservice.GetFromServer < HotkeywordResultRoot > ("search", "hot", {}).subscribe(x => {

      this.searchHots = x.result.hots.map(y => y.first);
    });
    this.getHistorys();
    this.searchSubject.pipe(debounceTime(100), filter(x => x != null && x != undefined && x.length > 0), distinctUntilChanged(), switchMap(x => {
      return this.httpservice.GetFromServer < SearchResultModel > ('Search', 'Search', new searchPageInfo(this.httpservice, searchType.All).toModel(x));
    }), retry(3)).subscribe(x => {
      
      this.getBindFromAll(x);
      this.searchResultShow = true;
    });
    
    this.route.paramMap.subscribe(x => { 
      if (x.has("keyword")){
     let  key = x.get('keyword');
     key=key.trim();
     if(key.length>0){this.searchKey=key;this.doSearch();}
    }
    });
    
  }
  //将搜索出来的所有项目绑定到对应的属性上
  private getBindFromAll(dataForBind: SearchResultModel) {  
    this.searchPageInfos[0].init(this.searchKey, dataForBind.musics.key, dataForBind.musics.value);
    this.searchPageInfos[1].init(this.searchKey, dataForBind.artists.key, dataForBind.artists.value);
    this.searchPageInfos[2].init(this.searchKey, dataForBind.albums.key, dataForBind.albums.value);
    this.searchPageInfos[3].init(this.searchKey, dataForBind.mvs.key, dataForBind.mvs.value);
    this.searchPageInfos[4].init(this.searchKey, dataForBind.playLists.key, dataForBind.playLists.value);
    this.searchPageInfos[5].init(this.searchKey, dataForBind.radios.key, dataForBind.radios.value);
    this.searchPageInfos[6].init(this.searchKey, dataForBind.users.key, dataForBind.users.value);
  }
  //订阅搜索框的输入事件
  subScribeEvent() {
    this.inputKeyWordObservable = fromEvent(this.inputKeyWord.nativeElement, 'input').pipe(debounceTime(500), distinctUntilChanged(), switchMap(x => {
      this.searchKeyWordSuggest.splice(0, this.searchKeyWordSuggest.length);
      if (this.searchKey == undefined || this.searchKey.length === 0) {
        this.searchResultShow = false;
        return of("");
      }
      return this.httpservice.GetFromServer < string > ("search", "suggest", {
        keyWord: this.searchKey
      })
    }));
    this.inputKeyWordObservable.subscribe(y => {
      if (y == "") return;
      let albums: Album[] = y["albums"];
      let mVs: Mv[] = y["mVs"];
      let musics: Music[] = y["musics"];
      let playLists: PlayList[] = y["playLists"];
      let temp: string[] = [];
      if (albums) {
        albums.forEach(al => {
          if (al.name && al.name.indexOf(this.searchKey) > -1)
            temp.push(al.name);
          else if (al.artist && al.artist.name && al.artist.name.indexOf(this.searchKey) > -1)
            temp.push(al.artist.name);
        });
      }
      if (mVs) {
        mVs.forEach(mv => {
          if (mv.name && mv.name.indexOf(this.searchKey) > -1)
            temp.push(mv.name);
          else if (mv.artists && mv.artists[0].name.indexOf(this.searchKey) > -1)
            temp.push(mv.artists[0].name);
        });
      }
      if (musics) {
        musics.forEach(music => {
          if (music.name && music.name.indexOf(this.searchKey) > -1)
            temp.push(music.name);
          else if (music.artists && music.artists[0].name.indexOf(this.searchKey) > -1)
            temp.push(music.artists[0].name);
        });
      }
      if (playLists) {
        playLists.forEach(playList => {
          if (playList.name && playList.name.indexOf(this.searchKey) > -1)
            temp.push(playList.name);

        });
      }
      this.searchKeyWordSuggest = this.distinctArray(temp).sort();
    });
  }
  //搜索历史
  getHistorys() {

    let historys = localStorage.getItem(searchHistoryKey);
    if (historys != undefined)
      this.searchHistory = JSON.parse(historys);
  }
  //删除搜索历史
  deleteHistory() {
    //const searchHistoryKey = "search.history";

    if (this.searchHistory) {
      this.searchHistory.splice(0, this.searchHistory.length);
      localStorage.removeItem(searchHistoryKey);
    }
  }
  //删除某一个搜索历史
  deleteHistoryByKey(key: string) {
    let index = this.searchHistory.indexOf(key);
    if (index > -1) {
      this.searchHistory.splice(index, 1);
      localStorage.setItem(searchHistoryKey, JSON.stringify(this.searchHistory));
    }
  }
  //点击下面的小按钮
  searchHotsClick(key: string) {
    this.searchKey = key;
    this.doSearch();
  }
  //搜索历史对应的点击事件
  searchHistoryClick(key: string) {

    this.searchHotsClick(key);
  }
  //正在执行搜索
  doSearch() {
    console.log("开始搜索。。。" + this.searchKey);
    this.searchKeyWordSuggest.splice(0, this.searchKeyWordSuggest.length);
    if (!this.searchKey) return;
    if (this.searchHistory.indexOf(this.searchKey) < 0) {
      let newLength = this.searchHistory.push(this.searchKey);
      if (newLength > searchHistoryMaxCacheLength)
        this.searchHistory.shift();

      localStorage.setItem(searchHistoryKey, JSON.stringify(this.searchHistory));
    }
    this.searchSubject.next(this.searchKey);
  }
  //选中搜索弹出的按钮
  searchKeyWordSuggestSelect(selectSuggest: string) {
    this.searchKey = selectSuggest;
    this.doSearch();
  }
  //选中输入的建议
  selectInputSuggest(item: string) {
    this.searchKey = item;
   
    this.doSearch();
  }
  //播放选中的搜索项
  searchMusicClick(music: Music) {
    this.audioService.play(music);
  }
  //去除重复元素
  private distinctArray(arr: string[]) {
    let left: string[] = [];
    let result: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];
      if (left.indexOf(temp) < 0) {
        result.push(temp);
      }

      left.push(temp);
    }
    left.splice(0, left.length);
    return result;
  }
  // onLoadMore(type: number) {
  //   if (type < 0 || type >= this.pageInfos.length) return;
  //   this.loadingMoreMusic = true;
  //   let page = this.pageInfos[type];
  //   if (type == 0) {

  //     this.httpservice.GetFromServer < SearchResultModel > ('Search', 'Search', {
  //       keyWord: this.searchKey,
  //       limit: 30,
  //       offset: page * 30,
  //       searchType: 'Music'
  //     }).subscribe(x => {
  //       //this.searchResultModel.musics.value = this.searchResultModel.musics.value.concat(x.musics.value);
  //       this.pageInfos[type] = page + 1;
  //       this.loadingMoreMusic = false;
  //     })

  //   }
  // }
}
