//DEKLARATION AV VARIABLAR
const submitBtn = document.getElementById("submitBtn");
const textArea = document.getElementById("textarea");
const inputForm = document.getElementById("inputForm");
const newShortcutBtn = document.getElementById("newShortcutBtn");
const closeButton = document.getElementById("closeBtn");
const dashboardHeader = document.getElementById("dashboardHeader")

//EVENTLISTENERS

// Väntar på hela dokumentet laddats för att säkerställa att alla element är tillgängliga
document.addEventListener("DOMContentLoaded", function () {
  // Lägger till sparade länkar från localStorage när sidan laddas
  displayLinks();

  //Ändrar värdet på headern-rubriken om det finns något sparat i dess local storage
  const savedHeader = localStorage.getItem("dashboardHeaderText");
  if (savedHeader){
        dashboardHeader.textContent = savedHeader;
  }

  //Hämtar savedNotes och sparar dem i textrutan
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
        textArea.value = savedNotes;
    }
  
  //Gör min rubrik redigeringsbar när jag klickar på den
  dashboardHeader.addEventListener("click", function() {
        this.contentEditable = "true"
    });

  //När man klickar på enter sätts redigeringsmöjligheten till false
    dashboardHeader.addEventListener("keydown", function(event){
      if(event.key === "Enter")
      {
        this.contentEditable = "false";
        event.preventDefault(); //Förhindrar att händelsen utför sitt standardbetéende. I detta fall skapa ny rad       
        localStorage.setItem("dashboardHeaderText", this.textContent);
      }
    })

  // Spara anteckningar i lokal lagring när texten ändras
  textArea.addEventListener("input", function () {
    localStorage.setItem("notes", textArea.value);
  });

  //Kör addNewLink när knappen klickas på
  submitBtn.addEventListener("click", addNewLink);

  // Visar inputForm när användaren klickar på knappen
  newShortcutBtn.addEventListener("click", function() {
    inputForm.style.display = 'flex';
  });

  // Döljer inputForm när användaren klickar på stängningsknappen
  closeButton.addEventListener('click', function() {
    inputForm.style.display = 'none';
  });

  // Initierar hämtning av väderdata baserat på användarens position. 
  navigator.geolocation.getCurrentPosition(success, error);
});

// FUNKTIONER

// Funktion för att lägga till en ny länk och döljer formuläret
function addNewLink(event) {
  event.preventDefault();
  const homepageName = document.getElementById("inputHomepage").value;
  const homepageUrl = document.getElementById("inputUrl").value;
  
  if (homepageName && homepageUrl) {
    //Sparar homepageName och dess url som ett objekt.
    const link = { name: homepageName, url: homepageUrl };

    // Hämtar nuvarande länkar från localStorage, eller skapar en ny lista om den inte finns
    const links = JSON.parse(localStorage.getItem("links")) || [];
    
    //Pushar in objektet i links och konverterar till en sträng då locasl storage endast kan lagra strängar.
    links.push(link);
    localStorage.setItem("links", JSON.stringify(links));

    // Rensar sedan input-fälten och döljer formuläret
    document.getElementById("inputHomepage").value = "";
    document.getElementById("inputUrl").value = "";
    inputForm.style.display = "none";

    // Kör funktionen för att visa länkarna
    displayLinks();
  } else {
    console.log("You must fill in homepageName and homepageURL");
  }
}

//Funktion för att hämta listan över länk-knapparna
function displayLinks() {

  //Försöker hämta listan från local storage, hittar den inget skapas en ny.
  const links = JSON.parse(localStorage.getItem("links")) || [];
  const widgetContent = document.querySelector(".widget-content");
  
  // Rensar befintligt innehåll
  widgetContent.innerHTML = ""; 

  //Använder forEach för att skapa en ny linkButton för varje par som finns sparat i listan

  links.forEach((link, index) => {
    const linkItem = document.createElement("div");
    linkItem.className = "linkButton";
    linkItem.addEventListener("click", () => window.open(link.url, "_blank"));

    const favicon = document.createElement("img");
    favicon.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${link.url}`;
    favicon.className = "favicon";

    //Läger till faviconen till link-elementet
    linkItem.appendChild(favicon);

    const linkText = document.createElement("span");
    linkText.textContent = link.name;
    linkText.style.flexGrow = "1";
    linkItem.appendChild(linkText);

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa fa-trash";
    deleteIcon.style.cursor = "pointer";

    
    deleteIcon.addEventListener("click", function(event) {
      
      //Stoppar "händelsebubbling" så att ett klick på iconen inte öppnar länken.
      event.stopPropagation(); 

      //Anropar funktion för att ta bort länken från local storage med indeg som argument.
      removeLinkFromStorage(index); 
    });
    linkItem.appendChild(deleteIcon);

    widgetContent.appendChild(linkItem);
  });
}


function removeLinkFromStorage(index) {
  const links = JSON.parse(localStorage.getItem("links")) || [];

  // Avnänder mig av splice-funktionen för att ta bort objektet från links.
  links.splice(index, 1);

  // Sparar den uppdaterade listan av länkar i localStorage
  localStorage.setItem("links", JSON.stringify(links)); 
  
  // Uppdaterar visningen av länkar
  displayLinks(); 
}

// Körs om användarens position lyckas hämtas.
function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  //Här körs fetchWeatherData med latituden och longituden som inparametrar
  fetchWeatherData(lat, lon); 
}

// Loggar fel om position inte kan hämtas
function error(error) {
  console.log(error);
}


// Asynkron funktion som hämtar och uppdaterar väderdatan
async function fetchWeatherData(latitude, longitude) {
  const apiKey = `081046673aa1981c57e0cce2b85d73a9`;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  
  //Försöker hämta väderdatan. Om det inte går kastas ett nytt error.
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Could not fetch the response");

    //Om hämtningen lyckades körs funktionen updateWeather med den hämtade datan som inparameter.
    const data = await response.json();
    updateWeather(data);
  } catch (error) {
    console.error("The fetch failed: ", error);
  }
}

// Uppdaterar sidans med väderinformation från datan som hämtats
function updateWeather(data) {
  console.log(data)
  const ort = data.name;
  const temp = data.main.temp;
  const windSpeed = data.wind.speed;
  const tempCelsius = temp - 273.15; // Konverterar från Kelvin till Celsius
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  

  document.getElementById("ort").innerText = `Ort: ${ort}`;
  document.getElementById("tempValue").innerText = `Dagens temperatur : ${tempCelsius.toFixed(1)}`;
  document.getElementById("tempIcon").src = iconUrl;
  document.getElementById("windSpeed").innerText = `Vindhastighet : ${windSpeed} m/s`;
  
}

