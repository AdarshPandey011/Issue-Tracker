import React, { useState, useEffect } from "react";
import "../src/taskModel.css"; // Include CSS for modal styling
import { editTask } from "../Api/editTask";

function TaskModal({ isOpen, closeModal, addTask, initialData, setSelectHandler }) {
  const [task, setTask] = useState({
    taskName: "",
    date: "",
    time: "",
    contact: "",
    contactMedium: "Call",
    contactPerson: "",
    note: "",
    status: "Open",
  });

  // Populate the modal with initialData if editing
  useEffect(() => {
    if (initialData) {
      setTask({
        taskName: initialData.taskName || "",
        date: initialData.date || "",
        time: initialData.time || "",
        contact: initialData.contact || "",
        contactMedium: initialData.contactMedium || "Call",
        contactPerson: initialData.contactPerson || "",
        note: initialData.note || "",
        status: initialData.status || "Open",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Convert date to YYYY-MM-DD format before sending to backend
    const formattedDate = new Date(task.date).toISOString().split('T')[0]; // Converts to YYYY-MM-DD
    const formattedTime = task.time;  // Time should already be in HH:MM format
  
    const taskToSend = { ...task, date: formattedDate, time: formattedTime };
  
    if (initialData) {
      // Edit task logic
      const updatedTask = { ...taskToSend, id: initialData.id, status: initialData.status }; // Preserve ID and status
      addTask(updatedTask, true); // Pass `true` to indicate an edited task
      editTask(updatedTask); // Send edit request to API
      closeModal();
      setSelectHandler(""); // Reset selectHandler

    } else {
      // New task logic
      fetch("https://issuetracker-igbb7eeot-adarsh-pandeys-projects-b829a453.vercel.app/?vercelToolbarCode=8TqFpDxewpNMSR3/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          addTask(taskToSend); // Add new task
          closeModal();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? "Edit Task" : "Create New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="modalInput"
            type="text"
            name="taskName"
            value={task.taskName}
            onChange={handleChange}
            placeholder="Enter Task Name"
            required
          />
          <div className="dateTime">
            <input
              className="modalInput"
              type="date"
              name="date"
              value={task.date}
              onChange={handleChange}
              required
            />
            <input
              className="modalInput"
              type="time"
              name="time"
              value={task.time}
              onChange={handleChange}
              required
            />
          </div>

          <select
            className="modalInput"
            name="contactMedium"
            value={task.contactMedium}
            onChange={handleChange}
            required
          >
            <option value="Call">Call</option>
            <option value="Meeting">Meeting</option>
            <option value="Video Call">Video Call</option>
          </select>

          <input
            className="modalInput"
            type="text"
            name="contact"
            value={task.contact}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <input
            className="modalInput"
            type="text"
            name="contactPerson"
            value={task.contactPerson}
            onChange={handleChange}
            placeholder="Contact Person"
            required
          />
          <input
            className="modalInput"
            type="text"
            name="note"
            value={task.note}
            onChange={handleChange}
            placeholder="Note (optional)"
          />

          <div className="buttonDiv">
            <button className="modalButton" onClick={closeModal}>
              Cancel
            </button>
            <button className="modalButton" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
