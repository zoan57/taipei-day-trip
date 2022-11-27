import json
from mysql.connector import Error
from mysql.connector import pooling

try:
    connection_pool = pooling.MySQLConnectionPool(pool_name="attraction_pool",
                                                  pool_size=5,
                                                  pool_reset_session=True,
                                                  host='localhost',
                                                  database='taipei_day_trip',
                                                  user='YOUR_SYSTEM_USER',
                                                  password='sggHiz3iJvVyfIUL')

    print("Printing connection pool properties ")
    print("Connection Pool Name - ", connection_pool.pool_name)
    print("Connection Pool Size - ", connection_pool.pool_size)

    # Get connection object from a pool
    connection_object = connection_pool.get_connection()

    if connection_object.is_connected():
        db_Info = connection_object.get_server_info()
        print("Connected to MySQL database using connection pool ... MySQL Server version on ", db_Info)
        cursor = connection_object.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("Your connected to - ", record)
        with open('./data/taipei-attractions.json', encoding='utf-8') as jsonfile:
          data = json.load(jsonfile)
          output = data["result"]["results"]
          for i in range(len(output)):
              # data in TABLE attractions
              name = output[i]["name"]
              category = output[i]["CAT"]
              description = output[i]["description"]
              address = output[i]["address"]
              transport = output[i]["direction"]
              mrt = output[i]["MRT"]
              lat = output[i]["latitude"]
              lng = output[i]["longitude"]
              img = []
              delimiter = "https"

              # data in TABLE attractions_images (store all images)
              images = [delimiter+x for x in output[i]["file"].split(delimiter) if x]
              for j in range(len(images)):
                  if "jpg" in images[j] or "JPG" in images[j] or "PNG" in images[j] or "png" in images[j]:
                      img.append(images[j])  # 若直接提取所有images的list

                      # Mysql execute process: insert into TABLE attractions_images
                      query_string = 'INSERT INTO attractions_images (image, attraction_id) VALUES (%s, %s)'
                      var_string = (images[j], i+1)
                      cursor.execute(query_string, var_string)
                      connection_object.commit()

              # Mysql execute process: insert into TABLE attractions
              insert_req = "INSERT INTO attractions (name, category, description, address, transport, mrt, latitude, longitude) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
              insert_data = (name, category, description,
                            address, transport, mrt, lat, lng)
              cursor.execute(insert_req, insert_data)
              connection_object.commit()

except Error as e:
    print("Error while connecting to MySQL using Connection pool ", e)
finally:
    cursor.close()
    connection_object.close()
    print("MySQL connection is closed")
