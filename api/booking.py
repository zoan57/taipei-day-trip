import datetime, os, jwt
from dotenv import load_dotenv
from flask import *
from flask_bcrypt import Bcrypt
from mysql.connector import Error
from mysql.connector import pooling
from data.EC2MySQL import *
from api.model import *
from datetime import datetime, timedelta
booking=Blueprint("booking", __name__)
app=Flask(__name__)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True
load_dotenv()
SECRET_KEY = os.urandom(12).hex()
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

@booking.route("/booking", methods=["GET","POST", "DELETE"])
def api_booking():
    try:
        if request.method=="POST":
            try:
                cnx=connection_pool()
                cursor = cnx.cursor(dictionary=True)
                if validate_token()!=False:
                    token=validate_token()
                    booking=request.get_json()
                    userId=token['id']
                    attractionId=booking['attractionId']
                    date=booking['date']
                    time=booking['time']
                    price=booking['price']
                    print(userId)
                    if attractionId==None or date==None or time=="" or price==0:
                        return {"error":True,"message":"建立失敗，輸入不正確或其他原因"},403
                    if not booking:
                        return jsonify({
                        "error":True,
                        "message":"請輸入資料"
                        }), 400
                    booking_sql="SELECT userId, attractionId, date, time, price FROM booking WHERE userId=%s"
                    cursor.execute(booking_sql, (userId,))
                    booking_info=cursor.fetchone()
                    if booking_info:
                        sql="UPDATE booking SET attractionId=%s, date=%s, time=%s, price=%s WHERE userId=%s"
                        val= (attractionId, date, time, price, userId)
                    else:
                        sql="INSERT INTO booking (userId, attractionId, date, time, price) value (%s, %s, %s, %s, %s)"
                        val=(userId,attractionId,date,time,price)
                        print(val)
                    cursor.execute(sql,val)
                    cnx.commit()
                    return jsonify({"ok":True}), 200
                return jsonify({
                        "error":True,
                        "message":"未登入系統，拒絕存取"
                        }), 403
            except Exception as e:
                return jsonify({
                    "error":True,
                    "message":"伺服器內部錯誤"
                    }), 500
            finally:
                if (cnx.is_connected()):
                    cursor.close()
                    cnx.close()
                    print("MySQL database Connection is close!")
        if request.method=="GET":
            try:
                cnx=connection_pool()
                cursor = cnx.cursor(dictionary=True, buffered=True)
                if validate_token()!=False:
                    token=validate_token()
                    userId=token['id']
                    sql="SELECT attractions.id, attractions.name, attractions.address, attractions_images.image, booking.date, booking.price, booking.time FROM attractions INNER JOIN attractions_images ON attractions.id=attractions_images.attraction_id INNER JOIN booking ON attractions.id=booking.attractionId WHERE booking.userId = %s"
                    cursor.execute(sql, (userId,))
                    get_booking=cursor.fetchone()
                    print(get_booking)
                    if get_booking:
                        data={
                            "attraction": {
                                "id": get_booking['id'],
                                "name": get_booking['name'],
                                "address": get_booking['address'],
                                "image": get_booking['image'],
                            },
                            "date": get_booking['date'],
                            "time": get_booking['time'],
                            "price": get_booking['price']
                            }
                        return jsonify({"data":data}),200
                    else:
                        return jsonify({"data":None}),200
                return jsonify({
                    "error":True,
                    "message":"未登入系統，拒絕存取"
                    }), 403
            except Exception as e:
                return jsonify({
                    "error":True,
                    "message":"伺服器內部錯誤"
                    }), 500
            finally:
                if (cnx.is_connected()):
                    cursor.close()
                    cnx.close()
                    print("MySQL database Connection is close!")
        if request.method=="DELETE":
            if validate_token()!=False:
                token=validate_token()
                userId=token['id']
                cnx=connection_pool()
                cursor = cnx.cursor()
                sql="DELETE FROM booking WHERE userId=%s"
                cursor.execute(sql, (userId,))
                cnx.commit()
                return jsonify({"ok":True}),200
            return jsonify({
                    "error":True,
                    "message":"未登入系統，拒絕存取"
                    }), 403
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"伺服器內部錯誤"
            }), 500
   