const sumUpDays = () => {
  const cells = [
    ...document.querySelectorAll(
      "tamin-data-grid table > tbody > tr > td:nth-child(n + 7)"
    ),
  ];

  const days = cells.map((td) => +td.textContent);

  return days.reduce((sum, x) => sum + x, 0);
};

const calculateDays = (days) => {
  return `${days} Days`;
};

const calculateMonths = (days) => {
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  return `${months} Months and ${calculateDays(remainingDays)}`;
};

const calculateYears = (days) => {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;

  return `${years} Years and ${calculateMonths(remainingDays)}`;
};

const show = (days) => {
  const content = [
    calculateDays(days),
    calculateMonths(days),
    calculateYears(days),
  ].join("\n");

  console.log(content);
  alert(content);
};

const govWorkHard = () => {
  const days = sumUpDays();
  show(days);
};

tools["govWorkHard"] = govWorkHard;
