import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AudioService } from '../service/audio.service';

@Injectable({
  providedIn: 'root'
})
export class PlayPanelGuard implements  CanActivate{
  constructor( private audioService:AudioService,private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   if(!this.audioService.currentTrack)
   {this.router.navigate(['/home']);
   return false;}
  // this.router.navigate(['/home']);
   return true;
  }
  
}
