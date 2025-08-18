import React from 'react'
import { motion } from 'framer-motion'

const colors = ["bg-red-400","bg-blue-400","bg-green-400","bg-yellow-400","bg-purple-400","bg-pink-400","bg-indigo-400","bg-emerald-400"]

export default function GanttChart({ timeline, snapshots }){
  if(!timeline || timeline.length===0) return null

  // ensure timeline sorted by start
  const sorted = [...timeline].sort((a,b)=> a.start - b.start || a.id - b.id)
  const minStart = Math.min(...sorted.map(s=>s.start))
  const maxEnd = Math.max(...sorted.map(s=>s.end))
  const span = Math.max(1, maxEnd - minStart)
  // compute a responsive pixel width for the timeline so it scales on mobile
  // - pxPerUnit controls compactness: lower => more compact on small screens
  const pxPerUnit = 28
  const minPx = 320
  const maxPx = 1600
  const totalWidth = Math.min(maxPx, Math.max(minPx, Math.floor(span * pxPerUnit)))

  // build lanes per process id
  const processIds = Array.from(new Set(sorted.map(s => s.id)))
  const rowCount = processIds.length
  const rowHeight = 48 // px per lane
  const totalHeight = Math.max(80, rowCount * rowHeight + 20)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-2">Gantt Chart</h3>
      <div className="overflow-x-auto touch-pan-x">
        <div className="flex">
          {/* labels column (hidden on very small screens) */}
          <div className="hidden sm:block w-28 pr-2">
            <div className="h-6" />
            {processIds.map(pid => (
              <div key={pid} className="h-[48px] flex items-center text-sm text-gray-700 border-b" style={{height: rowHeight}}>
                {`P${pid}`}
              </div>
            ))}
          </div>

          <div className="relative border rounded bg-white/50" style={{minWidth: `${totalWidth}px`, height: `${totalHeight}px`}}>
            {/* row backgrounds */}
            {processIds.map((pid,idx) => (
              <div key={`row-${pid}`} className={`${idx % 2 === 0 ? 'bg-white/0' : 'bg-gray-50'} absolute left-0 right-0`} style={{top: idx * rowHeight + 8, height: rowHeight - 8}} />
            ))}

            {sorted.map((seg,i)=>{
              const left = ((seg.start - minStart)/span)*100
              const width = ((seg.end - seg.start)/span)*100
              const color = colors[seg.id % colors.length]
              const rowIndex = processIds.indexOf(seg.id)
              const top = 8 + rowIndex * rowHeight
              return (
                <motion.div key={`${seg.id}-${seg.start}-${seg.end}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
                  className={`${color} absolute rounded text-white flex flex-col justify-center items-start overflow-hidden`} style={{left: `${left}%`, width: `${width}%`, top: `${top}px`, height: `${rowHeight - 12}px`, minWidth: 6}}>
                  <div className="pl-2 text-xs sm:text-sm font-medium truncate w-full">{seg.label || `P${seg.id}`}</div>
                  <div className="pl-2 text-[9px] sm:text-[10px] text-black bg-white/40">{seg.start} - {seg.end} ms</div>
                </motion.div>
              )
            })}

            {/* time ticks (top overlay) */}
            <div className="absolute left-0 right-0 top-0 pointer-events-none">
              {Array.from({length: Math.max(2, Math.ceil(span)+1)}).map((_,i)=>{
                const left = (i/span)*100
                const t = minStart + i
                return (
                  <div key={i} style={{left: `${left}%`, position: 'absolute', top: 0}} className="text-[10px] text-gray-500 -mt-3">
                    <div style={{transform: 'translateX(-50%)'}}>{t}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

  <div className="mt-2 text-xs text-gray-600">Time: {minStart} — {maxEnd} ms</div>
        {/** snapshots panel */}
        {Array.isArray(snapshots) && snapshots.length>0 && (
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2">Snapshots</h4>
            <div className="space-y-2 text-xs">
              {snapshots.map(s=> (
                <div key={s.time} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start border-l pl-3 py-1">
                  <div className="text-gray-700">Time:</div>
                  <div className="col-span-2 font-medium">{s.time} ms</div>

                  <div className="text-gray-700">Arrived Process:</div>
                  <div className="col-span-2">{s.arrived.length? s.arrived.join(', ') : '—'}</div>

                  <div className="text-gray-700">Remaining Time (ms):</div>
                  <div className="col-span-2">
                    {s.remaining.length? (
                      <div className="flex flex-col gap-1">
                        {s.remaining.map(r=> (
                          <div key={r.id}>{(r.label || `P${r.id}`)} — {r.rem} ms</div>
                        ))}
                      </div>
                    ) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
