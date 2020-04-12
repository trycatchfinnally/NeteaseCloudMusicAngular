import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
   
    let d:string=value;
    if(d){
      //00:00:00.00
    let h=+d.substring(0,2);
    let m=+d.substring(3,5);
    let s=+d.substring(6);
    let totalseconds=s+m*60+h*3600;
    h=Math.floor(totalseconds/60);
    s=Math.ceil(totalseconds-60*h);
let result=h.toString().padStart(2,"0")+":"+s.toString().padStart(2,"0") ;
return result;
    }
    return value;
  }

}
