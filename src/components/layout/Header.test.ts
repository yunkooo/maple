import { describe, expect, it } from 'vitest'
import { getSearchTargetPath } from './Header'

describe('getSearchTargetPath', () => {
  it('코디 화면에서는 검색 후에도 코디 화면을 유지한다', () => {
    expect(getSearchTargetPath('/cody', '므래')).toBe(
      '/cody?nickname=%EB%AF%80%EB%9E%98'
    )
  })

  it('오늘 리포트 화면에서는 검색 후에도 리포트 화면을 유지한다', () => {
    expect(getSearchTargetPath('/report/%EB%AF%80%EB%9E%98', '아델')).toBe(
      '/report/%EC%95%84%EB%8D%B8'
    )
  })

  it('일반 화면에서는 캐릭터 상세 화면으로 이동한다', () => {
    expect(getSearchTargetPath('/notice', '아델')).toBe('/%EC%95%84%EB%8D%B8')
  })
})
