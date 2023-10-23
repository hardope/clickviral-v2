import jwt
from datetime import datetime, timedelta
from clickviral.settings import SECRET_KEY

def encode(data):

    # Set the expiration time
    exp = datetime.utcnow() + timedelta(days=1)

    # Set the payload
    payload = {
        'exp': exp,
        'data': data
    }

    # Encode the token
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token

def decode(token):

    # Decode the token
    decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

    if decoded['exp'] < datetime.utcnow():
        raise Exception('Token has expired')

    # Return the data
    return decoded['data']