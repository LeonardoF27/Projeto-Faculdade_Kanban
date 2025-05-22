from functools import wraps
from flask import Flask, flash, render_template, request, redirect, session, jsonify, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key = "kanban_app"

#inicia e cria um banco de dados caso ele não exista    
def init_db():
    with sqlite3.connect('database.db') as db:
        db_cursor= db.cursor()
        db_cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_login (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        db_cursor.execute('''
        CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                owner TEXT,
                deadline TEXT,
                status TEXT,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES user_login(id)
            )
        ''')

def login_required(f):
    @wraps(f)
    def login_analyzer(*args, **kwargs):
        if 'user_id' not in session:
            flash('Você precisa estar logado para acessar essa página.')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return login_analyzer
        
@app.route('/')
def index():
    if 'user_login' in session:
        return redirect(url_for('kanban'))
    return redirect(url_for('login'))

# página de registro
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # recebem o email e a senha, transformando ela em um hash
        email = request.form['email']
        password = request.form['password']
        hash_password = generate_password_hash(password)

        try:
            # conecta no banco de dados e insere as informações tanto da senha quanto do email no banco de dados
            with sqlite3.connect("database.db") as db:
                db.execute("INSERT INTO user_login (email, password) VALUES (?, ?)", (email, hash_password))
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            return "Email já registrado!"
    
    return render_template('register.html')



# página de login
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        db = sqlite3.connect("database.db")
        db.row_factory = sqlite3.Row
        db_cursor = db.cursor()
        db_cursor.execute("SELECT * FROM user_login WHERE email=?", (email,))
        user = db_cursor.fetchone()
        db.close()
        
        # caso o login esteja correto, ele envia diretamente para a página da aplicação
        if user and check_password_hash(user['password'], password):
            
            #ele salva a sessão do usuário e redireciona para a aplicação
            session["user_id"] = user['id']
            session["user_email"] = user["email"]
            return redirect(url_for('kanban'))
        else:
            flash("Email ou Senha inválidos.")

    return render_template('login.html')  
    


@app.route('/kanban')
@login_required
def kanban():   
    if 'user_id' not in session:
        return redirect(url_for('register'))
    return render_template('kanban.html')

@app.route('/kanban/tarefas', methods=['POST'])
@login_required
def create_tasks():
    data = request.json
    db = sqlite3.connect("database.db")
    d = db.cursor()
    d.execute()



if __name__ == "__main__":
    init_db()
    app.run(debug=True)