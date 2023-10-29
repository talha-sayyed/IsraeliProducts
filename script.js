// Variables to hold the loaded data and the filtered data
let data;
let filteredData;

// Load the data from the JSON file
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        filteredData = data; // Initialize filteredData with all data
        updateCountryDropdown();
        updateCategoryDropdown();
        updateProductList();
    })
    .catch(error => {
        console.error('Error fetching data file', error);
    });

// Function to update the Country dropdown
function updateCountryDropdown() {
    const countryFilter = document.getElementById('countryFilter');
    countryFilter.innerHTML = '<option value="">All Countries</option>';
    for (const country in data) {
        countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
    }
}

// Function to update the Category dropdown
function updateCategoryDropdown() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    for (const country in filteredData) {
        for (const category in filteredData[country]) {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        }
    }
}

// Function to update the Product list
function updateProductList() {
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';

    for (const country in filteredData) {
        for (const category in filteredData[country]) {
            for (const product of filteredData[country][category]) {
                productsTable.innerHTML += `
                    <tr>
                        <td>${product}</td>
                    </tr>
                `;
            }
        }
    }
}

// Event listener for the Country filter
document.getElementById('countryFilter').addEventListener('change', () => {
    const selectedCountry = document.getElementById('countryFilter').value;
    filteredData = {};

    if (selectedCountry) {
        filteredData[selectedCountry] = data[selectedCountry];
    } else {
        filteredData = data;
    }

    updateCategoryDropdown();
    updateProductList();
});

// Event listener for the Category filter
document.getElementById('categoryFilter').addEventListener('change', () => {
    const selectedCategory = document.getElementById('categoryFilter').value;
    filteredData = {};

    for (const country in data) {
        if (selectedCategory) {
            if (data[country][selectedCategory]) {
                if (!filteredData[country]) {
                    filteredData[country] = {};
                }
                filteredData[country][selectedCategory] = data[country][selectedCategory];
            }
        } else {
            filteredData[country] = data[country];
        }
    }

    updateProductList();
});

// Event listener for product search
document.getElementById('productSearch').addEventListener('input', () => {
    const searchText = document.getElementById('productSearch').value.toLowerCase();
    const newFilteredData = {};

    if (searchText === '') {
        // If the search input is empty, restore the initial or filtered data
        filteredData = data; // Set back to the original data or filtered data
        updateProductList();
    } else {
        for (const country in filteredData) {
            for (const category in filteredData[country]) {
                for (const product of filteredData[country][category]) {
                    if (product.toLowerCase().includes(searchText)) {
                        if (!newFilteredData[country]) {
                            newFilteredData[country] = {};
                        }
                        if (!newFilteredData[country][category]) {
                            newFilteredData[country][category] = [];
                        }
                        newFilteredData[country][category].push(product);
                    }
                }
            }
        }

        filteredData = newFilteredData;
        updateProductList();
    }
});


// Rest of the code before

// Function to sort products alphabetically
function sortProductsAlphabetically() {
    for (const country in filteredData) {
        for (const category in filteredData[country]) {
            filteredData[country][category].sort();
        }
    }
}

// Function to generate filter buttons for product names
function generateFilterButtons() {
    const filterButtonsContainer = document.getElementById('filterButtons');
    filterButtonsContainer.innerHTML = '';

    for (let charCode = 65; charCode <= 90; charCode++) {
        const letter = String.fromCharCode(charCode);
        const filterButton = document.createElement('button');
        filterButton.className = 'btn btn-primary';
        filterButton.textContent = letter;
        filterButton.addEventListener('click', () => {
            // clearSearchInput(); // Clear the search input
            filterProductsByLetter(letter); // Apply the alphabet filter
        });
        filterButtonsContainer.appendChild(filterButton);
    }
}

// // Function to clear the search input
// function clearSearchInput() {
//     document.getElementById('productSearch').value = '';
// }


// Function to filter products by starting letter
function filterProductsByLetter(letter) {
    const newFilteredData = {};

    for (const country in filteredData) {
        newFilteredData[country] = newFilteredData[country] || {};

        for (const category in filteredData[country]) {
            newFilteredData[country][category] = filteredData[country][category].filter(product =>
                product.toLowerCase().startsWith(letter.toLowerCase())
            );
        }
    }

    filteredData = newFilteredData;
    updateProductList();
}


// Function to display all products in a Bootstrap table
function displayAllProducts() {
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';

    for (const country in filteredData) {
        for (const category in filteredData[country]) {
            for (const product of filteredData[country][category]) {
                productsTable.innerHTML += `
                    <tr>
                        <td>${product}</td>
                    </tr>
                `;
            }
        }
    }
}

// Sort and display products alphabetically
sortProductsAlphabetically();
generateFilterButtons();
displayAllProducts();

