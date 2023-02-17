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
    // toggle needs the id of the task
    //will use the task object itself
    // to ge acess to both the id and the name
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
      case 'toggle':
        // use map to go through tasks 
        return {tasks: state.tasks.map(task => {
          if( task.id == action.payload ) {
            // use sread as using task.completed = does not refresh page
            return {...task, completed: !task.completed}
          } else {
            return task
          }
        })}
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
            <button onClick={() => dispatch({type: 'toggle', payload: task.id})}>Toggle Completed Status</button>
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