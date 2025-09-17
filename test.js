// Global cart
let cart = [];

// ===== Spinner Handler =====
const manageSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  const plantContainer = document.getElementById("plants");
  if (status) {
    if (!spinner) {
      const div = document.createElement("div");
      div.id = "spinner";
      div.className = "col-span-full flex justify-center py-10";
      div.innerHTML = `<div class="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>`;
      plantContainer.parentNode.insertBefore(div, plantContainer);
    } else {
      spinner.classList.remove("hidden");
    }
    plantContainer.classList.add("hidden");
  } else {
    if (spinner) spinner.classList.add("hidden");
    plantContainer.classList.remove("hidden");
  }
};

// ===== Remove active category =====
const removeActive = () => {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
};

// ===== Load Categories =====
const loadCategories = async () => {
  try {
    const res = await fetch(
      "https://openapi.programming-hero.com/api/categories"
    );
    const data = await res.json();
    displayCategories(data.categories);
  } catch (err) {
    console.error(err);
  }
};

// ===== Display Categories =====
const displayCategories = (categories) => {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  // Add "All Trees" button
  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-outline w-full category-btn";
  allBtn.id = "category-btn-all";
  allBtn.innerText = "🌱 All Trees";
  allBtn.onclick = () => {
    removeActive();
    allBtn.classList.add("active");
    loadPlants();
  };
  container.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full category-btn";
    btn.id = `category-btn-${cat.id}`;
    const catName = cat.category_name || cat.category || cat.name || "Unknown";
    btn.innerText = `🌱 ${catName}`;
    btn.onclick = () => {
      removeActive();
      btn.classList.add("active");
      loadPlantsByCategory(cat.id);
    };
    container.appendChild(btn);
  });
};

// ===== Load All Plants =====
const loadPlants = async () => {
  manageSpinner(true);
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayPlants(data.plants);
  } catch (err) {
    console.error(err);
  }
};

// ===== Load Plants by Category =====
const loadPlantsByCategory = async (id) => {
  manageSpinner(true);
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/category/${id}`
    );
    const data = await res.json();
    displayPlants(data.plants);
  } catch (err) {
    console.error(err);
  }
};

// ===== Display Plants =====
const displayPlants = (plants) => {
  const container = document.getElementById("plants");
  container.innerHTML = "";

  if (!plants || plants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center bg-green-50 rounded-xl p-6">
        <img class="mx-auto mb-4" src="assets/alert-error.png" alt="" />
        <h2 class="text-xl font-semibold">No plants found 🌱</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-5 shadow text-center";

    card.innerHTML = `
      <img src="${plant.image}" alt="${
      plant.name
    }" class="h-40 w-full object-cover rounded mb-4"/>
      <h2 class="font-bold text-xl cursor-pointer hover:text-green-700">${
        plant.name
      }</h2>
      <p class="text-sm mt-1">${
        plant.description
          ? plant.description.slice(0, 50) + "..."
          : "No description"
      }</p>
      <p class="mt-1"><span class="font-bold">Category:</span> ${
        plant.category || "Unknown"
      }</p>
      <p class="mt-1 font-bold">Price: $${plant.price}</p>
      <div class="flex justify-center gap-2 mt-3">
        <button class="btn btn-sm btn-warning text-green-900">Add to Cart</button>
      </div>
    `;

    // Open modal on name click
    card.querySelector("h2").onclick = () => loadPlantDetails(plant.id);

    // Add to cart
    card.querySelector("button").onclick = () => addToCart(plant);

    container.appendChild(card);
  });

  manageSpinner(false);
};

// ===== Load Plant Details =====
const loadPlantDetails = async (id) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/plant/${id}`
    );
    const data = await res.json();
    displayPlantDetails(data.data);
  } catch (err) {
    console.error(err);
  }
};

// ===== Display Plant Details in Modal =====
const displayPlantDetails = (plant) => {
  document.getElementById("modal-title").innerText = plant.name;
  document.getElementById("modal-image").src = plant.image;
  document.getElementById("modal-description").innerText =
    plant.description || "No description";
  document.getElementById("modal-price").innerText = plant.price || 0;
  document.getElementById("plantModal").showModal();
};

// ===== Cart Functions =====
const addToCart = (plant) => {
  cart.push(plant);
  displayCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  displayCart();
};

const displayCart = () => {
  const container = document.getElementById("cart-list");
  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-white p-2 rounded shadow";
    li.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price}</span>
      <button class="text-red-500 font-bold">❌</button>
    `;
    li.querySelector("button").onclick = () => removeFromCart(index);
    container.appendChild(li);
  });

  document.getElementById("total").innerText = total;
};

// ===== Checkout =====
document.getElementById("checkout-btn").onclick = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  displayCart();
};

// ===== Initialize =====
loadCategories();
loadPlants();
