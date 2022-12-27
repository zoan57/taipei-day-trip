from flask import Blueprint, Flask, render_template, request,jsonify
from api.attraction import attraction
from api.user import user

app= Flask (__name__, static_folder="static", static_url_path="/")
app.secret_key="try it"
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.register_blueprint(attraction, url_prefix="/api")
app.register_blueprint(user, url_prefix="/api")

           
# Pages
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@app.route("/booking")
def booking():
	return render_template("booking.html")

@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

app.run(port=3000, host="0.0.0.0")