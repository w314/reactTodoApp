import { useRef, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

function App() {

  console.log('rendering')

  // define Task type
  type Task = {
    id: string,
    name: string,
    completed: boolean
  }

  // define initial state
  const initialState = { tasks: [] as Task[] }

  // define action types
  type ACTIONTYPE = 
    { type: 'add', payload: string } |
    { type: 'delete', payload: string} |
    { type: 'toggle', payload: string}
  
  // define reducer function
  const taskReducer = (state: typeof initialState, action: ACTIONTYPE) => {
    switch(action.type) {
      case 'add':
        return (
          {tasks: [...state.tasks, {
            id: uuidv4(),
            name: action.payload,
            completed: false
          }]}
        )
      case 'delete':
        return (
          {tasks: state.tasks.filter(task => task.id != action.payload)}
        )
      default:
        throw new Error()
    }
  }

  // create state variable
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // create reference to name input field
  const nameInput = useRef<HTMLInputElement>(null)
  

  function addTask(event: React.FormEvent) {
    // call preventDefault() to avoid page rerendering
    event.preventDefault()
    // if input field is empty return
    if (!nameInput.current) return
    // add task 
    dispatch({type: 'add', payload: nameInput.current.value})
    // clear input field
    nameInput.current
      ? nameInput.current.value = ''  
      : null
    // focus on input field
    nameInput.current.focus()
    
    }

  return (
    <>
      <h1>Todo Application</h1>
      <form onSubmit={addTask}>
        <input type="text" ref={nameInput}/>
        <button type="submit">Add Task</button>
      </form>
      <h2>Task List</h2>
      {state.tasks.map(task => {
        return (
          <div key={task.id}>
            {task.name}
            <button>Toggle Completed Status</button>
            <button onClick={() => dispatch({type: 'delete', payload: task.id})}>Delete</button>
          </div>
        )

      })}
    </>
  )
}


// STYLED ELEMENTS
export default App