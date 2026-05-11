import { Equipment } from '@/api/character.types'
import { Star } from 'lucide-react'

type Props = {
  item?: Equipment
  isLoading?: boolean
  slot?: string
}

export default function EquipmentCard({
  item,
  isLoading = false,
  slot
}: Props) {
  const potentialOptions = [
    item?.potential_option_1,
    item?.potential_option_2,
    item?.potential_option_3
  ].filter(Boolean)
  const additionalOptions = [
    item?.additional_potential_option_1,
    item?.additional_potential_option_2,
    item?.additional_potential_option_3
  ].filter(Boolean)
  const totalOptions = item?.item_total_option
  const optionSummary = [
    totalOptions?.attack_power && `공격력 +${totalOptions.attack_power}`,
    totalOptions?.magic_power && `마력 +${totalOptions.magic_power}`,
    totalOptions?.all_stat && `올스탯 +${totalOptions.all_stat}`,
    totalOptions?.boss_damage && `보공 +${totalOptions.boss_damage}%`,
    totalOptions?.damage && `데미지 +${totalOptions.damage}%`
  ].filter(Boolean)

  return (
    <li className="rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-emerald-300/80 dark:hover:border-emerald-400/40">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
          {item?.item_icon ? (
            <img
              className="h-10 w-10 object-contain"
              src={item.item_icon}
              alt=""
            />
          ) : (
            <span className="text-xs font-semibold text-muted-foreground">
              ITEM
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="truncate text-xs font-medium text-muted-foreground">
              {item?.item_equipment_part || slot || '장비'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
              <Star className="h-3.5 w-3.5 fill-current" />
              {item?.starforce || '0'}
            </span>
          </div>
          <p className="truncate text-sm font-bold text-foreground">
            {isLoading ? '장비 정보를 불러오는 중' : item?.item_name || '-'}
          </p>
          <div className="mt-2 space-y-1 text-xs leading-5">
            <p className="truncate text-emerald-600 dark:text-emerald-300">
              {potentialOptions.length > 0
                ? `잠재 ${potentialOptions.join(' / ')}`
                : '잠재 -'}
            </p>
            <p className="truncate text-violet-600 dark:text-violet-300">
              {additionalOptions.length > 0
                ? `에디 ${additionalOptions.join(' / ')}`
                : '에디 -'}
            </p>
            <p className="truncate text-cyan-700 dark:text-cyan-300">
              {optionSummary.length > 0
                ? optionSummary.join(' / ')
                : '추가 옵션 -'}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
