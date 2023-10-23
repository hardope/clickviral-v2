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
    def __init__(self,username , to, domain, subject="", body=""):
        self.username = username
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
            <p>Hi, {self.username}<br>
            Thanks for signing up to ClickViral! Please click the link below to verify your email address.<br><br>
            https://{self.domain}/verify/account/{id}/{code}<br>
            </p>

            <p>If you did not sign up for ClickViral, please ignore this email.</p>
        </body>
        </html>
        """

        self.send()

    def __str__(self):
        return f'{self.subject} to {self.to}'
    
    def send_email_reset(self, code):
        self.subject = "ClickViral Email Reset"
        self.body = f"""
        <html>
        <body>
            <p>Hi, {self.username}<br>
            Please click the link below to reset your email address.<br><br>
            https://{self.domain}/verify/email/{code}<br>
            </p>
            <p>If you did not request an email reset, please ignore this email.</p>
        </body>
        </html>
        """

        self.send()

    def send_password_reset(self, code):

        self.subject = "ClickViral Password Reset"
        self.body = f"""
        <html>
        <body>
            <p>Hi, {self.username}<br>
            Please click the link below to reset your password.<br><br>
            https://{self.domain}/verify/password/{code}<br>
            </p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </body>
        </html>
        """

        self.send()
