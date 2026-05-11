import type { CashItem } from '@/api/character.types'
import { useCashEquipment } from '@/hooks/useCashEquipment'
import { Check, Shirt } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  CASH_PRESET_NUMBERS,
  getBaseCashItems,
  getActivePresetNumber,
  getCashItemsByPreset,
  sortCashItemsBySlot
} from './cody.utils'
import type { CodyViewKey } from './cody.utils'

type Props = {
  ocid: string | undefined
}

type CodyCardProps = {
  item?: CashItem
  isLoading?: boolean
  slotLabel?: string
}

const CODY_SLOT_COLUMNS = [
  ['헤어', '모자', '얼굴장식', '신발', '망토', '반지'],
  ['성형', '상의', '눈장식', '장갑', '보조무기', '반지2'],
  ['피부', '하의', '귀고리', '무기', '반지3', '반지4']
]

const getSlotItem = (items: CashItem[], slot: string) =>
  items.find(item => item.cash_item_equipment_slot === slot)

function CodyItemRow({ item, isLoading = false, slotLabel }: CodyCardProps) {
  return (
    <li className="flex min-w-0 items-center gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted/70 dark:bg-white/[0.06]">
        {isLoading ? (
          <span className="h-8 w-8 animate-pulse rounded bg-muted-foreground/20" />
        ) : item ? (
          item.cash_item_icon ? (
            <img
              className="h-12 w-12 object-contain [image-rendering:pixelated]"
              src={item.cash_item_icon}
              alt=""
            />
          ) : (
            <Shirt className="h-5 w-5 text-muted-foreground" />
          )
        ) : (
          <span className="text-sm font-black text-muted-foreground/60">-</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {item?.cash_item_label && (
          <p className="truncate text-xs font-bold text-fuchsia-500">
            {item.cash_item_label}
          </p>
        )}
        <p
          className={`truncate text-sm font-black ${
            item ? 'text-foreground' : 'text-muted-foreground'
          }`}>
          {isLoading
            ? '코디 정보를 불러오는 중'
            : item?.cash_item_name || slotLabel || '-'}
        </p>
        {item?.cash_item_coloring_prism?.color_range ? (
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
            {item.cash_item_coloring_prism.color_range}
          </p>
        ) : !item && slotLabel ? (
          <p className="mt-1 truncate text-xs font-medium text-muted-foreground">
            {slotLabel}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export default function CodySection({ ocid }: Props) {
  const { beautyData, cashData, status } = useCashEquipment(ocid)
  const currentPresetNo = getActivePresetNumber(cashData)
  const [activeViewKey, setActiveViewKey] = useState<CodyViewKey>('base')
  const cashItems = useMemo(
    () =>
      sortCashItemsBySlot(
        activeViewKey === 'base'
          ? getBaseCashItems(cashData)
          : getCashItemsByPreset(cashData, activeViewKey)
      ),
    [activeViewKey, cashData]
  )
  const additionalCashItems = useMemo(
    () =>
      sortCashItemsBySlot(
        activeViewKey === 'base'
          ? getBaseCashItems(cashData, true)
          : getCashItemsByPreset(cashData, activeViewKey, true)
      ),
    [activeViewKey, cashData]
  )
  useEffect(() => {
    setActiveViewKey('base')
  }, [ocid])

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-lg font-black">코디 정보</h2>
          <p className="text-sm text-muted-foreground">
            현재 적용된 캐시 장비와 뷰티 정보를 프리셋 기준으로 확인합니다.
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={status === 'loading'}
          onClick={() => setActiveViewKey('base')}
          className={`rounded-lg border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
            activeViewKey === 'base'
              ? 'border-pink-300 bg-pink-50 text-pink-700 shadow-sm dark:border-pink-300/50 dark:bg-pink-400/10 dark:text-pink-200'
              : 'border-border bg-background text-muted-foreground hover:border-pink-300 hover:text-foreground dark:bg-white/5'
          }`}>
          기본 코디
        </button>
        {CASH_PRESET_NUMBERS.map(presetNo => (
          <button
            key={presetNo}
            type="button"
            disabled={status === 'loading'}
            onClick={() => setActiveViewKey(presetNo)}
            className={`rounded-lg border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
              activeViewKey === presetNo
                ? 'border-pink-300 bg-pink-50 text-pink-700 shadow-sm dark:border-pink-300/50 dark:bg-pink-400/10 dark:text-pink-200'
                : 'border-border bg-background text-muted-foreground hover:border-pink-300 hover:text-foreground dark:bg-white/5'
            }`}>
            프리셋 {presetNo}
            {currentPresetNo === presetNo && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-400/15 dark:text-pink-200">
                <Check className="h-3 w-3" />
                <span className="sr-only">현재 적용 프리셋</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {status === 'error' ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          코디 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-x-8 gap-y-4 md:grid-cols-3">
            {status === 'loading' ? (
              <>
                {[0, 1, 2].map(columnIndex => (
                  <ul
                    key={columnIndex}
                    className="space-y-4">
                    <CodyItemRow isLoading />
                    <CodyItemRow isLoading />
                    <CodyItemRow isLoading />
                  </ul>
                ))}
              </>
            ) : (
              CODY_SLOT_COLUMNS.map((column, columnIndex) => (
                <ul
                  key={columnIndex}
                  className="space-y-4">
                  {column.map(slot => {
                    const item =
                      slot === '헤어' || slot === '성형' || slot === '피부'
                        ? undefined
                        : getSlotItem(cashItems, slot)
                    const beautyValue =
                      slot === '헤어'
                        ? beautyData?.character_hair.hair_name
                        : slot === '성형'
                          ? beautyData?.character_face.face_name
                          : slot === '피부'
                            ? beautyData?.character_skin_name
                            : undefined

                    return (
                      <CodyItemRow
                        key={slot}
                        item={
                          beautyValue
                            ? ({
                                cash_item_equipment_slot: slot,
                                cash_item_equipment_part: slot,
                                cash_item_name: beautyValue,
                                cash_item_icon: '',
                                cash_item_description: '',
                                cash_item_option: [],
                                date_expire: '',
                                date_option_expire: '',
                                cash_item_label: '',
                                cash_item_coloring_prism: {
                                  color_range: '',
                                  hue: 0,
                                  saturation: 0,
                                  value: 0
                                },
                                item_gender: ''
                              } satisfies CashItem)
                            : item
                        }
                        slotLabel={slot}
                      />
                    )
                  })}
                </ul>
              ))
            )}
          </div>

          {additionalCashItems.length > 0 && (
            <div className="pt-4">
              <h3 className="mb-3 text-center text-lg font-black text-sky-600 dark:text-sky-300">
                이 아이템들로 드레스룸에서 꾸며보기 →
              </h3>
              <ul className="grid gap-x-8 gap-y-4 md:grid-cols-3">
                {status === 'loading' ? (
                  <>
                    <CodyItemRow isLoading />
                    <CodyItemRow isLoading />
                    <CodyItemRow isLoading />
                  </>
                ) : (
                  additionalCashItems.map(item => (
                    <CodyItemRow
                      key={`additional-${item.cash_item_equipment_slot}-${item.cash_item_name}`}
                      item={item}
                    />
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
