const categories = {
    clothes: {
        title: "Clothes",
        items: [
            { name: "T-shirts", quantity: 3 },
            { name: "Jeans or trousers", quantity: 2 },
            { name: "Dress or nice outfit", quantity: 1 },
            { name: "Underwear", quantity: 4 },
            { name: "Socks", quantity: 4 },
            { name: "Pajamas", quantity: 1 },
            { name: "Comfortable shoes", quantity: 1 }
        ]
    },
    cosmetics: {
        title: "Cosmetics",
        items: [
            { name: "Toothbrush", quantity: 1 },
            { name: "Toothpaste", quantity: 1 },
            { name: "Shampoo", quantity: 1 },
            { name: "Conditioner", quantity: 1 },
            { name: "Skincare", quantity: 1 },
            { name: "Deodorant", quantity: 1 },
            { name: "Makeup", quantity: 1 },
            { name: "Hair brush", quantity: 1 }
        ]
    },
    documents: {
        title: "Documents",
        items: [
            { name: "Passport or ID", quantity: 1 },
            { name: "Tickets", quantity: 1 },
            { name: "Hotel booking", quantity: 1 },
            { name: "Insurance", quantity: 1 },
            { name: "Bank card", quantity: 1 },
            { name: "Cash", quantity: 1 }
        ]
    },
    tech: {
        title: "Tech",
        items: [
            { name: "Phone charger", quantity: 1 },
            { name: "Power bank", quantity: 1 },
            { name: "Headphones", quantity: 1 },
            { name: "Adapter", quantity: 1 },
            { name: "Laptop or tablet", quantity: 1 }
        ]
    },
    medicine: {
        title: "Medicine",
        items: [
            { name: "Painkillers", quantity: 1 },
            { name: "Plasters", quantity: 1 },
            { name: "Personal medicine", quantity: 1 },
            { name: "Allergy pills", quantity: 1 }
        ]
    },
    other: {
        title: "Other",
        items: [
            { name: "Sunglasses", quantity: 1 },
            { name: "Tote bag", quantity: 1 },
            { name: "Water bottle", quantity: 1 },
            { name: "Book", quantity: 1 },
            { name: "Snacks", quantity: 1 }
        ]
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
const newItemQty = document.getElementById("newItemQty");
const categorySelect = document.getElementById("categorySelect");
const addItemBtn = document.getElementById("addItemBtn");
const pieceTemplate = document.getElementById("pieceTemplate");

function makePiece(itemName, index) {
    return {
        id: crypto.randomUUID(),
        name: `${itemName} ${index + 1}`,
        packed: false,
        photo: ""
    };
}

function makeItem(name, category, quantity = 1) {
    return {
        id: crypto.randomUUID(),
        name,
        category,
        quantity,
        opened: false,
        pieces: Array.from({ length: quantity }, (_, index) => makePiece(name, index))
    };
}

function createDefaultList() {
    packingList = [];

    Object.entries(categories).forEach(([categoryKey, category]) => {
        category.items.forEach(item => {
            packingList.push(makeItem(item.name, categoryKey, item.quantity));
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
        packingList.push(makeItem("Swimsuit", "clothes", 1));
        packingList.push(makeItem("SPF sunscreen", "cosmetics", 1));
        packingList.push(makeItem("Light jacket", "clothes", 1));
    }

    if (selectedWeather === "cold") {
        packingList.push(makeItem("Warm sweater", "clothes", 2));
        packingList.push(makeItem("Scarf", "clothes", 1));
        packingList.push(makeItem("Warm socks", "clothes", 2));
    }

    if (selectedWeather === "rainy" || selectedWeather === "mixed") {
        packingList.push(makeItem("Umbrella", "other", 1));
        packingList.push(makeItem("Rain jacket", "clothes", 1));
    }
}

function addTripLengthItems() {
    const tripDays = Number(days.value);

    if (tripDays >= 5) {
        packingList.push(makeItem("Laundry bag", "other", 1));
        packingList.push(makeItem("Extra underwear", "clothes", 2));
    }

    if (tripDays >= 7) {
        packingList.push(makeItem("Extra pair of shoes", "clothes", 1));
        packingList.push(makeItem("Full-size skincare", "cosmetics", 1));
    }
}

function normalizeOldData() {
    packingList = packingList.map(item => {
        if (item.pieces) return item;

        const quantity = item.quantity || 1;

        return {
            ...item,
            quantity,
            opened: false,
            pieces: Array.from({ length: quantity }, (_, index) => ({
                id: crypto.randomUUID(),
                name: quantity === 1 ? item.name : `${item.name} ${index + 1}`,
                packed: item.packed || false,
                photo: ""
            }))
        };
    });
}

function render() {
    categoriesContainer.innerHTML = "";

    Object.entries(categories).forEach(([categoryKey, category]) => {
        const items = packingList.filter(item => item.category === categoryKey);
        const packedPieces = items.reduce((sum, item) => sum + item.pieces.filter(piece => piece.packed).length, 0);
        const totalPieces = items.reduce((sum, item) => sum + item.pieces.length, 0);

        const card = document.createElement("article");
        card.className = "category-card";

        card.innerHTML = `
            <div class="category-header">
                <h2>${category.title}</h2>
                <span class="badge">${packedPieces}/${totalPieces}</span>
            </div>
        `;

        if (items.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty";
            empty.textContent = "Nothing here yet.";
            card.appendChild(empty);
        }

        items.forEach(item => {
            card.appendChild(createItemCard(item));
        });

        categoriesContainer.appendChild(card);
    });

    updateSummary();
}

function createItemCard(item) {
    const packedPieces = item.pieces.filter(piece => piece.packed).length;
    const card = document.createElement("div");
    card.className = item.opened ? "item-card open" : "item-card";

    card.innerHTML = `
        <div class="item-main">
            <button class="expand-btn" type="button" aria-label="Open item">${item.opened ? "−" : "+"}</button>

            <div class="item-title">
                <strong>${item.name}</strong>
                <small>${packedPieces}/${item.pieces.length} packed</small>
            </div>

            <div class="quantity">
                <button class="qty-btn minus" type="button">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn plus" type="button">+</button>
            </div>

            <button class="delete-btn" type="button">Remove</button>
        </div>

        <div class="details">
            <div class="pieces"></div>
        </div>
    `;

    card.querySelector(".expand-btn").addEventListener("click", () => toggleOpen(item.id));
    card.querySelector(".minus").addEventListener("click", () => changeQuantity(item.id, -1));
    card.querySelector(".plus").addEventListener("click", () => changeQuantity(item.id, 1));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.id));

    const piecesContainer = card.querySelector(".pieces");

    item.pieces.forEach(piece => {
        piecesContainer.appendChild(createPieceNode(item, piece));
    });

    return card;
}

function createPieceNode(item, piece) {
    const fragment = pieceTemplate.content.cloneNode(true);
    const node = fragment.querySelector(".piece");

    node.classList.toggle("packed", piece.packed);
    node.classList.toggle("has-photo", Boolean(piece.photo));

    const checkbox = node.querySelector(".piece-packed");
    const name = node.querySelector(".piece-name");
    const photo = node.querySelector(".piece-photo");
    const photoInput = node.querySelector(".photo-input");
    const removePhotoBtn = node.querySelector(".remove-photo-btn");

    checkbox.checked = piece.packed;
    name.textContent = piece.name;

    if (piece.photo) {
        photo.src = piece.photo;
        photo.alt = piece.name;
    }

    checkbox.addEventListener("change", () => togglePiece(item.id, piece.id));

    photoInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setPiecePhoto(item.id, piece.id, reader.result);
        };

        reader.readAsDataURL(file);
    });

    removePhotoBtn.addEventListener("click", () => {
        setPiecePhoto(item.id, piece.id, "");
    });

    return node;
}

function toggleOpen(itemId) {
    packingList = packingList.map(item => {
        if (item.id !== itemId) return item;

        return {
            ...item,
            opened: !item.opened
        };
    });

    saveList();
    render();
}

function changeQuantity(itemId, delta) {
    packingList = packingList.map(item => {
        if (item.id !== itemId) return item;

        const nextQuantity = Math.max(1, item.quantity + delta);
        let pieces = [...item.pieces];

        if (nextQuantity > item.quantity) {
            const amountToAdd = nextQuantity - item.quantity;

            for (let i = 0; i < amountToAdd; i++) {
                pieces.push(makePiece(item.name, pieces.length));
            }
        }

        if (nextQuantity < item.quantity) {
            pieces = pieces.slice(0, nextQuantity);
        }

        return {
            ...item,
            quantity: nextQuantity,
            pieces
        };
    });

    saveList();
    render();
}

function togglePiece(itemId, pieceId) {
    packingList = packingList.map(item => {
        if (item.id !== itemId) return item;

        return {
            ...item,
            pieces: item.pieces.map(piece => {
                if (piece.id !== pieceId) return piece;

                return {
                    ...piece,
                    packed: !piece.packed
                };
            })
        };
    });

    saveList();
    render();
}

function setPiecePhoto(itemId, pieceId, photoData) {
    packingList = packingList.map(item => {
        if (item.id !== itemId) return item;

        return {
            ...item,
            pieces: item.pieces.map(piece => {
                if (piece.id !== pieceId) return piece;

                return {
                    ...piece,
                    photo: photoData
                };
            })
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
    const quantity = Math.max(1, Number(newItemQty.value) || 1);
    const category = categorySelect.value;

    if (!name) return;

    packingList.push(makeItem(name, category, quantity));

    newItemInput.value = "";
    newItemQty.value = 1;
    saveList();
    render();
}

function updateSummary() {
    const total = packingList.reduce((sum, item) => sum + item.pieces.length, 0);
    const packed = packingList.reduce((sum, item) => {
        return sum + item.pieces.filter(piece => piece.packed).length;
    }, 0);

    const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

    packedCount.textContent = packed;
    totalCount.textContent = total;
    progressPercent.textContent = `${percent}%`;
}

function saveList() {
    const data = {
        tripName: tripName.value,
        days: days.value,
        weather: weather.value,
        packingList
    };

    localStorage.setItem("smartSuitcaseV2", JSON.stringify(data));
}

function loadList() {
    const savedV2 = localStorage.getItem("smartSuitcaseV2");
    const savedV1 = localStorage.getItem("smartSuitcase");
    const saved = savedV2 || savedV1;

    if (!saved) {
        createDefaultList();
        return;
    }

    const data = JSON.parse(saved);

    tripName.value = data.tripName || "";
    days.value = data.days || 4;
    weather.value = data.weather || "warm";
    packingList = data.packingList || [];

    normalizeOldData();
    saveList();
    render();
}

generateBtn.addEventListener("click", createDefaultList);
addItemBtn.addEventListener("click", addCustomItem);

newItemInput.addEventListener("keydown", event => {
    if (event.key === "Enter") addCustomItem();
});

newItemQty.addEventListener("keydown", event => {
    if (event.key === "Enter") addCustomItem();
});

tripName.addEventListener("input", saveList);
days.addEventListener("input", saveList);
weather.addEventListener("change", saveList);

loadList();
