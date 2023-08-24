window.setInterval(getTime, 1000)


function getTime(){
  let checkElem = document.getElementById('section1');
  if(checkElem != null){
    var date = new Date();
    var currentDate="Data: "+ date.getDate()+"/"+(date.getMonth()+1) + "/" + date.getFullYear()
    + "    Ora: " + date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    document.getElementById("date").innerHTML=currentDate;
  }
}
function sectiunea1(){
    let checkElem = document.getElementById('section1');
    if(checkElem != null){
      var origin= window.location.pathname;
      var browser= navigator.appCodeName + " " + navigator.appVersion;
      getLocation();
      document.getElementById("url").innerHTML="Calea: " + origin;
      document.getElementById("browser").innerHTML="Browser: " + browser;
      document.getElementById("os").innerHTML="OS: " + navigator.platform;
  }
}


function getLocation(){
    navigator.geolocation.getCurrentPosition(showPosition, showError);
}

function showPosition(position){
    document.getElementById("location").innerHTML = "Locație: Latitudine - " + position.coords.latitude + " Longitudine - " + position.coords.longitude;
}

function showError(error){
    document.getElementById("location").innerHTML = "Locație: Eroare";
}

var click1 = null;

function sectiunea2(event){
  let checkElem = document.getElementById('section2');
  if(checkElem != null)
  {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
       
    var margine = document.getElementById("margini").value;
    ctx.strokeStyle = margine;
    ctx.lineWidth = 10;

//culoare umplere
    var umplere = document.getElementById("fill").value;
    ctx.fillStyle = umplere;


    
    
    if (click1 === null)
    {
        click1 =
        {
        x: event.offsetX,
        y: event.offsetY 
        };
    }
    else
    {
        var click2 =
        {
        x: event.offsetX,
        y: event.offsetY
        };
    var width = click2.x - click1.x;
    var height = click2.y - click1.y;

    ctx.beginPath();
    ctx.rect(click1.x, click1.y, width, height);
    ctx.stroke();
    ctx.fill();

    //ctx.fill
    //reset pt alt dreptunghi
    click1 = null;
    }
  }
}

function start(){
    sectiunea1();
}



//window.onload = start;


function clearTableSpanError() {
    document.getElementById("tableSpanError").innerHTML = "";
  }
 
  function setTableSpanError(message) {
    document.getElementById("tableSpanError").innerHTML = "<br><b>" + message + "!</b>";
  
  }

var nRows = 4;
var nColumns = 2;

function tableElementChangeColour() {
    clearTableSpanError();
    let tabel = document.getElementById("tableInvat");
    let posRow = document.getElementById("tableRowAdd").value;
    let posCol = document.getElementById("tableColumnAdd").value;
    let rows = tabel.getElementsByTagName("tr");
    if (posRow > nRows || posCol >= nColumns + 1 || rows.length == 0) {
      setTableSpanError("Celula nu exista!");
    }
    else {
      let columns = rows[posRow - 1].getElementsByTagName("td");
      if(columns.length == 0){
        columns = rows[posRow - 1].getElementsByTagName("th");
      }
      let colour = document.getElementById("tableColour").value;
      console.log(columns);
      columns[posCol - 1].style.backgroundColor = colour;
    }
  }


  function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp;
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
      /* onreadystatechange, onload, onerror */
      xhttp.onreadystatechange =
        function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("continut").innerHTML = xhttp.responseText;
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } 
            else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
                }
          }
        }
      xhttp.open("GET", resursa + '.html', true);
      xhttp.send();
    }
  }

  function login(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var user = document.getElementById("utilizator").value;
        var pass = document.getElementById("parola").value;
        var users = JSON.parse(xmlhttp.responseText);
        var check = false;
        for (let i  = 0; i < users.length; i++) {
            if((user == users[i].utilizator && pass == users[i].parola) == true){
              check = true;
              break;
            }
          }
          loginText = document.getElementById("login");
          if(check){
            loginText.style.color = "green";
            loginText.innerHTML = "Username si parola corecta!";
          }
          else{
            loginText.style.color = "red";
            loginText.innerHTML = "Username sau parola gresita!";
          }
        }
      };
    xmlhttp.open("GET", "resurse/utilizatori.json", true);
    xmlhttp.send();
}

