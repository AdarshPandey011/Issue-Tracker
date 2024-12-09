import React, { useState } from "react";
import TaskModal from "./TaskModel";

export default function Home({ tasks, addTask }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null); // Holds the data for editing or duplicating
  const [selectHandler, setSelectHandler] = useState(""); // For handling selected options

  const openModel = () => {
    setIsModalOpen(true);
  };

  const newTask = () => {
    setInitialData(null); // Reset initialData when opening modal for new task
    openModel();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectHandler(""); // Reset selectHandler
    setInitialData(null); // Clear initial data after modal closes
  };

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    const taskId = e.target.id;
    const selectedTask = tasks.find((task) => task.id === Number(taskId));

    if (selectedOption === "edit") {
      setInitialData({ ...selectedTask, selectedOption });
      openModel();
    } else if (selectedOption === "duplicate") {
      // Handle task duplication logic
      const duplicatedTask = { ...selectedTask, id: Date.now() }; // New ID for the duplicated task
      addTask(duplicatedTask); // Add the duplicated task
    } else if (selectedOption === "status") {
      // Handle status change logic
      const updatedTask = { ...selectedTask, status: "Closed" };
      addTask(updatedTask, true); // Pass edited flag to update task in the list
    }
    setSelectHandler(selectedOption); // Update selected option state
  };

  return (
    <>
      <div className="home">
        <div className="salesLog ">
          <div className="left">
            <h5>Sales Log</h5>
            <button onClick={newTask}>New Task</button>
          </div>
          <input type="text" placeholder="Search" />
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Entity Name</th>
              <th>Task Type</th>
              <th>Time</th>
              <th>Contact Person</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.date}</td>
                <td>{task.taskName}</td>
                <td>{task.contactMedium}</td>
                <td>{task.time}</td>
                <td>{task.contactPerson}</td>
                <td>{task.note}</td>
                <td>{task.status}</td>
                <td>
                  <select
                    className="options"
                    value={selectHandler}
                    id={task.id}
                    onChange={handleSelectChange}
                  >
                    <option value="">Options</option>
                    <option value="edit">Edit</option>
                    <option value="duplicate">Duplicate</option>
                    <option value="status">Change status to Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <TaskModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          addTask={addTask}
          initialData={initialData}
          setSelectHandler={setSelectHandler}
        />
      </div>
    </>
  );
}
