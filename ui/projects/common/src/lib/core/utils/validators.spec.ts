import { FormControl, FormGroup } from '@angular/forms';

import { AppValidators } from './validators';

describe('AppValidators', () => {
  describe('.matchControl(x)', () => {
    let form: FormGroup<{first: FormControl<null | string>; second: FormControl<null | string>;}>;

    beforeEach(() => {
      form = new FormGroup({
        first: new FormControl<null | string>(null),
        second: new FormControl<null | string>(null),
      });
    });

    describe('valid context', () => {
      beforeEach(() => {
        form.controls.first.setValidators(AppValidators.matchControl('second'));
      });

      describe('values are not equal with the specified one', () => {
        it('makes control invalid', () => {
          const { first, second } = form.controls;

          first.setValue('first value');
          second.setValue('second value');
          first.updateValueAndValidity();

          expect(first.invalid).toBe(true);
        });
      });

      describe('values are the same with the specified control', () => {
        it('does not make control invalid', () => {
          const { first, second } = form.controls;

          first.setValue('value');
          second.setValue('value');
          first.updateValueAndValidity();

          expect(first.valid).toBe(true);
        });
      });
    });

    describe('invalid context', () => {
      describe('form control is "parentless"', () => {
        it('does not produce a validation error', () => {
          const standaloneControl = new FormControl(null);

          standaloneControl.setValidators(
            AppValidators.matchControl('someNeighbor'),
          );
          standaloneControl.updateValueAndValidity();

          expect(standaloneControl.valid).toBe(true);
        });
      });

      describe('the parent form does not have a specified child', () => {
        it('makes control invalid', () => {
          const { first } = form.controls;

          first.setValidators(AppValidators.matchControl('some-non-existent-control'));
          first.updateValueAndValidity();

          expect(first.invalid).toBe(true);
        });
      });

    });
  });
});
