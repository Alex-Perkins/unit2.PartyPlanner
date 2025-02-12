//Cohort API variable
const COHORT = "2411-FSA-ET-WEB-PT-AP";
//API LINK
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//Object named state that containes the array
const state = {
    parties: [],
}

//Function to fetch the data from the API
const fetchAllParties = async () => {
    try {
        //link API and change it to json
        console.log(API_URL);
        const response = await fetch(API_URL);
        const json = await response.json();

        //link the json data to the state
        state.parties = json.data;

        //call the renderAllParties function after you make it
renderAllParties();

        //Add the catch function and console log the error when it occurs
    } catch (error) {
        console.log("ERROR is fetchAllParties", error);
    };
};

//Make a getParties function to grab parties from the API
const createNewParty = async (name, date, description, location) => {
    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                name,
                date: new Date(date).toISOString(),
                description,
                location,

            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        await fetchAllParties();
    } catch (error) {
        console.log("ERROR is FetchAllParties", error);
    };
};

//Delete Request function removeParty
const removeParty = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        }),
        fetchAllParties();
    } catch (error) {
        console.log("ERROR is fetchAllParties", error);
    }
}

//render the parties on the page
const renderAllParties = () => {
    const partiesContainer = document.getElementById("parties-container");
    const partyList = state.parties;
    if (!partyList || partyList.length === 0) {
        partiesContainer.innerHTML = "<h3>No Parties Available</h3>";
        return;
    }

    //reset html of all Parties
    partiesContainer.innerHTML = "";

    //create a card for each recipe
    partyList.forEach((party) => {
        const partyElement = document.createElement("div");
        partyElement.classList.add("party-card");
        partyElement.innerHTML = `
        <h4>${party.name}</h4>
        <img src="${party.imageUrl}" alt="${party.name}">
        <p>${party.description}</p>
        <p>${party.date}</p>
        <button class="delete-button" data-id="${party.id}">remove</button>
        `;
        partiesContainer.appendChild(partyElement);

        const deleteBtn = partyElement.querySelector(".delete-button");
        //add event listener to the delete button to delete a recipe
        deleteBtn.addEventListener("click", (event) => {
            try {
            event.preventDefault();
            removeParty(party.id);
            } catch (error) {
                console.log(error);
            }
        });
    });
};

//adds an event listener to eth form so when you submit it you create a new recipe
const addListener = () => {
const form = document.querySelector("#addParty");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewParty(
        form.names.value,
        //form.imageUrl.value,
        form.date.value,
        form.description.value,
        form.location.value,
    );

    //clears the form after we create the new party
    form.names.value = "";
    //form.imageUrl.value = "";
    form.description.value = "";
    form.date.value = "";
    form.location.value = "";
});
};

//initialize the function when the page loads
const init = async () => {
    //get all the recipes from the API
    await fetchAllParties();
    //adds a listener to the form to be able to add the parties
    addListener();
};

init();