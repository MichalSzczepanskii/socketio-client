import { AbstractControl, ValidationErrors } from '@angular/forms';

export function wsAddressValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) return null;
  return /^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})$/.test(
    control.value
  )
    ? null
    : { invalidWsAddress: true };
}
