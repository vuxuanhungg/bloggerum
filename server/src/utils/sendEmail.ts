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

export const sendEmail = async (to: string, subject: string, html: string) => {
    const info = await transporter.sendMail({
        from: 'bloggerum@xuanhung.dev',
        to,
        subject,
        html,
    })
    return info
}

export const resetPasswordTemplate = (name: string, url: string) =>
    `
        <div style="max-width: 640px; margin: 0 auto; padding: 40px 50px">
            <h2 style="font-size: 20px; font-weight: 500; color: #4f545c" >
                Hey ${name},
            </h2>
            <p style="margin-top: 1rem; font-size: 16px; line-height: 24px; color: #737f8d">
                Your Bloggerum password can be reset by clicking the button
                below. If you did not request a new password, please ignore
                this email.
            </p>
            <div style="margin-top: 2rem; display: flex; justify-content: center">
                <a
                    href="${url}"
                    target="_blank"
                    rel="noreferrer"
                    style="text-decoration: none; font-size: 15px; background-color: #16a34a; color: #ffffff; padding: 0.75rem 2rem; border-radius: 0.5rem"
                >
                    Reset password
                </a>
            </div>
        </div>
    `
