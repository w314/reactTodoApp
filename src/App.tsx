import { useRef, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styled from '@emotion/styled'

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
    // add only needs the name of the new task 
    { type: 'add', payload: string } |
    // delete needs the id of the task
    { type: 'delete', payload: string} |
    // toggle will use the task object itself
    // to ge acess to both the id and the name
    { type: 'toggle', payload: Task}
  
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
      case 'toggle':
        // get index of element to be changed
        const index = state.tasks.indexOf(action.payload)
        return (
          // use spread instead of changing the element at the index
          // to change the state and force page refresh
          // prefer this method instead of first filtering all items that 
          // will not change and adding the new element at the end
          // as that method changes the order of the tasks in the array
          {tasks: [...state.tasks.slice(0, index), {
            id: action.payload.id,
            name: action.payload.name,
            completed: !action.payload.completed
          }, ...state.tasks.slice(index + 1, state.tasks.length)]} 
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
    <Container>
      <h1>Todo Application</h1>
      <form onSubmit={addTask}>
        <input type="text" ref={nameInput}/>
        <button type="submit">Add Task</button>
      </form>
      <h2>Task List</h2>
      {state.tasks.map(task => {
        return (
          <Task key={task.id}>
            <TaskName {...task}>{task.name}</TaskName>
            <button onClick={() => dispatch({type: 'toggle', payload: task})}>Toggle Completed Status</button>
            <button onClick={() => dispatch({type: 'delete', payload: task.id})}>Delete</button>
          </Task>
        )

      })}
    </Container>
  )
}


// STYLED ELEMENTS
const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
`

const Task = styled.div`
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 3fr 2fr 1fr;
  gap: 10px;
`

type TaskNameProps = {
  completed: boolean
}

const TaskName = styled.p<TaskNameProps>`
  color: ${props => props.completed ? "lightgray" : "black"}
`

export default App