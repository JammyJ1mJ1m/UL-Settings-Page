

// Pass in a json config file
function LoadSettings(pConfigFile) {
  // Load the local JSON file and print the contrents to the page on the <p> with the ID of 'output'
  fetch(pConfigFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {

      // show contents on the 'output' <p> element
       document.getElementById('output').innerHTML = JSON.stringify(data, null, 2);
       

      // Set the resolution ID based on the JSON data
      mResolutionID = data.resolutionID;

      // This should then reflect on the dropdown
      UpdateInnerTextByClassName('resolution', mValidResolutions[mResolutionID]);
    })
    .catch(error => {
      console.error('Error loading JSON file:', error);
    });
  

}



// This was given to us by the Ultralight samples
function HandleButton(evt) {
  console.log("Button clicked!");
  // Call our C++ callback 'GetMessage'
  var message = GetMessage();

  // Display the result in our 'message' div element and apply the
  // rainbow effect to our document's body.
  document.getElementById('message').innerHTML = message;
  document.body.classList.add('rainbow');
}


function CustomHandleButton(evt) {
  console.log("Button clicked!");
  // retrieve message from C++ as well as send a string over
  var message = HandleButtonChange("Hello from JS!");


  document.getElementById('message').innerHTML = message;
  document.body.classList.add('rainbow');
}


// I forgot what this is used for/if it is. 
// If you figure it out I owe you a peepo
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('show');
}


// This will create the navbar thats shown at the top of each page
function CreateNavbar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      // Now that the navbar is loaded, highlight the current page link
      const currentPage = window.location.pathname.split('/').pop();
      document.querySelectorAll('.button-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        }
      });
    });


}




// Grab any/all elements with the class name and set their inner text
function UpdateInnerTextByClassName(pClassName, pText) {

  const elements = document.getElementsByClassName(pClassName);
  for (let i = 0; i < elements.length; i++) {
    elements[i].innerText = pText;
  }
}

function UpdateInnerTextByID(pID, pText) {
  const element = document.getElementById(pID);
  if (element) {
    element.innerText = pText;
  } else {
    console.error(`Element with ID ${pID} not found.`);
  }
}


// Pass in the slider ID and the <span> display ID:
function UpdateSliderDisplay(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);

  if (slider && display) {
    // Set initial display
    display.textContent = slider.value;

    // Update display on input
    slider.addEventListener('input', () => {
      display.textContent = slider.value;

      if (typeof SetVolume === 'function') {
        const volumeType = sliderId.replace('-volume', ''); // "master", "music", "sfx"
        SetVolume(volumeType, parseInt(slider.value));
      }
    });
  }
}

// This is a custom dropdown menu
function HandleDropDown() {
  const select = document.querySelector('.dropdown-select');
  const options = document.querySelector('.dropdown-options');

  // Toggle dropdown on select click
  select.addEventListener('click', (e) => {
    options.classList.toggle('show');
  });

  // Handle option selection
  options.addEventListener('click', (e) => {
    if (e.target.closest('div')) {
      select.textContent = e.target.textContent;
      options.classList.remove('show');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-select') && !e.target.closest('.dropdown-options')) {
      options.classList.remove('show');
    }
  });
}





// Waits for page to load first 
window.addEventListener('DOMContentLoaded', () => {


  // can change this to whereever you need it to be
// LoadSettings('../config/config.json');

  CreateNavbar();


  UpdateSliderDisplay('master-volume', 'master-volume-value');
  UpdateSliderDisplay('music-volume', 'music-volume-value');
  UpdateSliderDisplay('effects-volume', 'effects-volume-value');

});



