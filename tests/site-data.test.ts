import { expect, test } from 'vitest';
import { externalLinks, leadership, pages } from '../src/data/site';

test('the recruitment and Facebook links use HTTPS', () => {
  expect(externalLinks.recruitment).toMatch(/^https:\/\//);
  expect(externalLinks.facebook).toMatch(/^https:\/\//);
});

test('leadership records include all four terms and both roles', () => {
  expect(leadership).toHaveLength(4);
  expect(leadership.every(({ president, secretaryGeneral }) => president && secretaryGeneral)).toBe(true);
});

test('the navigation exposes exactly four content pages', () => {
  expect(pages.map(({ href }) => href)).toEqual(['/about/', '/legacy/', '/activities/', '/join/']);
});
