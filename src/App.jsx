//import "./App.css";
import { useState } from 'react';
import Task from './components/Task';
import InputTask from './components/InputTask';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Create a ToDo list', completed: false }
  ]);
  const toggleTask = (id) =>{
        setTasks(tasks.map(task =>
            task.id===id ? {...task,completed: !task.completed} : task
        ));
    };

  return (
    <div>
      <h1>My ToDo List</h1>
      <InputTask placeholder="Input a task"/>
      {tasks.map((task) => (
        <Task
        key={task.id}
        text={task.text}
        completed={task.completed}
        onToggle={() => toggleTask(task.id)}/>
      ))}
    </div>
  );
}

export default App;
