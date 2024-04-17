// 清空空白字元
export function removeSpace(str) {
  return str.replace(/ /g, '')
}

// 計算千分位
export function numberWithCommas(value) {
  const stringValue = typeof value === 'number' ? value.toString() : value
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
