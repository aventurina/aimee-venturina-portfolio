from flask import Flask, render_template, request
from datetime import datetime
import csv

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit_form", methods=["POST", "GET"])
def submit_form():
    if request.method == "POST":
        data = request.form.to_dict()
        write_to_csv(data)
        return "Form is submitted. Thank you!"

    return "Ooops...something went wrong!"


def write_to_file(data):
    with open("database.txt", mode="a") as database:
        email = data["email"]
        name = data["name"]
        message = data["message"]

        database.write(f"\n{email},{name},{message}")


def write_to_csv(data):
    with open("database.csv", mode="a", newline="") as database2:
        now = datetime.now()
        email = data["email"]
        name = data["name"]
        message = data["message"]

        csv_writer = csv.writer(
            database2, delimiter=",", quotechar="'", quoting=csv.QUOTE_MINIMAL
        )

        csv_writer.writerow([now, email, name, message])
