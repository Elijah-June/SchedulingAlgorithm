import { computeSchedule } from './src/utils/scheduler.js'

const processes = [
  { id: 0, arrival: 3, burst: 2, priority: 1, label: 'P0' },
  { id: 1, arrival: 2, burst: 4, priority: 1, label: 'P1' },
  { id: 2, arrival: 0, burst: 6, priority: 1, label: 'P2' },
  { id: 3, arrival: 1, burst: 4, priority: 1, label: 'P3' }
]

console.log('=== Non-Preemptive ===')
console.log(JSON.stringify(computeSchedule(processes, 'nonpreemptive'), null, 2))

console.log('\n=== Preemptive ===')
console.log(JSON.stringify(computeSchedule(processes, 'preemptive'), null, 2))
