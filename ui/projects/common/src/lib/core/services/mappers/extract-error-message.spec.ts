import { extractErrorMessage } from './extract-error-message';

describe('extractErrorMessage(x)', () => {
  describe('if no data provided ', () => {
    it('returns undefined', () => {
      const result = extractErrorMessage();

      expect(result).toBeUndefined();
    });
  });

  describe('if data provided', () => {
    describe('and data is an array', () => {
      describe('that is empty', () => {
        it('throws an error', () => {
          expect(() => extractErrorMessage([])).toThrow();
        });
      });

      describe('that is not empty', () => {
        it('returns mapped error message', () => {
          const result = extractErrorMessage(['some', 'test', 'data']);

          expect(result).toEqual(jasmine.any(String));
        });
      });
    });

    describe('and data is an object', () => {
      describe('that is empty', () => {
        it('returns undefined', () => {
          const result = extractErrorMessage({});

          expect(result).toBeUndefined();
        });
      });

      describe('that is not empty', () => {
        it('returns mapped error message', () => {
          const result = extractErrorMessage({
            non_field_errors: ['Some error'],
          });

          expect(result).toEqual(jasmine.any(String));
        });
      });
    });
  });
});
