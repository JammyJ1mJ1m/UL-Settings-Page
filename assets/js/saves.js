
let saves = [
    new SaveItem("1", "01/10/2025 12:00:00"),
    new SaveItem("2", "02/10/2025 12:00:00"),
    new SaveItem("3", "03/10/2025 12:00:00"),
    new SaveItem("4", "04/10/2025 12:00:00"),
    new SaveItem("5", "05/10/2025 12:00:00"),
    new SaveItem("6", "06/10/2025 12:00:00"),
    new SaveItem("7", "07/10/2025 12:00:00"),
    new SaveItem("8", "08/10/2025 12:00:00"),
    new SaveItem("9", "09/10/2025 12:00:00"),
    new SaveItem("10", "10/10/2025 12:00:00"),
    new SaveItem("11", "11/10/2025 12:00:00"),
    new SaveItem("12", "12/10/2025 12:00:00"),
    new SaveItem("13", "13/10/2025 12:00:00"),
    new SaveItem("14", "14/10/2025 12:00:00"),
    new SaveItem("15", "15/10/2025 12:00:00"),
    new SaveItem("16", "16/10/2025 12:00:00"),
    new SaveItem("17", "17/10/2025 12:00:00"),
    new SaveItem("18", "18/10/2025 12:00:00"),
    new SaveItem("19", "19/10/2025 12:00:00"),
    new SaveItem("20", "20/10/2025 12:00:00"),
    new SaveItem("21", "21/10/2025 12:00:00"),
    new SaveItem("22", "22/10/2025 12:00:00"),
    new SaveItem("23", "23/10/2025 12:00:00"),
    new SaveItem("24", "24/10/2025 12:00:00"),
    new SaveItem("25", "25/10/2025 12:00:00"),
    new SaveItem("26", "26/10/2025 12:00:00"),
    new SaveItem("27", "27/10/2025 12:00:00"),
    new SaveItem("28", "28/10/2025 12:00:00"),
    new SaveItem("29", "29/10/2025 12:00:00"),
    new SaveItem("30", "30/10/2025 12:00:00"),
    new SaveItem("31", "31/10/2025 12:00:00"),
    new SaveItem("32", "01/11/2025 12:00:00"),

];


// This will create the actual element that will be clickable on the page
function CreateSaveItem(pSaveName, pTimeStamp) {
    let content = document.getElementById("contentWrapper");


    const saveItem = document.createElement("div");
    saveItem.className = "saveItem";
    saveItem.onclick = function (e) {
        
        // Prevent clicks on delete button from triggering this
        if (e.target.closest('.deleteSaveBut')) return;
        OverwriteSave();
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
        CreateSaveItem(saveName, timeStamp);


    }
}


function OverwriteSave() {
    console.log("Overwrite save triggered.");
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