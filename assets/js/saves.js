let currentSaveID = null;

let saves = [


];


// function saveGame() {

//     console.log("Save game triggered.");
//     // Show the save creator popup
//     showSavePopup(true);
//     // RenderSaveList();
// }


function ClosePopup(pElementID) {

    // Close the popup by removing the 'active' class
    document.getElementById(pElementID).classList.remove('active');
    document.getElementById("saveNameInput").value = "";


    // document.getElementById("saveNameInput").placeholder = "Enter save name";
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

    let saveItem = CreateSaveItem(); // Use saves.length + 1 as ID

    if (!saveItem) {
        console.log("Failed to create save item.");
        return;
    }

    saves.push(saveItem);

    showSavePopup(false);
    CreateSaveItemLabel(saveItem.GetSaveName(), saveItem.GetTimeStamp(), saveItem.GetID());


}


// This will create the actual element that will be clickable on the page
function CreateSaveItemLabel(pSaveName, pTimeStamp, pID) {
    let content = document.getElementById("savesContainer");


    const saveItem = document.createElement("div");
    saveItem.className = "saveItem";
    saveItem.dataset.id = pID; // 👈 Attach ID here


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

    deleteButton.onclick = function () {
        DeleteSave();
    };

    rightCol.appendChild(deleteButton);


    saveItem.appendChild(leftCol);
    saveItem.appendChild(rightCol);


    content.appendChild(saveItem);

    console.log("Save item created:", pSaveName, pTimeStamp);
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
    const popup = document.getElementById("overwriteCreatorPopupCont");
    if (isVisible) {
        popup.classList.add('active');
    } else {
        popup.classList.remove('active');
    }
}

function OverwriteSave(saveID) {



    console.log("Overwrite save triggered for ID:", saveID);

    // Find the SaveItem in the array
    const foundSave = saves.find(s => s.GetID() === saveID);
    if (foundSave) {
        const newData = CreateOverwrite();
        foundSave.OverWrite(newData); // or do something else
        toggleOverwritePopup(false); // Hide the popup
        // RenderSaveList(); // Re-render the save list
    } else {
        console.log("No save found with ID:", saveID);
    }



    // remove the items from savesContainer and re add them
    const content = document.getElementById("savesContainer");
    const saveItems = content.querySelectorAll(".saveItem");
    saveItems.forEach(item => item.remove());

    // Re-render the save list
  RenderSaveList();


}

function RenderSaveList() {
    const content = document.getElementById("savesContainer");

    // Remove all saveItems (keep the 'New Save' button)
    const saveItems = content.querySelectorAll(".saveItem");
    saveItems.forEach(item => item.remove());

    // Sort saves by timestamp DESC (newest first)
    const sortedSaves = [...saves].sort((a, b) => b.GetTimeStamp() - a.GetTimeStamp());

    // Render each save
    for (let save of sortedSaves) {
        CreateSaveItemLabel(save.GetSaveName(), save.GetTimeStamp(), save.GetID());
    }
}

function DeleteSave() {
    console.log("Delete save triggered.");
}

// Waits for page to load first 
window.addEventListener('DOMContentLoaded', () => {



    PopulateSaves();


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