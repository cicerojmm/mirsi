'''
    TCC - Sistemas de Informacao
    MIRSI v1.0 - 07/10/2017
    @cicero.moura
    API online para receber os dados do MIRSI embarcado via GET e
    enviar os mesmos para o banco de dados Firebase

    'God is good all the time'
'''

import os
from flask import Flask, request
import pyrebase
from pyfcm import FCMNotification
import time

app = Flask(__name__)


##
# Rota inicial da API
##
@app.route("/")
def verifica_api_online():
    return "API ONLINE v1.6", 200

##
# Recebe os dados VIA GET e envia para o Firebase
##
@app.route("/api/save/get")
def api_salvar():

    if request.method == "GET":
        firebase = pyrebase.initialize_app(configuracao_firebase())
        user = autenticacao_firebase(firebase)

        bancoDados = firebase.database()

        dados = request.args.to_dict()

        queda = verifica_quedas(dados['aclX'], dados['aclZ'])
        anormalidadeBPM = verifica_bpm(dados['bpm'])
        anormalidadeTemp = verifica_temp(dados['temperatura'])
        analiseMedia =  analisa_media(dados['bpm'], bancoDados)

        situacaoSaude = verifica_situacoes_saude(0, anormalidadeBPM, anormalidadeTemp)

        dadosParaSalvar = retorna_json(dados['bpm'], dados['temperatura'], dados['aclX'], dados['aclY'], dados['aclZ'],
                                       dados['girX'], dados['girY'], dados['girZ'], situacaoSaude,
                                    time.strftime("%Y-%m-%d"), time.strftime("%Y-%m-%d %H:%M:%S"))

        bancoDados.child("mirsi").push(dadosParaSalvar, user['idToken'])


    return "Dados Salvos com sucesso!", 200

##
# Recebe os dados VIA POST e envia para o Firebase
##
'''@app.route("/api/salvar", methods=['POST'])
def api_salvar():

    if request.method == "POST":
        if request.is_json:
            firebase = pyrebase.initialize_app(config_firebase())
            user = auth_firebase(firebase)

            db = firebase.database()

            data = request.json.to_dict()

            dataSend = retorna_json(data["bpm"], data['temperatura'], data['aclX'], data['aclY'], data['aclZ'],
                                   data['girX'], data['girY'], data['girZ'], time.strftime("%Y-%m-%d"), 
								   time.strftime("%Y-%m-%d %H:%M:%S"))

            db.child("mirsi").push(dataSend, user['idToken'])


    return "Dados Salvos com sucesso!", 200 '''


##
# Verifica variavel de quedas para enviar
# notificacoes
##
def verifica_quedas(aclX, aclZ):
    quedaVerificada = 0

    if(float(aclX) >= 30 or float(aclZ) >= 30):
        quedaVerificada = 1

    return quedaVerificada

def verifica_bpm(bpm):
    anormalidade = 0

    if (int(bpm) == 0):
        anormalidade = 3
    elif(int(bpm) <= 40):
        anormalidade = 2
    elif(int(bpm) >= 160):
        anormalidade = 1


    return anormalidade

def analisa_media(bpm, db):
    media = calcula_media_bpm(db)
    analiseMedia = 0

    if(media > 0):
        if(int(bpm) > media):
            analiseMedia = 1
        elif(int(bpm) < media):
            analiseMedia = 2

    return analiseMedia

def calcula_media_bpm(db):

    dados = db.child("mirsi").order_by_child("data").limit_to_last(60).get()

    total = 0
    contador = 0

    for item in dados.each():
        array = db.child("mirsi").child(item.key()).get().val()
        total = total + int(array["bpm"])

        contador += 1

    media = total / contador
    #print(media)

    return float(media)


def verifica_temp(temp):
    anormalidade = 0

    if (float(temp) >= 37.4):
        anormalidade = 1
    elif (float(temp) <= 34):
        anormalidade = 2

    return anormalidade


def verifica_situacoes_saude(queda, anormalidadeBPM, anormalidadeTemp):
    situacaoSaude = "Tudo Normal"

    if(queda == 1):
        situacaoSaude = "Queda Detectada"
        envia_notificacao("QUEDA Detectada, é necessáro tomar providencias.")

    if(anormalidadeBPM == 1):
        situacaoSaude = "BPM Muito Alto"
        envia_notificacao("Frequência Cardíaca acima do normal, é necessáro tomar providencias.")
    elif(anormalidadeBPM == 2):
        situacaoSaude = "BPM Muito Baixo"
        envia_notificacao("Frequência Cardíaca abaixo do normal, é necessáro tomar providencias.")
    elif(anormalidadeBPM == 3):
        situacaoSaude = "BPM não Encontrado"
        envia_notificacao("Frequência Cardíaca está ZERO, é necessáro tomar providencias.")

    if(anormalidadeTemp == 1):
        situacaoSaude = "Temperatura Muito Alta"
        envia_notificacao("Temperatura Corporal acima do normal, é necessáro tomar providencias.")
    elif(anormalidadeTemp == 2):
        situacaoSaude = "Temperatura Muito Baixa"
        envia_notificacao("Temperatura Corporal abaixo do normal, é necessáro tomar providencias.")

    if (analiseMedia == 1):
       situacaoSaude = "BPM acima da Média"
      envia_notificacao("BPM acima da Média, é necessáro tomar providencias.")
    elif (analiseMedia == 2):
       situacaoSaude = "BPM abaixo da Média"
      envia_notificacao("BPM abaixo da Média, é necessáro tomar providencias.")

    return situacaoSaude


##
# Envia notificacao para ao usuario
##
def envia_notificacao(corpoMensagem):
    #precisa adicionar informação
    servico_notificacao = FCMNotification(api_key="")
    #precisa adicionar informação
    id_cliente = ""
    titulo_mensagem = "O Paciente Requer sua Atenção!"
    corpo_mensagem = corpoMensagem
    resultado = servico_notificacao.notify_single_device(registration_id=id_cliente, message_title=titulo_mensagem, message_body=corpo_mensagem)

    return resultado
	
##
# Monta configuracao e retorna dados de
# autenticacao
##
def configuracao_firebase():
    # necessário adicionar informações
    config = {
        "apiKey": "",
        "authDomain": "",
        "databaseURL": "",
        "storageBucket": ""
    }

    return config

##
## Retorna dados de autenticacao
##
def autenticacao_firebase(firebase):

    email = "email"
    password = "senha"

    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password(email, password)

    return user

##
# Monta JSON e retorna os dados estruturados
##
def retorna_json(bpm, temp, aclX, aclY, aclZ, girX, girY, girZ, situacaoSaude, data, timestamp):
    json = {
        "bpm": bpm,
        "temp": temp,
        "aclX": aclX,
        "aclY": aclY,
        "aclZ": aclZ,
        "girX": girX,
        "girY": girY,
        "girZ": girZ,
        "situacaoSaude": situacaoSaude,
		"data": data,
        "timestamp": timestamp
    }

    return json

##
## Coloca a app como online
##
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
