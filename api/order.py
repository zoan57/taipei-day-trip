import datetime, os, jwt,requests
from flask import *
from flask_bcrypt import Bcrypt
from mysql.connector import Error
from mysql.connector import pooling
from api.model import *
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()

order=Blueprint("order", __name__)
app=Flask(__name__)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True
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

@order.route("/orders", methods=["POST"])
def post_order():
        if request.method=="POST":
            cnx=connection_pool()
            cursor = cnx.cursor(dictionary=True)
            if validate_token()!=False:
                token=validate_token()
                now=datetime.now()
                current_time=now.strftime("%Y%m%d%H%M%S%f")
                user_id=token['id']
                order_number=str(current_time)+str(user_id)
                print(type(order_number))
                print(order_number)
                order_json=request.get_json()
                print(order_json['order'])
                if not order_json['order']:
                    return jsonify({
                        "error":True,
                        "message":"訂單建立失敗，輸入不正確或其他原因"
                        }), 400
                else:
                    # INSERT THE ORDER TO MySQL first
                    order_info=order_json['order']
                    
                    order_sql="""
                    INSERT INTO orderInfo (orderNumber, userId, attractionId, date, time, price, orderName, orderEmail, orderPhone) VALUE(%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    order_val=(order_number,user_id,order_info['trip']['attraction']['id'],order_info['trip']['date'],order_info['trip']['time'],order_info['price'],order_info['contact']['name'],order_info['contact']['email'],order_info['contact']['phone'])
                    cursor.execute(order_sql,order_val)
                    cnx.commit()
                    
                    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                    data = {
                        "prime": order_json['prime'],
                        "partner_key": os.getenv('partner_key'),
                        "merchant_id": os.getenv('merchant_ID'),
                        "details":"Taipei Day Trip Attraction Tour - Test version",
                        "amount": order_info['price'],
                        "cardholder": {
                            "phone_number": order_info['contact']['phone'],
                            "name": order_info['contact']['name'],
                            "email": order_info['contact']['email'],
                        },
                        "remember": True
                    }
                    Headers = {
                    "Content-Type": "application/json",
                    "x-api-key": os.getenv('partner_key')
                    }
                    tappay_res = requests.post(url, headers=Headers, json=data).json()
                    if tappay_res['status'] == 0:
                        status_sql="UPDATE orderInfo SET status = 0 WHERE orderNumber=%s"
                        cursor.execute(status_sql,(order_number,))
                        cnx.commit()
                        return jsonify({
                            "data": {
                                "number": order_number,
                                "payment": {
                                "status": 0,
                                "message": "付款成功"
                                }
                            }
                            }), 200
                    else:
                        return jsonify({
                            "data": {
                                "number": order_number,
                                "payment": {
                                "status": 0,
                                "message": "付款失敗"
                                }
                            }
                            }), 200
            else:
                return jsonify({
                        "error":True,
                        "message":"未登入系統，拒絕存取"
                        }), 403

        if (cnx.is_connected()):
            cursor.close()
            cnx.close()
            print("MySQL database Connection is close!")

@order.route("order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    try:
        if request.method=="GET":
            cnx=connection_pool()
            cursor = cnx.cursor(dictionary=True)
            if validate_token()!=False:
                order_sql="""
                SELECT 
                orderInfo.*,  
                attractions.name, attractions.address, 
                attractions_images.image FROM orderInfo 
                INNER JOIN attractions on orderInfo.attractionId = attractions.id 
                INNER JOIN attractions_images on orderInfo.attractionId = attractions_images.id
                WHERE orderInfo.orderNumber=%s;
                """
                cursor.execute(order_sql,(orderNumber,))
                data=cursor.fetchone()
                if data:
                    res={
                        "data": {
                            "number": orderNumber,
                            "price": data['price'],
                            "trip": {
                            "attraction": {
                                "id": data['attractionId'],
                                "name": data['name'],
                                "address": data['address'],
                                "image": data['image']
                            },
                            "date": data['date'],
                            "time": data['time']
                            },
                            "contact": {
                            "name": data['orderName'],
                            "email": data['orderEmail'],
                            "phone": data['orderPhone']
                            },
                            "status": data['status']
                        }
                        }
                    return jsonify(res),200
                else:
                    return jsonify({"data": None}), 200
        return jsonify({
                        "error":True,
                        "message":"未登入系統，拒絕存取"
                        }), 403
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"伺服器內部錯誤"
            }), 500