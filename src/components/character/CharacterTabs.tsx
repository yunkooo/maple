import EquipmentSection from '@/components/equipment/EquipmentSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PackageCheck } from 'lucide-react'

type Props = {
  ocid: string | undefined
}

export default function CharacterTabs({ ocid }: Props) {
  return (
    <Tabs
      defaultValue="equipment"
      className="mt-5">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="h-auto justify-start rounded-lg border border-emerald-200/70 bg-emerald-50 p-1 dark:border-emerald-400/15 dark:bg-emerald-400/10">
          <TabsTrigger
            className="gap-2 rounded-md px-4 py-2 text-sm font-black text-emerald-900 hover:text-emerald-950 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm dark:text-emerald-100 dark:hover:text-white dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-emerald-200"
            value="equipment">
            <PackageCheck className="h-4 w-4" />
            장비 정보
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
          <span className="rounded-full border border-border bg-background px-3 py-1">
            스탯은 장비 정보와 분리해 제공 예정
          </span>
        </div>
      </div>
      <TabsContent
        className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm"
        value="equipment">
        <EquipmentSection ocid={ocid} />
      </TabsContent>
    </Tabs>
  )
}
