const categories = {
    clothes: {
        title: "Clothes",
        items: ["T-shirts", "Jeans or trousers", "Dress or nice outfit", "Underwear", "Socks", "Pajamas", "Comfortable shoes"]
    },
    cosmetics: {
        title: "Cosmetics",
        items: ["Toothbrush", "Toothpaste", "Shampoo", "Conditioner", "Skincare", "Deodorant", "Makeup", "Hair brush"]
    },
    documents: {
        title: "Documents",
        items: ["Passport or ID", "Tickets", "Hotel booking", "Insurance", "Bank card", "Cash"]
    },
    tech: {
        title: "Tech",
        items: ["Phone charger", "Power bank", "Headphones", "Adapter", "Laptop or tablet"]
    },
    medicine: {
        title: "Medicine",
        items: ["Painkillers", "Plasters", "Personal medicine", "Allergy pills"]
    },
    other: {
        title: "Other",
        items: ["Sunglasses", "Tote bag", "Water bottle", "Book", "Snacks"]
    }
};

let packingList = [];

const categoriesContainer = document.getElementById("categories");
const packedCount = document.getElementById("packedCount");
const totalCount = document.getElementById("totalCount");
const progressPercent = document.getElementById("progressPercent");

const tripName = document.getElementById("tripName");
const days = document.getElementById("days");
const weather = document.getElementById("weather");
const generateBtn = document.getElementById("generateBtn");

const newItemInput = document.getElementById("newItemInput");
const categorySelect = document.getElementById("categorySelect");
const addItemBtn = document.getElementById("addItemBtn");

function createDefaultList() {
    packingList = [];

    Object.entries(categories).forEach(([categoryKey, category]) => {
        category.items.forEach(item => {
            packingList.push({
                id: crypto.randomUUID(),
                name: item,
                category: categoryKey,
                packed: false
            });
        });
    });

    addWeatherItems();
    addTripLengthItems();
    saveList();
    render();
}

function addWeatherItems() {
    const selectedWeather = weather.value;

    if (selectedWeather === "warm") {
        addGeneratedItem("Swimsuit", "clothes");
        addGeneratedItem("SPF sunscreen", "cosmetics");
        addGeneratedItem("Light jacket", "clothes");
    }

    if (selectedWeather === "cold") {
        addGeneratedItem("Warm sweater", "clothes");
        addGeneratedItem("Scarf", "clothes");
        addGeneratedItem("Warm socks", "clothes");
    }

    if (selectedWeather === "rainy" || selectedWeather === "mixed") {
        addGeneratedItem("Umbrella", "other");
        addGeneratedItem("Rain jacket", "clothes");
    }
}

function addTripLengthItems() {
    const tripDays = Number(days.value);

    if (tripDays >= 5) {
        addGeneratedItem("Laundry bag", "other");
        addGeneratedItem("Extra underwear", "clothes");
    }

    if (tripDays >= 7) {
        addGeneratedItem("Extra pair of shoes", "clothes");
        addGeneratedItem("Full-size skincare", "cosmetics");
    }
}

function addGeneratedItem(name, category) {
    packingList.push({
        id: crypto.randomUUID(),
        name,
        category,
        packed: false
    });
}

function render() {
    categoriesContainer.innerHTML = "";

    Object.entries(categories).forEach(([categoryKey, category]) => {
        const items = packingList.filter(item => item.category === categoryKey);
        const packedItems = items.filter(item => item.packed).length;

        const card = document.createElement("article");
        card.className = "category-card";

        card.innerHTML = `
            <div class="category-header">
                <h2>${category.title}</h2>
                <span class="badge">${packedItems}/${items.length}</span>
            </div>
        `;

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty";
            empty.textContent = "Nothing here yet.";
            card.appendChild(empty);
        }

        items.forEach(item => {
            const row = document.createElement("label");
            row.className = item.packed ? "item done" : "item";

            row.innerHTML = `
                <input type="checkbox" ${item.packed ? "checked" : ""}>
                <span>${item.name}</span>
                <button class="delete-btn" type="button">Remove</button>
            `;

            const checkbox = row.querySelector("input");
            checkbox.addEventListener("change", () => toggleItem(item.id));

            const deleteButton = row.querySelector("button");
            deleteButton.addEventListener("click", event => {
                event.preventDefault();
                deleteItem(item.id);
            });

            card.appendChild(row);
        });

        categoriesContainer.appendChild(card);
    });

    updateSummary();
}

function updateSummary() {
    const total = packingList.length;
    const packed = packingList.filter(item => item.packed).length;
    const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

    packedCount.textContent = packed;
    totalCount.textContent = total;
    progressPercent.textContent = `${percent}%`;
}

function toggleItem(id) {
    packingList = packingList.map(item => {
        if (item.id !== id) return item;

        return {
            ...item,
            packed: !item.packed
        };
    });

    saveList();
    render();
}

function deleteItem(id) {
    packingList = packingList.filter(item => item.id !== id);
    saveList();
    render();
}

function addCustomItem() {
    const name = newItemInput.value.trim();
    const category = categorySelect.value;

    if (!name) return;

    packingList.push({
        id: crypto.randomUUID(),
        name,
        category,
        packed: false
    });

    newItemInput.value = "";
    saveList();
    render();
}

function saveList() {
    const data = {
        tripName: tripName.value,
        days: days.value,
        weather: weather.value,
        packingList
    };

    localStorage.setItem("smartSuitcase", JSON.stringify(data));
}

function loadList() {
    const saved = localStorage.getItem("smartSuitcase");

    if (!saved) {
        createDefaultList();
        return;
    }

    const data = JSON.parse(saved);

    tripName.value = data.tripName || "";
    days.value = data.days || 4;
    weather.value = data.weather || "warm";
    packingList = data.packingList || [];

    render();
}

generateBtn.addEventListener("click", createDefaultList);
addItemBtn.addEventListener("click", addCustomItem);

newItemInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addCustomItem();
});

tripName.addEventListener("input", saveList);
days.addEventListener("input", saveList);
weather.addEventListener("change", saveList);

loadList();
