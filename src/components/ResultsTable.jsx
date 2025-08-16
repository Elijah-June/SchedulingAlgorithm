import React from 'react'

export default function ResultsTable({ results, onSelect }){
  if(!results) return null
  const { rows, avgTAT, avgWT } = results

  const headers = ['Process','Arrival','Burst','Priority','Completion','TAT','WT']

  const exportCSV = ()=>{
    const csv = [headers.join(',')].concat(rows.map(r=> [
      `${r.label || `P${r.id}`}`,
      r.arrival,
      r.burst,
      r.priority,
      r.ct,
      r.tat,
      r.wt
    ].join(','))).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'priority-schedule.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Results</h3>
        <button onClick={exportCSV} className="text-sm text-blue-600">Export CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th>Process</th>
              <th><abbr title="Arrival Time">AT</abbr></th>
              <th><abbr title="Burst Time">BT</abbr></th>
              <th><abbr title="Priority">Pr</abbr></th>
              <th><abbr title="Completion Time">CT</abbr></th>
              <th><abbr title="Turnaround Time">TAT</abbr></th>
              <th><abbr title="Waiting Time">WT</abbr></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r.id} className="border-t cursor-pointer" onClick={()=>onSelect?.(r.id)}>
                <td>{r.label || `P${r.id}`}</td>
                <td>{r.arrival}</td>
                <td>{r.burst}</td>
                <td>{r.priority}</td>
                <td>{r.ct}</td>
                <td>{r.tat}</td>
                <td>{r.wt}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-medium">
              <td colSpan={4}>Averages</td>
              <td></td>
              <td>{rows.length? avgTAT.toFixed(2) : '0.00'}</td>
              <td>{rows.length? avgWT.toFixed(2) : '0.00'}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
