import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

import { assertNonNull } from '../utils/assert-non-null';

/**
 * Injection token to use instead of global window object.
 */
export const WINDOW = new InjectionToken<Window>(
  'An abstraction over global window object',
  {
    factory() {
      const { defaultView } = inject(DOCUMENT);
      assertNonNull(defaultView);
      return defaultView;
    },
  },
);
