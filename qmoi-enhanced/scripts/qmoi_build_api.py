from flask import Flask, jsonify
import subprocess
import threading

app = Flask(__name__)


@app.route("/api/build-apps", methods=["POST"])
def build_apps():
    def run_builder():
        subprocess.run(["python", "scripts/qmoi-app-builder.py"])

    threading.Thread(target=run_builder).start()
    return jsonify({"status": "Build triggered"}), 202


if __name__ == "__main__":
    app.run(port=5050)
