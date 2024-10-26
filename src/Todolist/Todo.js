import React, { useEffect, useReducer, useState } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaEdit, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';

const initialState = {
  tasks: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, title: action.payload.title } : task
        ),
      };
    default:
      return state;
  }
};

export default function Todo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskTitle, setTaskTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      data.forEach(task => {
        dispatch({ type: 'ADD_TASK', payload: { ...task, completed: false } });
      });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleToggle = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setTaskTitle(task.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTaskId) {
      dispatch({ type: 'EDIT_TASK', payload: { id: editTaskId, title: taskTitle } });
      setEditTaskId(null);
    } else {
      const newTask = {
        id: Date.now(), 
        title: taskTitle,
        completed: false,
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    setTaskTitle('');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">What's the plan for Today ...?</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
          <button className="btn btn-info" type="submit">
            <FaPlusCircle /> {editTaskId ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
      <ul className="list-group mb-4">
        {state.tasks.map((task, key) => (
          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'gray' : 'black' }}>
              {task.title}
            </span>
            <div>
              <button className="btn btn-success btn-sm me-2" onClick={() => handleToggle(task.id)}>
                <FaCheckCircle /> {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(task)}>
                <FaEdit /> 
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
