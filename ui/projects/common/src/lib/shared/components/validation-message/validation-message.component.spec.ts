import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator';
import { ValidationErrorCode } from '@eu/common/core/models/validation-error-code';
import { enumToArray } from '@eu/common/core/utils/enum-to-array';

import { ValidationMessageComponent } from './validation-message.component';

describe('ValidationMessageComponent', () => {
  let spectator: Spectator<ValidationMessageComponent>;
  const createSpectator = createComponentFactory(ValidationMessageComponent);

  function queryMessageElement(): HTMLElement | null {
    return spectator.query(byTestId('message'));
  }

  beforeEach(() => {
    spectator = createSpectator({
      detectChanges: true,
    });
  });

  describe('with error passed', () => {
    describe('and error is a ValidationErrorCode', () => {
      it('shows a message', () => {
        enumToArray(ValidationErrorCode).forEach(code => {
          spectator.component.errors = {
            [code]: { message: 'Error' },
          };
          spectator.detectComponentChanges();

          expect(queryMessageElement()).not.toBeNull();
        });
      });
    });

    describe('and a custom error passed', () => {
      beforeEach(() => {
        spectator.component.errors = {
          someCustomErrorKey: 'Error for testing',
        };
        spectator.detectComponentChanges();
      });

      it('shows a message', () => {
        expect(queryMessageElement()).not.toBeNull();
      });
    });
  });

  describe('without an error passed', () => {
    it('shows no message', () => {
      expect(queryMessageElement()).toBeNull();
    });
  });
});
