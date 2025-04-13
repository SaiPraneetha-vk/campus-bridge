# from .queries.queries import student_insert
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    host="localhost",
    database="postgres",
    user="postgres",
    password="postgres123",
    port="5432"
)
cursor = conn.cursor()

@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        cursor.execute("INSERT INTO public.users (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, password))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({'error': 'Username or Email already exists'}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=False)