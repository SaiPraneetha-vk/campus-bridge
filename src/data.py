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
    print("Received JSON:", data)

    username = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([username, email, password, role]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        cursor.execute("INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
                       (username, email, password, role))
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({'error': 'Username or Email already exists'}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['GET'])
def login_user():
    print("request.args",request.args)
    name = request.args.get('name')
    password = request.args.get('password')
    role = request.args.get('role')

    if not all([name, password, role]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        cur = conn.cursor()

        query = """
            SELECT * FROM users
            WHERE username = %s AND password = %s AND role = %s
        """
        
        print(f"Query parameters: name={name}, password=******, role={role}")
        cur.execute(query, (name, password, role))
        user = cur.fetchone()

        cur.close()

        if user:
            return jsonify({'message': 'Login successful'})
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print("Error during login:", e)
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
