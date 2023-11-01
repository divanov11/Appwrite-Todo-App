import './style.css'
import {Client, Databases, ID} from 'appwrite'

const client = new Client()

const DB_ID = '<DATABASE_ID>'
const COLLECTION_ID_TASKS = '<COLLECTION_ID>'

client.setEndpoint('https://cloud.appwrite.io/v1')
client.setProject('<PROJECT_ID>')

const db = new Databases(client)

const tasksList = document.getElementById('tasks-list')
const form = document.getElementById('form')

form.addEventListener('submit', addTask)
getTasks()

async function getTasks () {
  const response = await db.listDocuments(DB_ID, COLLECTION_ID_TASKS)

  const tasks = response.documents
 
  for(let i=0; tasks.length > i; i++){
    renderItemToDom(tasks[i])
  }
}

const renderItemToDom = async (task) => {


  //ADD ITEM TO DOM
  const taskWrapper = `<div class="task-wrapper" id="task-${task.$id}">
                          <p class="complete-${task.completed}">${task.body}</p>
                          <strong class="delete" id="delete-${task.$id}">x</strong>
                      </div>`

  tasksList.insertAdjacentHTML('afterbegin', taskWrapper)

  const deleteBtn = document.getElementById(`delete-${task.$id}`)
  const wrapper = document.getElementById(`task-${task.$id}`)

  //DELETE TASK EVENT HANDLER
  deleteBtn.addEventListener('click', () => {
     db.deleteDocument(DB_ID, COLLECTION_ID_TASKS, task.$id)
     document.getElementById(`task-${task.$id}`).remove()
  })

  // //UPDATE TASK EVENT HANDLER
  wrapper.childNodes[1].addEventListener('click', async (e) => {

    task.completed = !task.completed
    e.target.className = `complete-${task.completed}`

    db.updateDocument(
      DB_ID,
      COLLECTION_ID_TASKS,
      task.$id,
      {'completed':task.completed}
      )

  })
}

async function addTask (e)  {
  e.preventDefault()

  if(e.target.body.value == ''){
    alert("Form field cannot be empty")
    return
  }

  const response = await db.createDocument(
      DB_ID, 
      COLLECTION_ID_TASKS,
      ID.unique(),
      {"body":e.target.body.value}
    )

    renderItemToDom(response)
    form.reset()

}