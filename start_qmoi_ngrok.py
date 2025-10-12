import os
import shutil
from pyngrok import ngrok
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn

# ✅ Set Ngrok Auth Token
os.environ["NGROK_AUTH_TOKEN"] = "2vpml86bIuHdp1q06rMfqsqWqPz_7sGTMrPds44ZJmMFWdUa5"
ngrok.set_auth_token(os.environ["NGROK_AUTH_TOKEN"])

# ✅ Start Ngrok tunnel on port 8080
try:
    tunnel = ngrok.connect(8080)
    print("✅ Ngrok tunnel started!")
    print("🌍 Public URL:", tunnel.public_url)

    # Save public URL to file for other scripts
    with open("ngrok_tunnel.txt", "w") as f:
        f.write(tunnel.public_url)

except Exception as e:
    print("❌ Failed to start Ngrok tunnel:", str(e))
    exit(1)

# ✅ Auto-copy fallback EXE if available and not already in downloads/
fallback_source = os.path.join("Qmoi_downloaded_apps", "windows", "latest", "qmoi_ai.exe")
target_path = os.path.join("downloads", "qmoi ai.exe")

if os.path.exists(fallback_source) and not os.path.exists(target_path):
    try:
        os.makedirs("downloads", exist_ok=True)
        shutil.copy2(fallback_source, target_path)
        print("📦 Copied fallback EXE to /downloads folder.")
    except Exception as copy_err:
        print("⚠️ Failed to copy fallback EXE:", str(copy_err))

# ✅ Start FastAPI app
app = FastAPI()

# Serve the 'downloads' folder publicly at /downloads/
os.makedirs("downloads", exist_ok=True)
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
