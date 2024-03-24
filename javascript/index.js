
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

        //Förhindrar att händelsen utför sitt standardbetéende. I detta fall skapa ny rad       
        event.preventDefault(); 

        //Sparar i local storage
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
  //Kör antingen funktionen success eller error
  navigator.geolocation.getCurrentPosition(success, error);
});



// FUNKTIONER

// Funktion för att navigera till den anginva länkes value
function goToLink(link) {
  console.log(link.value);
  const url = link.getAttribute("data-url")

    //Om länken har ett url-värde ska det öppnas i ett nytt fönster.
    if(url){
      window.open(url, "_blank")
    }
}



// Funktion för att lägga till en ny länk och döljer formuläret
function addNewLink(event) {
  event.preventDefault();
  const homepageName = document.getElementById("inputHomepage").value;
  const homepageUrl = document.getElementById("inputUrl").value;
  
  //Körs om både homepageName och homepageURL har ett värde.
  if (homepageName && homepageUrl) {
      // Skapar huvudcontainer för länk-item
      const linkItem = document.createElement("div");

      //Sätter class som linkButton
      linkItem.className = "linkButton";
      
      //När man klickar på länken ska dess url öppnas i ett nytt fönster.
      linkItem.addEventListener("click", ()=>{
        window.open(homepageUrl, "_blank");
      });

      // Skapar ett nytt .img-element där favicon ska hämtas
      const favicon = document.createElement("img");

      //Hämtar homepageUrls favicon genom en googletjänst
      favicon.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${homepageUrl}`;

      //Sätter dess className till "favicon"
      favicon.className = "favicon";
      

      //Skapar en span för att skriva ut namnet på hemsidan.
      const linkText = document.createElement("span");

      //Sätter dess textContent till det inmatade hompageName
      linkText.textContent = homepageName;
      
      //Låter texten ta upp extra utrymme
      linkText.style.flexGrow = "1"; 

      // Skapar ett nytt i-element för min soptunna.
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fa fa-trash";
      deleteIcon.style.cursor = "pointer";

      //När man klickar på elementet kommer följnade funktion att köras;
      deleteIcon.onclick = function(event) {

        //stopPropagation används för att stoppa händelsen från att bubbla upp till dess föräldra-element. 
          event.stopPropagation();

          //Tar bor linkItem from DOM-trädet.
          linkItem.remove();
      };

      // Lägger till alla barn till linkItem
      linkItem.appendChild(favicon);
      linkItem.appendChild(linkText);
      linkItem.appendChild(deleteIcon);

      // Lägger till linkItem till widget-content
      document.querySelector(".widget-content").appendChild(linkItem);

      // Rensar input-fälten och döljer formuläret
      document.getElementById("inputHomepage").value = "";
      document.getElementById("inputUrl").value = "";
      inputForm.style.display = "none";
  } else {
      console.log("You must fill in homepageName and homepageURL");
  }
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

//Tar bort den valda länken från DOM-trädet
function removeLink(link){
  link.remove();
}