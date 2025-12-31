const API_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const selects = document.querySelectorAll(".dropdown select");
const fromSelect = document.querySelector(".from select");
const toSelect = document.querySelector(".to select");
const swapBtn = document.querySelector(".dropdown i");
const convertBtn = document.querySelector("form button");
const resultText = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

/* Populate currency dropdowns */
selects.forEach((select) => {
  for (let code in countryList) {
    const option = document.createElement("option");
    option.value = code;
    option.innerText = code;

    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;

    select.append(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
});

/* Update flag when currency changes */
function updateFlag(selectEl) {
  const countryCode = countryList[selectEl.value];
  const img = selectEl.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

/* Prevent invalid characters in amount */
amountInput.addEventListener("keydown", (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
});

/* Fetch and display exchange rate */
async function convertCurrency() {
  let amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    amount = 1;
    amountInput.value = 1;
  }

  const res = await fetch(`${API_URL}/${fromSelect.value.toLowerCase()}.json`);
  const data = await res.json();

  const rate =
    data[fromSelect.value.toLowerCase()][toSelect.value.toLowerCase()];

  resultText.innerText = `${amount} ${fromSelect.value} = ${(
    amount * rate
  ).toFixed(2)} ${toSelect.value}`;
}

/* Button click */
convertBtn.addEventListener("click", (e) => {
  e.preventDefault();
  convertCurrency();
});

/* Swap currencies */
swapBtn.addEventListener("click", () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;

  updateFlag(fromSelect);
  updateFlag(toSelect);
  convertCurrency();
});

/* Initial load */
window.addEventListener("load", convertCurrency);
