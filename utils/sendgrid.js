const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailVerificationMail = (token, email) => {
    const link = `https://socialites-karthikey.herokuapp.com/verified/${token}`;
    const msg = {
        to: email,
        from: "karthikeysaxena@outlook.com", 
        subject: "Welcome to Socialites",
        html: `<a href=${link}> Link to verify your Email </a>
                <p> The Link will expire in 30 mins </p>`
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log("Email sent");
    })
    .catch((error) => {
        console.log(error);
    });
}

const sendResetPasswordMail = (token, email) => {
    var link = "https://socialites-karthikey.herokuapp.com/reset/" + token;
    const msg = {
        to: email,
        from: "karthikeysaxena@outlook.com",
        subject: "Reset Your Password at Socialites",
        html: `<a href=${link}> Link to Reset your Password </a> 
                <p> The link is valid for 30 mins only </p>`
    };
    sgMail
    .send(msg)
    .then(() => {
        console.log("Email sent");
    })
    .catch((error) => {
        console.log(error);
    });
}

module.exports = { sendEmailVerificationMail, sendResetPasswordMail };