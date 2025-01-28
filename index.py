import pandas as pd
import pickle
import tensorflow as tf
from datetime import datetime, timedelta
from flask import *
from flask_cors import CORS
from web3 import Web3
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
print("Connected:", web3.is_connected())
account_1 = web3.eth.accounts[0]
contract_address = "0x07f4DA34F3101F035Dcdf402DEDF7D3716de14Ec"
abi = json.load(open('./CreditCardFraudDetection.json', 'r'))['abi']
contract = web3.eth.contract(address=contract_address, abi=abi)


with open("./output/category_encoder.pkl", "rb") as file:
    category_le = pickle.load(file)
with open("./output/gender_encoder.pkl", "rb") as file:
    gender_le = pickle.load(file)
with open("./output/city_encoder.pkl", "rb") as file:
    city_le = pickle.load(file)
with open("./output/state_encoder.pkl", "rb") as file:
    state_le = pickle.load(file)
with open("./output/job_encoder.pkl", "rb") as file:
    job_le = pickle.load(file)
with open("./output/fraud_encoder.pkl", "rb") as file:
    fraud_le = pickle.load(file)

with open("./output/dtree_model.pkl", "rb") as file:
    dtree = pickle.load(file)
with open("./output/rforest_model.pkl", "rb") as file:
    rforest = pickle.load(file)
with open("./output/xgb_model.pkl", "rb") as file:
    xgb = pickle.load(file)
with open("./output/scaler.pkl", "rb") as file:
    scaler = pickle.load(file)
model = tf.keras.models.load_model("./output/cnn_model.h5")


@app.route("/predict", methods=['POST'])
def predict():
    if 'card' not in request.form or \
        'trans_date_trans_time' not in request.form or \
        'category' not in request.form or \
        'amt' not in request.form or \
        'gender' not in request.form or \
        'city' not in request.form or \
        'state' not in request.form or \
        'lat' not in request.form or \
        'long' not in request.form or \
        'city_pop' not in request.form or \
        'job' not in request.form or \
        'merch_lat' not in request.form or \
            'merch_long' not in request.form:
        return {
            "text": "",
            "err": "All fields are not present"
        }
    card = request.form['card']
    trans_date_trans_time = request.form['trans_date_trans_time']
    dt_obj = datetime.strptime(trans_date_trans_time, "%Y-%m-%dT%H:%M")
    trans_date_trans_time = int(dt_obj.timestamp())
    category = category_le.transform([request.form['category']])[0]
    amt = float(request.form['amt'])
    gender = gender_le.transform([request.form['gender']])[0]
    city = city_le.transform([request.form['city']])[0]
    state = state_le.transform([request.form['state']])[0]
    lat = float(request.form['lat'])
    long = float(request.form['long'])
    city_pop = float(request.form['city_pop'])
    job = job_le.transform([request.form['job']])[0]
    merch_lat = float(request.form['merch_lat'])
    merch_long = float(request.form['merch_long'])

    cardTransactions = contract.functions.getCardTransactions(
        card
    ).call({
        "from": account_1,
        "gas": '1000000'
    })

    current_time = datetime.utcnow()
    one_hour_ago = current_time - timedelta(hours=1)
    _cardTransactions = []

    for transaction in cardTransactions:
        try:
            if int(datetime.strptime(transaction[2], '%Y-%m-%dT%H:%M:%S.%fZ').timestamp()) > int(one_hour_ago.timestamp()) and transaction[7] != "Not fraud":
                _cardTransactions.append(transaction)
        except Exception as e:
            print(e)
        try:
            if int(datetime.strptime(transaction[2], '%Y-%m-%dT%H:%M').timestamp()) > int(one_hour_ago.timestamp()) and transaction[7] != "Not fraud":
                _cardTransactions.append(transaction)
        except Exception as e:
            print(e)

    result = ""
    if len(_cardTransactions) >= 2:
        result = "Blocked"
    else:
        data = pd.DataFrame({
            "trans_date_trans_time": [trans_date_trans_time],
            "category": [category],
            "amt": [amt],
            "gender": [gender],
            "city": [city],
            "state": [state],
            "lat": [lat],
            "long": [long],
            "city_pop": [city_pop],
            "job": [job],
            "merch_lat": [merch_lat],
            "merch_long": [merch_long],
        })
        prediction = dtree.predict(data)
        cnn_pred =  model.predict(data)
        cnn_pred = np.argmax(cnn_pred, axis=1)
        model_weight = 0.8
        cnn_weight = 0.2

        hybrid_predictions = np.round((prediction * model_weight + cnn_pred * cnn_weight)).astype(int)
        prediction = fraud_le.inverse_transform(hybrid_predictions)
        print(prediction)
        result = prediction[0]

    contract.functions.addCardTransaction(
        card,
        request.form['trans_date_trans_time'],
        request.form['category'],
        str(amt),
        str(merch_lat),
        str(merch_long),
        result
    ).transact({
        "from": account_1,
        "gas": 1000000
    })

    return {"result": result}


@app.route("/transact", methods=['POST'])
def transact():
    if 'card' not in request.form or \
        'trans_date_trans_time' not in request.form or \
        'category' not in request.form or \
        'amt' not in request.form or \
        'gender' not in request.form or \
        'city' not in request.form or \
        'state' not in request.form or \
        'lat' not in request.form or \
        'long' not in request.form or \
        'city_pop' not in request.form or \
        'job' not in request.form or \
        'merch_lat' not in request.form or \
            'merch_long' not in request.form:
        return {
            "text": "",
            "err": "All fields are not present"
        }
    card = request.form['card']
    trans_date_trans_time = request.form['trans_date_trans_time']
    dt_obj = datetime.strptime(trans_date_trans_time, '%Y-%m-%dT%H:%M:%S.%fZ')
    trans_date_trans_time = int(dt_obj.timestamp())
    category = category_le.transform([request.form['category']])[0]
    amt = float(request.form['amt'])
    gender = gender_le.transform([request.form['gender']])[0]
    city = city_le.transform([request.form['city']])[0]
    state = state_le.transform([request.form['state']])[0]
    lat = float(request.form['lat'])
    long = float(request.form['long'])
    city_pop = float(request.form['city_pop'])
    job = job_le.transform([request.form['job']])[0]
    merch_lat = float(request.form['merch_lat'])
    merch_long = float(request.form['merch_long'])

    cardTransactions = contract.functions.getCardTransactions(
        card
    ).call({
        "from": account_1,
        "gas": 1000000
    })

    current_time = datetime.utcnow()
    one_hour_ago = current_time - timedelta(hours=1)
    _cardTransactions = [transaction for transaction in cardTransactions if
                         int(datetime.strptime(transaction[2], '%Y-%m-%dT%H:%M:%S.%fZ').timestamp()) > int(one_hour_ago.timestamp()) and
                         transaction[7] != "Not fraud"]

    result = ""
    if len(_cardTransactions) >= 2:
        result = "Blocked"
    else:
        data = pd.DataFrame({
            "trans_date_trans_time": [trans_date_trans_time],
            "category": [category],
            "amt": [amt],
            "gender": [gender],
            "city": [city],
            "state": [state],
            "lat": [lat],
            "long": [long],
            "city_pop": [city_pop],
            "job": [job],
            "merch_lat": [merch_lat],
            "merch_long": [merch_long],
        })
        prediction = dtree.predict(data)
        prediction = fraud_le.inverse_transform(prediction)
        print(prediction)
        result = prediction[0]

    contract.functions.addCardTransaction(
        card,
        request.form['trans_date_trans_time'],
        request.form['category'],
        str(amt),
        str(merch_lat),
        str(merch_long),
        result
    ).transact({
        "from": account_1,
        "gas": 1000000
    })

    return {"result": result}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
