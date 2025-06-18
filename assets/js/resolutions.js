// Use this to assign JSON ID to show current resolution states
let mResolutionID = 0;

const mValidResolutions = [
  '3840x2160',
  '2560x1440',
  '1920x1080',
  '1600x900',
  '1280x720',
  '1024x768',
  '640x480',
];

function selectResolution(value) {
  console.log("Selected resolution: " + value); // or store it in a variable
  // Optionally update button text:
  document.querySelector(".dropbtn").textContent = value;


  // converting the string resolution to the index of the array
  mResolutionID = mValidResolutions.indexOf(value);

  // now send the resolution ID to C++
    var message = HandleDropdown(mResolutionID);

  // Close dropdown
  toggleDropdown();
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleDropdown() {
  document.getElementById("resolutionDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
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

// Will loop over the resolutions array and add them to 
// the dropdown in video page
function PopulateResolutions() {
  try {
    const dropdown = document.getElementById('resolutionDropdown');
    dropdown.innerHTML = ''; // Clear existing items

    if (mValidResolutions && dropdown) {
      mValidResolutions.forEach(res => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = res;
        link.onclick = () => selectResolution(res);
        dropdown.appendChild(link);
      });

      // Optionally update the button text to the default selected resolution
      document.querySelector(".dropbtn").textContent = mValidResolutions[mResolutionID] ;
    }
  } catch (error) {
    console.error("Error populating resolutions:", error);
  }
}




document.getElementById("vsync").addEventListener("change", function() {
    // Call your specific function here

    var message = HandleRadioButton(this.checked, "vsync");

});

document.getElementById("fullscreen").addEventListener("change", function() {
    // Call your specific function here

    var message = HandleRadioButton(this.checked, "fullscreen");

});

window.addEventListener('DOMContentLoaded', () => {
  CreateNavbar();
  PopulateResolutions();

});