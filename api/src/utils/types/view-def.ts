/**
 * Helper type describing a standard view function.
 * @param reqBody Request body container.
 */
export type ViewDef = (reqBody: string | null) => Promise<string | null>;
