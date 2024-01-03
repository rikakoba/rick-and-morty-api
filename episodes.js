axios
    .get('https://rickandmortyapi.com/api/episode')
    .then(response => {
        let responseData = response.data.results;
        displayEpisodes(responseData);
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
    const episodeContainer = document.getElementById("episodeContainer");
    const search_btn = document.getElementById("search-btn");
    const search = document.getElementById("search");

    search_btn.addEventListener("click", (e) => {
        const episode_name = search.value;
        if(episode_name != "") {
            searchEpisodes(episode_name);
        } else {
            return;
        }
        
        e.preventDefault();
    });

    async function fetchEpisodes(page) {
        const response = await fetch(`https://rickandmortyapi.com/api/episode/?page=${page}`);
        const data = await response.json();
        return data.results;
    }

    function searchEpisodes(name) {
        fetch(`https://rickandmortyapi.com/api/episode/?name=${name}`)
        .then(response => response.json())
        .then(data => {
            displayEpisodes(data.results);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function displayEpisodes(episodes) {
        episodeContainer.innerHTML = "";
        episodes.forEach(element => {
            let card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${element.name}</h5>
                    <p class="card-text">Air-date: ${element.air_date}</p>
                    <p class="card-text">Episode: ${element.episode}</p>
                    <p class="card-text">Created: ${element.created}</p>
                    <button class="btn btn-outline-primary" id="btn-details-${element.id}">more</button>
                </div>
            </div>
            `;
            episodeContainer.appendChild(card);
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
        const episodes = await fetchEpisodes(page);
        displayEpisodes(episodes);
        updatePagination();
    }
    
    function updatePagination() {
        const current_page_item = document.querySelector(".pagination .page-item:nth-child(3)");
        current_page_item.classList.add("active");
        const current_text = current_page_item.querySelector(".page-link");
        current_text.textContent = current_page;
    }

    async function init() {
        const episodes = await fetchEpisodes(current_page);
        displayEpisodes(episodes);
        const response = await fetch(`https://rickandmortyapi.com/api/episode/`);
        const data = await response.json();
        total_pages = data.info.pages;
        console.log(data);
        displayPagination();
    }

    init();
});