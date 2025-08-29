import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { UploadFileToCloudinary } from "./imageService";

export const updateUser = async (
    uid: string,
    updateData: UserDataType
): Promise<ResponseType> => {
    try {
        if (updateData.image && updateData?.image?.uri) {
            const imageUploadRes = await UploadFileToCloudinary(updateData.image, "users");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Failed to upload image" }
            }
            updateData.image = imageUploadRes.data;

        }
        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, updateData)
        return { success: true, msg: "Updated Successfully" };
    } catch (error: any) {
        console.log("Error Update User: ", error);
        return { success: false, msg: error?.message };
    }
}