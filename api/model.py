import re
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