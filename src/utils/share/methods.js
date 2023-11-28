export function voteRate(valid, total) {
  let result = valid / total * 100;
  return (result.toFixed(2)) % 1 === 0 ? Math.floor(result) : result.toFixed(2);
}

// 計算千分位
export function numberWithCommas(value) {
  const stringValue = typeof value === 'number' ? value.toString() : value
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}