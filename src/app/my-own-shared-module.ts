
import { NgModule } from '@angular/core';
 
 
import {  NgZorroAntdModule} from 'ng-zorro-antd';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@NgModule({
  imports: [NgZorroAntdModule,BrowserModule, 
    AppRoutingModule,  HttpClientModule,
    BrowserAnimationsModule,  FormsModule,ReactiveFormsModule],
  exports: [NgZorroAntdModule,BrowserModule, 
    AppRoutingModule,  HttpClientModule,
    BrowserAnimationsModule,  FormsModule,ReactiveFormsModule],
})
export class MyOwnSharedModule {
}
