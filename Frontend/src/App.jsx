import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import Home from '../Components/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css'

function App() {
  // const [arr, setArr] = useState()
  const [tasks, setTasks] = useState([]); 






  useEffect(() => {


    fetch('http://localhost:5172/')
      .then(response => response.json())
      .then((data) => {
        data = data.tasks
        
        setTasks(data)


      })
      .catch(error => console.error('Error fetching data:', error))

  }, []);

  const addTask = (newTask,edited=false) => {
    if (edited){
      // setTasks((prevTasks)=>[...prevTasks])
      console.log(newTask)
      // for(let i=0;i<tasks.length;i++){
      //   console.log(tasks[i])
      // }
      let temp = tasks.map(item => item.id === Number(newTask.id) ? newTask : item)
      console.log(temp)
      setTasks(temp)
      console.log(newTask.id,temp[0].id)
    }
    else{
    setTasks((prevTasks) => [...prevTasks, newTask]);  // Adds the new task to the existing list
    }
};

  


  return (
    <>

      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Home tasks={arr} />}/> */}
          <Route
            path="/"
            element={
              tasks == undefined ? (  // Conditionally render based on arr state
                <div>Loading...</div>  // Show a loading message while arr is empty
              ) : (
                <Home tasks={tasks} addTask={addTask} />  // Render Home component when data is loaded
              )
            }
          />

        </Routes>
      </BrowserRouter>

      {/* <Home tasks={data.tasks}></Home> */}
    </>
  )
}

export default App
