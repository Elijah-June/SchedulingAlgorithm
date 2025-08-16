import React from 'react'

function computeFromSegments(proc, segments){
  // segments: [{start,end}...]
  const totalExec = segments.reduce((s,seg)=> s + (seg.end - seg.start), 0)
  const ct = segments.length? Math.max(...segments.map(s=>s.end)) : undefined
  const tat = ct !== undefined? ct - proc.arrival : undefined
  const wt = tat !== undefined? tat - proc.burst : undefined
  return { totalExec, ct, tat, wt }
}

export default function SolutionPanel({ selectedId, processes, results, timeline, mode }){
  if(!selectedId) return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium">Solution</h4>
      <div className="text-sm text-gray-500 mt-2">Click a process in the list or results to see computation details.</div>
    </div>
  )

  const proc = processes.find(p=>p.id===selectedId) || {}
  const row = results.rows?.find(r=>r.id===selectedId) || {}
  const segments = timeline.filter(s=>s.id===selectedId).map(s=> ({ start: s.start, end: s.end }))
  const calc = computeFromSegments(proc, segments)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-medium">Solution for {proc.label || `P${selectedId}`}</h4>

      <div className="mt-2 text-sm">
        <div><strong>Arrival Time</strong>: {proc.arrival ?? '-'}</div>
        <div><strong>Burst Time</strong>: {proc.burst ?? '-'}</div>
        <div><strong>Priority</strong>: {proc.priority ?? '-'}</div>
      </div>

      <div className="mt-3">
        <h5 className="font-medium">Step-by-step Computation</h5>
        <div className="text-sm mt-2">
          {segments.length===0 && <div className="text-gray-500">No execution segments available.</div>}
          {segments.length>0 && (
            <div>
              <div className="mb-2">Execution Segments:</div>
              <ul className="list-disc list-inside text-sm mb-2">
                {segments.map((s,i)=> (
                  <li key={i}>Runs from t={s.start} to t={s.end} (exec {s.end - s.start})</li>
                ))}
              </ul>

              <div className="mt-2">
                <div><strong>Total executed</strong>: {calc.totalExec} (should equal Burst Time {proc.burst})</div>
                <div><strong>Completion Time (CT)</strong>: max(segment end times) = {calc.ct ?? '-'}</div>
                <div><strong>Turnaround Time (TAT)</strong>: CT - AT = {calc.ct ?? '-'} - {proc.arrival ?? '-'} = {calc.tat ?? '-'}</div>
                <div><strong>Waiting Time (WT)</strong>: TAT - BT = {calc.tat ?? '-'} - {proc.burst ?? '-'} = {calc.wt ?? '-'}</div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Mode: {mode === 'preemptive' ? 'Preemptive' : 'Non-Preemptive'} — The computation above shows how segments add up to CT/TAT/WT.
        </div>
      </div>
    </div>
  )
}
