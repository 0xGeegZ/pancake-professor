import { Queue } from 'quirrel/next'

// https://docs.quirrel.dev/api/queue

export default Queue(
  'api/jobs/launch-strategie',
  async (strategieId) => {
    console.log('Job launching job for sttategie', strategieId)
  },
  {
    // if execution fails, it will be retried
    // 10s, 1min and 2mins after the scheduled date
    // retry: ['10s', '1min', '2min'],
  }
)
