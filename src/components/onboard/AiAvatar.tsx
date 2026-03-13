interface AiAvatarProps {
  size?: number
  thinking?: boolean
  eating?: boolean
  fat?: 0 | 1 | 2 | 3
}

export function AiAvatar({ size = 100, thinking = false, eating = false, fat = 0 }: AiAvatarProps) {
  // fat レベルに応じてボディを少しずつ膨らませる
  const bodyR   = 42 + fat * 1.5
  const cheekRx = 5  + fat * 1.2
  const cheekRy = 3  + fat * 0.8
  const cheekOffset = fat > 1 ? fat * 1.5 : 0 // 太るほどほっぺが横に広がる

  // 口: 通常=スマイル曲線、eating=大きく開いた楕円
  const mouthPath = eating
    ? undefined // eating時は楕円で描く
    : `M ${36 - fat * 0.5} 63 Q 50 ${73 + fat * 1.5} ${64 + fat * 0.5} 63`

  return (
    <div
      className={`inline-flex items-center justify-center ${thinking ? 'animate-pulse' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* eating アニメ用CSS */}
      {eating && (
        <style>{`
          @keyframes sei-munch {
            0%,100% { transform: scaleY(1); }
            25%      { transform: scaleY(0.6); }
            50%      { transform: scaleY(1.2); }
            75%      { transform: scaleY(0.7); }
          }
          .sei-mouth { animation: sei-munch 0.25s ease-in-out infinite; transform-origin: center; }
          @keyframes sei-grow {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
          .sei-body { animation: sei-grow 0.4s ease-in-out; }
        `}</style>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 外側グロー */}
        <circle cx="50" cy="50" r="46" fill="#eff6ff" />

        {/* メインサークル（fat で微妙に膨らむ） */}
        <circle
          cx="50"
          cy={50 + fat * 0.5}
          r={bodyR}
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="1.5"
          className={eating ? 'sei-body' : ''}
        />

        {/* 頭部パーツ */}
        <circle cx="34" cy="43" r="7" fill="#1e40af" />
        <circle cx="36" cy="41" r="2.5" fill="white" />
        <circle cx="66" cy="43" r="7" fill="#1e40af" />
        <circle cx="68" cy="41" r="2.5" fill="white" />

        {/* 口 */}
        {eating ? (
          <ellipse
            cx="50"
            cy="66"
            rx="8"
            ry="6"
            fill="#1e40af"
            className="sei-mouth"
          />
        ) : (
          <path
            d={mouthPath}
            stroke="#1e40af"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* アンテナ */}
        <line x1="50" y1="8" x2="50" y2="20" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="50" cy="6" r="3.5" fill="#3b82f6" />

        {/* ほっぺ（fat で大きくなる） */}
        <ellipse
          cx={25 - cheekOffset}
          cy={55 + fat * 0.5}
          rx={cheekRx}
          ry={cheekRy}
          fill="#93c5fd"
          opacity="0.6"
        />
        <ellipse
          cx={75 + cheekOffset}
          cy={55 + fat * 0.5}
          rx={cheekRx}
          ry={cheekRy}
          fill="#93c5fd"
          opacity="0.6"
        />

        {/* fat >= 2 のときだけ二重あご */}
        {fat >= 2 && (
          <ellipse cx="50" cy={50 + bodyR - 4} rx={12 + fat * 2} ry={4 + fat} fill="#bfdbfe" opacity="0.7" />
        )}
      </svg>
    </div>
  )
}
