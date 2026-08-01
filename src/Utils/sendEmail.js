import nodemailer from "nodemailer";
import env from "../Config/config.js";

// ASSIGNMENT 12

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.googleAccountEmail,
        pass: env.googleAppPassword
    }
});



export const sendEmail= async({to, subject, html})=>{
    try {
        const info = await transporter.sendMail({
            from: `Kerollos RN <${env.googleAccountEmail}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.log("Failed to send email");
    }
};