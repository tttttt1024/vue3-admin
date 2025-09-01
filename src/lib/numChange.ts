export const increaseValue = (dataNode, key, targetValue, duration, start = 0) => {
  const range = targetValue - start
  const increment = range / (duration * 60)

  let current = start
  const timer = setInterval(() => {
    console.log('current', current, increment)

    current += increment
    if (current >= targetValue) {
      clearInterval(timer)
      current = targetValue
    }
    // squareData.value[0].num = Math.floor(current)
    // dataNode[key] = dataNode.num = Math.floor(current)
    dataNode[key] = Math.floor(current)
    console.log('dataNode[key]', dataNode[key])
  }, 40)
}
