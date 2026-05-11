import CharacterDailyReport from '@/components/character/CharacterDailyReport'
import CodySection from '@/components/character/CodySection'
import EquipmentSection from '@/components/equipment/EquipmentSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PackageCheck, Shirt, Sparkles } from 'lucide-react'

type Props = {
  ocid: string | undefined
}

const tabTriggerClassName =
  'gap-2 rounded-md border border-transparent px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-background hover:text-slate-950 data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-emerald-700 data-[state=active]:shadow-md dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white dark:data-[state=active]:border-white/10 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-emerald-200'

export default function CharacterTabs({ ocid }: Props) {
  return (
    <Tabs
      defaultValue="equipment"
      className="mt-5">
      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-lg bg-slate-100/80 p-1 text-slate-700 sm:grid-cols-3 dark:bg-white/[0.04] dark:text-slate-300">
          <TabsTrigger
            className={tabTriggerClassName}
            value="equipment">
            <PackageCheck className="h-4 w-4" />
            장비 정보
          </TabsTrigger>
          <TabsTrigger
            className={tabTriggerClassName}
            value="report">
            <Sparkles className="h-4 w-4" />
            오늘 리포트
          </TabsTrigger>
          <TabsTrigger
            className={tabTriggerClassName}
            value="cody">
            <Shirt className="h-4 w-4" />
            코디
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        className="mt-4"
        value="equipment">
        <EquipmentSection ocid={ocid} />
      </TabsContent>
      <TabsContent
        className="mt-4"
        value="report">
        <CharacterDailyReport ocid={ocid} />
      </TabsContent>
      <TabsContent
        className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm"
        value="cody">
        <CodySection ocid={ocid} />
      </TabsContent>
    </Tabs>
  )
}
