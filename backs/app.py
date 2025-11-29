from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import jwt
import datetime

# -----------------------------
# CONFIG
# -----------------------------
SECRET_KEY = "changeme"
MONGO_URI = "mongodb+srv:kwanelexavi_db_atlas:45etvz9IbZZWDkR7@cluster0.o0nfuss.mongodb.net/"

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

client = MongoClient(MONGO_URI)
db = client.safehaven

users = db.users
blogs = db.blogs
reports = db.reports
support_messages = db.support_messages


# -----------------------------
# JWT Token Generator
# -----------------------------
def generate_token(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


# -----------------------------
# AUTH ROUTES
# -----------------------------

@app.post("/api/auth/register")
def register():
    data = request.json
    existing = users.find_one({"email": data["email"]})

    if existing:
        return jsonify({"msg": "Email already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "role": "user"
    }
    inserted = users.insert_one(user)
    token = generate_token(str(inserted.inserted_id))

    return {
        "msg": "Registered successfully",
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    }, 201


@app.post("/api/auth/login")
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})

    if not user:
        return {"msg": "Invalid credentials"}, 400

    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return {"msg": "Invalid credentials"}, 400

    token = generate_token(str(user["_id"]))

    return {
        "msg": "Login successful",
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    }


# -----------------------------
# BLOG ROUTES
# -----------------------------

@app.get("/api/blogs")
def list_blogs():
    all_blogs = list(blogs.find({}))
    for b in all_blogs:
        b["_id"] = str(b["_id"])
    return jsonify(all_blogs)


@app.post("/api/blogs/create")
def create_blog():
    data = request.json
    blogs.insert_one(data)
    return {"msg": "Blog created"}, 201


# -----------------------------
# REPORT ROUTES
# -----------------------------

@app.post("/api/reports/create")
def create_report():
    data = request.json
    reports.insert_one(data)
    return {"msg": "Report submitted"}, 201


# -----------------------------
# SUPPORT ROUTES
# -----------------------------

@app.post("/api/support/send")
def send_support():
    data = request.json
    support_messages.insert_one(data)
    return {"msg": "Support message sent"}, 200


# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def home():
    return {"msg": "SafeHaven Backend Running"}


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
