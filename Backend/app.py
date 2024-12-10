from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

CORS(app, resources={r"/*": {"origins": ["https://issuetracker-kwar5j1bs-adarsh-pandeys-projects-b829a453.vercel.app"], "allow_headers": "*"}})

class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    taskName = db.Column(db.String(200), nullable=False)
    contactMedium = db.Column(db.String(100), nullable=False)
    time = db.Column(db.Time, nullable=False)
    contactPerson = db.Column(db.String(200), nullable=False)
    contact = db.Column(db.String(15), nullable=True)
    note = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(200), default='Open')

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date.strftime("%Y-%m-%d"),
            "taskName": self.taskName,
            "contactMedium": self.contactMedium,
            "time": self.time.strftime("%H:%M"),
            "contactPerson": self.contactPerson,
            "note": self.note,
            "status": self.status,
            "contact": self.contact,
        }

@app.route('/', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        data = request.get_json()
        print('Received date:', data['date'], 'Received time:', data['time'])
        
        # Convert date and time formats
        try:
            modifiedDate = datetime.strptime(data['date'], "%Y-%m-%d").date()
            modifiedTime = datetime.strptime(data['time'], "%H:%M").time()

            task = Tasks(
                date=modifiedDate,
                taskName=data['taskName'],
                contactMedium=data['contactMedium'],
                contactPerson=data['contactPerson'],
                contact=data['contact'],
                time=modifiedTime,
                note=data['note'],
                status='Open'
            )

            db.session.add(task)
            db.session.commit()
            return jsonify(message="Task added successfully"), 201
        except ValueError as e:
            print(f"Error parsing date or time: {e}")
            return jsonify(message="Invalid date or time format"), 400
    else:
        tasks = Tasks.query.all()
        tasks_list = [task.to_dict() for task in tasks]
        return jsonify(tasks=tasks_list)

@app.route('/edit', methods=['POST'])
def edit():
    data = request.get_json()  # Get JSON data from request
    print(f"Received data for editing task: {data}")

    if not data.get('id'):
        return jsonify(message="Missing task ID"), 400

    task = Tasks.query.get_or_404(data['id'])  # Get task by ID or return 404 if not found
    print(f"Editing task with ID: {task.id}")

    # Update the task fields
    task.taskName = data.get('taskName', task.taskName)
    task.contactMedium = data.get('contactMedium', task.contactMedium)
    task.contactPerson = data.get('contactPerson', task.contactPerson)
    task.note = data.get('note', task.note)
    task.status = data.get('status', task.status)

    # If date and time are provided, update them
    if 'date' in data:
        try:
            task.date = datetime.strptime(data['date'], "%Y-%m-%d").date()  # Date format: YYYY-MM-DD
        except ValueError:
            return jsonify(message="Invalid date format. Use YYYY-MM-DD"), 400

    if 'time' in data:
        try:
            task.time = datetime.strptime(data['time'], "%H:%M").time()  # Time format: HH:MM
        except ValueError:
            return jsonify(message="Invalid time format. Use HH:MM"), 400

    db.session.commit()
    return jsonify(message="Task updated successfully"), 200

def create_tables():
    db.create_all()  # Creates the database tables based on your models

if __name__ == '__main__':
    app.r un(debug=True, port=8080)
