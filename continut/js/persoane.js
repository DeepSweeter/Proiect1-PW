function incarcaPersoane() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      myFunction(this);
      }
    };
    xhttp.open("GET", "resurse/filosofi.xml", true);
    xhttp.send();
  }

  function myFunction(xml) {
    var i;
    var xmlDoc = xml.responseXML;
    var table="<table style=\"margin-left:auto; margin-right:auto; text-align:center;\"><tr><th>Filosof</th><th>Filosofia</th><th>Locul nașterii</th><th>Influențe</th></tr>";
    var x = xmlDoc.getElementsByTagName("filosof");
    for (i = 0; i <x.length; i++) {
      table += "<tr><td>" +
      x[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("filosofia")[0].childNodes[0].nodeValue +
      "</td><td>"+
      x[i].getElementsByTagName("locatia")[0].childNodes[0].nodeValue +
      "</td><td>"+
      x[i].getElementsByTagName("influenta")[0].childNodes[0].nodeValue +
      "</td></tr>";
    }
    document.getElementById("temp").innerHTML = table + "</table>";
  }