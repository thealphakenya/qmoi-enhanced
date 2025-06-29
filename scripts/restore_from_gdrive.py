import os
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

GOOGLE_DRIVE_FOLDER_ID = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
LOCAL_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

assert GOOGLE_DRIVE_FOLDER_ID, "GOOGLE_DRIVE_FOLDER_ID environment variable must be set."

gauth = GoogleAuth()
gauth.LocalWebserverAuth()
drive = GoogleDrive(gauth)

# List and download all files in the folder
def download_folder(folder_id, dest_dir):
    file_list = drive.ListFile({'q': f"'{folder_id}' in parents and trashed=false"}).GetList()
    for file in file_list:
        file_path = os.path.join(dest_dir, file['title'])
        if file['mimeType'] == 'application/vnd.google-apps.folder':
            os.makedirs(file_path, exist_ok=True)
            download_folder(file['id'], file_path)
        else:
            print(f"Downloading {file['title']} to {file_path}")
            file.GetContentFile(file_path)

try:
    download_folder(GOOGLE_DRIVE_FOLDER_ID, LOCAL_DIR)
    print(f"Restore from Google Drive folder {GOOGLE_DRIVE_FOLDER_ID} completed.")
except Exception as e:
    print(f"Restore from Google Drive failed: {e}") 