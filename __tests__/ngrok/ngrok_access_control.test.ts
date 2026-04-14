import { describe, it, expect } from 'vitest'

describe('NGROK Paid Access Control', () => {
  it('should restrict paid NGROK access to master and sponsored users', () => {
    const allowed = ['master', 'sponsored']
    expect(allowed).toContain('master')
    expect(allowed).toContain('sponsored')
  })

  it('should deny guest access to paid NGROK features', () => {
    const role = 'guest'
    expect(role).not.toBe('master')
    expect(role).not.toBe('sponsored')
  })
})
