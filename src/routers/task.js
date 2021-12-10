const express = require('express')
const Task = require('../models/tasks')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()


router.get('/test', (req, res) => {
    res.send('From a new file')
})


router.patch('/tasks/:id', auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValid = updates.every((update) => allowUpdates.includes(update))
    if (!isValid) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if (!task) {
            return res.status(404).send('Task not found')
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    } 

    // if (filter === 'true') {
    //     match.completed = 'true'
    // } else if (filter === 'false'){
    //     match.completed = 'false'
    // } else {
    //     res.status(400).send('Wrong query')
    //     throw new Error('Wrong query')
        
    // }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    
    try {
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (e) {   
        res.status(400).send(e)
    }
})

router.get('/tasks/:id', auth ,async (req, res) => {

    const _id = req.params.id
    try {
        
        const task =  await Task.findOne({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('Task Not found')
        }

        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task){
            return res.status(404).send('Task not found')
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router