// Utility Function to use **await sleep(ms)**
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  sleep
}
