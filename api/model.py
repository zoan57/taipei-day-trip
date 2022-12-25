import re
def validate(data, regex):
    """Custom Validator"""
    return True if re.match(regex, data) else False

def validate_email(email: str):
    """Email Validator"""
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return validate(email, regex)

def validate_password(password: str):
    """Password Validator"""
    reg = r"(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    return validate(password, reg)