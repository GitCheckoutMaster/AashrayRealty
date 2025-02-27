import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (path) => {
	try {
		if (!path) {
      throw new Error("No file path provided");
		}
		const result = await cloudinary.uploader.upload(path);
		fs.unlinkSync(path);

		return result;
	} catch (error) {
		throw error;
	}
};

const deleteOnCloudinary = async (url) => {
	const publicId = url.split("/").pop().split(".")[0];
	await cloudinary.uploader.destroy(publicId).catch((error) => {
		throw error;
	});
};

export { uploadOnCloudinary, deleteOnCloudinary };
