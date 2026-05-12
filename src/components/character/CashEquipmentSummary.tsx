import { useCashEquipment } from '@/hooks/useCashEquipment'
import { Shirt } from 'lucide-react'
import {
  findCashItemBySlot,
  getActiveCashItems,
  getBeautyFaceName,
  getBeautyHairName
} from './cody.utils'

type Props = {
  ocid: string | undefined
}

export default function CashEquipmentSummary({ ocid }: Props) {
  const { beautyData, cashData, status } = useCashEquipment(ocid)
  const nowCashData = getActiveCashItems(cashData)
  const getItemName = (slot: string) =>
    findCashItemBySlot(nowCashData, slot)?.cash_item_name

  const outfitRows = [
    ['모자', getItemName('모자') || '-'],
    ['헤어', getBeautyHairName(beautyData)],
    ['성형', getBeautyFaceName(beautyData)],
    ['상의', getItemName('상의') || '-'],
    ['하의', getItemName('하의') || '-'],
    ['신발', getItemName('신발') || '-'],
    ['무기', getItemName('무기') || '-']
  ]

  return (
    <aside className="rounded-lg border border-border bg-background/85 p-4 shadow-sm dark:bg-white/[0.04]">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:bg-white/10">
          <Shirt className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold">코디 분석</p>
          <p className="text-xs text-muted-foreground">
            {status === 'loading'
              ? '불러오는 중'
              : status === 'error'
                ? '조회 실패'
                : '현재 프리셋 기준'}
          </p>
        </div>
      </div>
      <dl className="space-y-2">
        {outfitRows.map(([label, value]) => (
          <div
            className="grid grid-cols-[44px_1fr] gap-2 text-sm"
            key={label}>
            <dt className="text-xs font-medium text-muted-foreground">
              {label}
            </dt>
            <dd className="truncate font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
