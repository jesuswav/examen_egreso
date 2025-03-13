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
            SELECT usuarios.idUsuario, usuarios.nombre, usuarios.usuario, roles.rol, carreras.carrera
            FROM usuarios
            JOIN roles ON usuarios.rol = roles.idRol
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
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
        cur.execute("SELECT idCarrera, carrera FROM carreras")
        carreras = cur.fetchall()
        cur.close()
        return jsonify(carreras)
    except Exception as e:
        print("Error en getCarreras: ", e)
        return jsonify({"error": "Error en getCarreras"})

@app.route('/registerUser', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def registerUser():
    try:
        data = request.json
        nombre = data.get('nombre')
        usuario = data.get('usuario')
        password = data.get('password')
        rol = data.get('rol')
        idCarrera = data.get('idCarrera')
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO usuarios (nombre, usuario, password, rol, idCarrera) VALUES (%s, %s, %s, %s, %s)", (nombre, usuario, password, rol, idCarrera))
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
        respuestaCorrecta = data.get('respuestaCorrecta')
        idModulo = data.get('idModulo')
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO preguntas (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, idModulo)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, idModulo))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Pregunta registrada exitosamente"})
    except Exception as e:
        print("Error en addPregunta: ", e)
        return jsonify({"error": "Error en addPregunta"})

@app.route('/getPreguntas', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getPreguntas():
    try:
        idModulo = request.args.get('idModulo')
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        if idModulo:
            cur.execute("""
                SELECT preguntas.idPregunta, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuestaCorrecta, modulos.modulo AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.idModulo = modulos.idModulo
                WHERE preguntas.idModulo = %s
            """, (idModulo,))
        else:
            cur.execute("""
                SELECT preguntas.idPregunta, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuestaCorrecta, modulos.modulo AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.idModulo = modulos.idModulo
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

@app.route('/addModulo', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def addModulo():
    try:
        data = request.json
        modulo = data.get('modulo')
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO modulos (modulo) VALUES (%s)", (modulo,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Módulo registrado exitosamente"})
    except Exception as e:
        print("Error en addModulo: ", e)
        return jsonify({"error": "Error en addModulo"})

@app.route('/getModulos', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getModulos():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT idModulo, modulo FROM modulos")
        modulos = cur.fetchall()
        cur.close()
        return jsonify(modulos)
    except Exception as e:
        print("Error en getModulos: ", e)
        return jsonify({"error": "Error en getModulos"})   

@app.route('/getResultados', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getResultados():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT usuarios.nombre, carreras.carrera, resultados.modulo1Res, resultados.modulo2Res, resultados.modulo3Res, resultados.modulo4Res, resultados.modulo5Res, resultados.resultadoFinal
            FROM resultados
            JOIN usuarios ON resultados.idUsuario = usuarios.idUsuario
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
        """)
        resultados = cur.fetchall()
        cur.close()
        return jsonify(resultados)
    except Exception as e:
        print("Error en getResultados: ", e)
        return jsonify({"error": "Error en getResultados"})

@app.route('/getRoles', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getRoles():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT idRol, rol FROM roles")
        roles = cur.fetchall()
        cur.close()
        return jsonify(roles)
    except Exception as e:
        print("Error en getRoles: ", e)
        return jsonify({"error": "Error en getRoles"})

@app.route('/getAlumnosPorCarrera', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getAlumnosPorCarrera():
    try:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("""
            SELECT carreras.carrera, COUNT(usuarios.idUsuario) as cantidad
            FROM usuarios
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
            WHERE carreras.carrera != 'admin'
            GROUP BY carreras.carrera
        """)
        result = cur.fetchall()
        cur.close()
        return jsonify(result)
    except Exception as e:
        print("Error en getAlumnosPorCarrera: ", e)
        return jsonify({"error": "Error en getAlumnosPorCarrera"})

@app.route('/editPregunta', methods=['PUT'])
@cross_origin(allow_headers=['Content-Type'])
def editPregunta():
    try:
        data = request.json
        idPregunta = data.get('idPregunta')
        pregunta = data.get('pregunta')
        respuesta1 = data.get('respuesta1')
        respuesta2 = data.get('respuesta2')
        respuesta3 = data.get('respuesta3')
        respuesta4 = data.get('respuesta4')
        respuestaCorrecta = data.get('respuestaCorrecta')
        idModulo = data.get('idModulo')
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE preguntas
            SET pregunta = %s, respuesta1 = %s, respuesta2 = %s, respuesta3 = %s, respuesta4 = %s, respuestaCorrecta = %s, idModulo = %s
            WHERE idPregunta = %s
        """, (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, idModulo, idPregunta))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Pregunta actualizada exitosamente"})
    except Exception as e:
        print("Error en editPregunta: ", e)
        return jsonify({"error": "Error en editPregunta"})

@app.route('/deletePregunta/<int:idPregunta>', methods=['DELETE'])
@cross_origin(allow_headers=['Content-Type'])
def deletePregunta(idPregunta):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM preguntas WHERE idPregunta = %s", (idPregunta,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Pregunta eliminada exitosamente"})
    except Exception as e:
        print("Error en deletePregunta: ", e)
        return jsonify({"error": "Error en deletePregunta"})

@app.route('/deleteModulo/<int:idModulo>', methods=['DELETE'])
@cross_origin(allow_headers=['Content-Type'])
def deleteModulo(idModulo):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM modulos WHERE idModulo = %s", (idModulo,))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Módulo eliminado exitosamente"})
    except Exception as e:
        print("Error en deleteModulo: ", e)
        return jsonify({"error": "Error en deleteModulo"})

@app.route('/editModulo', methods=['PUT'])
@cross_origin(allow_headers=['Content-Type'])
def editModulo():
    try:
        data = request.json
        idModulo = data.get('idModulo')
        modulo = data.get('modulo')
        cur = mysql.connection.cursor()
        cur.execute("UPDATE modulos SET modulo = %s WHERE idModulo = %s", (modulo, idModulo))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Módulo actualizado exitosamente"})
    except Exception as e:
        print("Error en editModulo: ", e)
        return jsonify({"error": "Error en editModulo"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)