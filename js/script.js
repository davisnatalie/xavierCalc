const committeeMembers = [
  { name: 'Alaina', commitment: 0 },
  { name: 'Ashleigh', commitment: 0 },
  { name: 'David', commitment: 0 },
  { name: 'Ellie', commitment: 0 },
  { name: 'Joel', commitment: 0 },
  { name: 'Jon', commitment: 0 },
  { name: 'Justine', commitment: 0 },
  { name: 'Natalie', commitment: 0 },
  { name: 'Ryan', commitment: 0 },
];

const dayCosts = {
  monTues: 1628.54,
  Monday: 1212.35,
  Executive: 2080.98,
  monFood: 1188.92,
  default: 0,
};

function generateTable() {
  committeeMembers.sort((a, b) => a.name.localeCompare(b.name));
  const tableBody = document.getElementById('committeeBody');

  committeeMembers.forEach(member => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = member.name;
    row.appendChild(nameCell);

    const commitmentCell = document.createElement('td');
    const commitmentInput = document.createElement('input');
    commitmentInput.type = 'number';
    commitmentInput.id = `${member.name.toLowerCase()}Commitment`;
    commitmentInput.value = member.commitment;
    commitmentInput.addEventListener('input', calculateIncome);
    commitmentCell.appendChild(commitmentInput);
    row.appendChild(commitmentCell);

    const incomeCell = document.createElement('td');
    incomeCell.id = `${member.name.toLowerCase()}Income`;
    row.appendChild(incomeCell);

    tableBody.appendChild(row);
  });
}

function updateCost() {
  const daySelect = document.getElementById('daySelect');
  const earlyPrice = parseFloat(document.getElementById('earlyPrice').value);
  const selectedDay = daySelect.value;
  let cost = getCostByDay(selectedDay);
  const dayCostSpan = document.getElementById('dayCost');
  dayCostSpan.textContent = '$' + cost;

  calculateIncome();

  // Update <h4> with the selected day's details
  const h4Element = document.querySelector('h4');
  if (selectedDay === 'monTues') {
    h4Element.innerHTML = `<ul>Based on last year's program: <li>
      2 hours of unlimited bowling on 3 lanes <li>
      4 light bite platters  <li>
      25 shoes maximum (50% discount) <li>
      50 drink tickets (negotiable) <li>
      Charged for high-top tables <br>
      Total cost: $1,628.54</ul>`;
    h4Element.classList.add('with-border');
  } else if (selectedDay === 'Monday') {
    h4Element.innerHTML = `<ul><li>2 hours of unlimited bowling on 3 lanes <li>
      25 shoe rentals <li>
      50 beer/wine/soda drink tickets <li>
      NO Food <li>
      NO high tops reserved <br>
      Total cost: $1,212.35</ul>`;
    h4Element.classList.add('with-border');
  } else if (selectedDay === 'Executive') {
    h4Element.innerHTML = `<ul>Discounted Premium Package <li>
      2 hours of unlimited bowling <li>
      25 shoe rentals <li>
      50 PREMIUM drink tickets (house cocktail plus beer wine soda) <li>
      3 replenished food selections <br>
      Total cost: $2080.98</ul>`;
    h4Element.classList.add('with-border');
  } else if (selectedDay === 'monFood') {
    h4Element.innerHTML = `<ul><li>
      2 hours of unlimited bowling on 3 lanes <li>
      25 shoe rentals<li>
      NO drinks<li>
      FOOD: 1 Full Crudite Platter, 2x Party Platters, 7x pizzas <li>
      NO high tops reserved<br>
      Total cost: $1,188.92</ul>`;
    h4Element.classList.add('with-border');
  } else {
    h4Element.textContent = '';
  }
}

function getCostByDay(day) {
  return dayCosts[day] || dayCosts.default;
}

function calculateIncome() {
  let totalIncome = 0;
  let totalCommitment = 0; // Initialize total commitment
  const earlyPrice = parseFloat(document.getElementById('earlyPrice').value) || 0;
  const stdPrice = parseFloat(document.getElementById('stdPrice').value) || 0;
  let ticketPrice = earlyPrice; // Initialize ticket price as earlyPrice
  const dayCost = getCostByDay(document.getElementById('daySelect').value);

  totalCommitment = committeeMembers.reduce((acc, member) => {
    const commitmentInput = document.getElementById(`${member.name.toLowerCase()}Commitment`);
    const commitment = parseFloat(commitmentInput.value) || 0;

    acc += commitment; // Accumulate commitment values

    const income = ticketPrice * commitment;
    totalIncome += income;

    const incomeCell = document.getElementById(`${member.name.toLowerCase()}Income`);
    incomeCell.textContent = '$' + income.toFixed(2); // Limit to 2 decimal places

    return acc;
  }, 0);

  // Update the total commitment span
  const totalCommitmentSpan = document.getElementById('totalCommitment');
  totalCommitmentSpan.textContent = totalCommitment;

  if (totalCommitment >= 26) {
    totalIncome += (stdPrice - earlyPrice) * (totalCommitment - 25); // Add to total income
  }

  ticketPrice = totalCommitment > 25 ? stdPrice : earlyPrice; // Update ticket price to regular price if total commitment reaches 25 or more

  const totalIncomeSpan = document.getElementById('totalIncome');
  totalIncomeSpan.textContent = '$' + totalIncome.toFixed(2); // Limit to 2 decimal places

  const profit = (totalIncome - dayCost).toFixed(2); // Limit to 2 decimal places
  const profitSpan = document.getElementById('profit');
  profitSpan.textContent = '$' + profit;
}

generateTable();
