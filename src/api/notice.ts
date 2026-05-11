import mapleClient from './mapleClient'
import {
  CashshopNoticeListResponse,
  DashboardNotice,
  EventNoticeListResponse,
  MapleCashshopNoticeItem,
  MapleEventNoticeItem,
  MapleNoticeItem,
  NoticeCollection,
  NoticeListResponse,
  NoticeListResponses,
  NoticeSourceLabel,
  NoticeType,
  UpdateNoticeListResponse
} from './notice.types'

export const NOTICE_REFRESH_POLICY_TEXT =
  'NEXON Open API로 크롤링한 공지 데이터는 30일 이내에 갱신해야 합니다.'

type NoticeEndpointConfig = {
  responseKey: string
  sourceLabel: NoticeSourceLabel
  type: NoticeType
}

const NOTICE_ENDPOINTS = {
  cashshop: {
    responseKey: 'cashshop_notice',
    sourceLabel: '캐시샵',
    type: 'cashshop'
  },
  event: {
    responseKey: 'event_notice',
    sourceLabel: '이벤트',
    type: 'event'
  },
  notice: {
    responseKey: 'notice',
    sourceLabel: '공지',
    type: 'notice'
  },
  update: {
    responseKey: 'update_notice',
    sourceLabel: '업데이트',
    type: 'update'
  }
} satisfies Record<NoticeType, NoticeEndpointConfig>

const getNoticeResponse = async <TResponse>(endpoint: string) => {
  const response = await mapleClient.get(endpoint)
  return response.json<TResponse>()
}

export const getNoticeList = () =>
  getNoticeResponse<NoticeListResponse>('notice')

export const getUpdateNoticeList = () =>
  getNoticeResponse<UpdateNoticeListResponse>('notice-update')

export const getEventNoticeList = () =>
  getNoticeResponse<EventNoticeListResponse>('notice-event')

export const getCashshopNoticeList = () =>
  getNoticeResponse<CashshopNoticeListResponse>('notice-cashshop')

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toText = (value: unknown) => {
  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return ''
}

const toOptionalText = (value: unknown) => {
  const text = toText(value)
  return text || undefined
}

const getResponseItems = (response: unknown, responseKey: string) => {
  if (Array.isArray(response)) {
    return response
  }

  if (!isRecord(response)) {
    return []
  }

  const items = response[responseKey]
  return Array.isArray(items) ? items : []
}

const getStableId = (
  item: MapleNoticeItem,
  type: NoticeType,
  fallbackIndex: number
) => {
  const noticeId = toText(item.notice_id)

  if (noticeId) {
    return `${type}-${noticeId}`
  }

  return `${type}-${item.url || item.title || item.date || fallbackIndex}`
}

const isAlwaysOnSale = (ongoingFlag: MapleCashshopNoticeItem['ongoing_flag']) =>
  ongoingFlag === true || ongoingFlag === 'true'

const normalizeNoticeItem = (
  item: unknown,
  config: NoticeEndpointConfig,
  index: number
): DashboardNotice | null => {
  if (!isRecord(item)) {
    return null
  }

  const noticeItem = item as MapleNoticeItem
  const title = toText(noticeItem.title)
  const url = toText(noticeItem.url)

  if (!title || !url) {
    return null
  }

  const eventItem = item as MapleEventNoticeItem
  const cashshopItem = item as MapleCashshopNoticeItem
  const noticeId = toText(noticeItem.notice_id)

  return {
    date: toText(noticeItem.date),
    eventEndAt: toOptionalText(eventItem.date_event_end),
    eventStartAt: toOptionalText(eventItem.date_event_start),
    id: getStableId(noticeItem, config.type, index),
    isAlwaysOnSale:
      config.type === 'cashshop'
        ? isAlwaysOnSale(cashshopItem.ongoing_flag)
        : undefined,
    noticeId,
    saleEndAt: toOptionalText(cashshopItem.date_sale_end),
    saleStartAt: toOptionalText(cashshopItem.date_sale_start),
    sourceLabel: config.sourceLabel,
    title,
    type: config.type,
    url
  }
}

const normalizeNoticeResponse = (
  type: NoticeType,
  response: unknown
): DashboardNotice[] => {
  const config = NOTICE_ENDPOINTS[type]

  return getResponseItems(response, config.responseKey)
    .map((item, index) => normalizeNoticeItem(item, config, index))
    .filter((item): item is DashboardNotice => item !== null)
}

const getNoticeTimestamp = (notice: DashboardNotice) => {
  const timestamp = Date.parse(notice.date)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export const getAllNoticeLists = async (): Promise<NoticeListResponses> => {
  const [notice, update, event, cashshop] = await Promise.all([
    getNoticeList(),
    getUpdateNoticeList(),
    getEventNoticeList(),
    getCashshopNoticeList()
  ])

  return { cashshop, event, notice, update }
}

export const getDashboardNotices = async (): Promise<NoticeCollection> => {
  const responses = await getAllNoticeLists()
  const notices = (
    [
      ...normalizeNoticeResponse('notice', responses.notice),
      ...normalizeNoticeResponse('update', responses.update),
      ...normalizeNoticeResponse('event', responses.event),
      ...normalizeNoticeResponse('cashshop', responses.cashshop)
    ] satisfies DashboardNotice[]
  ).sort((left, right) => getNoticeTimestamp(right) - getNoticeTimestamp(left))

  return {
    notices,
    refreshPolicyText: NOTICE_REFRESH_POLICY_TEXT
  }
}
