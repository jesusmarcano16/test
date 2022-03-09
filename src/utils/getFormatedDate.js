const getFormatedtDate = (extraDays) => {
  const d = new Date()
  if (extraDays) {
    d.setDate(d.getDate() + extraDays)
  }
  let month = (d.getMonth() + 1).toString()
  let day = d.getDate().toString()
  const year = d.getFullYear()
  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }
  return [year, month, day].join('-')
}
export default getFormatedtDate
