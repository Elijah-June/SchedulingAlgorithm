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

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-2">Gantt Chart</h3>
      <div className="overflow-x-auto">
        <div className="relative h-20 min-w-[600px] border rounded bg-white/50">
          {sorted.map((seg,i)=>{
            const left = ((seg.start - minStart)/span)*100
            const width = ((seg.end - seg.start)/span)*100
            const color = colors[seg.id % colors.length]
            return (
              <motion.div key={`${seg.id}-${seg.start}-${seg.end}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}
                className={`${color} absolute top-3 bottom-6 rounded text-white text-center flex flex-col justify-center`} style={{left: `${left}%`, width: `${width}%`, minWidth: 8}}>
                <div className="text-sm font-medium px-1">{seg.label || `P${seg.id}`}</div>
                <div className="text-[10px] text-black bg-white/40">{seg.start} - {seg.end} ms</div>
              </motion.div>
            )
          })}

          {/* time ticks */}
          <div className="absolute left-0 right-0 bottom-0 flex">
            {Array.from({length: Math.max(2, Math.ceil(span)+1)}).map((_,i)=>{
              const left = (i/span)*100
              const t = minStart + i
              return (
                <div key={i} style={{left: `${left}%`}} className="relative" />
              )
            })}
          </div>
        </div>
  <div className="mt-2 text-xs text-gray-600">Time: {minStart} — {maxEnd} ms</div>
        {/** snapshots panel */}
        {Array.isArray(snapshots) && snapshots.length>0 && (
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2">Snapshots</h4>
            <div className="space-y-2 text-xs">
              {snapshots.map(s=> (
                <div key={s.time} className="grid grid-cols-3 gap-3 items-start border-l pl-3 py-1">
                  <div className="text-gray-700">Time:</div>
                  <div className="col-span-2 font-medium">{s.time} ms</div>

                  <div className="text-gray-700">Arrived Process:</div>
                  <div className="col-span-2">{s.arrived.length? s.arrived.join(', ') : '—'}</div>

                  <div className="text-gray-700">Remaining Time (ms):</div>
                  <div className="col-span-2">
                    {s.remaining.length? (
                      <div className="flex flex-col">
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
