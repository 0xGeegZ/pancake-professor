// Utility Function to use **await sleep(ms)**
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const range = (start, end) => Array.from(Array(end + 1).keys()).slice(start)

const finder = (search, target) => {
  return search.map(function (val) {
    return target.filter(function (e) {
      return val === e
    }).length
  })
}

export default { sleep, range, finder }
// export default [sleep, range, finder]
// module.exports = {
//   sleep,
//   range,
//   finder,
// }

// module.exports = {
//   sleep,
//   range,
//   finder,
// }
