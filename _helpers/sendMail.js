const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const config = require('config.json');

module.exports = sendEmail;

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./_template/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./_template/'),
};

async function sendEmail({ from, to, subject, template, context}) {
    const transporter = nodemailer.createTransport(config.smtpOptions);

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))

    var mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject,
        template: template, // the name of the template file i.e email.handlebars
        context: context
    };
    await transporter.sendMail(mailOptions);
}