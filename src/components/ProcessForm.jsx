import React, { useState, useEffect } from 'react'
import { PlusCircleIcon, CalculatorIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import InfoModal from './InfoModal'

export default function ProcessForm({ processes, setProcesses, mode, setMode, tieBreak, setTieBreak }){
  const [label, setLabel] = useState('')
  const [arrival, setArrival] = useState(0)
  const [burst, setBurst] = useState(1)
  const [priority, setPriority] = useState(1)

  useEffect(()=>{
    // recalc happens outside via parent useMemo
  },[processes, mode])

  const addProcess = ()=>{
    const id = processes.length ? Math.max(...processes.map(p=>p.id)) + 1 : 1
  const finalLabel = label.trim() || `P${id}`
  setProcesses([...processes, { id, label: finalLabel, arrival: Number(arrival), burst: Number(burst), priority: Number(priority) }])
  setLabel('')
  }

  const [showInfo, setShowInfo] = useState(false)
  const [showPriorityHint, setShowPriorityHint] = useState(false)

  useEffect(()=>{
    if(processes.length>0){
      const vals = processes.map(p=>p.priority)
      const allEqual = vals.every(v=>v===vals[0])
      setShowPriorityHint(allEqual)
    } else setShowPriorityHint(false)
  },[processes])

  const autoAssignPriorities = ()=>{
    // assign priorities by arrival (earlier -> smaller number = higher priority)
    const sorted = [...processes].sort((a,b)=> a.arrival - b.arrival || a.id - b.id)
    const reassigned = sorted.map((p,i)=> ({ ...p, priority: i }))
    // restore original order
    const restored = reassigned.sort((a,b)=> a.id - b.id)
    setProcesses(restored)
  }

  return (
    <>
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium">Add Process</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowInfo(true)} title="What is the difference?" className="text-gray-600 hover:text-gray-800">
              <InformationCircleIcon className="w-5 h-5" />
            </button>
            <span className="text-sm">Mode</span>
            <button onClick={()=>setMode(mode==='preemptive'?'nonpreemptive':'preemptive')} className={`px-3 py-1 rounded ${mode==='preemptive' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {mode === 'preemptive' ? 'Preemptive' : 'Non-Preemptive'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Tie-break</label>
            <select value={tieBreak} onChange={e=>setTieBreak(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="fcfs">FCFS</option>
              <option value="srtf">SRTF</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm text-gray-600">Label (optional)</label>
        <input className="border p-2 rounded" type="text" value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. IO, CPU-bound)" />

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <label className="text-sm text-gray-600">Arrival Time</label>
            <input className="border p-2 rounded w-full" type="number" min="0" value={arrival} onChange={e=>setArrival(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Burst Time</label>
            <input className="border p-2 rounded w-full" type="number" min="1" value={burst} onChange={e=>setBurst(e.target.value)} placeholder="1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Priority</label>
            <input className="border p-2 rounded w-full" type="number" min="0" value={priority} onChange={e=>setPriority(e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button onClick={addProcess} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500">
          <PlusCircleIcon className="w-5 h-5" />
          Add
        </button>
  {/* Recompute button removed per user request */}
        <button onClick={()=>setProcesses([])} className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500">
          <TrashIcon className="w-5 h-5" />
          Reset All
        </button>
      </div>
      {showPriorityHint && (
        <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-300 text-sm rounded">
          <div className="font-medium">Note: All processes have equal priority.</div>
          <div className="mt-1">When priorities are equal, the scheduler uses tie-break rules (burst/arrival/id). Preemptive behavior may not appear.</div>
          <div className="mt-2">
            <button onClick={autoAssignPriorities} className="text-sm text-blue-600 underline">Auto-assign priorities by arrival</button>
          </div>
        </div>
      )}
    </div>
    {showInfo && <InfoModal open={showInfo} onClose={()=>setShowInfo(false)} />}
    </>
  )
}
