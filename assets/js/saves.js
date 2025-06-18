let currentSaveID = null;

let saves = [
    new SaveItem("Dummy Save", Math.floor(Date.now() / 1000), 0) // ID 0 is a dummy save
];


function ClosePopup(pElementID) {

    // Close the popup by removing the 'active' class
    document.getElementById(pElementID).classList.remove('active');
    document.getElementById("saveNameInput").value = "";
}

function showSavePopup(pIsShowing, pElementID) {

    const input = document.getElementById("saveNameInput");

    if (pIsShowing) {
        // saveCreatorPopupCont
        document.getElementById("saveCreatorPopupCont").classList.add('active');
    }
    else
        document.getElementById("saveCreatorPopupCont").classList.remove('active');

    input.value = "";
    input.placeholder = "Enter save name";

    setTimeout(() => {
        input.focus();
    }, 50);

}

function closeSaveCreatorPopup(pIsSaving) {

    if (!pIsSaving) {
        showSavePopup(false);
        console.log("Save cancelled.");
        return;
    }

    SaveGame();

}

// handles overwrite save
function CreateOverwrite() {
    // dont need a name or id as it gets overwritten by the original file
    return new SaveItem("overwrite", Math.floor(Date.now() / 1000), -1);
}


// This creates the actual save item object
function CreateSaveItem() {
    let saveName = document.getElementById("saveNameInput").value;
    if (saveName.length < 1) {
        console.log("Save name is empty.");
        // set inner text of saveNameError to "Save name is empty."
        document.getElementById("saveNameInput").placeholder = "Save name can't be empty";
        return false; // Disgusting, but it works because JS is *quirky*
    }

    let timeStamp = Math.floor(Date.now() / 1000);
    let saveItem = new SaveItem(saveName, timeStamp, saves.length + 1); // Use saves.length + 1 as ID
    return saveItem;
}

// Actually saves the game
function SaveGame() {

    let saveItem = CreateSaveItem();

    if (!saveItem) {
        console.log("Failed to create save item.");
        return;
    }

    saves.push(saveItem);

    showSavePopup(false);
    //CreateSaveItemLabel(saveItem.GetSaveName(), saveItem.GetTimeStamp(), saveItem.GetID());

    TriggerSave(saveItem.GetSaveName());
    RenderSaveList();
}


// This will create the actual element that will be clickable on the page
function CreateSaveItemLabel(pSaveName, pTimeStamp, pID) {
    let content = document.getElementById("savesContainer");


    const saveItem = document.createElement("div");
    saveItem.className = "saveItem";
    saveItem.dataset.id = pID; // This gives the label itself the data-id attrib


    // This is going to attach the onclick behaviour to the "button"
    saveItem.onclick = function (e) {
        if (e.target.closest('.deleteSaveBut')) return;
        currentSaveID = pID;
        toggleOverwritePopup(true); // Show the overwrite popup
    };


    const leftCol = document.createElement("div");
    leftCol.className = "leftCol";


    const saveEntry = document.createElement("div");
    saveEntry.className = "save-entry";

    const saveNameSpan = document.createElement("span");
    saveNameSpan.className = "save-name";
    saveNameSpan.textContent = pSaveName;

    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = pTimeStamp;


    saveEntry.appendChild(saveNameSpan);
    saveEntry.appendChild(timestampSpan);


    leftCol.appendChild(saveEntry);


    const rightCol = document.createElement("div");
    rightCol.className = "rightCol";

    const deleteButton = document.createElement("button");
    deleteButton.className = "deleteSaveBut";
    deleteButton.textContent = "x";

    deleteButton.onclick = function (e) {
        // DeleteSave(pID);
        currentSaveID = pID; 
        toggleDeletePopup(true);
    };

    rightCol.appendChild(deleteButton);


    saveItem.appendChild(leftCol);
    saveItem.appendChild(rightCol);


    content.appendChild(saveItem);

    console.log("Save item created: "+ pSaveName + " - " + pTimeStamp);
}


function PopulateSaves() {

    for (let i = 0; i < saves.length; i++) {

        const save = saves[i];
        let saveName = save.GetSaveName();
        let timeStamp = save.GetTimeStamp();
        // CreateSaveItem(saveName, timeStamp);


    }
}


function toggleOverwritePopup(isVisible) {

    console.log("Toggling overwrite popup visibility: " + isVisible);


    const popup = document.getElementById("overwriteCreatorPopupCont");
    if (isVisible) {
        popup.classList.add('active');
    } else {
        popup.classList.remove('active');
    }
}

function toggleDeletePopup(isVisible) {

    console.log("Toggling confirm delete popup visibility: " + isVisible);


    const popup = document.getElementById("deleteSaveCreatorPopupCont");
    if (isVisible) {
        popup.classList.add('active');
    } else {
        popup.classList.remove('active');
    }
}

function OverwriteSave(saveID) {

    TriggerOverwrite(saveID);

    console.log("Overwrite save triggered for ID:", saveID);

    // Find the SaveItem in the array
    const foundSave = saves.find(s => s.GetID() === saveID);
    if (foundSave) {
        const newData = CreateOverwrite();
        foundSave.OverWrite(newData);
        toggleOverwritePopup(false);
    } else {
        console.log("No save found with ID:", saveID);
    }

    // removes the items from savesContainer
    RemoveSaveItems();

    RenderSaveList();
}

function RemoveSaveItems() {
    const content = document.getElementById("savesContainer");
    const saveItems = content.querySelectorAll(".saveItem");
    saveItems.forEach(item => item.remove());
}

function RenderSaveList() {

    // C++ func
    LoadSaves();

    RemoveSaveItems();

    // Render each save
    for (let save of saves) {
        CreateSaveItemLabel(save.GetSaveName(), save.GetTimeStamp(), save.GetID());
    }
}

function DeleteSave(pID) {

    // c++ func
    console.log("DeleteSave pID: " + pID);
    console.log("Current save ID: " + currentSaveID);

    TriggerDeleteSave(pID);
    RenderSaveList();

    console.log("Delete save triggered.");
    toggleDeletePopup(false);
}



function LoadSaves(evt) {

    saves = [];
    var message = GetSaves("Hello from JS - Saves!");


    // throw these into the saves array
    saves = message.map(save => new SaveItem(save.name, save.timeStamp, save.id));
    // RenderSaveList();
}


// Waits for page to load first 
window.addEventListener('DOMContentLoaded', () => {

    //LoadSaves();

    //console.log("Page loaded, populating saves...");
    // PopulateSaves();


    CreateSaveItemLabel("Dummy Save", Math.floor(Date.now() / 1000), 0); // Create a dummy save item for testing
    console.log("Dummy save item created for testing.");

    setTimeout(() => {
        RenderSaveList();
    }, 20);
    

});

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}