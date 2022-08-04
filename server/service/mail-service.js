const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: /* "egatsak@yandex.ru" */ process.env.SMTP_USER,
        pass: /*  "saqnnbgucjfuhmou" */ process.env.SMTP_PASSWORD,
      },
    });
    /* this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        type: "login",
        user: process.env.SMTP_USER,
        
        pass: process.env.SMTP_PASSWORD,
      },
      // requireTLS: true,
    }); */
  }

  async sendActivationMail(to, link) {
    console.log(to, link);
    await this.transporter.sendMail({
      from: process.env.SMTP_USER /* "egatsak@yandex.ru" */,
      to,
      subject: "Account activation at " + process.env.API_URL,
      text: "",
      html: `
        <div>
            <h1>Click the link to activate account</h1>
               <a href="${link}">${link}</a>

        </div>
      `,
    });
  }
}

module.exports = new MailService();
