import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('static build writes the home page', () => {
  expect(existsSync(resolve('dist/index.html'))).toBe(true);
});
