let sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let URL = "https://socialites-24x7.herokuapp.com/";

/**
 * The function to send the email verification email
 * @param {String} token 
 * @param {String} email 
 */
let sendEmailVerificationMail = (token, email) => {
    let link = `${URL}verified/${token}`;
    let msg = {
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

/**
 * The function to send the reset password email
 * @param {String} token 
 * @param {String} email 
 */
let sendResetPasswordMail = (token, email) => {
    var link = URL + "reset/" + token;
    let msg = {
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