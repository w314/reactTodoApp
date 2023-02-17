import { useRef, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

function App() {

  console.log('rendering')

  type Task = {
    id: string,
    name: string,
    completed: boolean
  }

  const initialState = { tasks: [] as Task[] }

  type ACTIONTYPE = 
    { type: 'add', payload: string } 
    // |
    // { type: 'delete', payload: string} |
    // { type: 'toggle', payload: string}
  
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
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer(taskReducer, initialState)


  const nameInput = useRef<HTMLInputElement>(null)
  


  function addTask(event: React.FormEvent) {
    // call preventDefault() to avoid page rerendering
    event.preventDefault()
    console.log(`${nameInput.current?.value} task added`)
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
          </div>
        )

      })}
    </>
  )
}
export default App