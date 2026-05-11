import { CashItem } from '@/api/character.types'
import { useCashInfo } from '@/hooks/useCashInfo'
import { Clock3, Palette, Shirt, Sparkles } from 'lucide-react'
import {
  getActiveCashItems,
  getActivePresetNumber,
  sortCashItemsBySlot
} from './cody.utils'

type Props = {
  ocid: string | undefined
}

type CodyCardProps = {
  item?: CashItem
  isLoading?: boolean
}

function formatExpireDate(dateExpire: string) {
  if (!dateExpire || dateExpire === 'expired') {
    return '기간 정보 없음'
  }

  return dateExpire.split('T')[0]
}

function CodyItemCard({ item, isLoading = false }: CodyCardProps) {
  const prism = item?.cash_item_coloring_prism
  const hasPrism = Boolean(prism?.color_range)

  return (
    <li className="rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-pink-300/80 dark:hover:border-pink-300/40">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
          {item?.cash_item_icon ? (
            <img
              className="h-10 w-10 object-contain"
              src={item.cash_item_icon}
              alt=""
            />
          ) : (
            <Shirt className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="truncate text-xs font-medium text-muted-foreground">
              {item?.cash_item_equipment_slot || '코디'}
            </span>
            {item?.cash_item_label && (
              <span className="rounded-md bg-pink-100 px-1.5 py-0.5 text-xs font-bold text-pink-700 dark:bg-pink-400/10 dark:text-pink-200">
                {item.cash_item_label}
              </span>
            )}
          </div>
          <p className="truncate text-sm font-bold text-foreground">
            {isLoading
              ? '코디 정보를 불러오는 중'
              : item?.cash_item_name || '-'}
          </p>
          <div className="mt-2 space-y-1 text-xs leading-5">
            <p className="truncate text-muted-foreground">
              {item?.cash_item_equipment_part || '장착 부위 -'}
            </p>
            <p className="flex min-w-0 items-center gap-1 text-cyan-700 dark:text-cyan-300">
              <Clock3 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {item ? formatExpireDate(item.date_expire) : '기간 정보 -'}
              </span>
            </p>
            <p className="flex min-w-0 items-center gap-1 text-fuchsia-700 dark:text-fuchsia-300">
              <Palette className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {hasPrism
                  ? `${prism?.color_range} H${prism?.hue} S${prism?.saturation} V${prism?.value}`
                  : '프리즘 정보 -'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function CodySection({ ocid }: Props) {
  const { beautyData, cashData, status } = useCashInfo(ocid)
  const presetNo = getActivePresetNumber(cashData)
  const cashItems = sortCashItemsBySlot(getActiveCashItems(cashData))
  const additionalCashItems = sortCashItemsBySlot(
    getActiveCashItems(cashData, true)
  )
  const beautyRows = [
    ['헤어', beautyData?.character_hair.hair_name || '-'],
    ['성형', beautyData?.character_face.face_name || '-'],
    ['피부', beautyData?.character_skin_name || '-']
  ]

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-black">코디 정보</h2>
          <p className="text-sm text-muted-foreground">
            현재 적용된 캐시 장비와 뷰티 정보를 프리셋 기준으로 확인합니다.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {status === 'loading'
            ? '조회중'
            : status === 'error'
              ? '조회 실패'
              : `${presetNo}번 프리셋 · ${cashItems.length}개 아이템`}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {beautyRows.map(([label, value]) => (
          <div
            className="rounded-lg border border-border bg-background/70 p-3 shadow-sm dark:bg-white/[0.04]"
            key={label}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {label}
            </div>
            <p className="mt-1 truncate text-sm font-bold text-foreground">
              {status === 'loading' ? '불러오는 중' : value}
            </p>
          </div>
        ))}
      </div>

      {status === 'error' ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          코디 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-bold">캐시 장비</h3>
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {status === 'loading' ? (
                <>
                  <CodyItemCard isLoading />
                  <CodyItemCard isLoading />
                  <CodyItemCard isLoading />
                </>
              ) : cashItems.length > 0 ? (
                cashItems.map(item => (
                  <CodyItemCard
                    key={`${item.cash_item_equipment_slot}-${item.cash_item_name}`}
                    item={item}
                  />
                ))
              ) : (
                <li className="rounded-lg border border-border bg-muted/30 p-4 text-sm font-medium text-muted-foreground md:col-span-2 xl:col-span-3">
                  표시할 캐시 장비 정보가 없습니다.
                </li>
              )}
            </ul>
          </div>

          {additionalCashItems.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold">추가 장착 코디</h3>
              <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {additionalCashItems.map(item => (
                  <CodyItemCard
                    key={`additional-${item.cash_item_equipment_slot}-${item.cash_item_name}`}
                    item={item}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
