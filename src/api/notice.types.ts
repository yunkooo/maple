export type NoticeRequestStatus = 'idle' | 'loading' | 'error'

export type NoticeType = 'notice' | 'update' | 'event' | 'cashshop'

export type NoticeSourceLabel = '공지' | '업데이트' | '이벤트' | '캐시샵'

export type MapleNoticeItem = {
  date?: string
  notice_id?: number | string
  title?: string
  url?: string
}

export type MapleEventNoticeItem = MapleNoticeItem & {
  date_event_end?: string
  date_event_start?: string
}

export type MapleCashshopNoticeItem = MapleNoticeItem & {
  date_sale_end?: string
  date_sale_start?: string
  ongoing_flag?: boolean | string
}

export type NoticeListResponse = {
  notice?: MapleNoticeItem[]
}

export type UpdateNoticeListResponse = {
  update_notice?: MapleNoticeItem[]
}

export type EventNoticeListResponse = {
  event_notice?: MapleEventNoticeItem[]
}

export type CashshopNoticeListResponse = {
  cashshop_notice?: MapleCashshopNoticeItem[]
}

export type NoticeListResponses = {
  cashshop: CashshopNoticeListResponse
  event: EventNoticeListResponse
  notice: NoticeListResponse
  update: UpdateNoticeListResponse
}

export type DashboardNotice = {
  date: string
  eventEndAt?: string
  eventStartAt?: string
  id: string
  isAlwaysOnSale?: boolean
  noticeId: string
  saleEndAt?: string
  saleStartAt?: string
  sourceLabel: NoticeSourceLabel
  title: string
  type: NoticeType
  url: string
}

export type NoticeCollection = {
  notices: DashboardNotice[]
}

export type UseNoticesResult = NoticeCollection & {
  errorMessage: string
  status: NoticeRequestStatus
}
