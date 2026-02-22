// ===============================
// ✅ API BASE URL
// ===============================
const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// ===============================
// ✅ DOM ELEMENTS
// ===============================
const fromContainer = document.querySelector(".custom-dropdown.from");
const toContainer = document.querySelector(".custom-dropdown.to");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const btn = document.querySelector("form button");

// ===============================
// ✅ CURRENT SELECTED CURRENCIES
// ===============================
let fromCurrency = "USD";
let toCurrency = "INR";

// ===============================
// ✅ CREATE SEARCHABLE DROPDOWN
// ===============================
const createDropdown = (container, isFrom) => {
  const input = container.querySelector(".search-input");
  const optionsBox = container.querySelector(".options");

  // Default values
  input.value = isFrom ? "USD" : "INR";

  // Populate dropdown
  for (let code in countryList) {
    const option = document.createElement("div");
    option.classList.add("option-item");
    option.innerText = code;
    optionsBox.appendChild(option);

    option.addEventListener("click", () => {
      input.value = code;
      optionsBox.style.display = "none";

      if (isFrom) {
        fromCurrency = code;
      } else {
        toCurrency = code;
      }

      updateExchangeRate();
    });
  }

  // Show dropdown on focus
  input.addEventListener("focus", () => {
    optionsBox.style.display = "block";
  });

  // Filter currencies while typing
  input.addEventListener("input", () => {
    const filter = input.value.toUpperCase();
    const items = optionsBox.querySelectorAll(".option-item");

    items.forEach((item) => {
      item.style.display =
        item.innerText.includes(filter) ? "block" : "none";
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      optionsBox.style.display = "none";
    }
  });
};

// ===============================
// ✅ UPDATE EXCHANGE RATE
// ===============================
const updateExchangeRate = async () => {
  try {
    let amount = amountInput.value;

    if (amount === "" || amount <= 0) {
      amount = 1;
      amountInput.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurrency.toLowerCase()}.json`;

    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch rate");
    }

    const data = await response.json();

    const rate =
      data[fromCurrency.toLowerCase()][toCurrency.toLowerCase()];

    const finalAmount = amount * rate;

    msg.innerText = `${amount} ${fromCurrency} = ${finalAmount.toFixed(
      2
    )} ${toCurrency}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
};

// ===============================
// ✅ BUTTON CLICK
// ===============================
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// ===============================
// ✅ INITIALIZE DROPDOWNS
// ===============================
createDropdown(fromContainer, true);
createDropdown(toContainer, false);

// ===============================
// ✅ LOAD DEFAULT RATE
// ===============================
window.addEventListener("load", () => {
  updateExchangeRate();
});