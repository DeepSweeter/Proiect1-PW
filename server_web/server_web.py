import socket
import os
import gzip
import threading
from _thread import *
import time
# creeaza un server socket

def processRequest(clientsocket):
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    counter = 0
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        if cerere != '':
            print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print( 'S-a citit linia de start din cerere: ##### ' + linieDeStart + '\
    #####')
            break
        if cerere == '':
            counter += 1
            print(f"S-a incercat conectarea: {counter}")
            time.sleep(1)
            if counter == 10:
                
                clientsocket.close()
                break
    print('S-a terminat cititrea.')
    vector = linieDeStart.split()
    nume = vector[1]

    if nume == '/':
        nume = '/index.html'


    # WINDOWS
    # numeFisier = os.getcwd() + '\\continut\\' + numeResursaCeruta[1:]

    # calea este relativa la directorul de unde a fost executat scriptul
    # LINUX
    numeFisier = os.getcwd() + '/continut' + nume
    print(numeFisier)
    fisier = None
    try:
        # deschide fisierul pentru citire in mod binar
        fisier = open(numeFisier,'rb')

        # tip media
        numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
        tipuriMedia = {
            'html': 'text/html; charset=utf-8',
            'css': 'text/css; charset=utf-',
            'js': 'text/javascript; charset=utf-8',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'ico': 'image/x-icon',
            'xml': 'application/xml; charset=utf-8',
            'json': 'application/json; charset=utf-8'
        }
        tipMedia = tipuriMedia.get(numeExtensie,'text/plain; charset=utf-8')
        
        # se trimite raspunsul
        clientsocket.sendall(str.encode('HTTP/1.1 200 OK\r\n'))
        clientsocket.sendall(str.encode('Content-Length: ' + str(os.stat(numeFisier).st_size) + '\r\n'))
        clientsocket.sendall(str.encode('Content-Type: ' + tipMedia +'\r\n'))
        clientsocket.sendall(str.encode('Server: My PW Server\r\n'))
        clientsocket.sendall(str.encode('\r\n'))
        
        # citeste din fisier si trimite la server
        buf = fisier.read(1024)
        while (buf):
            clientsocket.send(buf)
            buf = fisier.read(1024)
    except IOError:
        # daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
        msg = 'Eroare! Resursa ceruta ' + nume + ' nu a putut fi gasita!'
        print(msg)
        clientsocket.sendall(str.encode('HTTP/1.1 404 Not Found\r\n'))
        clientsocket.sendall(str.encode('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n'))
        clientsocket.sendall(str.encode('Content-Type: text/plain; charset=utf-8\r\n'))
        clientsocket.sendall(str.encode('Server: Casti\r\n'))
        clientsocket.sendall(str.encode('\r\n'))
        clientsocket.sendall(str.encode(msg))
    finally:
        if fisier is not None:
            fisier.close()
        clientsocket.close()
        print('S-a terminat comunicarea cu clientul.')

if __name__ == '__main__':
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
    serversocket.bind(('', 5679))
   # continut_dir = "/home/andrei/Facultate/An3/Sem2/PW/Lab/proiect-1-Achirica/continut"
    # serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
    serversocket.listen(5)
    while True:
        try:
            print('#########################################################################')
            print('Serverul asculta potentiali clienti.')
            # asteapta conectarea unui client la server
            # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
            (clientsocket, address) = serversocket.accept()

            #* Folosind _thread
            start_new_thread(processRequest, (clientsocket, ))

            #* Folosing threading
            #newClient = threading.Thread(target=processRequest, args=(clientsocket, ), daemon=True)
            #newClient.start()
            
        except KeyboardInterrupt:
            clientsocket.close()
            serversocket.close()
            print("Opreste program fortat")
            exit(-1)
        except:
            clientsocket.close()
            serversocket.close()
            exit(-1)

            
