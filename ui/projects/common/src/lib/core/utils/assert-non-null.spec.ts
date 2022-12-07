import { assertNonNull, assertNonNullablePropertiesWithReturn, assertNonNullWithReturn } from './assert-non-null';

describe('.assertNonNull(x)', () => {
  it('throws in case the passed value is `null`', () => {
    expect(() => assertNonNull(null)).toThrow();
  });

  it('does not throw if the value is not `null`', () => {
    expect(() => assertNonNull({})).not.toThrow();
  });

  it('does not throw if the value is false', () => {
    expect(() => assertNonNull(false)).not.toThrow();
  });

  it('does not throw if the value is empty array', () => {
    expect(() => assertNonNull([])).not.toThrow();
  });
});

describe('.assertNonNullWithReturn(x)', () => {
  it('throws in case the passed value is `null`', () => {
    expect(() => assertNonNullWithReturn(null)).toThrow();
  });

  it('does not throw in case the value is not `null`', () => {
    expect(() => assertNonNullWithReturn({})).not.toThrow();
  });

  it('does not throw if the value is false', () => {
    expect(() => assertNonNullWithReturn(false)).not.toThrow();
  });

  it('does not throw if the value is empty array', () => {
    expect(() => assertNonNullWithReturn([])).not.toThrow();
  });

  it('returns passed value if it passes the assertion', () => {
    const mockNonNullValue = { data: 123 };
    expect(assertNonNullWithReturn(mockNonNullValue)).toBe(mockNonNullValue);
  });
});

describe('.assertNonNullablePropertiesWithReturn', () => {
  const aValue: {
    a: number | null;
    b: number | null;
  } = {
    a: 1,
    b: null,
  };

  it('throws in case one of the passed keys properties is null', () => {
    expect(() => assertNonNullablePropertiesWithReturn(aValue, 'b')).toThrow();
  });

  it('does not throw in case asserted properties are not `null`', () => {
    expect(() => assertNonNullablePropertiesWithReturn(aValue, 'a')).not.toThrow();
  });
});
