axios
    .get('https://rickandmortyapi.com/api/character')
    .then(response => {
        let responseData = response.data.results;
        displayCharacters(responseData);
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
    const characterContainer = document.getElementById("characterContainer");
    async function fetchCharacters(page) {
        const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
        const data = await response.json();
        return data.results;
    }

    function displayCharacters(characters) {
        characterContainer.innerHTML = "";
        characters.forEach(element => {
            let card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
            <div class="card">
                <img src="${element.image}" alt="${element.name}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${element.name}</h5>
                    <p class="card-text">${element.species}</p>
                    <p class="card-text">Status: ${element.status}</p>
                    <p class="card-text">Type: ${element.type}</p>
                    <p class="card-text">Location: ${element.location.name}</p>
                    <p class="card-text">Gender: ${element.gender}</p>
                </div>
            </div>
            `;
            characterContainer.appendChild(card);
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
        const characters = await fetchCharacters(page);
        displayCharacters(characters);
        updatePagination();
    }
    
    function updatePagination() {
        const current_page_item = document.querySelector(".pagination .page-item:nth-child(3)");
        current_page_item.classList.add("active");
        const current_text = current_page_item.querySelector(".page-link");
        current_text.textContent = current_page;
    }

    async function init() {
        const characters = await fetchCharacters(current_page);
        displayCharacters(characters);
        const response = await fetch(`https://rickandmortyapi.com/api/character/`);
        const data = await response.json();
        total_pages = data.info.pages;
        console.log(data);
        displayPagination();
    }

    init();
});