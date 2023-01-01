import re, jwt, os
from flask import request
SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'

def validate(data, regex):
    """Custom Validator"""
    return True if re.match(regex, data) else False

def validate_email(email: str):
    """Email Validator"""
    reg = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,10}\b'
    return validate(email, reg)

def validate_password(password: str):
    """Password Validator"""
    reg = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
    return validate(password, reg)

def validate_token():
    """Token Validator"""
    token=request.cookies.get("token")
    if token:
        token_info=jwt.decode(token, SECRET_KEY, algorithms="HS256")
        return token_info
    else:
        return False