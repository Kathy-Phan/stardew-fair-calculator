const qualities = ["normal", "silver", "gold", "iridium"];
let allItems = [];

// List all your JSON files
const itemFiles = [
    'items/animal.json',
    'items/artisan.json',
    'items/cooking.json',
    'items/fish.json',
    'items/forage.json',
    'items/fruit.json',
    'items/minerals.json',
    'items/vegetables.json'
];

async function fetchAllItems() {
    try {
        const fetches = itemFiles.map(file => fetch(file).then(res => res.json()));
        const results = await Promise.all(fetches);

        // Flatten each JSON file
        allItems = results.flatMap(data =>
            data.items.map(i => ({ ...i, category: data.category }))
        );

        attachSearchListener();
    } catch (err) {
        console.error("Failed to fetch items:", err);
    }
}

const dropdown = document.querySelector('.quality-dropdown');
const selected = dropdown.querySelector('.selected');
const options = dropdown.querySelectorAll('.options li');

selected.addEventListener('click', () => dropdown.classList.toggle('active'));
options.forEach(opt => {
    opt.addEventListener('click', () => {
        selected.innerHTML = opt.innerHTML;
        dropdown.classList.remove('active');
        selected.dataset.value = opt.dataset.value;
    });
});

// Render items with dropdowns
function renderItems(itemsToRender) {
    const ul = document.getElementById('item-list');
    ul.innerHTML = ''; // clear previous results

    itemsToRender.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} (Category: ${item.category})`;

        // Make it clickable
        li.addEventListener('click', () => {
            addChosenItem(item);  // function to add item to chosen list
        });

        ul.appendChild(li);
    });
}


// Live search
function attachSearchListener() {
    const input = document.getElementById('input-box');
    const ul = document.getElementById('item-list');

    input.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();
        if (!searchText) {
            ul.style.display = 'none';
            return;
        }

        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(searchText)
        ).slice(0, 10); // limit to 10 suggestions

        ul.innerHTML = '';
        filtered.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} (Category: ${item.category})`;

            li.addEventListener('click', () => {
                addChosenItem(item);
                input.value = '';      // clear input
                ul.style.display = 'none'; // hide dropdown
            });

            ul.appendChild(li);
        });

        ul.style.display = filtered.length ? 'block' : 'none';
    });

    // hide dropdown if click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            ul.style.display = 'none';
        }
    });
}


function addChosenItem(item) {
    const chosenUl = document.getElementById('chosen-list');

    // Create a new list item
    const li = document.createElement('li');
    // do different colours for each category
    li.innerHTML = `
        ${item.name} (Category: ${item.category})
        <select>
            ${qualities.map(q => `<option value="${q}">${q}</option>`).join('')}
        </select>
        <button class="remove-btn">x</button>
    `;

    // Remove button
    li.querySelector('.remove-btn').addEventListener('click', () => {
        li.remove();
    });

    chosenUl.appendChild(li);
}



// Calculate score
document.getElementById('calculate-btn').addEventListener('click', () => {
    const chosenItems = [];
    document.querySelectorAll('#item-list li').forEach((li) => {
        const itemName = li.firstChild.textContent.split(' (')[0];
        const item = allItems.find(i => i.name === itemName);
        const quality = li.querySelector('select').value;
        if (item && quality) chosenItems.push({ item, quality });
    });

    const score = calculateGrangeScore(chosenItems); // from score.js
    document.getElementById('score').textContent = 'Score: ' + score;
});

// Start fetching items
fetchAllItems();
