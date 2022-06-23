// Utility Function to use **await sleep(ms)**
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let range = (start, end) => Array.from(Array(end + 1).keys()).slice(start)

const finder = (search, target) => {
  return search.map(function (val) {
    return target.filter(function (e) {
      return val === e
    }).length
  })
}

module.exports = {
  sleep,
  range,
  finder,
}
