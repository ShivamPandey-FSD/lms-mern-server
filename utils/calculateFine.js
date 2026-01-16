const calculateFine = (dueDate) => {
 const finePerHour = 5;
 const today = new Date();
 if (today > dueDate) {
  const lateHours = Math.ceil((today - dueDate)/ (1000 * 60 * 60));
  const fine = lateHours * finePerHour;
  return fine;
 }
 return 0;
}

module.exports = calculateFine;
