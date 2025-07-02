let mResolutionID = 0;
const mValidResolutions = [
    '3840x2160', '2560x1440', '1920x1080',
    '1600x900', '1280x720', '1024x768', '640x480'
];

let mDifficultyID = 0;
const mDifficulties = [
    'Easy', 'Normal', 'Hard', 'Extreme', 'Impossible'
];

// add your dropdown configs here
// I've left the mResolutionID and mDifficultyID as global variables so that you can 
// override them by passing data from CPP to here,
// useful for loading a save config instead of having it default to 0 everytimes
const dropdownConfigs = {
    resolution: {
        dropdownId: 'resolutionDropdown',
        buttonSelector: "UNDEFINED", // leave this undefined for now as it gets filled in after creation of this array
        values: mValidResolutions,
        onSelect: (value) => {
            const index = mValidResolutions.indexOf(value);
            mResolutionID = index;
            HandleDropdown(mResolutionID);
        },
        defaultIndex: mResolutionID;
    },

    difficulty: {
        dropdownId: 'difficultyDropdown',
        buttonSelector: "UNDEFINED",
        values: mDifficulties,
        onSelect: (value) => {
            const index = mDifficulties.indexOf(value);
            mDifficultyID = index;
            HandleDropdownDifficulty(mDifficultyID);
        },
        defaultIndex: mDifficultyID;
    }

    // you can add more configs here
    // ...
    // ...
};


// we fill this in here because A, laziness and B, the objects now exist so we can loop over them
for (const key in dropdownConfigs) {
    const config = dropdownConfigs[key];
    config.buttonSelector = `[data-dropdown-id="${config.dropdownId}"]`;
}


function initDropdowns() {
    for (const key in dropdownConfigs) {
        const config = dropdownConfigs[key];
        const dropdown = document.getElementById(config.dropdownId);
        const button = document.querySelector(config.buttonSelector);
        const defaultIndex = (typeof config.defaultIndex === 'number') ? config.defaultIndex : 0;
        const defaultText = config.values[defaultIndex];


        // if there isnt a button skip and report error
        if (!button) {
            console.log("Error, missing button: " + key);
            continue;
        }


        button.textContent = defaultText;


        dropdown.innerHTML = '';
        config.values.forEach(value => {
            const item = document.createElement('a');
            item.href = '#';
            item.textContent = value;
            item.onclick = () => {
                if (button) button.textContent = value;
                config.onSelect(value);
                dropdown.classList.remove('show');
            };
            dropdown.appendChild(item);
        });


        button.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });

    }

    // clicks outside of dropdown will close it
    window.addEventListener('click', function (e) {
        if (!e.target.matches('.dropbtn')) {
            document.querySelectorAll('.dropdown-content.show').forEach(el => {
                el.classList.remove('show');
            });
        }
    });
}

function attachCheckboxHandler(elementId, cppIdentifier) {
    const checkbox = document.getElementById(elementId);
    if (checkbox) {
        checkbox.addEventListener('change', function () {
            HandleRadioButton(this.checked, cppIdentifier);
        });
    } else {
        console.warn(`Checkbox with ID '${elementId}' not found.`);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    CreateNavbar();
    initDropdowns();

    attachCheckboxHandler("fullscreen", "fullscreen");
    attachCheckboxHandler("vsync", "vsync");
});