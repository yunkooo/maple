const getDate = () => {
  const nowDate = new Date()
  const prevDate = new Date(nowDate.setDate(nowDate.getDate() - 1))

  const year = prevDate.getFullYear()
  const month = (nowDate.getMonth() + 1).toString().padStart(2, '0')
  const day = nowDate.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}
export { getDate }
