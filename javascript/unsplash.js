const newImageBtn = document.getElementById("newImageBtn");


 function randomBackgroundImage(){

      // Min access key samt api-urlen med min implementerade accessKey.
       const accessKey = 'haVwpEmtH5Ah6Fw__N6ot5jwqAXzwjZnRZ-QEuzpMD0';
       const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;
   
       //Gör en förfrågan till API
   fetch(url)
     .then(response => {
      //Om responsen är ok - omvandla till .json
       if (response.ok) {
         return response.json();
       } else {
         throw new Error('Network response was not ok');
       }
     })

     
     .then(data => {
       console.log(data);
       //Ändrar sidans bakgrundsbild till apiens bild. Anväder .full för att få den så högupplöst som möjligt.
       document.body.style.backgroundImage = `url('${data.urls.full}')`;

       //Säkerställer att bilden täcker sidan, centreras och inte upprepas
       document.body.style.backgroundSize = 'cover';
       document.body.style.backgroundPosition = 'center';
       document.body.style.backgroundRepeat = 'no-repeat';
     })
     //Loggar ett error vid fel
     .catch(error => {
       console.error('New error : ', error);
     });

 }

//Sätter en ny bakgrundsbild både när man klickar på knappen och när sidan laddas på nytt
 newImageBtn.addEventListener("click", randomBackgroundImage);

 document.addEventListener("DOMContentLoaded", randomBackgroundImage);