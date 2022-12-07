import { enumToArray } from './enum-to-array';

describe('enumToArray(x)', () => {
  describe('for numeric enum', () => {
    it('returns array of all items', () => {
      enum NumericEnum {
        First = 0,
        Second = 1,
      }

      expect(enumToArray(NumericEnum)).toEqual([0, 1]);
    });
  });

  describe('for string enum', () => {
    it('returns array of all items', () => {
      enum StringEnum {
        First = 'FirstValue',
        Second = 'SecondValue',
        Third = 'ThirdValue',
      }

      expect(enumToArray(StringEnum)).toEqual(['FirstValue', 'SecondValue', 'ThirdValue'] as StringEnum[]);
    });
  });

  describe('for heterogenous enum', () => {
    it('returns array of all items', () => {
      enum HeterogenousEnum {
        First = 'FirstValue',
        Second = 2,
        Third = 3,
        Fourth = 'FourthValue',
      }

      expect(enumToArray(HeterogenousEnum)).toEqual(['FirstValue', 2, 3, 'FourthValue'] as HeterogenousEnum[]);
    });
  });

  describe('for empty enum', () => {
    it('returns empty array ', () => {
      enum EmptyEnum {}

      expect(enumToArray(EmptyEnum)).toEqual([]);
    });
  });
});
