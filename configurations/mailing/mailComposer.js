var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
    }
});

var mailOptions = {
    from: process.env.EMAIL_ID,
}

module.exports.sendMail = async function (mailObj) {
    try {
        mailOptions.to = mailObj.to
        mailOptions.subject = mailObj.subject
        mailOptions.text = mailObj.body

        var info = await transporter.sendMail(mailOptions);
        if (info) {
            console.log("Email sent : " + info.response);
            return info;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

