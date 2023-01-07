import datetime
from flask import *
from flask_bcrypt import Bcrypt
from mysql.connector import Error
from mysql.connector import pooling
from data.EC2MySQL import *
from api.model import *
import os, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

user=Blueprint("user", __name__)
app=Flask(__name__)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True
load_dotenv()

bcrypt=Bcrypt()



# Set Connection Pool
def connection_pool():
    connection_pool = pooling.MySQLConnectionPool(pool_name="attraction_pool",
                                                  pool_size=5,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='taipei_day_trip',
                                                  user=os.getenv('mysqlUsername'),
                                                  password=os.getenv('mysqlpassword'))

    print("Printing connection pool properties ")
    print("Connection Pool Name - ", connection_pool.pool_name)
    print("Connection Pool Size - ", connection_pool.pool_size)

    # Get connection object from a pool
    connection_object = connection_pool.get_connection()

    return connection_object

# User Register
@user.route("/user", methods=["POST"])
def api_register():
    try:
        user = request.get_json()
        if not user:
            return jsonify({
            "error":True,
            "message":"Please provide user details"
            }), 400
        is_validated= validate_email(user["email"]) and validate_password(user["password"])
        if is_validated is not True:
            return jsonify({
            "error":True,
            "message":"請輸入正確帳號或密碼"
            }), 400
        cnx=connection_pool()
        cursor = cnx.cursor(dictionary=True)
        sql_user="SELECT email, password FROM user WHERE email=%s"
        cursor.execute(sql_user,(user["email"],))
        #Check if email is used
        is_email_used=cursor.fetchone()
        # Insert user info to MySQL database
        if not is_email_used:
            hashed_pwd=bcrypt.generate_password_hash(user["password"])
            query_sql="INSERT INTO user (email, password, name) VALUES (%s, %s, %s)"
            user_info_sql=(user["email"], hashed_pwd, user["name"])
            cursor.execute(query_sql,user_info_sql)
            cnx.commit()
            return jsonify({"ok":True}), 200
        else:
            return jsonify({
            "error":True,
            "message":"註冊失敗，重複的Email或其他原因，請重新註冊"
            }), 400
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"伺服器內部錯誤"
            }), 500
    finally:
        if cnx.is_connected():
            cursor.close()
            cnx.close() 

# User Auth, Method=["GET", "PUT", "DELETE"]
@user.route("/user/auth", methods=["GET", "PUT", "DELETE"])
def api_auth():
    try:
        if request.method== "PUT":
            try:
                cnx=connection_pool()
                cursor = cnx.cursor(dictionary=True)
                auth_user=request.get_json()
                if not auth_user:
                    return jsonify({
                    "error":True,
                    "message":"Please provide user details"
                    }), 400
                is_validated= validate_email(auth_user["email"]) and validate_password(auth_user["password"])
                if is_validated is not True:
                    return jsonify({
                    "error":True,
                    "message":"帳號或密碼有誤"
                    }), 400
                sql_user_login="SELECT * FROM user WHERE email = %s"
                cursor.execute(sql_user_login, (auth_user["email"],))
                check_email = cursor.fetchone()
                # SET JWT token
                if check_email:
                    sql_pwd=check_email["password"]
                    if bcrypt.check_password_hash(sql_pwd, auth_user["password"]):
                        payload_data={
                            "id":check_email["id"],
                            "name": check_email["name"],
                            "email": check_email["email"],
                            'exp' : datetime.now() + timedelta(days=7)
                        }
                        expire_day=datetime.now() + timedelta(days=7)
                        
                        token=jwt.encode(payload=payload_data, key=SECRET_KEY)
                        resp=make_response(({"ok":True}), 200) 
                        resp.headers["Accept"]="application/json"
                        resp.access_control_allow_origin="*"
                        resp.set_cookie("token=%s"%token, expires=expire_day)
                        return resp
                return jsonify({
                    "error":True,
                    "message":"登入失敗，帳號或密碼錯誤或其他原因"
                    }), 400
            except Exception as e:
                return jsonify({
                    "error":True,
                    "message":"伺服器內部錯誤"
                    }), 500
        if request.method=="GET":
            try:
                token= request.cookies.get("token")
                cnx=connection_pool()
                cursor = cnx.cursor(dictionary=True)
                if token:
                    decoded_token=jwt.decode(token, SECRET_KEY, algorithms="HS256")
                    sql_retrieve_info="SELECT id, name, email FROM user WHERE email = %s"
                    cursor.execute(sql_retrieve_info, (decoded_token["email"],))
                    user_info=cursor.fetchone()
                    return jsonify({"data": user_info}) 
                return jsonify({"data":None}),200
            except Exception as e:
                return jsonify({
                    "error":True,
                    "message":"伺服器內部錯誤"
                    }), 500
            finally:
                if cnx.is_connected():
                    cursor.close()
                    cnx.close()
        if request.method=="DELETE":
            resp=make_response(({"ok":True}),200)
            token=request.cookies.get("JWTtoken")
            resp.set_cookie("token", max_age=-1, expires=datetime.now())
            return resp
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"伺服器內部錯誤"
            }), 500