from flask import Flask, request, jsonify, session, render_template
from flask_bcrypt import Bcrypt
from flask_session import Session
import random

app = Flask(__name__)
bcrypt = Bcrypt(app)

# 設定Session
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# 模擬的用戶資料庫
users = {}

# 卡片池
card_pool = ["SSR 龍騎士", "SSR 魔法師", "SR 劍士", "SR 弓箭手", "R 新手村民"]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    password = request.form.get('password')

    if username in users:
        return jsonify({"message": "用戶名已存在"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users[username] = hashed_password
    return jsonify({"message": "註冊成功"}), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if username not in users or not bcrypt.check_password_hash(users[username], password):
        return jsonify({"message": "用戶名或密碼錯誤"}), 400

    session['user'] = username
    return jsonify({"message": "登入成功"}), 200

@app.route('/draw', methods=['POST'])
def draw():
    if 'user' not in session:
        return jsonify({"message": "未登入"}), 401

    drawn_card = random.choice(card_pool)
    return jsonify({"card": drawn_card}), 200

if __name__ == '__main__':
    app.run(debug=True)
