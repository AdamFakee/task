const nodemailer = require('nodemailer');

module.exports = (subject, email, text) => {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,  // Replace with your Gmail email address
            pass: process.env.NODEMAILER_PASSWORD  // Replace with your Gmail password or an app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: 'buidinhtuan04@gmail.com',   // Replace with your Gmail email address
        to: email,    // Replace with the recipient's email address
        subject: subject,
        text: text
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', 'send mail un-succesfully');
        } else {
            console.log('Email sent:', "send mail successfully");
        }
    });
}
        