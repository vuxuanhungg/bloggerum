import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
})

const sendEmail = async (to: string, subject: string, html: string) => {
    const info = await transporter.sendMail({
        from: 'xuanhung@bloggerum.com',
        to,
        subject,
        html,
    })

    return nodemailer.getTestMessageUrl(info)
}

export default sendEmail
