import { swc } from './vite-swc';

describe('viteSwc', () => {
  it('should work', () => {
    expect(swc('index.ts')).toBeDefined();
  });
});
