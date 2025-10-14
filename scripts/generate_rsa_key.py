from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
import os

os.makedirs('secrets', exist_ok=True)

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
    backend=default_backend()
)

private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

public_key = private_key.public_key()
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

with open('secrets/bitget_private.pem', 'wb') as f:
    f.write(private_pem)

with open('secrets/bitget_public.pem', 'wb') as f:
    f.write(public_pem)

print("RSA key pair generated. Public key: secrets/bitget_public.pem, Private key: secrets/bitget_private.pem") 