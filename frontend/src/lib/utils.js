export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatMesasgeDate(date) {
  const today = new Date();
  const msgDate = new Date(date);
  const diffInMs = Math.abs(msgDate - today);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  console.log(diffInDays);

  if (diffInDays > 7) {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  } else if (diffInDays == 0) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  }


}
