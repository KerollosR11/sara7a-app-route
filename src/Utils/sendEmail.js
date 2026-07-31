import nodemailer from "nodemailer";

// ASSIGNMENT 12

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
})