axios
    .get('https://rickandmortyapi.com/api/location')
    .then(response => {
        let responseData = response.data.results;
        displayLocations(responseData);
    })
    .catch(error => {
        console.log(error);
    });

document.addEventListener("DOMContentLoaded", () => {
    let current_page = 1;
    let total_pages;
    const skip_start = document.getElementById("skip-start");
    const skip_end = document.getElementById("skip-end");
    const prev_page_link = document.getElementById("prev-page-link");
    const next_page_link = document.getElementById("next-page-link");
    const locationContainer = document.getElementById("locationContainer");
    const search_btn = document.getElementById("search-btn");
    const search = document.getElementById("search");

    search_btn.addEventListener("click", (e) => {
        const location_name = search.value;
        if(location_name != "") {
            searchLocations(location_name);
        } else {
            return;
        }
        
        e.preventDefault();
    });

    async function fetchLocations(page) {
        const response = await fetch(`https://rickandmortyapi.com/api/location/?page=${page}`);
        const data = await response.json();
        return data.results;
    }

    function searchLocations(name) {
        fetch(`https://rickandmortyapi.com/api/location/?name=${name}`)
        .then(response => response.json())
        .then(data => {
            displayLocations(data.results);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function displayLocations(locations) {
        locationContainer.innerHTML = "";
        locations.forEach(element => {
            let card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${element.name}</h5>
                    <p class="card-text">Type: ${element.type}</p>
                    <p class="card-text">Dimension: ${element.dimension}</p>
                    <p class="card-text">Created: ${element.created}</p>
                </div>
            </div>
            `;
            locationContainer.appendChild(card);
        });
    }
    
    function displayPagination() {
        skip_start.addEventListener("click", (e) => {
            changePage(1);
            e.preventDefault();
        });
        skip_end.addEventListener("click", (e) => {
            changePage(total_pages);
            e.preventDefault();
        });
        prev_page_link.addEventListener("click", (e) => {
            changePage(current_page - 1);
            e.preventDefault();
        });
        next_page_link.addEventListener("click", (e) => {
            changePage(current_page + 1);
            e.preventDefault();
        });
        prev_page_link.classList.toggle("disabled", current_page == 1 ? "disabled" : "");
        next_page_link.classList.toggle("disabled", current_page == total_pages ? "disabled" : "");
    }
    
    async function changePage(page) {
        if(page == 1) {
            prev_page_link.classList.add("disabled");
            skip_start.classList.add("disabled");

        } else {
            prev_page_link.classList.remove("disabled");
            skip_start.classList.remove("disabled");
        }

        if(page == total_pages) {
            next_page_link.classList.add("disabled");
            skip_end.classList.add("disabled");
        } else {
            next_page_link.classList.remove("disabled");
            skip_end.classList.remove("disabled");
        }

        current_page = page;
        const locations = await fetchLocations(page);
        displayLocations(locations);
        updatePagination();
    }
    
    function updatePagination() {
        const current_page_item = document.querySelector(".pagination .page-item:nth-child(3)");
        current_page_item.classList.add("active");
        const current_text = current_page_item.querySelector(".page-link");
        current_text.textContent = current_page;
    }

    async function init() {
        const locations = await fetchLocations(current_page);
        displayLocations(locations);
        const response = await fetch(`https://rickandmortyapi.com/api/location/`);
        const data = await response.json();
        total_pages = data.info.pages;
        console.log(data);
        displayPagination();
    }

    init();
});