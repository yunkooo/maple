const getDate = () => {
  const nowDate = new Date()
  const month =
    nowDate.getMonth() + 1 < 10
      ? '0' + (nowDate.getMonth() + 1).toString()
      : nowDate.getMonth() + 1

  return `${nowDate.getFullYear()}-${month}-${nowDate.getDate() - 1}`
}
export { getDate }
