import { describe, expect, it } from 'vitest'
import {
  HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS,
  HOVER_DETAILS_VISIBILITY_CLASS
} from './hoverDetailsClassNames'

describe('hover details visibility class names', () => {
  it('마우스 클릭 focus가 tooltip을 계속 열어두지 않도록 focus-within을 쓰지 않는다', () => {
    const visibilityClasses = [
      HOVER_DETAILS_VISIBILITY_CLASS,
      HOVER_DETAILS_INTERACTIVE_VISIBILITY_CLASS
    ].join(' ')

    expect(visibilityClasses).toContain('group-focus-visible:visible')
    expect(visibilityClasses).not.toContain('group-focus-within')
  })
})
