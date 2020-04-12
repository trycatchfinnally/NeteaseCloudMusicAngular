import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const rePassWordValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const passWord = control.get("passWord");
  const rePassWord = control.get("rePassWord");
    if (passWord == null || rePassWord == null) return null;
    if (passWord.value == rePassWord.value) return null;
   
    return { 'passWordInvalid': true };
};
