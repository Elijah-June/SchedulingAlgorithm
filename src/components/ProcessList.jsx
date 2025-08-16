import React, { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function ProcessList({ processes, setProcesses, onSelect }){
  const remove = (id)=> setProcesses(processes.filter(p=>p.id!==id))
  const [editingId, setEditingId] = useState(null)
  const [editVals, setEditVals] = useState({ arrival: 0, burst: 1, priority: 0 })

  const startEdit = (p)=>{
    setEditingId(p.id)
    setEditVals({ arrival: p.arrival, burst: p.burst, priority: p.priority })
    onSelect?.(p.id)
  }

  const cancelEdit = ()=>{
    setEditingId(null)
  }

  const saveEdit = (id)=>{
    const next = processes.map(p=> p.id===id ? { ...p, arrival: Number(editVals.arrival), burst: Number(editVals.burst), priority: Number(editVals.priority) } : p)
    setProcesses(next)
    setEditingId(null)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-2">Processes</h3>
      <div className="space-y-2">
        {processes.length===0 && <div className="text-sm text-gray-500">No processes yet.</div>}
        {processes.map(p=> (
          <div key={p.id} className="flex items-center justify-between border rounded p-2">
            {!editingId || editingId !== p.id ? (
              <div onClick={()=>startEdit(p)} className="text-sm cursor-pointer">
                {p.label || `P${p.id}`} — <abbr title="Arrival Time">AT</abbr>:{p.arrival} <abbr title="Burst Time">BT</abbr>:{p.burst} <abbr title="Priority">Pr</abbr>:{p.priority}
              </div>
            ) : (
              <div className="w-full grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <input type="number" min="0" value={editVals.arrival} onChange={e=>setEditVals({...editVals, arrival: e.target.value})} className="border p-1 rounded w-full text-sm" />
                </div>
                <div className="col-span-4">
                  <input type="number" min="1" value={editVals.burst} onChange={e=>setEditVals({...editVals, burst: e.target.value})} className="border p-1 rounded w-full text-sm" />
                </div>
                <div className="col-span-2">
                  <input type="number" min="0" value={editVals.priority} onChange={e=>setEditVals({...editVals, priority: e.target.value})} className="border p-1 rounded w-full text-sm" />
                </div>
                <div className="col-span-2 flex gap-2 justify-end">
                  <button onClick={()=>saveEdit(p.id)} className="text-sm bg-green-600 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={cancelEdit} className="text-sm bg-gray-200 px-2 py-1 rounded">Cancel</button>
                </div>
              </div>
            )}

            <button onClick={()=>remove(p.id)} className="text-red-500 hover:text-red-700">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
