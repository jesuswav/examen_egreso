from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_mysqldb import MySQL, MySQLdb

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'admision_utcalvillo'

mysql = MySQL(app)

@app.route('/getUsers', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getUsers():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT usuarios.nombre, usuarios.usuario, carreras.nombre AS carrera, examenes.nombre AS examen
            FROM usuarios
            JOIN carreras ON usuarios.carrera_id = carreras.carrera_id
            JOIN examenes ON carreras.examen_id = examenes.id
        """)
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getUsers: ", e)
        return jsonify({"error": "Error en getUsers"})

@app.route('/getCarreras', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getCarreras():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT carreras.carrera_id, carreras.nombre, examenes.nombre AS examen
            FROM carreras
            JOIN examenes ON carreras.examen_id = examenes.id
        """)
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getCarreras: ", e)
        return jsonify({"error": "Error en getCarreras"})

@app.route('/registerUser', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def registerUser():
    try:
        data = request.json
        name = data.get('name')
        usuario = data.get('usuario')
        password = data.get('password')
        carrera_id = data.get('carrera_id')
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO usuarios (nombre, usuario, password, carrera_id) VALUES (%s, %s, %s, %s)", (name, usuario, password, carrera_id))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Usuario registrado exitosamente"})
    except Exception as e:
        print("Error en registerUser: ", e)
        return jsonify({"error": "Error en registerUser"})

@app.route('/getAuth', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def getAuth():
    try:
        data = request.get_json()
        usuario = data['usuario']
        password = data['password']
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM usuarios WHERE usuario = %s AND password = %s", (usuario, password))
        user = cur.fetchone()
        cur.close()
        if user:
            return jsonify(user)
        else:
            return jsonify({"error": "Usuario o contraseña inválidos"})
    except Exception as e:
        print("Error en getAuth: ", e)
        return jsonify({"error": "Error en getAuth"})

@app.route('/addPregunta', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def addPregunta():
    try:
        data = request.json
        pregunta = data.get('pregunta')
        respuesta1 = data.get('respuesta1')
        respuesta2 = data.get('respuesta2')
        respuesta3 = data.get('respuesta3')
        respuesta4 = data.get('respuesta4')
        respuesta_correcta = data.get('respuesta_correcta')
        id_modulo = data.get('id_modulo')
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO preguntas (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuesta_correcta, id_modulo) VALUES (%s, %s, %s, %s, %s, %s, %s)", (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuesta_correcta, id_modulo))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Pregunta agregada exitosamente"})
    except Exception as e:
        print("Error en addPregunta: ", e)
        return jsonify({"error": "Error en addPregunta"})

@app.route('/getPreguntas', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getPreguntas():
    try:
        id_modulo = request.args.get('id_modulo')
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        if id_modulo:
            cur.execute("""
                SELECT preguntas.id, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuesta_correcta, modulos.nombre AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.id_modulo = modulos.id
                WHERE preguntas.id_modulo = %s
            """, (id_modulo,))
        else:
            cur.execute("""
                SELECT preguntas.id, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuesta_correcta, modulos.nombre AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.id_modulo = modulos.id
            """)
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getPreguntas: ", e)
        return jsonify({"error": "Error en getPreguntas"})

@app.route('/getPreguntasModulo1', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getPreguntasModulo1():
    try:
        usuario_id = request.args.get('usuario_id')
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT preguntas.id, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuesta_correcta
            FROM preguntas
            JOIN modulos ON preguntas.id_modulo = modulos.id
            JOIN examenes_modulos ON modulos.id = examenes_modulos.modulo_id
            JOIN carreras ON examenes_modulos.examen_id = carreras.examen_id
            JOIN usuarios ON carreras.carrera_id = usuarios.carrera_id
            WHERE usuarios.id = %s AND modulos.nombre = 'Modulo 1'
        """, (usuario_id,))
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getPreguntasModulo1: ", e)
        return jsonify({"error": "Error en getPreguntasModulo1"})

@app.route('/deletePregunta/<int:id>', methods=['DELETE'])
@cross_origin(allow_headers=['Content-Type'])
def deletePregunta(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM preguntas WHERE id = %s", (id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Pregunta eliminada exitosamente"})
    except Exception as e:
        print("Error en deletePregunta: ", e)
        return jsonify({"error": "Error en deletePregunta"})
@app.route('/addModulo', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def addModulo():
    try:
        data = request.json
        nombre = data.get('nombre')
        examen_id = data.get('examen_id')
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO modulos (nombre) VALUES (%s)", (nombre,))
        modulo_id = cur.lastrowid
        cur.execute("INSERT INTO examenes_modulos (examen_id, modulo_id) VALUES (%s, %s)", (examen_id, modulo_id))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Módulo agregado exitosamente"})
    except Exception as e:
        print("Error en addModulo: ", e)
        return jsonify({"error": "Error en addModulo"})
@app.route('/getModulos', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getModulos():
    try:
        examen_id = request.args.get('examen_id')
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        if examen_id:
            cur.execute("""
                SELECT modulos.id, modulos.nombre
                FROM modulos
                JOIN examenes_modulos ON modulos.id = examenes_modulos.modulo_id
                WHERE examenes_modulos.examen_id = %s
            """, (examen_id,))
        else:
            cur.execute("SELECT * FROM modulos")
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getModulos: ", e)
        return jsonify({"error": "Error en getModulos"})   
@app.route('/getResultados', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getResultados():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT usuarios.nombre, carreras.nombre AS carrera, examenes.nombre AS examen, resultados.modulo1, resultados.modulo2, resultados.modulo3, resultados.modulo4, resultados.modulo5, resultados.puntuacion_total
            FROM resultados
            JOIN usuarios ON resultados.usuario_id = usuarios.id
            JOIN carreras ON usuarios.carrera_id = carreras.carrera_id
            JOIN examenes ON carreras.examen_id = examenes.id
        """)
        data = cur.fetchall()
        cur.close()

        # Transform data into the desired format
        resultados = []
        for row in data:
            resultado = {
                'nombre': row['nombre'],
                'carrera': row['carrera'],
                'examen': row['examen'],
                'puntuacion_total': row['puntuacion_total'],
                'modulos': [
                    {'nombre': 'Modulo 1', 'puntuacion': row['modulo1']},
                    {'nombre': 'Modulo 2', 'puntuacion': row['modulo2']},
                    {'nombre': 'Modulo 3', 'puntuacion': row['modulo3']},
                    {'nombre': 'Modulo 4', 'puntuacion': row['modulo4']},
                    {'nombre': 'Modulo 5', 'puntuacion': row['modulo5']}
                ]
            }
            resultados.append(resultado)

        return jsonify(resultados)
    except Exception as e:
        print("Error en getResultados: ", e)
        return jsonify({"error": "Error en getResultados"})
@app.route('/updatePregunta/<int:id>', methods=['PUT'])
@cross_origin(allow_headers=['Content-Type'])
def updatePregunta(id):
    try:
        data = request.json
        pregunta = data.get('pregunta')
        respuesta1 = data.get('respuesta1')
        respuesta2 = data.get('respuesta2')
        respuesta3 = data.get('respuesta3')
        respuesta4 = data.get('respuesta4')
        respuesta_correcta = data.get('respuesta_correcta')
        id_modulo = data.get('id_modulo')
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE preguntas
            SET pregunta = %s, respuesta1 = %s, respuesta2 = %s, respuesta3 = %s, respuesta4 = %s, respuesta_correcta = %s, id_modulo = %s
            WHERE id = %s
        """, (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuesta_correcta, id_modulo, id))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Pregunta actualizada exitosamente"})
    except Exception as e:
        print("Error en updatePregunta: ", e)
        return jsonify({"error": "Error en updatePregunta"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)