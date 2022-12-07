import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { createObserverSpy } from '@eu/common/testing/utils';
import { Observer, Subject, throwError } from 'rxjs';

import { AppError, AppValidationError, EntityValidationErrors, PropValidationMessage } from '../../models/app-error';
import { AppValidators } from '../validators';

import { catchValidationData } from './catch-validation-error';

type ExtractFormValue<T extends FormGroup> = {
  [K in keyof T['controls']]: T['controls'][K] extends FormGroup ?
    ExtractFormValue<T['controls'][K]> : T['controls'][K]['value'];
};

type TestForm = FormGroup<{
  childValue1: FormControl<string | null>;
  childValue2: FormControl<string | null>;
  childValueObject: FormGroup<{
    nestedChildValue1: FormControl<string | null>;
    nestedChildValue2: FormControl<string | null>;
  }>;
}>;

type TestValidationData = EntityValidationErrors<ExtractFormValue<TestForm>>;

describe('catchValidationError(x)', () => {
  let observer: Observer<unknown>;

  beforeEach(() => {
    observer = createObserverSpy();
  });

  describe('with form group provided', () => {
    let formGroupMock: TestForm;

    beforeEach(() => {
      formGroupMock = new FormGroup({
        childValue1: new FormControl<string | null>(null),
        childValue2: new FormControl<string | null>(null),
        childValueObject: new FormGroup({
          nestedChildValue1: new FormControl<string | null>(null),
          nestedChildValue2: new FormControl<string | null>(null),
        }),
      });
    });

    /**
     * Handles the validation data error and expects the form to be filled with errors properly.
     * @param validationData Validation data.
     */
    function testValidationData(validationData: TestValidationData): void {
      const passedError = new AppValidationError('Invalid data', validationData);

      throwError(() => passedError).pipe(
        catchValidationData(formGroupMock),
      )
        .subscribe(observer);

      expectFormToHave(validationData);
      expect(observer.error).toHaveBeenCalledOnceWith(jasmine.any(AppError));
    }

    /**
     * Checks that a form group has validation data.
     * @param validationData Validation data.
     */
    function expectFormToHave(validationData: TestValidationData): void {
      const validationDataToError = (
        data: PropValidationMessage<FormControl> | string | undefined,
      ): ValidationErrors | null => data ? AppValidators.buildAppError(data.toString()) : null;

      // Form group elements must always be null, since the errors gotta be only provided for the controls
      expect(formGroupMock.errors).toBe(null);

      expect(formGroupMock.controls.childValue1.errors).toEqual(
        validationDataToError(validationData.childValue1),
      );
      expect(formGroupMock.controls.childValue2.errors).toEqual(
        validationDataToError(validationData.childValue2),
      );

      if (typeof validationData.childValueObject === 'string') {
        expect(formGroupMock.controls.childValueObject.errors).toEqual(
          validationDataToError(validationData.childValueObject),
        );
        expect(formGroupMock.controls.childValueObject.controls.nestedChildValue1.errors).toBe(null);
        expect(formGroupMock.controls.childValueObject.controls.nestedChildValue2.errors).toBe(null);
      } else {
        expect(formGroupMock.controls.childValueObject.controls.nestedChildValue1.errors).toEqual(
          validationDataToError(validationData.childValueObject?.nestedChildValue1),
        );
        expect(formGroupMock.controls.childValueObject.controls.nestedChildValue2.errors).toEqual(
          validationDataToError(validationData.childValueObject?.nestedChildValue2),
        );
      }
    }

    describe('when got no validation data', () => {
      it('does not set errors', () => testValidationData({}));
    });

    describe('when got validation data', () => {
      it('sets errors for the child elements', () => testValidationData({
        childValue1: 'Test error',
        childValue2: 'Test error 2',
      }));

      it('sets errors for nested child elements', () => testValidationData({
        childValueObject: {
          nestedChildValue1: 'Test error',
          nestedChildValue2: 'test error 2',
        },
      }));

      it('sets an error for a nested form group', () => testValidationData({
        childValueObject: 'error',
      }));

      it('sets errors for both nested and first-level child elements', () => testValidationData({
        childValue1: 'Test error',
        childValueObject: {
          nestedChildValue1: 'Test error',
        },
      }));
    });
  });

  describe('with subject provided', () => {
    let spySubject: jasmine.SpyObj<Subject<EntityValidationErrors<unknown>>>;

    beforeEach(() => {
      spySubject = jasmine.createSpyObj('Fake subject', ['next', 'error', 'complete']);
    });

    describe('when got AppValidationError', () => {
      it('emits a validation data to subject', () => {

        const validationDataMock = { someData: 'is wrong' };
        const error = new AppValidationError('Invalid data', validationDataMock);

        throwError(() => error).pipe(
          catchValidationData(spySubject),
        )
          .subscribe(observer);

        expect(spySubject.next).toHaveBeenCalledOnceWith(validationDataMock);
        expect(spySubject.error).not.toHaveBeenCalled();
        expect(spySubject.complete).not.toHaveBeenCalled();
      });
    });

    describe('when got non-AppValidationError', () => {
      it('passes error through', () => {
        const error = new Error('Error different from AppValidationError');

        throwError(() => error).pipe(
          catchValidationData(spySubject),
        )
          .subscribe(observer);

        expect(observer.error).toHaveBeenCalledOnceWith(error);
      });
    });
  });
});
