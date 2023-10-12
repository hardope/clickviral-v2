from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
import ssl
import smtplib
from email.mime.text import MIMEText
import os
from clickviral.settings import BASE_DIR
import json
from account.models import Profile


with open(os.path.join(BASE_DIR, 'secret.json')) as f:
    secret = json.load(f)

def send_email(subject, body, to):
    msg = EmailMessage()
    msg.set_content(body)
    msg['Subject'] = subject
    msg['From'] = secret['email_host_user']
    msg['To'] = to
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(secret['email_host'], secret['email_port'], context=context) as server:
        server.login(secret['email_host_user'], secret['email_host_password'])
        server.send_message(msg)

def send_html_email(subject, body, to):

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = secret['email_host_user']
    msg['To'] = to

    html = body

    part2 = MIMEText(html, 'html')

    msg.attach(part2)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(secret['email_host'], secret['email_port'], context=context) as server:
        server.login(secret['email_host_user'], secret['email_host_password'])
        server.send_message(msg)

class Email:
    def __init__(self, to, domain, subject="", body=""):
        self.subject = subject
        self.body = body
        self.to = to
        self.domain = domain

    def send(self):
        send_html_email(self.subject, self.body, self.to)

    def send_text(self):
        send_email(self.subject, self.body, self.to)

    def send_sign_up(self, code, id):
        self.subject = "Welcome to ClickViral!"
        self.body = f"""
        <html>
        <body>
            <p>Hi, {Profile}<br>
            Thanks for signing up to ClickViral! Please click the link below to verify your email address.<br><br>
            https://{self.domain}/account/verify/{id}/{code}<br>
            </p>
        </body>
        </html>
        """

        self.send()

    def __str__(self):
        return f'{self.subject} to {self.to}'
