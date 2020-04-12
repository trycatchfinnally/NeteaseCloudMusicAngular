import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import "src/app/my-own-shared-module";
import { MyOwnSharedModule } from "src/app/my-own-shared-module";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HomeComponent } from "./home/home.component";
import { DefaultHttpService } from "./service/default-http-service";
import { SlidenavItemsComponent } from "./slidenav-items/slidenav-items.component";
import { NZ_I18N, zh_CN } from "ng-zorro-antd";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
import { SearchComponent } from "./search/search.component";
import { CountpipePipe } from "./pipes/countpipe.pipe";
import { EverydayMusicComponent } from "./everyday-music/everyday-music.component";
import { LoginServiceService } from "./service/login-service.service";
import { DurationPipe } from "./pipes/duration.pipe";
import { BillboardComponent } from "./billboard/billboard.component";
import { PlaylistDetailComponent } from "./playlist-detail/playlist-detail.component";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { PlayPanelComponent } from "./play-panel/play-panel.component";
import { httpInterceptorProviders } from "./http-interceptors";
import { CommentComponent } from "./comment/comment.component";
import { CommentChangeService } from "./service/comment-change.service";
import { ArtistComponent } from "./artist/artist.component";
import { AlbumComponent } from "./album/album.component";
import { MvComponent } from "./mv/mv.component";
import { UserComponent } from "./user/user.component";
import { TopArtistComponent } from "./top-artist/top-artist.component";
import { PlayListComponent } from "./play-list/play-list.component";
import { NewestMusicsComponent } from "./newest-musics/newest-musics.component";
import { ArtistsComponent } from "./artists/artists.component";
import { UsercloudComponent } from "./usercloud/usercloud.component";
import { NzCollectMusicModalCustomComponent } from "./nz-collect-music-modal-custom/nz-collect-music-modal-custom.component";
import { NzLoginModalCustomComponent } from "./nz-login-modal-custom/nz-login-modal-custom.component";
import { NzCommentModalCustomComponent } from "./nz-comment-modal-custom/nz-comment-modal-custom.component";
import { PlaylistCommentComponent } from "./playlist-comment/playlist-comment.component";
import { LikeListProviderService } from "./service/like-list-provider.service";
import { LikeOrDisLikeMusicService } from "./service/like-or-dis-like-music.service";
import { CollectionService } from "./service/collection.service";
import { EventComponent } from './event/event.component';
import { TimepipePipe } from './pipes/timepipe.pipe';
import { AEventItemComponent } from './a-event-item/a-event-item.component';
import { ChangeUserInfoComponent } from './change-user-info/change-user-info.component';
import { NzRegisterModalCustomComponent } from './nz-register-modal-custom/nz-register-modal-custom.component';
import { UpdatePlaylistComponent } from './update-playlist/update-playlist.component';
import { PlaylistcategorysComponent } from './playlistcategorys/playlistcategorys.component';

registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,

    FooterComponent,

    HeaderComponent,

    NotFoundComponent,

    HomeComponent,

    SlidenavItemsComponent,

    SearchComponent,

    CountpipePipe,

    EverydayMusicComponent,

    DurationPipe,

    BillboardComponent,

    PlaylistDetailComponent,

    ControlPanelComponent,

    PlayPanelComponent,

    CommentComponent,

    ArtistComponent,

    AlbumComponent,

    MvComponent,

    UserComponent,

    TopArtistComponent,

    PlayListComponent,

    NewestMusicsComponent,

    ArtistsComponent,

    UsercloudComponent,

    NzCollectMusicModalCustomComponent,

    NzLoginModalCustomComponent,

    NzCommentModalCustomComponent,

    PlaylistCommentComponent,

    EventComponent,

    TimepipePipe,

    AEventItemComponent,

    ChangeUserInfoComponent,

    NzRegisterModalCustomComponent,

    UpdatePlaylistComponent,

    PlaylistcategorysComponent
  ],
  imports: [MyOwnSharedModule],
  providers: [
    httpInterceptorProviders,
    DefaultHttpService,
    CommentChangeService,
    { provide: NZ_I18N, useValue: zh_CN },
    LoginServiceService,
    LikeListProviderService,
    LikeOrDisLikeMusicService,
    CollectionService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    NzCollectMusicModalCustomComponent,
    NzLoginModalCustomComponent,
    NzCommentModalCustomComponent,
    NzRegisterModalCustomComponent,
    PlaylistcategorysComponent
  ]
})
export class AppModule {}
