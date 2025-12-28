export const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Jan = 1

  if (month >= 6) {
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    return `${year - 1}-${String(year).slice(-2)}`;
  }
};

export const getSemesterType = () => {
  const month = new Date().getMonth() + 1;
  return month >= 6 && month <= 11 ? "odd" : "even";
};