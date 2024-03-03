import { signal } from './signal';

describe('signal', () => {
  it('should have correct initial value', () => {
    const a = signal(1);
    expect(a()).toBe(1);
  });

  it('should have correct updated value', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    a.set(2);
    expect(a()).toBe(2);
  });

  it('should have correct updated value', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    a.set(2);
    expect(a()).toBe(2);
  });
});
