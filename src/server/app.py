import requests
import optimizer
# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.get("/solve")
def get_results():
    return jsonify({"kuki": "a"})