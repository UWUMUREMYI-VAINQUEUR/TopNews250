# cloudinary_utils.py

import cloudinary
import cloudinary.uploader
from config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def upload_image(file_path):
    try:
        res = cloudinary.uploader.upload(file_path)
        return res["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        return None
