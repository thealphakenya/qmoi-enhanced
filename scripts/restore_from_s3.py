import os
import boto3
from botocore.exceptions import NoCredentialsError

S3_BUCKET = os.environ.get("S3_BUCKET")
LOCAL_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

assert S3_BUCKET, "S3_BUCKET environment variable must be set."

s3 = boto3.client("s3")

# List all objects in the bucket and download them
try:
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=S3_BUCKET):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            dest_path = os.path.join(LOCAL_DIR, key)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            print(f"Downloading {key} to {dest_path}")
            s3.download_file(S3_BUCKET, key, dest_path)
    print(f"Restore from S3 bucket {S3_BUCKET} completed.")
except NoCredentialsError:
    print("AWS credentials not found. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")
except Exception as e:
    print(f"Restore from S3 failed: {e}")
