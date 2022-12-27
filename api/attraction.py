from flask import *
from mysql.connector import Error
from mysql.connector import pooling
from data.EC2MySQL import *

attraction=Blueprint("attraction", __name__)

# Set Connection Pool
def connection_pool():
    connection_pool = pooling.MySQLConnectionPool(pool_name="attraction_pool",
                                                  pool_size=5,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='taipei_day_trip',
                                                  user=EC2MyUser(),
                                                  password=EC2MySQLpassword())

    print("Printing connection pool properties ")
    print("Connection Pool Name - ", connection_pool.pool_name)
    print("Connection Pool Size - ", connection_pool.pool_size)

    # Get connection object from a pool
    connection_object = connection_pool.get_connection()

    return connection_object

        
# API_attractions - Get all or sorted attractions data.
@attraction.route("/attractions")
def api_get_attractions():
    try:
        cnx= connection_pool()
        cursor = cnx.cursor()
        image_req="SELECT attractions.id, image FROM attractions INNER JOIN attractions_images ON attractions.id=attractions_images.attraction_id ORDER BY attractions.id"
        cursor.execute(image_req)
        image_list=cursor.fetchall()
        nextPage= request.args.get('page', 0, type=int)
        if nextPage >0:
            nextPage+=1
        per_rows=int(12)
        count=(nextPage-1)*per_rows
        if count < 0:
            count=0
        print(nextPage)
        kyw= request.args.get('keyword')
        data=[]
        # GET fuzzy search results
        if kyw == None:
            sql_req="SELECT id, name, category, description, address, transport, mrt, latitude, longitude FROM attractions ORDER BY id LIMIT %s,%s"
            val=(count, per_rows)
        else:
            sql_req="SELECT * FROM attractions WHERE category=%s OR LOCATE(%s, name)>0 limit %s,%s"
            val=(kyw, kyw, count, per_rows)
        cursor.execute(sql_req, val)
        sql_result=cursor.fetchall()
            
        for i in range(len(sql_result)):
            id=sql_result[i][0]
            name=sql_result[i][1]
            cat=sql_result[i][2]
            descr=sql_result[i][3]
            addr=sql_result[i][4]
            trans=sql_result[i][5]
            mrt=sql_result[i][6]
            lat=sql_result[i][7]
            lng=sql_result[i][8]
            images=[]
            for x in range(len(image_list)):
                if image_list[x][0]==id:
                    images.append(image_list[x][1])
            single_data={
                "id":id, 
                "name":name,
                "category":cat,
                "description":descr,
                "address":addr,
                "transport":trans,
                "mrt":mrt,
                "lat":lat,
                "lng":lng,
                "images":images}
            data.append(single_data)
        
        #Return results
        if nextPage == 0:
            result={
                "nextPage":nextPage+1,
                "data":data
            }
        elif nextPage >0:
            result={
                "nextPage":nextPage,
                "data":data
            }
        if data==[] or len(data) < 12:
            result={
                "nextPage":None,
                "data":data
            }
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"請按照情境提供對應的錯誤訊息"
            })
    finally:
            cursor.close()
            cnx.close()   

# API_attraction_id - GET attractions by id
@attraction.route("/attraction/<int:attractionId>")
def api_get_attraction_id(attractionId):
    try:
        cnx=connection_pool()
        cursor = cnx.cursor(dictionary=True)
        sql_id_req="SELECT * FROM attractions WHERE id = %s"
        cursor.execute(sql_id_req, (attractionId,))
        result=cursor.fetchone()
        
        image_req="SELECT attractions.id, image FROM attractions INNER JOIN attractions_images ON attractions.id=attractions_images.attraction_id WHERE attractions.id = %s"
        cursor.execute(image_req, (attractionId,))
        image_list=cursor.fetchall()
        images=[]
        for i in image_list:
            images.append(i["image"])
        
        data={
            "id":result["id"],
            "name":result["name"],
            "category":result["category"],
            "description":result["description"],
            "address":result["address"],
            "transport":result["transport"],
            "mrt":result["mrt"],
            "lat":result["latitude"],
            "lng":result["longitude"],
            "images":images
        }
        id_data=jsonify({
            "data":data
        })
        if attractionId == result["id"]:
            return id_data

    except Exception as e:
        return jsonify({
            "error":True,
            "message":"請按照情境提供對應的錯誤訊息"
            })
    finally:
            cursor.close()
            cnx.close() 

# API_category - GET all categories
@attraction.route("/categories")
def api_get_category():
    try:
        cnx=connection_pool()
        cursor=cnx.cursor()
        cat_req="SELECT distinct category FROM attractions"
        cursor.execute(cat_req)
        cat_result=cursor.fetchall()
        cat_data=[]
        for i in cat_result:
            cat_data.append(str(i[0]))
            print(i[0])
        return jsonify({"data":cat_data})
    
    except Exception as e:
        return jsonify({
            "error":True,
            "message":"請按照情境提供對應的錯誤訊息"
            })
    finally:
            cursor.close()
            cnx.close() 