require('dotenv').config();
const nodeMailer = require('nodemailer');

class MailService{
    constructor(){
        this.transporter = nodeMailer.createTransport({
            //host: process.env.SMTP_HOST,
            //port: process.env.SMTP_PORT,
            //secure: false,
            //auth: {
            //    user: process.env.SMTP_USER,
            //    pass: process.env.SMTP_PASSWORD
            //}   

            // отправка писем работает только по HTTPS (если есть SSL сертификат)
            
            // host: 'mail.speaking.odessa.ua',
            // port: 587,
            // secure: false,
            // auth: {
            //     user: 'admin@speaking.odessa.ua',
            //     pass: 'zv4jcoELFk'
            // }

            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'aaliyah.botsford@ethereal.email',
                pass: '4JsSTm2hb5hnRGb67b'
            }
        })
    }
    async sendActivationMail(to, link){
        //console.log(link);
        //console.log(process.env.API_URL);
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Аткивация аккаунта на сайте Polygraph-Rubicon.com',
            text: '',
            html: 
                `
                <div style="padding: 30px; background: linear-gradient(45deg, #e3ffe7 0%, #d9e7ff 100%); font-family: Candara;">
                    <div style="margin:1em auto"><img src='https://www.polygraph-rubicon.com/img/logo.png' alt="Rubicon Logo" width="200px" /></div>
                    <div style="padding: 15px 25px 30px; background-color: #EEEA; border-radius:10px;">
                    <h1>Активируйте учётную запись</h1>
                    Добрый день.<br>
                    Благодарим Вас за регистрацию в нашей системе.<br>
                    Чтобы активировать Вашу учётную запись, нажмите на кнопку ниже.<br><br><br>
                    <a target="_blank" style="padding: 10px 20px; margin: 2em; color: #FFF; text-decoration: none; background: linear-gradient(180deg, #9ebd13 0%, #6db608 100%); border-radius:5px" href="${link}">Подтверждаю Email адрес</a><br><br><br>
                    Если Вы не регистрировались, то просто ничего не делайте.<br><br><br><br>
                    С уважением,<br>
                    Команда проекта Rubicon<br><br>
                    <hr>
                    <h4>Если возникли какие-то проблемы во время активации учётной записи, пожалуйста, скопируйте и вставьте эту ссылку в адресную строку вашего браузера.</h4>
                    <a target="_blank" href="${link}">${link}</a>
                    </div>
                    <br>
                    <p style='text-align:center'>© ${new Date().getFullYear()} Polygraph-Rubicon.com | Все права защищены.</p>
                </div>
                `
        })
        //console.log("_+_+_");
    }
    async sendRecoveryMail(to, link){
        //console.log(link);
        //console.log(process.env.API_URL);
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Восстановление пароля на сайте Polygraph-Rubicon.com',
            text: '',
            html: 
                `
                <div style="padding: 30px; background: linear-gradient(45deg, #d9e7ff 0%, #e3ffe7 100%); font-family: Candara;">
                    <div style="margin:1em auto"><img src='https://www.polygraph-rubicon.com/img/logo.png' alt="Rubicon Logo" width="200px" /></div>
                    <div style="padding: 15px 25px 30px; background-color: #EEEA; border-radius:10px;">
                    <h1>Сброс пароля в системе</h1>
                    Добрый день.<br>
                    Мы получили от Вас запрос на сброс пароля.<br>
                    Чтобы перейти к восстановлению пароля, нажмите на кнопку ниже.<br><br><br>
                    <a target="_blank" style="padding: 10px 20px; margin: 2em; color: #FFF; text-decoration: none; background: linear-gradient(180deg, #9ebd13 0%, #6db608 100%); border-radius:5px" href="${link}">Создать новый пароль</a><br><br><br>
                    Ссылка на восстановление будет активна в течение 1 часа.<br><br>
                    Если у Вас всё ок и Вы не запрашивали восстановление пароля, просто ничего не делайте.<br><br><br><br>
                    С уважением,<br>
                    Команда проекта Rubicon<br><br>
                    <hr>
                    <h4>Если возникли какие-то проблемы во время активации учётной записи, пожалуйста, скопируйте и вставьте эту ссылку в адресную строку вашего браузера.</h4>
                    <a target="_blank" href="${link}">${link}</a>
                    </div>
                    <br>
                    <p style='text-align:center'>© ${new Date().getFullYear()} Polygraph-Rubicon.com | Все права защищены.</p>
                </div>
                `
        })
        //console.log("_+_+_");
    }
}

module.exports = new MailService();