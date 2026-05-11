import { useCharacterOcid } from '@/hooks/useCharacterOcid'
import { useParams } from 'react-router-dom'
import CharacterProfile from './CharacterProfile'
import CharacterTabs from './CharacterTabs'

export default function CharacterInfo() {
  const { nickname } = useParams()
  const { errorMessage, ocid } = useCharacterOcid(nickname)

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      )}
      <CharacterProfile ocid={ocid} />
      <CharacterTabs ocid={ocid} />
    </div>
  )
}
