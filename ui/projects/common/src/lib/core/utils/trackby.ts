/** Interface for trackById function. */
interface ObjectWithId {
  [key: string]: unknown;

  /** Id. */
  id: number;
}

/**
 * Factory for trackBy function that allows Angular track the value by provided prop name.
 * @param propName Property by which you want to track the item.
 */
export function createTrackByFunction<
  T extends unknown,
  P extends keyof T = keyof T,
>(propName: P): (i: number, obj: T) => T[P] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_, obj) => (obj as any)[propName];
}

/**
 * Trackby function for angular ngFor directive.
 * @param param0 Any object with id field.
 * @returns Unique identifier.
 */
export const trackById = createTrackByFunction<ObjectWithId>('id');
