import axios from 'axios';



export const cloudinaryService = {
    uploadImg
}


async function uploadImg(url) {
    const CLOUD_NAME = "dptiv4ajc"
    const UPLOAD_PRESET = "rolpcssu"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData();
    formData.append('file', url)
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
        const res = await axios.post(`${UPLOAD_URL}`, formData)
        return res.data.url

    } catch (err) {
        console.log(err);
    }
}
