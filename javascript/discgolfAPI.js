document.getElementById("searchDiscBtn").addEventListener("click", fetchData);

//Asynkron funktion för att hämta data baserat på vilken disc som matas in
async function fetchData() {
    try {
        document.getElementById("discModelName").style.fontSize = "initial";

        const discNameInput = document.getElementById("discInput").value;
        const discName = capitalizeFirstLetter(discNameInput);

        //Gör en request till api:et med discens namn som inmatning.
        const response = await fetch(`https://discit-api.fly.dev/disc?name=${discName}`);

        //Kastar ett fel om hämtningen misslyckas
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        //Parsar resultat till json-format och letar efter det inmatade namnet på discen
        const data = await response.json();
        const disc = data.find(d => d.name === discName);

        //Om en matchning hittades skrivs nedan information ut i respektive element
        if (disc) {
                        
            document.getElementById("spanSpeed").textContent = " " + disc.speed;           
            document.getElementById("spanGlide").textContent = " " + disc.glide;
            document.getElementById("spanTurn").textContent = " " + disc.turn;
            document.getElementById("spanFade").textContent = " " + disc.fade;
            document.getElementById("discModelName").textContent = " " + disc.name;
            document.getElementById("brandName").textContent = " " + disc.brand;
            
        //Om discen inte hittas körs DiscNotFound-funktionen    
        } else {
            
            DiscNotFound(discNameInput);          
            
        }

        //Vid fel loggas felet i consolen.
    } catch (error) {
        console.error(error);
    }

    //Om discen inte hittas visas ett meddelande i "discModalName" med lite mindre text, samt "tömmer" inforutorna.
    function DiscNotFound(discNameInput)
    {
        const discModel = document.getElementById("discModelName");
        discModel.style.fontSize = "0.8rem"
        discModel.textContent = `${discNameInput} kunde inte hittas`

        document.getElementById("spanSpeed").textContent = "";
        document.getElementById("spanTurn").textContent = "" 
        document.getElementById("spanFade").textContent = ""        
        document.getElementById("spanGlide").textContent = ""
        document.getElementById("brandName").textContent = ""
    }


    //Funktion för att säkerställa att första bokstaven blir stor, och övriga små.
    function capitalizeFirstLetter(string) 
    {
    
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    
    }   

}