import requests

def get_public_ip():
    try:
        ip = requests.get('https://api.ipify.org').text
        print(f"Your public IP address is: {ip}")
    except Exception as e:
        print(f"Error fetching public IP: {e}")

if __name__ == "__main__":
    get_public_ip() 