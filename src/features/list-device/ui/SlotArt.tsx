import { useId, type ReactNode } from 'react'
import type { CategoryId } from '@/entities/category'

const BODY = '#2b2c30'
const SCREEN = '#111214'
const LINE = '#98928a'
const LIGHT = '#e2dcd1'
const ACCENT = '#ff5a1f'

/** Dashed orange ring that marks the part of the device this shot must show clearly. */
const Focus = ({ x, y, width, height, r = 8 }: { x: number; y: number; width: number; height: number; r?: number }) => (
  <rect x={x} y={y} width={width} height={height} rx={r} fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="5 4" />
)

const Lenses = ({ x, y }: { x: number; y: number }) => (
  <>
    <circle cx={x} cy={y} r="6" fill={SCREEN} stroke={LINE} strokeWidth="1.5" />
    <circle cx={x} cy={y + 15} r="6" fill={SCREEN} stroke={LINE} strokeWidth="1.5" />
    <circle cx={x + 15} cy={y + 7} r="6" fill={SCREEN} stroke={LINE} strokeWidth="1.5" />
    <circle cx={x + 15} cy={y - 6} r="2.5" fill="#fff" />
  </>
)

function PhoneFront({ on, grad }: { on: boolean; grad: string }) {
  return (
    <>
      <rect x="68" y="8" width="64" height="154" rx="13" fill={BODY} />
      <rect x="72" y="12" width="56" height="146" rx="10" fill={on ? `url(#${grad})` : SCREEN} />
      <rect x="92" y="17" width="16" height="5" rx="2.5" fill={SCREEN} />
      {on ? (
        <>
          <rect x="80" y="40" width="40" height="8" rx="4" fill="#fff" opacity=".85" />
          <rect x="80" y="54" width="28" height="5" rx="2.5" fill="#fff" opacity=".45" />
          <rect x="80" y="120" width="40" height="22" rx="7" fill="#fff" opacity=".25" />
        </>
      ) : (
        <>
          <path d="M72 40 L128 18 L128 44 L72 70 Z" fill="#fff" opacity=".08" />
          <path d="M72 96 L128 74 L128 90 L72 114 Z" fill="#fff" opacity=".05" />
        </>
      )}
    </>
  )
}

function PhoneBack() {
  return (
    <>
      <rect x="68" y="8" width="64" height="154" rx="13" fill={BODY} />
      <rect x="75" y="15" width="30" height="34" rx="8" fill="#1b1c1f" />
      <Lenses x={85} y={26} />
      <circle cx="100" cy="102" r="9" fill="none" stroke={LINE} strokeWidth="1.5" />
    </>
  )
}

/** A device seen edge-on: a slab with the details that edge must show. */
function EdgeH({ detail }: { detail: 'top' | 'bottom' }) {
  return (
    <>
      <rect x="16" y="62" width="168" height="34" rx="12" fill={BODY} />
      <rect x="16" y="66" width="168" height="4" fill="#fff" opacity=".08" />
      {detail === 'top' ? (
        <>
          <circle cx="60" cy="80" r="3" fill={SCREEN} />
          <rect x="94" y="77" width="30" height="6" rx="3" fill={SCREEN} />
          <Focus x={46} y={70} width={90} height={20} r={10} />
        </>
      ) : (
        <>
          <rect x="84" y="75" width="32" height="9" rx="4.5" fill={SCREEN} />
          {[36, 46, 56, 66].map((x) => <circle key={x} cx={x} cy="80" r="2.2" fill={SCREEN} />)}
          {[134, 144, 154, 164].map((x) => <circle key={x} cx={x} cy="80" r="2.2" fill={SCREEN} />)}
          <Focus x={74} y={68} width={52} height={24} r={10} />
        </>
      )}
    </>
  )
}

function EdgeV({ detail }: { detail: 'left' | 'right' }) {
  return (
    <>
      <rect x="84" y="8" width="32" height="154" rx="13" fill={BODY} />
      <rect x="88" y="8" width="4" height="154" fill="#fff" opacity=".08" />
      {detail === 'left' ? (
        <>
          <rect x="96" y="38" width="8" height="14" rx="4" fill={SCREEN} />
          <rect x="96" y="62" width="8" height="26" rx="4" fill={SCREEN} />
          <rect x="96" y="96" width="8" height="26" rx="4" fill={SCREEN} />
          <Focus x={90} y={32} width={20} height={96} r={8} />
        </>
      ) : (
        <>
          <rect x="96" y="58" width="8" height="40" rx="4" fill={SCREEN} />
          <rect x="94" y="120" width="12" height="3" rx="1.5" fill={SCREEN} />
          <Focus x={90} y={52} width={20} height={52} r={8} />
        </>
      )}
    </>
  )
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <>
      <rect x="22" y="26" width="156" height="118" rx="12" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      {children}
    </>
  )
}

function Scene({ category, id, grad }: { category: CategoryId; id: string; grad: string }) {
  const key = `${category}:${id}`
  switch (key) {
    case 'phone:front-on': return <PhoneFront on grad={grad} />
    case 'phone:front-off': return <PhoneFront on={false} grad={grad} />
    case 'phone:back': return <PhoneBack />
    case 'phone:top': return <EdgeH detail="top" />
    case 'phone:bottom': return <EdgeH detail="bottom" />
    case 'phone:left': return <EdgeV detail="left" />
    case 'phone:right': return <EdgeV detail="right" />
    case 'phone:camera':
      return (
        <>
          <rect x="52" y="28" width="96" height="114" rx="22" fill={BODY} />
          <rect x="62" y="38" width="76" height="94" rx="16" fill="#1b1c1f" />
          <circle cx="86" cy="64" r="15" fill={SCREEN} stroke={LINE} strokeWidth="2" />
          <circle cx="86" cy="106" r="15" fill={SCREEN} stroke={LINE} strokeWidth="2" />
          <circle cx="120" cy="85" r="15" fill={SCREEN} stroke={LINE} strokeWidth="2" />
          <circle cx="120" cy="52" r="5" fill="#fff" />
          <circle cx="82" cy="60" r="4" fill="#fff" opacity=".25" />
          <Focus x={46} y={22} width={108} height={126} r={26} />
        </>
      )
    case 'phone:battery':
    case 'watch:battery':
      return (
        <Frame>
          <rect x="40" y="44" width="54" height="26" rx="6" fill="none" stroke={BODY} strokeWidth="3" />
          <rect x="94" y="52" width="4" height="10" rx="2" fill={BODY} />
          <rect x="44" y="48" width="42" height="18" rx="3" fill="#16794c" />
          <rect x="108" y="48" width="52" height="7" rx="3.5" fill={LIGHT} />
          <rect x="108" y="60" width="34" height="7" rx="3.5" fill={LIGHT} />
          <rect x="40" y="86" width="120" height="8" rx="4" fill={LIGHT} />
          <rect x="40" y="86" width="108" height="8" rx="4" fill="#16794c" />
          <rect x="40" y="106" width="90" height="6" rx="3" fill={LIGHT} />
          <rect x="40" y="118" width="70" height="6" rx="3" fill={LIGHT} />
        </Frame>
      )
    case 'phone:storage':
      return (
        <Frame>
          <rect x="40" y="46" width="74" height="9" rx="4.5" fill={LIGHT} />
          <rect x="40" y="66" width="120" height="16" rx="8" fill={LIGHT} />
          <rect x="40" y="66" width="46" height="16" rx="8" fill={ACCENT} />
          <rect x="86" y="66" width="28" height="16" fill="#98928a" />
          <rect x="114" y="66" width="18" height="16" fill="#2b2c30" />
          <rect x="40" y="96" width="14" height="6" rx="3" fill={ACCENT} />
          <rect x="60" y="96" width="34" height="6" rx="3" fill={LIGHT} />
          <rect x="40" y="110" width="14" height="6" rx="3" fill="#98928a" />
          <rect x="60" y="110" width="44" height="6" rx="3" fill={LIGHT} />
        </Frame>
      )
    case 'phone:defects':
    case 'watch:defects':
      return (
        <>
          <path d="M40 150 L40 52 Q40 30 62 30 L130 30" fill="none" stroke={BODY} strokeWidth="16" strokeLinecap="round" />
          <circle cx="112" cy="84" r="40" fill="#fff" stroke={ACCENT} strokeWidth="3" />
          <path d="M92 100 L130 66 M102 106 L120 90 M96 78 l14 10" stroke={BODY} strokeWidth="2" strokeLinecap="round" />
          <path d="M142 114 L170 142" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" />
        </>
      )
    case 'phone:box':
    case 'speaker:accessories':
      return (
        <>
          <rect x="28" y="60" width="144" height="78" rx="8" fill={BODY} />
          <rect x="28" y="44" width="144" height="26" rx="6" fill="#3a3b40" />
          <rect x="84" y="50" width="32" height="8" rx="4" fill={LINE} />
          <rect x="62" y="84" width="34" height="34" rx="6" fill="#fff" />
          <circle cx="132" cy="101" r="17" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="132" cy="101" r="7" fill="none" stroke="#fff" strokeWidth="4" />
        </>
      )
    case 'watch:front-on':
    case 'watch:front-off':
    case 'watch:back':
    {
      const on = key === 'watch:front-on'
      const back = key === 'watch:back'
      return (
        <>
          <rect x="82" y="2" width="36" height="166" rx="8" fill="#3a3b40" />
          <rect x="52" y="34" width="96" height="102" rx="30" fill={BODY} />
          {back ? (
            <>
              <circle cx="100" cy="85" r="32" fill="#1b1c1f" stroke={LINE} strokeWidth="2" />
              {[[88, 76], [112, 76], [88, 94], [112, 94]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="5" fill={on ? ACCENT : '#16794c'} />)}
              <circle cx="100" cy="85" r="4" fill={LINE} />
            </>
          ) : (
            <>
              <rect x="58" y="40" width="84" height="90" rx="25" fill={on ? `url(#${grad})` : SCREEN} />
              {on ? (
                <>
                  <circle cx="100" cy="85" r="26" fill="none" stroke="#fff" strokeWidth="2" opacity=".55" />
                  <path d="M100 85 L100 66 M100 85 L114 92" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                <path d="M58 70 L142 40 L142 66 L58 100 Z" fill="#fff" opacity=".08" />
              )}
            </>
          )}
        </>
      )
    }
    case 'watch:crown':
      return (
        <>
          <rect x="22" y="48" width="130" height="74" rx="22" fill={BODY} />
          <rect x="22" y="54" width="130" height="5" fill="#fff" opacity=".08" />
          <rect x="152" y="66" width="20" height="38" rx="6" fill="#3a3b40" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={156 + i * 2} y="70" width="1.5" height="30" fill={LINE} />)}
          <rect x="140" y="122" width="22" height="10" rx="4" fill="#3a3b40" />
          <Focus x={136} y={56} width={42} height={62} r={12} />
        </>
      )
    case 'watch:band':
      return (
        <>
          <rect x="6" y="64" width="62" height="42" rx="14" fill="#3a3b40" />
          <rect x="132" y="64" width="62" height="42" rx="14" fill="#3a3b40" />
          {[18, 30, 42, 54].map((x) => <circle key={x} cx={x} cy="85" r="3" fill={SCREEN} />)}
          <rect x="68" y="56" width="64" height="58" rx="20" fill={BODY} />
          <rect x="74" y="62" width="52" height="46" rx="14" fill={SCREEN} />
          <Focus x={2} y={58} width={196} height={54} r={16} />
        </>
      )
    case 'watch:clasp':
      return (
        <>
          <rect x="30" y="48" width="140" height="74" rx="14" fill="#3a3b40" />
          <rect x="52" y="60" width="96" height="50" rx="8" fill="none" stroke={LINE} strokeWidth="5" />
          <rect x="96" y="56" width="8" height="58" rx="3" fill={LINE} />
          <circle cx="76" cy="85" r="4" fill={SCREEN} />
          <Focus x={44} y={52} width={112} height={66} r={12} />
        </>
      )
    case 'speaker:front':
    case 'speaker:working':
      return (
        <>
          <rect x="58" y="14" width="84" height="142" rx="38" fill={BODY} />
          {[34, 48, 62, 76, 90, 104].map((y) => [74, 88, 100, 112, 126].map((x) => <circle key={`${x}${y}`} cx={x} cy={y + 12} r="2.4" fill="#4a4b50" />))}
          {key === 'speaker:working' ? (
            <>
              <circle cx="100" cy="140" r="4" fill={ACCENT} />
              <circle cx="86" cy="140" r="3" fill="#16794c" />
              <circle cx="114" cy="140" r="3" fill="#16794c" />
            </>
          ) : (
            <circle cx="100" cy="140" r="4" fill={LINE} />
          )}
        </>
      )
    case 'speaker:back':
      return (
        <>
          <rect x="58" y="14" width="84" height="142" rx="38" fill={BODY} />
          <rect x="72" y="52" width="56" height="44" rx="6" fill="#fff" />
          <rect x="78" y="60" width="44" height="5" rx="2.5" fill={LIGHT} />
          <rect x="78" y="70" width="32" height="4" rx="2" fill={LIGHT} />
          <rect x="78" y="80" width="38" height="4" rx="2" fill={LIGHT} />
          <rect x="84" y="114" width="32" height="12" rx="5" fill={SCREEN} />
          <Focus x={66} y={46} width={68} height={56} r={8} />
        </>
      )
    case 'speaker:top':
      return (
        <>
          <rect x="16" y="52" width="168" height="66" rx="30" fill={BODY} />
          {[56, 84, 112, 140].map((cx) => <circle key={cx} cx={cx} cy="85" r="9" fill={SCREEN} stroke={LINE} strokeWidth="1.5" />)}
          <Focus x={40} y={70} width={120} height={30} r={14} />
        </>
      )
    case 'speaker:bottom':
      return (
        <>
          <rect x="16" y="58" width="168" height="58" rx="26" fill={BODY} />
          <rect x="28" y="108" width="144" height="14" rx="7" fill="#1b1c1f" />
          <rect x="50" y="116" width="20" height="8" rx="3" fill={LINE} />
          <rect x="130" y="116" width="20" height="8" rx="3" fill={LINE} />
          <Focus x={22} y={102} width={156} height={26} r={12} />
        </>
      )
    case 'speaker:side':
      return (
        <>
          <rect x="70" y="12" width="60" height="146" rx="30" fill={BODY} />
          <rect x="74" y="22" width="4" height="126" rx="2" fill="#fff" opacity=".1" />
          <path d="M130 50 q22 6 22 30 q0 24 -22 30" fill="none" stroke={LINE} strokeWidth="5" strokeLinecap="round" />
          <Focus x={64} y={6} width={72} height={158} r={34} />
        </>
      )
    case 'speaker:ports':
      return (
        <>
          <rect x="30" y="40" width="140" height="90" rx="22" fill={BODY} />
          <rect x="52" y="72" width="40" height="16" rx="8" fill={SCREEN} />
          <rect x="60" y="77" width="24" height="6" rx="3" fill={LINE} />
          <circle cx="128" cy="80" r="11" fill={SCREEN} />
          <circle cx="128" cy="80" r="4" fill={LINE} />
          <Focus x={42} y={60} width={116} height={40} r={14} />
        </>
      )
    default:
      return <PhoneFront on={false} grad={grad} />
  }
}

/** A line drawing of exactly the view each photo slot asks for, shown until the seller adds the photo. */
export function SlotArt({ category, slotId }: { category: CategoryId; slotId: string }) {
  const grad = `s${useId().replace(/:/g, '')}`
  return (
    <svg className="slot__art" viewBox="0 0 200 170" aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={SCREEN} />
        </linearGradient>
      </defs>
      <Scene category={category} id={slotId} grad={grad} />
    </svg>
  )
}
