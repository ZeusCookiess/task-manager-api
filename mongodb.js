// CRUD 

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const {MongoClient, ObjectId } = require('mongodb')

const id = new ObjectId()


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
         return console.log('Unable to connect to database!')
    } 
    const db = client.db(databaseName)
    const usersCollection = db.collection('users')
    const tasksCollection = db.collection('tasks')
    
    tasksCollection.updateMany({
        completed: true
    },{
        $set: {
            completed: false
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    
})




