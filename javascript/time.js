function timeAndDate() {
    //Skapar ett nytt objekt för att hålla koll på tiden
    const now = new Date();

    //Hämtar timmar och minuter. Padstart lägger till en nolla framför timmen om det är en ensiffrig timme.
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');    
    const days = now.getDate();


    //En array med årets månader
    const monthsArray = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

    //Hämtar den aktuella månadens nummer och omvandlar den hämtade siffran till rätt månad från arrayen.
    const month = monthsArray[now.getMonth()];
    const year = now.getFullYear();


    //Sammanfattar samtliga element till en variabel...
    const formateratDatumTid = `<strong>${hours}:${minutes}</strong>&nbsp;&nbsp; ${days} ${month} ${year}`;

    //...och exporterar den till time-header i html-koden.
    document.getElementById('time-header').innerHTML = formateratDatumTid;

    
}

// Kör funktionen när sidan laddas
timeAndDate(); 

//Kör även funktionen varje sekund för att automatiskt uppdatera tiden utan att behöva ladda om sidan 
setInterval(timeAndDate, 1000);

