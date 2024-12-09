from flask import Flask ,jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


app = Flask(__name__)



# CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})
# CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"], "allow_headers": "*"}})
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"], "allow_headers": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


class Tasks(db.Model):
  
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime,default=datetime)
  entityName = db.Column(db.String(200), nullable=False)
  taskType = db.Column(db.String(100),nullable = False)
  time = db.Column(db.DateTime,default=datetime.now)
  contactPerson = db.Column(db.String(200), nullable=False)
  notes = db.Column(db.String(200), nullable=True)
  status = db.Column(db.String(200), default='Open')


# @app.route('/')
# def Home():
#   # task = Tasks.query.all()
#   return jsonify({task:'dsxfsc'})

@app.route('/')
def Home():
    tasks = Tasks.query.all()
    print('task',tasks)
    task_data = [task.to_dict() for task in tasks]
    return jsonify(task_data)

if __name__ == '__main__':
  app.run(debug=True,port=5172)
