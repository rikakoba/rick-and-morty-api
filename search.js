document.addEventListener("DOMContentLoaded", () => {
    const search = document.getElementById('search');
    const search_btn = document.getElementById('search-btn');
    const status_dropdown = document.getElementById('status-dropdown');
    const gender_dropdown = document.getElementById('gender-dropdown');

    search_btn.addEventListener("click", (e) => {
        const character_name = search.value;
        if(character_name != "") {
            searchCharacters(character_name);
        } else {
            return;
        }
        
        e.preventDefault();
    });

    status_dropdown.addEventListener("click", (e) => {
        const selected_status = e.target.textContent;
        if(selected_status != "") {
            filterCharacters(selected_status, null);
        } else {
            return;
        }
    });

    gender_dropdown.addEventListener("click", (e) => {
        const selected_gender = e.target.textContent;
        if(selected_gender != "") {
            filterCharacters(null, selected_gender);
        } else {
            return;
        }
    });

    function searchCharacters(name) {
        fetch(`https://rickandmortyapi.com/api/character/?name=${name}`)
        .then(response => response.json())
        .then(data => {
            displayCharacters(data.results);
        })
        .catch(err => {
            console.log(err);
        });
    }

    function filterCharacters(status, gender) {
        if(status != null && gender == null) {
            fetch(`https://rickandmortyapi.com/api/character/?status=${status}`)
            .then(response => response.json())
            .then(data => {
                displayCharacters(data.results);
            })
            .catch(err => {
                console.log(err);
            });
        }

        if(status == null && gender != null) {
            fetch(`https://rickandmortyapi.com/api/character/?gender=${gender}`)
            .then(response => response.json())
            .then(data => {
                displayCharacters(data.results);
            })
            .catch(err => {
                console.log(err);
            });
        }
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
});