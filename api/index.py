from flask import Flask, request, jsonify
import random
from functools import wraps
import os

app = Flask(__name__)

# Environment variables for credentials (set in Vercel)
USERNAME = os.getenv('USERNAME', 'admin')
PASSWORD = os.getenv('PASSWORD', 'securepassword123')

def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth or not (auth.username == USERNAME and auth.password == PASSWORD):
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route("/generate", methods=["GET"])
@authenticate
def generate_password():
    numbers = [1,2,3,4,5,6,7,8,9]
    symbols = ['!', '@', '#', '$', '%', '^', '&', '*']
    latin = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
         'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    greek = ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω']
    cyrillic = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ы','ь','э','ю','я']
    arabic = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي']
    chinese = ['汉','字','中','文','测','试','学','习','编','码']

    chars = [
        str(random.choice(numbers)),
        random.choice(symbols),
        random.choice(latin),
        random.choice(greek),
        random.choice(cyrillic),
        random.choice(arabic),
        random.choice(chinese)
    ]

    all_chars = [str(n) for n in numbers] + symbols + latin + greek + cyrillic + arabic + chinese
    for _ in range(1):
        chars.append(random.choice(all_chars))
    
    random.shuffle(chars)
    password = ''.join(chars)
    return jsonify({"password": password})

if __name__ == "__main__":
    app.run(debug=True)
