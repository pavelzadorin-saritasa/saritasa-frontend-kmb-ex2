/**
 * Helper type describing a standard view function.
 * @param req Request data container.
 */
export type ViewDef = (req: string) => Promise<string | null>;
