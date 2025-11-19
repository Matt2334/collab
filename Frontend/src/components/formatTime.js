function formatTime(lastActive) {
  const dateObject = new Date(lastActive);
  const now = new Date()
  let difference = now-dateObject
  let seconds = difference/1000
  let minutes = seconds/60
  let hours = minutes/60
  let days = hours/24
  
  if (minutes<60) return Math.round(minutes)+" minutes ago"
  else if (hours<24) return Math.round(hours) +" hours ago"
  else return Math.round(days) +" days ago"
  
}
export default formatTime;
