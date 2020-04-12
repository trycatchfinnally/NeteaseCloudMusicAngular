import { ValidatorFn, AbstractControl } from "@angular/forms";
 
export function notMatchValidator(regs: RegExp[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      
      for (let index = 0; index < regs.length; index++) {
          const reg = regs[index];
          
          if (reg.test(control.value)) {
               
              return { "notMatch": true };
          }
      }
        return null;
  };
}
