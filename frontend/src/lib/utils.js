export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
 
export function fromatMesasgeDate(date){ 
return new Date(date).DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit'
});
}
console.log(fromatMesasgeDate); // e.g., "March 25, 2024"
