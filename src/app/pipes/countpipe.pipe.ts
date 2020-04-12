import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countpipe'
})
export class CountpipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof value==='number'){
    let num:number=value;
    if(num>100000)
    return `${Math.floor(num/10000)}万` ;
    else 
    return num;
  }
    return null;
  }

}
