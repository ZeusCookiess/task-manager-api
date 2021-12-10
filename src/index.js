const express = require('express')
require('./database/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')




const app = express()
const port = process.env.PORT

// const multer = require('multer')
// const upload = multer({
//     dest: 'Images'
// })
// app.post('/upload', upload.single('upload') ,(req, res) => {
//     res.send()
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)






//Port

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



