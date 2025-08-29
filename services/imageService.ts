import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_PRESET } from "@/constants";
import { ResponseType } from "@/types";
import axios from 'axios';

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const UploadFileToCloudinary = async (
    file: { uri?: string } | string,
    folderName: string
): Promise<ResponseType> => {
    try {
        // If the file is already a string (like an existing Cloudinary URL), no upload is needed → just return it.
        if (typeof file == 'string') {
            return { success: true, data: file };
        }

        // If the file has a .uri (local file from React Native ImagePicker, Camera, etc.):

        // Wraps the file in FormData.

        // Calls Cloudinary’s image/upload API.

        // Returns the secure URL of the uploaded image.

        if (file && file.uri) {
            const formData = new FormData();
            formData.append("file", {
                uri: file?.uri,
                type: "image/jpeg",
                name: file?.uri?.split('/').pop() || "file.jpg"
            } as any);

            formData.append("upload_preset", CLOUDINARY_CLOUD_PRESET);
            formData.append("folder", folderName);

            const response = await axios.post(CLOUDINARY_API_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            // console.log("Upload image result: ", response?.data);
            return { success: true, data: response?.data?.secure_url }

        }

        // return { success: true };
        return { success: false, msg: "No file provided" };

    } catch (error: any) {
        console.log("Got an error uploading file: ", error.response?.data || error.message);

        return { success: false, msg: error.response?.data?.error?.message || "Could not upload file." };

    }
}

export const getProfileImage = (file: any) => {
    if (file && typeof file == 'string') {
        return file;
    }

    if (file && typeof file == 'object') {
        return file.uri;
    }

    return require('../assets/images/defaultAvatar.png');
}