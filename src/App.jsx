import React, { useState, useMemo } from 'react'
import ProcessForm from './components/ProcessForm'
import ProcessList from './components/ProcessList'
import GanttChart from './components/GanttChart'
import ResultsTable from './components/ResultsTable'
import SolutionPanel from './components/SolutionPanel'
import { computeSchedule } from './utils/scheduler'
import ConfirmModal from './components/ConfirmModal'

export default function App(){
  const [processes, setProcesses] = useState([])
  const [mode, setMode] = useState('nonpreemptive') // or 'preemptive'
  const [tieBreak, setTieBreak] = useState('fcfs') // 'fcfs' or 'srtf'
  const [selectedId, setSelectedId] = useState(null)
  const [savedPerMode, setSavedPerMode] = useState({ preemptive: [], nonpreemptive: [] })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingMode, setPendingMode] = useState(null)

  // when switching to non-preemptive, arrival times are ignored in our simplified UI
  // clear processes to avoid confusion (user will re-add processes with appropriate fields)
  const handleSetMode = (newMode) => {
    // save current list for current mode
    setSavedPerMode(prev => ({ ...prev, [mode]: processes }))

    // always ask confirmation when switching modes
    setPendingMode(newMode)
    setConfirmOpen(true)
  }

  const onConfirmClearAndSwitch = ()=>{
    // clear processes for nonpreemptive and switch
    setSavedPerMode(prev => ({ ...prev, [pendingMode]: [] }))
    setProcesses([])
    setSelectedId(null)
    setMode(pendingMode)
    setPendingMode(null)
    setConfirmOpen(false)
  }

  const onConfirmKeepAndSwitch = ()=>{
    // restore saved list for nonpreemptive if exists, otherwise keep empty
    setProcesses(savedPerMode[pendingMode] || [])
    setSelectedId(null)
    setMode(pendingMode)
    setPendingMode(null)
    setConfirmOpen(false)
  }

  const onConfirmCancel = ()=>{
    setPendingMode(null)
    setConfirmOpen(false)
  }

  const results = useMemo(()=>computeSchedule(processes, mode, tieBreak), [processes, mode, tieBreak])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Priority Scheduling Visualizer</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <ProcessForm processes={processes} setProcesses={setProcesses} mode={mode} setMode={handleSetMode} tieBreak={tieBreak} setTieBreak={setTieBreak} />
          <div className="space-y-4">
            <ProcessList processes={processes} setProcesses={setProcesses} onSelect={id=>setSelectedId(id)} />
            <ResultsTable results={results} onSelect={id=>setSelectedId(id)} />
          </div>
        </div>

  <ConfirmModal open={confirmOpen}
    title={pendingMode ? `Switch to ${pendingMode === 'preemptive' ? 'Preemptive' : 'Non-Preemptive'}` : 'Switch mode'}
    message={pendingMode ? (pendingMode === 'nonpreemptive' ? 'Arrival time is ignored in Non-Preemptive mode. Do you want to clear processes, keep existing list for the mode, or cancel?' : 'Switching to Preemptive will restore any saved preemptive process list if available. Do you want to keep, clear, or cancel?') : 'Switch mode?'}
    onConfirmClear={onConfirmClearAndSwitch} onConfirmKeep={onConfirmKeepAndSwitch} onCancel={onConfirmCancel} />

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <GanttChart timeline={results.timeline} snapshots={results.snapshots} />
          </div>
          <div>
            <SolutionPanel selectedId={selectedId} processes={processes} results={results} timeline={results.timeline} mode={mode} />
          </div>
        </div>
      </div>
    </div>
  )
}
