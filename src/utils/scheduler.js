// Scheduler logic for priority scheduling (preemptive and non-preemptive)

export function computeSchedule(processes = [], mode = 'nonpreemptive', tieBreak = 'fcfs'){
  // clone and sort by arrival then id
  const procs = processes.map(p=>({...p})).sort((a,b)=> a.arrival - b.arrival || a.id - b.id)
  if(procs.length===0) return { rows: [], avgTAT:0, avgWT:0, timeline: [] }

  let time = 0
  const timeline = []
  const completed = []

  if(mode === 'nonpreemptive'){
    // pick next available highest priority (lower number = higher priority)
    const queue = [...procs]
    while(queue.length){
      // find arrived tasks
      const available = queue.filter(p=>p.arrival <= time)
      let next
      if(available.length===0){
        // advance time
        time = queue[0].arrival
        continue
      } else {
        // highest priority => smallest priority value
        // tie-breaker: configurable
        available.sort((a,b)=> {
          const pa = a.priority - b.priority
          if(pa !== 0) return pa
          if(tieBreak === 'srtf'){
            const bb = a.burst - b.burst
            if(bb !== 0) return bb
          }
          const pa2 = a.arrival - b.arrival
          if(pa2 !== 0) return pa2
          return a.id - b.id
        })
        next = available[0]
      }

      // run to completion
      const start = Math.max(time, next.arrival)
      const end = start + next.burst
      timeline.push({ id: next.id, start, end })
  // carry label if present
  if(next.label) timeline[timeline.length-1].label = next.label
      time = end
      completed.push({...next, ct: end})
      // remove from queue
      const idx = queue.findIndex(p=>p.id===next.id)
      queue.splice(idx,1)
    }
  } else {
    // preemptive: simulate time-slice by time unit, always run highest-priority arrived with remaining time
    const remaining = procs.map(p=> ({ ...p, rem: p.burst }))
    while(true){
      // check if any remaining
      const pending = remaining.filter(p=>p.rem>0)
      if(pending.length===0) break

      // consider arrived
      const arrived = pending.filter(p=>p.arrival <= time)
      if(arrived.length===0){
        time = Math.min(...pending.map(p=>p.arrival))
        continue
      }
      // pick highest priority among arrived
      // tie-breaker for preemptive: configurable; 'srtf' uses smallest remaining
      arrived.sort((a,b)=> {
        const pa = a.priority - b.priority
        if(pa !== 0) return pa
        if(tieBreak === 'srtf'){
          const rb = a.rem - b.rem
          if(rb !== 0) return rb
        }
        const pa2 = a.arrival - b.arrival
        if(pa2 !== 0) return pa2
        return a.id - b.id
      })
      const run = arrived[0]
      const start = time
      // run until either completion or next arrival of higher priority
  // find next arrival time of any process that would preempt current run
  // that is: arrival of any process with strictly higher priority OR (if tieBreak==='srtf') same priority but smaller remaining
  const higherArrivals = remaining.filter(p=> p.arrival > time && (p.priority < run.priority || (tieBreak === 'srtf' && p.priority === run.priority && p.rem < run.rem)))
      const nextHigherArrival = higherArrivals.length? Math.min(...higherArrivals.map(p=>p.arrival)) : Infinity
      const runUntil = Math.min(time + run.rem, nextHigherArrival)
      const end = runUntil
      timeline.push({ id: run.id, start, end })
    if(run.label) timeline[timeline.length-1].label = run.label
      const used = end - start
      run.rem -= used
      time = end
      if(run.rem===0){
        // mark completion
        const orig = procs.find(p=>p.id===run.id)
        completed.push({...orig, ct: time})
      }
    }
  }

  // compute TAT and WT
  const rows = completed.map(p=> ({ id: p.id, label: p.label, arrival: p.arrival, burst: p.burst, priority: p.priority, ct: p.ct, tat: p.ct - p.arrival, wt: p.ct - p.arrival - p.burst }))
  rows.sort((a,b)=>a.id - b.id)
  const avgTAT = rows.length? rows.reduce((s,r)=>s + r.tat,0)/rows.length : 0
  const avgWT = rows.length? rows.reduce((s,r)=>s + r.wt,0)/rows.length : 0

  // merge consecutive timeline segments for the same process (avoid adjacent duplicates)
  const merged = []
  for(const seg of timeline){
    if(merged.length===0) { merged.push({...seg}); continue }
    const last = merged[merged.length-1]
    if(last.id === seg.id && last.end === seg.start){
      // extend last segment
      last.end = seg.end
      // preserve label if present
      if(seg.label && !last.label) last.label = seg.label
    } else {
      merged.push({...seg})
    }
  }

  // build snapshots: at interesting times (arrivals and timeline boundaries) show arrived processes and remaining times
  const timesSet = new Set()
  procs.forEach(p=> timesSet.add(p.arrival))
  merged.forEach(s=> { timesSet.add(s.start); timesSet.add(s.end) })
  const times = Array.from(timesSet).sort((a,b)=>a-b)

  const snapshots = times.map(t=>{
    // arrived processes at time t
    const arrived = procs.filter(p=> p.arrival <= t).map(p=> ({ id: p.id, label: p.label || `P${p.id}`, arrival: p.arrival, burst: p.burst }))
    // compute executed before time t using merged timeline
    const executedMap = new Map()
    for(const seg of merged){
      const segStart = seg.start
      const segEnd = seg.end
      if(segEnd <= t){
        // fully executed before t
        executedMap.set(seg.id, (executedMap.get(seg.id) || 0) + (segEnd - segStart))
      } else if(segStart < t && segEnd > t){
        // partial
        executedMap.set(seg.id, (executedMap.get(seg.id) || 0) + (t - segStart))
      }
    }
    const remaining = arrived.map(p=> {
      const exec = executedMap.get(p.id) || 0
      return { id: p.id, label: p.label, rem: Math.max(0, p.burst - exec) }
    })
    return { time: t, arrived: arrived.map(a=> a.label), remaining }
  })

  return { rows, avgTAT, avgWT, timeline: merged, snapshots }
}
