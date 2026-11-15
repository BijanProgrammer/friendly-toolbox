const sumUpDays = () => {
  const cells = [
    ...document.querySelectorAll(
      "tamin-data-grid table > tbody > tr > td:nth-child(n + 7)",
    ),
  ];

  const days = cells.map((td) => Number(td.textContent));

  return days.reduce((sum, x) => sum + x, 0);
};

const calculateDays = (days: number) => `${days} Days`;

const calculateMonths = (days: number) => {
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  return `${months} Months and ${calculateDays(remainingDays)}`;
};

const calculateYears = (days: number) => {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  return `${years} Years and ${calculateMonths(remainingDays)}`;
};

const show = (days: number) => {
  const content = [
    calculateDays(days),
    calculateMonths(days),
    calculateYears(days),
  ].join("\n");

  console.log(content);
  alert(content);
};

export const govWorkHard = () => {
  show(sumUpDays());
};
