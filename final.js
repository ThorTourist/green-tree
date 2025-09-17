// Global cart
let cart = [];

// ===== Spinner Handler =====
const manageSpinner = (status) => {
  // Optional spinner element if needed
};

// ===== Remove active category =====
const removeActive = () => {
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => btn.classList.remove("active"));
};

// ===== Load Categories =====
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const categories = [{ id: "all", name: "All Trees" }, ...data.categories];
      displayCategories(categories);
    });
};

// ===== Display Categories =====
const displayCategories = (categories) => {
  const container = document.getElementById("categories");
  container.innerHTML = "";

  // Add "All Trees" first
  const allBtn = document.createElement("button");
  allBtn.id = "category-btn-all";
  allBtn.className = "btn btn-outline w-full category-btn";
  allBtn.innerText = "🌱 All Trees";
  allBtn.onclick = () => {
    removeActive();
    allBtn.classList.add("active");
    loadPlants();
  };
  container.appendChild(allBtn);

  // Add real categories
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.id = `category-btn-${cat.id}`;
    btn.className = "btn btn-outline w-full category-btn";

    // Safely get category name
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
const loadPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants));
};

// ===== Load Plants by Category =====
const loadPlantsByCategory = (id) => {
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // The API wraps plants in data.data.plants
      displayPlants(data.data.plants);
    });
};

// ===== Display Plants =====
const displayPlants = (plants) => {
  const container = document.getElementById("plants");
  container.innerHTML = "";

  if (!plants || plants.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center bg-green-50 rounded-xl p-6">
        <h2 class="text-xl font-semibold">No plants found 🌱</h2>
      </div>
    `;
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "card bg-white rounded-xl p-5 shadow text-center";

    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="h-40 w-full object-cover rounded mb-4"/>
      <h2 class="font-bold text-xl">${plant.name}</h2>
      <p class="text-sm mt-2">$${plant.price}</p>
      <div class="flex justify-between mt-4">
        <button class="btn btn-outline btn-sm">Details</button>
        <button class="btn btn-warning btn-sm">Add</button>
      </div>
    `;

    // Detail button
    card.querySelector(".btn-outline").onclick = () =>
      loadPlantDetails(plant.id);

    // Add to cart button
    card.querySelector(".btn-warning").onclick = () =>
      addToCart(plant.name, plant.price);

    container.appendChild(card);
  });
};

// ===== Load Plant Details =====
const loadPlantDetails = async (id) => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/plant/${id}`
    );
    const data = await res.json();
    const plant = data.data; // the API structure
    displayPlantModal(plant);
  } catch (err) {
    console.error(err);
  }
};

// ===== Display Plant Modal =====
const displayPlantModal = (plant) => {
  document.getElementById("modal-title").innerText = plant.name;
  document.getElementById("modal-image").src = plant.image;
  document.getElementById("modal-description").innerText = plant.description;
  document.getElementById("modal-price").innerText = plant.price;
  document.getElementById("plantModal").showModal();
};

// ===== Cart Functions =====
const addToCart = (name, price) => {
  cart.push({ name, price });
  updateCart();
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCart();
};

const updateCart = () => {
  const container = document.getElementById("cart-list");
  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-white p-2 rounded";
    li.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price}</span>
      <button class="text-red-500">x</button>
    `;
    li.querySelector("button").onclick = () => removeFromCart(index);
    container.appendChild(li);
  });

  document.getElementById("total").innerText = total;
};

// ===== Checkout =====
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  updateCart();
});

// ===== Initialize =====
loadCategories();
loadPlants();
