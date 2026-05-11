import { useEquipment } from '@/hooks/useEquipment'
import EquipmentCard from './EquipmentCard'

type Props = {
  ocid: string | undefined
}

export default function EquipmentSection({ ocid }: Props) {
  const { equipmentData, status } = useEquipment(ocid)
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-black">장비 정보</h2>
          <p className="text-sm text-muted-foreground">
            스타포스, 잠재, 에디셔널 잠재를 한 번에 확인합니다.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {status === 'loading'
            ? '조회중'
            : status === 'error'
              ? '조회 실패'
              : `${equipmentData.length}개 장비`}
        </span>
      </header>
      <div>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {status === 'loading' ? (
            <>
              <EquipmentCard
                slot="모자"
                isLoading
              />
              <EquipmentCard
                slot="무기"
                isLoading
              />
              <EquipmentCard
                slot="장갑"
                isLoading
              />
            </>
          ) : status === 'error' ? (
            <li className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive md:col-span-2 xl:col-span-3">
              장비 정보를 불러오지 못했습니다.
            </li>
          ) : equipmentData.length > 0 ? (
            equipmentData.map(item => (
              <EquipmentCard
                key={`${item.item_equipment_slot}-${item.item_name}`}
                item={item}
              />
            ))
          ) : (
            <li className="rounded-lg border border-border bg-muted/30 p-4 text-sm font-medium text-muted-foreground md:col-span-2 xl:col-span-3">
              표시할 장비 정보가 없습니다.
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
