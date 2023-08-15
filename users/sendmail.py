from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
import ssl
import smtplib
from email.mime.text import MIMEText

def send_mail(to, subject, body):
    sender = "clickviralng@gmail.com"
    recipient = to
    password = "wflwidljzrykjswq"

    mail = MIMEMultipart('alternative')
    mail["From"] = sender
    mail["To"] = recipient
    mail["Subject"] = subject

    mail.attach(MIMEText(body, 'html'))

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(sender, password)
        smtp.sendmail(sender, recipient, mail.as_string())

def send_activation_mail(user, domain):
    subject = "Account Activation"
    body = f"""
        <html>
        <head></head>
        <body>
            <p>Hello There,</p>
            <p>Thank you for registering on our platform.</p>
            <p>Please click the link below to activate your account:</p>
            https://{domain}/activate/{user.activation}
            <p>This link expires in 24 hours.</p>
            <p>Ignore this message if you did not register on our platform.</p>
        </body>
        </html>
        """
    
    send_mail(user.email, subject, body)