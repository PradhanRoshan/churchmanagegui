import { FormControl, FormGroup } from "@angular/forms";

export function getFormControlValue(
    form: FormGroup,
    formControlName: string
  ): any {
    return form.get(formControlName).value;
  }
  export function setFormControlValue(
    form: FormGroup,
    formControlName: string,
    newValue: any
  ): void {
    form.get(formControlName).patchValue(newValue);
  }
  
  export function clearFormControl(
    form: FormGroup,
    formControlName: string
  ): void {
    form.get(formControlName).patchValue('');
  }

export function nullifyEmptyFormFields(form:FormGroup): void {
    Object.keys(form.controls).forEach(key =>{
        const control = form.get(key);
        if(control instanceof FormControl){
            if(control.value instanceof Array && control.value.length==0){
                control.setValue(null);
            } else if( typeof control.value === 'string'){
                // trim the value
                const trimmedVal = control.value.trim();
                //  after trimmed if value is empty then set to null\
                control.setValue(trimmedVal ===''? null : trimmedVal);
            }
        }
        // if there are more nested formGroup recursively call the function
        else if (control instanceof FormGroup){
            this.nullifyEmptyFormFields(control);
        }
    });
}