import useOcidStore from '@/store/store'
import { useParams } from 'react-router-dom'

export default function BasicInfo() {
  const { nickname } = useParams()
  console.log(nickname)
  const ocidData = useOcidStore(state => state.ocidDate)

  return (
    <section className="shadow-md rounded outline outline-slate-200	p-2">
      <header className="sr-only">캐릭터 기본 정보</header>
      <div>안녕하세요</div>
    </section>
  )
}
