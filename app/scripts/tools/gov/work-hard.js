const sumUpDays = () => {
    const cells = [...document.querySelectorAll('tamin-data-grid table > tbody > tr > td:nth-child(n + 7)')];

    const days = cells.map((td) => +td.textContent);

    return days.reduce((sum, x) => sum + x, 0);
};

const govWorkHard = () => {
    const sum = sumUpDays();
    const content = `Total Days: ${sum}`;

    console.log(content);
    alert(content);
};

tools['govWorkHard'] = govWorkHard;
