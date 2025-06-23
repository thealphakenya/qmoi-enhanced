// Simple test that doesn't require JSX or React components
test('basic test environment works', () => {
  expect(1 + 1).toBe(2);
});

test('string operations work', () => {
  const message = 'Alpha-Q AI';
  expect(message).toContain('AI');
}); 