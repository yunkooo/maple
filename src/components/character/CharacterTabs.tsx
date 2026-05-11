import EquipmentSection from '@/components/equipment/EquipmentSection'
import NoticeSection from '@/components/notice/NoticeSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

type Props = {
  ocid: string | undefined
}

export default function CharacterTabs({ ocid }: Props) {
  return (
    <Tabs
      defaultValue="equipment"
      className="mt-5">
      <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-lg border border-border bg-card p-1 shadow-sm">
        <TabsTrigger
          className="rounded-md px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-emerald-400 dark:data-[state=active]:text-slate-950"
          value="equipment">
          장비
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-emerald-400 dark:data-[state=active]:text-slate-950"
          value="stats">
          스탯
        </TabsTrigger>
        <TabsTrigger
          className="rounded-md px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-emerald-400 dark:data-[state=active]:text-slate-950"
          value="notice">
          공지
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm"
        value="equipment">
        <EquipmentSection ocid={ocid} />
      </TabsContent>
      <TabsContent
        className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm"
        value="stats">
        스탯 분석 화면은 다음 단계에서 연결할 수 있도록 영역만 준비했습니다.
      </TabsContent>
      <TabsContent
        className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm"
        value="notice">
        <NoticeSection />
      </TabsContent>
    </Tabs>
  )
}
