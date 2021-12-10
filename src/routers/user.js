const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const { sendWelcomeMessage, sendGoodbyeMessage } = require('../emails/account')
const router = new express.Router()



router.get('/test', (req, res) => {
    res.send('From a new file')
})
const multer = require('multer')
const upload = multer({
    
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an Image file'))
        }

        cb(undefined, true)      
    } 
})


router.post('/users/me/avatar', auth, upload.single('avatar'),async  (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e){
        res.status(400).send('Login failed!')
    }
})


router.post('/users' ,  async (req,res) => {
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    
    try {
        await user.save()
        sendWelcomeMessage(user.email, user.name)
        res.status(201).send( {user, token})
    } catch (e) {
        res.status(400).send(e)
    }
    

})



router.get('/users/me' , auth , async (req, res) => {
    res.send(req.user)
})



router.patch('/users/me' , auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name' , 'email', 'password', 'age']
    const isValid = updates.every((update) => allowUpdates.includes(update))
    if (!isValid) {
        return res.status(400).send({error: "Invalid updates!"})
    }

    try {
        
        updates.forEach((update) => req.user[update] = req.body[update] )
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        sendGoodbyeMessage(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

// Logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return  token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Delete all jwt tokens
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.send(404).send()
    }
})

module.exports = router