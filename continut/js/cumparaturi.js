class Carte{
    constructor(filosof, carte){
        this.filosof = document.getElementById('filosof').value;
        this.carte = document.getElementById('carte').value;
    }
}

class Stocare{
    constructor(){
        this.stocare = undefined;
        this.carte = undefined;
        this.worker = new Worker('js/worker.js');
    }

    getBook(){
        let filosof = document.getElementById('filosof').value;
        let book =  document.getElementById('carte').value;
        this.carte = new Carte(filosof, book);
    }

    sendMessageToWorker() {
        var carte = new Carte();
        this.worker.postMessage([carte.filosof, carte.carte])
        console.log('Message posted to worker');
        this.worker.onmessage = function (e) {
            let result = e.data;
            console.log('Message received from worker\n' + result);
        }

    }

}

class LocalStorage extends Stocare{
    constructor(){
        super();
        this.stocare= window.localStorage;
    }

    addBook(){
        this.getBook();
        if(this.stocare.getItem('nrCrt') == null){
            this.stocare.setItem('nrCrt', 1);
        }
        else{
            this.stocare.setItem('nrCrt', (parseInt(this.stocare.getItem('nrCrt'))+1));
        }
        this.stocare.setItem(this.stocare.getItem('nrCrt'), JSON.stringify(this.carte));
    }

    printBook(){
        var table = "<table style=\"margin-left:auto; margin-right:auto; text-align:center;\"><tr><th>Nr.</th><th>Filosof</th><th>Cartea</th></tr>";
        let temp;
        var result = '';
        if (this.stocare.getItem('nrCrt') == null) {
            result = 'Nu exista produse!';
        }
        else {
            result = 'Exista ' + this.stocare.getItem('nrCrt') + ' carti:\n';
            for (let i = 1; i <= parseInt(this.stocare.getItem('nrCrt')); i++) {
                temp = this.stocare.getItem(i);
                console.log(this.stocare.getItem(i));
                temp = JSON.parse(temp);
                table += "<tr><td>" +
                i + "</td><td>"+
                temp.filosof + "</td><td>" +
                temp.carte + "</td></tr>"; 
            }
            document.getElementById("table").innerHTML = table + "</table>";
        }
    }
   
}

let list = "<table style=\"margin-left:auto; margin-right:auto; text-align:center;\"><tr><th>Nr.</th><th>Filosof</th><th>Cartea</th></tr>";
let index = 0;

class IndexDB extends Stocare{
    constructor(){
        super();
        this.stocare = window.indexedDB;
    }

    addBook(){
        var database;
        var tmp;
        var req = window.indexedDB.open("database", 1);
        let b = new Carte();

        req.onerror = function (e){
            console.log("error: " + req.error);
        };

        req.onsuccess = function(e){
            database = req.result;
            console.log("success: " + database);

            let tx = database.transaction("book", "readwrite");
            tmp = tx.objectStore("book");

            req = tmp.add(b);
            req.oncomplete = function (e) {
                console.log("Inserare cu succes.");
            };

            req.onerror = function (e) {
                console.log("Eroare inserare");
            };

            database.close();
        };

        req.onupgradeneeded = function (e) {
            database = req.result;
            tmp = database.createObjectStore("book", { keyPath: "filosof" });
            tmp.createIndex("filosof", "filosof", { unique: false });
            tmp.createIndex("carte", "carte", { unique: false });
        };
    }

    printBook() {
        let req = indexedDB.open('database', 1);

        req.onsuccess = (event) => {
            let database = event.target.result;

            let tran = database.transaction('book', 'readonly');
            let objectStore = tran.objectStore('book');
            
            let countRequest = objectStore.count();
            let numEntries = 0;

            countRequest.onsuccess = (event) => {
                numEntries = event.target.result;
            };

            countRequest.onerror = (event) => {
                console.error('Error counting entries:', event.target.error);
            };
            


            let cursorRequest = objectStore.openCursor();

            cursorRequest.onsuccess = (event) => {
                let cursor = event.target.result;

                if (cursor) {

                    let json = cursor.value;
                    let carte = json["carte"];
                    let filosof = json["filosof"];
                    list += "<tr><td>" + (index + 1) + "</td><td>" + filosof + "</td><td>" + carte + "</td></tr>";
                    console.log(index);
                    index += 1;
                    cursor.continue();
                }
                if (index == numEntries) {
                    document.getElementById('table').innerHTML = list + "</table>";
                    index = 0;
                    list = "";
                    
                    console.log("final")
                }
            };
            cursorRequest.onerror = (event) => {
                console.error('Error opening cursor:', event.target.error);
            };

        };

        req.onerror = (event) => {
            console.error('Error opening database:', event.target.error);
        };
    }
}

function add(){
    let stocare = undefined;
    let option = document.getElementById("option").value;
    if(option == "localstorage"){
        stocare= new LocalStorage();
        stocare.addBook();
        stocare.sendMessageToWorker();
        stocare.printBook();
    }
    else if (option == "indexDB"){
        stocare= new IndexDB();
        stocare.addBook();
        stocare.sendMessageToWorker();
        stocare.printBook();
    }
}