import { LOCATION_META } from '@/constants/locationMeta'

export default function LocationCard({ loc, selected, onClick }) {
  const meta     = LOCATION_META[loc.name] ?? {}
  const isFull   = loc.treasure_count >= loc.max_count
  const isLow    = loc.treasure_count <= 3 && !isFull

  return (
    <button
      className={[
        'loc-card',
        selected ? 'loc-card--selected' : '',
        isFull   ? 'loc-card--full'     : '',
      ].filter(Boolean).join(' ')}
      onClick={() => !isFull && onClick(loc)}
      disabled={isFull}
    >
      {/* 장소 이미지 */}
      <div className="loc-card__img-wrap">
        {meta.image
          ? <img src={meta.image} alt={loc.name} className="loc-card__img" />
          : <div className="loc-card__img loc-card__img--placeholder" />
        }
      </div>

      {/* 장소명 */}
      <p className="loc-card__name">{loc.name}</p>

      {/* 선택하기 버튼 영역 */}
      <div className={`loc-card__select-btn ${selected ? 'active' : ''}`}>
        {selected ? '✓ 선택됨' : '선택하기'}
      </div>

      {/* 잔여 보물 */}
      <div className={`loc-card__count ${isFull ? 'full' : isLow ? 'low' : ''}`}>
        {isFull
          ? '🔒 가득참'
          : `${loc.treasure_count}/${loc.max_count}`
        }
      </div>
    </button>
  )
  
}
