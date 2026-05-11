import type { CashItem } from '@/api/character.types'
import { useCashEquipment } from '@/hooks/useCashEquipment'
import { useCharacterBasic } from '@/hooks/useCharacterBasic'
import { Grid2X2, List, Shirt } from 'lucide-react'
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

const PREVIEW_ITEM_SLOTS = ['모자', '헤어', '얼굴장식', '상의', '무기', '망토']

const getSlotItem = (items: CashItem[], slot: string) =>
  items.find(item => item.cash_item_equipment_slot === slot)

const getPreviewImageUrl = (imageUrl: string) => {
  if (!imageUrl) {
    return imageUrl
  }

  const url = new URL(imageUrl)
  url.searchParams.set('action', 'A00')
  url.searchParams.set('emotion', 'E00')
  url.searchParams.set('width', '220')
  url.searchParams.set('height', '220')
  url.searchParams.set('x', '110')
  url.searchParams.set('y', '160')

  return url.toString()
}

const getPreviewItems = (items: CashItem[]) => {
  const slottedItems = PREVIEW_ITEM_SLOTS.flatMap(slot => {
    const item = getSlotItem(items, slot)

    return item ? [item] : []
  })

  if (slottedItems.length > 0) {
    return slottedItems.slice(0, 6)
  }

  return items.slice(0, 6)
}

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

function CodyPreviewPanel({
  activeViewLabel,
  canUseCharacterImage,
  imageUrl,
  previewItems
}: {
  activeViewLabel: string
  canUseCharacterImage: boolean
  imageUrl: string
  previewItems: CashItem[]
}) {
  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-pink-200 bg-pink-50/40 p-4 shadow-sm dark:border-pink-300/30 dark:bg-pink-400/10">
      <div className="grid gap-5 sm:grid-cols-[18rem_minmax(0,1fr)] sm:items-center">
        <div className="flex h-72 items-end justify-center rounded-lg border border-pink-200/70 bg-background/80 p-3 dark:border-pink-300/20 dark:bg-black/20">
          {canUseCharacterImage && imageUrl ? (
            <img
              className="h-68 w-68 object-contain [image-rendering:pixelated]"
              src={imageUrl}
              alt=""
            />
          ) : (
            <div className="flex h-32 w-24 flex-col items-center justify-center rounded-full bg-muted text-center text-xs font-black text-muted-foreground">
              프리셋
              <span className="mt-1 text-[11px] font-bold">아이템 기준</span>
            </div>
          )}
        </div>
        <div className="min-w-0 text-left">
          <p className="text-xs font-black text-pink-600 dark:text-pink-200">
            선택한 코디
          </p>
          <h3 className="mt-1 text-2xl font-black text-foreground">
            {activeViewLabel}
          </h3>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {canUseCharacterImage
              ? '적용 중인 모습'
              : '선택 프리셋 아이템 기준'}
          </p>
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {previewItems.length > 0 ? (
              previewItems.map(item => (
                <li
                  key={`${item.cash_item_equipment_slot}-${item.cash_item_name}`}
                  className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background/80 p-2 dark:bg-white/5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/70">
                    {item.cash_item_icon ? (
                      <img
                        className="h-8 w-8 object-contain [image-rendering:pixelated]"
                        src={item.cash_item_icon}
                        alt=""
                      />
                    ) : (
                      <Shirt className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-black text-foreground">
                      {item.cash_item_name}
                    </span>
                    <span className="block truncate text-[11px] font-medium text-muted-foreground">
                      {item.cash_item_equipment_slot}
                    </span>
                  </span>
                </li>
              ))
            ) : (
              <li className="col-span-3 rounded-lg border border-dashed border-border p-4 text-center text-sm font-bold text-muted-foreground">
                표시할 코디 아이템이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function CodySection({ ocid }: Props) {
  const { beautyData, cashData, status } = useCashEquipment(ocid)
  const { basicData } = useCharacterBasic(ocid)
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
  const activeViewLabel =
    activeViewKey === 'base' ? '기본 코디' : `${activeViewKey}번 프리셋`
  const previewItems = useMemo(() => getPreviewItems(cashItems), [cashItems])
  const canUseCharacterImage =
    activeViewKey === 'base' || activeViewKey === currentPresetNo

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
        <span className="text-xs font-medium text-muted-foreground">
          {status === 'loading'
            ? '조회중'
            : status === 'error'
              ? '조회 실패'
              : activeViewLabel}
        </span>
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
              <span className="ml-1 text-[10px] font-bold">현재</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3 text-center">
        <p className="text-sm font-bold text-muted-foreground">
          (캐릭터가 인게임 모습과 다를 수 있습니다.)
        </p>
        <CodyPreviewPanel
          activeViewLabel={activeViewLabel}
          canUseCharacterImage={canUseCharacterImage}
          imageUrl={getPreviewImageUrl(basicData.character_image)}
          previewItems={previewItems}
        />
      </div>

      {status === 'error' ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          코디 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-black text-foreground">
              <List className="h-4 w-4" />
              목록
            </button>
            <button className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-black text-muted-foreground">
              <Grid2X2 className="h-4 w-4" />
              장비창
            </button>
          </div>

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
