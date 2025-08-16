import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function InfoModal({ open, onClose }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white max-w-lg w-full p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Preemptive vs Non-Preemptive</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <div className="mt-3 text-sm text-gray-700 space-y-2">
          <p><strong>Non-Preemptive:</strong> Once a process starts execution, it runs to completion. New arriving processes—no matter their priority—must wait until the running process finishes.</p>
          <p><strong>Preemptive:</strong> The scheduler can interrupt the running process when a newly arrived process has a higher priority (lower numerical value). The running process pauses and will resume later when scheduled again.</p>
          <div>
            <p className="font-medium">Why it matters</p>
            <ul className="list-disc list-inside">
              <li>Preemptive scheduling can reduce waiting time for high-priority work arriving late.</li>
              <li>Non-preemptive is simpler and has less context-switch overhead.</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Example</p>
            <p>Processes: P1(AT=0,BT=10,Pr=2), P2(AT=2,BT=3,Pr=1)</p>
            <p className="text-xs text-gray-600">Non-Preemptive:&nbsp;P1 runs 0-10, P2 runs 10-13 (longer wait for P2)</p>
            <p className="text-xs text-gray-600">Preemptive:&nbsp;P1 runs 0-2, P2 arrives and preempts P1 because it has higher priority, P2 runs 2-5, then P1 resumes 5-13</p>
          </div>
        </div>
      </div>
    </div>
  )
}
