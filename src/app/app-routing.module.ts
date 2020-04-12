import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HomeComponent } from "./home/home.component";
import { SearchComponent } from "./search/search.component";
import { EverydayMusicComponent } from "./everyday-music/everyday-music.component";
import { AuthGuardGuard } from "./RouterGuard/auth-guard.guard";
import { BillboardComponent } from "./billboard/billboard.component";
import { PlaylistDetailComponent } from "./playlist-detail/playlist-detail.component";
import { PlayPanelComponent } from "./play-panel/play-panel.component";
import { PlayPanelGuard } from "./RouterGuard/play-panel.guard";
import { ArtistComponent } from "./artist/artist.component";
import { AlbumComponent } from "./album/album.component";
import { MvComponent } from "./mv/mv.component";
import { UserComponent } from "./user/user.component";
import { TopArtistComponent } from "./top-artist/top-artist.component";
import { PlayListComponent } from "./play-list/play-list.component";
import { NewestMusicsComponent } from "./newest-musics/newest-musics.component";
import { ArtistsComponent } from "./artists/artists.component";
import { UsercloudComponent } from "./usercloud/usercloud.component";
import { PlaylistCommentComponent } from "./playlist-comment/playlist-comment.component";
import { EventComponent } from "./event/event.component";
import { ChangeUserInfoComponent } from "./change-user-info/change-user-info.component";
import { NzRegisterModalCustomComponent } from "./nz-register-modal-custom/nz-register-modal-custom.component";
import { UpdatePlaylistComponent } from "./update-playlist/update-playlist.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "search", component: SearchComponent },
  {
    path: "everydaymusic",
    component: EverydayMusicComponent,
    canActivate: [AuthGuardGuard],
  },
  { path: "billboard", component: BillboardComponent },
  {
    path: "playlistdetail/:playlistid",
    component: PlaylistDetailComponent,
    pathMatch: "full",
  },
  {
    path: "playdetail/comment",
    component: PlaylistCommentComponent,
    pathMatch: "full",
  },
  {
    path: "playdetail",
    component: PlayPanelComponent,
    canActivate: [PlayPanelGuard],
  },
  { path: "artist/:artistid", component: ArtistComponent, pathMatch: "full" },
  { path: "album/:albumid", component: AlbumComponent, pathMatch: "full" },
  { path: "mv/:mvid", component: MvComponent, pathMatch: "full" },
  { path: "user/:userid", component: UserComponent, pathMatch: "full" },
  {
    path: "billboard/topArtist",
    component: TopArtistComponent,
    pathMatch: "full",
  },
  { path: "playList", component: PlayListComponent, pathMatch: "full" },
  { path: "newestMusics", component: NewestMusicsComponent, pathMatch: "full" },
  { path: "artists", component: ArtistsComponent, pathMatch: "full" },
  {
    path: "userCloudDisk",
    component: UsercloudComponent,
    canActivate: [AuthGuardGuard],
    pathMatch: "full",
  },
  {
    path: "events",
    component: EventComponent,
    canActivate: [AuthGuardGuard],
    pathMatch: "full",
  },
  {
    path: "changeUserInfo",
    component: ChangeUserInfoComponent,
    canActivate: [AuthGuardGuard],
    pathMatch: "full",
  },
  {
    path: "updatePlaylist/:playlistid",
    component: UpdatePlaylistComponent,
    canActivate: [AuthGuardGuard],
    pathMatch: "full",
  },

  { path: "notfound", component: NotFoundComponent },
  { path: "**", redirectTo: "notfound" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
