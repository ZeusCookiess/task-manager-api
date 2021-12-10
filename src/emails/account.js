const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log(process.env.SENDGRID_API_KEY)
console.log(process.env.JWT_SECRET)
console.log(process.env.MONGODB_URL)

// sgMail.send({
//     to: 'zezozm2014@gmail.com',
//     from: 'zezozm2014@hotmail.com',
//     subject:'This is my first mail',
//     text: 'I hope this one works'
// })

const  sendWelcomeMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'zezozm2014@hotmail.com',
        subject: 'Thanks for creating your account',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendGoodbyeMessage = (email, name) => {
    sgMail.send({
        to: email,
        from: 'zezozm2014@hotmail.com',
        subject: 'Cancellation mail',
        text:'Thanks for using our service. May we ask you what made you cancel your registeration?'
    })
}

module.exports =  {
    sendWelcomeMessage,
    sendGoodbyeMessage
}