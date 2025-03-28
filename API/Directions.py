from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
#from flask_mysqldb import MySQL, MySQLdb
import pymysql
from collections import defaultdict

import csv
import io

app = Flask(__name__)
CORS(app)

#app.config['MYSQL_HOST'] = 'localhost'
#app.config['MYSQL_USER'] = 'root'
#app.config['MYSQL_PASSWORD'] = ''
#app.config['MYSQL_DB'] = 'admision_utcalvillo'

#mysql = MySQL(app)

# Configurar conexión manualmente
"""db = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="examen_egreso",
    cursorclass=pymysql.cursors.DictCursor
)"""

def execute_query(query, params=None):
    try:
        db = pymysql.connect(
            host="localhost",
            user="root",
            password="",
            database="examen_egreso",
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = db.cursor()
        cursor.execute(query, params or ())
        resultado = cursor.fetchall()
        db.commit()  # Confirmar cambios si es una consulta de escritura
        return resultado
    except pymysql.MySQLError as e:
        print(f"Error en la consulta: {e}")
        return None
    finally:
        cursor.close()
        db.close()  # Asegurar que siempre cerramos la conexión

@app.route('/getUsers', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getUsers():
    try:
        result = execute_query("""
            SELECT usuarios.idUsuario, usuarios.nombre, usuarios.usuario, roles.rol, carreras.carrera
            FROM usuarios
            JOIN roles ON usuarios.rol = roles.idRol
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
        """)
        return jsonify(result)
    except Exception as e:
        print("Error en getUsers: ", e)
        return jsonify({"error": "Error en getUsers"})
        

@app.route('/getCarreras', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getCarreras():
    try:
        carreras = execute_query("SELECT idCarrera, carrera FROM carreras")
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
        ## ejecutar la consulta
        execute_query("INSERT INTO usuarios (nombre, usuario, password, rol, idCarrera) VALUES (%s, %s, %s, %s, %s)", (nombre, usuario, password, rol, idCarrera))
        
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
        ## ejecutar la consulta
        user = execute_query("SELECT * FROM usuarios WHERE usuario = %s AND password = %s", (usuario, password))

        if user:
            return user[0]
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
        print('-----------', data)
        pregunta = data.get('pregunta')
        respuesta1 = data.get('respuesta1')
        respuesta2 = data.get('respuesta2')
        respuesta3 = data.get('respuesta3')
        respuesta4 = data.get('respuesta4')
        respuesta_correcta = data.get('respuestaCorrecta')
        id_modulo = data.get('idModulo')
        # ejecutar consulta
        execute_query("INSERT INTO preguntas (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, idModulo) VALUES (%s, %s, %s, %s, %s, %s, %s)", (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuesta_correcta, id_modulo))

        return jsonify({"message": "Pregunta agregada exitosamente"})
    except Exception as e:
        print("Error en addPregunta: ", e)
        return jsonify({"error": "Error en addPregunta"})
        

@app.route('/getPreguntas', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getPreguntas():
    try:
        idModulo = request.args.get('id_modulo')

        # ejecutar consulta
        if idModulo:
            result = execute_query("""
                SELECT preguntas.idPregunta, preguntas.isPreguntaAbierta, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuestaCorrecta, modulos.modulo AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.idModulo = modulos.idModulo
                WHERE preguntas.idModulo = %s
            """, (idModulo,))
        else:
            result = execute_query("""
                SELECT preguntas.idPregunta, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuestaCorrecta, modulos.modulo AS modulo
                FROM preguntas
                JOIN modulos ON preguntas.idModulo = modulos.idModulo
            """)
            print('Hola')

        response = []

        for pregunta in result:
            opciones = [
                {"idOpcion": 1, "texto": pregunta['respuesta1'], "value": "a"}, 
                {"idOpcion": 2, "texto": pregunta['respuesta2'], "value": "b"}, 
                {"idOpcion": 3, "texto": pregunta['respuesta3'], "value": "c"}, 
                {"idOpcion": 4, "texto": pregunta['respuesta4'], "value": "d"}]
            print(opciones)
            response.append({
                "idPregunta": pregunta['idPregunta'],
                "isPreguntaAbierta": pregunta['isPreguntaAbierta'],
                "pregunta": pregunta['pregunta'],
                "opciones": opciones,
                "respuestaCorrecta": pregunta['respuestaCorrecta'],
                "modulo": pregunta['modulo']
            })
         
        
        return jsonify(response)
    except Exception as e:
        print("Error en getPreguntas: ", e)
        return jsonify({"error": "Error en getPreguntas"})
        

@app.route('/getPreguntasModulo1', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getPreguntasModulo1():
    try:
        usuario_id = request.args.get('usuario_id')
        # ejecutar consulta
        result = execute_query("""
            SELECT preguntas.id, preguntas.pregunta, preguntas.respuesta1, preguntas.respuesta2, preguntas.respuesta3, preguntas.respuesta4, preguntas.respuesta_correcta
            FROM preguntas
            JOIN modulos ON preguntas.id_modulo = modulos.id
            JOIN examenes_modulos ON modulos.id = examenes_modulos.modulo_id
            JOIN carreras ON examenes_modulos.examen_id = carreras.examen_id
            JOIN usuarios ON carreras.carrera_id = usuarios.carrera_id
            WHERE usuarios.id = %s AND modulos.nombre = 'Modulo 1'
        """, (usuario_id,))
        return jsonify(result)
    except Exception as e:
        print("Error en getPreguntasModulo1: ", e)
        return jsonify({"error": "Error en getPreguntasModulo1"})
      
      
@app.route('/addModulo', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def addModulo():
    try:
        data = request.json
        nombre = data.get('nombre')
        examen_id = data.get('examen_id')

        execute_query("INSERT INTO modulos (nombre) VALUES (%s)", (nombre,))
        execute_query("INSERT INTO examenes_modulos (examen_id, modulo_id) VALUES (%s, %s)", (examen_id, modulo_id))
        
        return jsonify({"message": "Módulo agregado exitosamente"})
    except Exception as e:
        print("Error en addModulo: ", e)
        return jsonify({"error": "Error en addModulo"})
        

@app.route('/getModulos', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getModulos():
    try:
        examen_id = request.args.get('examen_id')
        # ejecutar la consulta
        if examen_id:
            result = execute_query("""
                SELECT modulos.id, modulos.nombre
                FROM modulos
                JOIN examenes_modulos ON modulos.id = examenes_modulos.modulo_id
                WHERE examenes_modulos.examen_id = %s
            """, (examen_id,))
        else:
            result = execute_query("SELECT * FROM modulos")
        return jsonify(result)
    except Exception as e:
        print("Error en getModulos: ", e)
        return jsonify({"error": "Error en getModulos"})   
        

@app.route('/getResultados', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getResultados():
    try:
        data = execute_query("""
            SELECT usuarios.nombre, carreras.nombre AS carrera, examenes.nombre AS examen, resultados.modulo1, resultados.modulo2, resultados.modulo3, resultados.modulo4, resultados.modulo5, resultados.puntuacion_total
            FROM resultados
            JOIN usuarios ON resultados.idUsuario = usuarios.idUsuario
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
        """)
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
        ## Ejecutar consulta
        execute_query("""
            UPDATE preguntas
            SET pregunta = %s, respuesta1 = %s, respuesta2 = %s, respuesta3 = %s, respuesta4 = %s, respuesta_correcta = %s, id_modulo = %s
            WHERE id = %s
        """, (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuesta_correcta, id_modulo, id))
        
        return jsonify({"message": "Pregunta actualizada exitosamente"})
    except Exception as e:
        print("Error en updatePregunta: ", e)
        return jsonify({"error": "Error en updatePregunta"})
        

@app.route('/getRoles', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getRoles():
    try:
        roles = execute_query("SELECT idRol, rol FROM roles")
        return jsonify(roles)
    except Exception as e:
        print("Error en getRoles: ", e)
        return jsonify({"error": "Error en getRoles"})
        

@app.route('/getAlumnosPorCarrera', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getAlumnosPorCarrera():
    try:
        result = execute_query("""
            SELECT carreras.carrera, COUNT(usuarios.idUsuario) as cantidad
            FROM usuarios
            JOIN carreras ON usuarios.idCarrera = carreras.idCarrera
            WHERE carreras.carrera != 'admin'
            GROUP BY carreras.carrera
        """)
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
        ## ejecutar consulta
        execute_query("""
            UPDATE preguntas
            SET pregunta = %s, respuesta1 = %s, respuesta2 = %s, respuesta3 = %s, respuesta4 = %s, respuestaCorrecta = %s, idModulo = %s
            WHERE idPregunta = %s
        """, (pregunta, respuesta1, respuesta2, respuesta3, respuesta4, respuestaCorrecta, idModulo, idPregunta))
        return jsonify({"message": "Pregunta actualizada exitosamente"})
    except Exception as e:
        print("Error en editPregunta: ", e)
        return jsonify({"error": "Error en editPregunta"})

@app.route('/deletePregunta/<int:idPregunta>', methods=['DELETE'])
@cross_origin(allow_headers=['Content-Type'])
def deletePregunta(idPregunta):
    try:
        execute_query("DELETE FROM preguntas WHERE idPregunta = %s", (idPregunta,))
        return jsonify({"message": "Pregunta eliminada exitosamente"})
    except Exception as e:
        print("Error en deletePregunta: ", e)
        return jsonify({"error": "Error en deletePregunta"})

@app.route('/deleteModulo/<int:idModulo>', methods=['DELETE'])
@cross_origin(allow_headers=['Content-Type'])
def deleteModulo(idModulo):
    try:
        execute_query("DELETE FROM modulos WHERE idModulo = %s", (idModulo,))
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
        execute_query("UPDATE modulos SET modulo = %s WHERE idModulo = %s", (modulo, idModulo))
        return jsonify({"message": "Módulo actualizado exitosamente"})
    except Exception as e:
        print("Error en editModulo: ", e)
        return jsonify({"error": "Error en editModulo"})

      
## endpoint para crear un examen
@app.route('/getExamen/<int:idExamen>', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getExamen(idExamen):
    try:
        examen = execute_query("""
            SELECT 
                modulos.*,
                examen.*
            FROM modulos 
            JOIN examenModulo ON modulos.idModulo = examenModulo.moduloId
            JOIN examen ON examenModulo.examenId = examen.idExamen
            WHERE examenModulo.examenId = %s;""", (idExamen))
        
        print(examen)
        return jsonify(examen)
    except Exception as e:
        print("Error en editModulo: ", e)
        return jsonify({"error": "Error en getExamen"})
    
## endpoint para crear un examen
@app.route('/getInfoExamen/<int:idExamen>', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getInfoExamen(idExamen):
    try:
        query = execute_query("""
            SELECT 
                modulos.*,
                examen.*
            FROM modulos 
            JOIN examenModulo ON modulos.idModulo = examenModulo.moduloId
            JOIN examen ON examenModulo.examenId = examen.idExamen
            WHERE examenModulo.examenId = %s;""", (idExamen))
        
        # diccionario para la respuesta
        infoExamen = {
            "idExamen": 0,
            "nombre": '',
            "descripcion": '', 
            "modulos": [],
        }
        
        for item in query:
            infoExamen['idExamen'] = item['idExamen']
            infoExamen['nombre'] = item['nombre']
            infoExamen['descripcion'] = item['descripcion']
            infoExamen['modulos'].append({ 'idModulo': item['idModulo'], 'nombreModulo': item['modulo'] })
        print('------------------')
        print(infoExamen)
        return jsonify(infoExamen)
    except Exception as e:
        print("Error en getInfoExamen: ", e)
        return jsonify({"error": "Error en getInfoExamen"})
    
@app.route('/saveAnswers', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def saveAnswers():
    try:
        data = request.json

        for respuesta in data:
            print(f"Pregunta: {respuesta['idPregunta']}")
            if respuesta['respuesta'] == "A" or respuesta['respuesta'] == "B" or respuesta['respuesta'] == 'C' or respuesta['respuesta'] == 'D':
                print('Holaaaa')
                execute_query("""
                INSERT INTO respuestasEstudiantes (idUsuario, idPregunta, idModulo, respuestaCerrada)
                    VALUES (%s, %s, %s, %s);
                """, (respuesta['idUsuario'], respuesta['idPregunta'], respuesta['idModulo'], respuesta['respuesta']))
            else:
                execute_query("""
                INSERT INTO respuestasEstudiantes (idUsuario, idPregunta, idModulo, respuestaAbierta)
                    VALUES (%s, %s, %s, %s);
                """, (respuesta['idUsuario'], respuesta['idPregunta'], respuesta['idModulo'], respuesta['respuesta']))

        return jsonify({"message": "Respuestas guardadas exitosamente"})
    except Exception as e:
        print("Error en editModulo: ", e)
        return jsonify({"error": "Error en saveAnswers"})
      
      
@app.route('/assignExamen', methods=['POST'])
@cross_origin(allow_headers=['Content-Type'])
def assignExamen():
    try:
        data = request.json
        idCarrera = data.get('idCarrera')
        idModulo1 = data.get('idModulo1')
        idModulo2 = data.get('idModulo2')
        idModulo3 = data.get('idModulo3')
        idModulo4 = data.get('idModulo4')
        idModulo5 = data.get('idModulo5')
        
        execute_query("""
            INSERT INTO examen (idCarrera, idModulo1, idModulo2, idModulo3, idModulo4, idModulo5)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (idCarrera, idModulo1, idModulo2, idModulo3, idModulo4, idModulo5))
        
        return jsonify({"message": "Examen asignado correctamente"})
    except Exception as e:
        print("Error en assignExamen: ", e)
        return jsonify({"error": "Error en assignExamen"})

@app.route('/getExamenDetails/<int:idExamen>', methods=['GET'])
@cross_origin(allow_headers=['Content-Type'])
def getExamenDetails(idExamen):
    try:
        result = execute_query("""
            SELECT e.idExamen, c.carrera, m1.modulo as modulo1Nombre, m2.modulo as modulo2Nombre, 
                   m3.modulo as modulo3Nombre, m4.modulo as modulo4Nombre, m5.modulo as modulo5Nombre
            FROM examen e
            JOIN carreras c ON e.idCarrera = c.idCarrera
            JOIN modulos m1 ON e.idModulo1 = m1.idModulo
            JOIN modulos m2 ON e.idModulo2 = m2.idModulo
            JOIN modulos m3 ON e.idModulo3 = m3.idModulo
            JOIN modulos m4 ON e.idModulo4 = m4.idModulo
            JOIN modulos m5 ON e.idModulo5 = m5.idModulo
            WHERE e.idExamen = %s
        """, (idExamen))
        return jsonify(result)
    except Exception as e:
        print("Error en getExamenDetails: ", e)
        return jsonify({"error": "Error en getExamenDetails"})




if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3200, debug=True)

""" 
CREATE TABLE examen (
    idExamen INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

"""