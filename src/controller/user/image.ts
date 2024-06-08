import { Request, Response } from "express";
import { UserImage } from "../../database/models/userModel";
import path from 'path';

declare const __dirname: string;

const getImages = () => {
    return async (req: Request, res: Response) => {
        try {
            var images = await UserImage.find({ user_id: req.params.id });

            if (images.length === 0) {
                res.status(404).send({
                    "message": "No images found",
                    "status": "not_found"
                });
                return;
            }

            images = images.map(image => image.toJSON());

            res.status(200).send({
                "data": images,
                "message": "Images retrieved successfully",
                "status": "success"
            });

        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while retrieving images",
                "status": "error"
            });
        }
    }
}

const uploadImage = () => {

    interface UploadedImage {
        name: string;
        data: Buffer;
        size: number;
        encoding: string;
        tempFilePath: string;
        truncated: boolean;
        mimetype: string;
        md5: string;
        mv: (path: string, callback: (err: any) => void) => void; // Assuming this is the type of the 'mv' function
    }

    return async (req, res: Response) => {

        try {

            const user = req.user;

            if (!req.files || !req.files.image) {
                res.status(400).send({
                    "message": "No image found",
                    "status": "error"
                });
                return;
            }

            if (!req.body.image_type) {
                res.status(400).send({
                    "message": "Image type not found",
                    "status": "error"
                });
                return;
            }

            if (req.body.image_type !== 'profile' && req.body.image_type !== 'cover') {
                res.status(400).send({
                    "message": "Invalid image type",
                    "status": "error"
                });
                return;
            }

            let type: { [key: string]: string } = {
                'profile': 'profileImage',
                'cover': 'coverImage'
            }

            req.body.image_type = type[req.body.image_type]

            let imageobj = new UserImage({ user_id: user._id, image_type: req.body.image_type, image_url: '' });

            const file = req.files.image as UploadedImage;
            const extension = file.name.split('.').pop();
            const fileName = `${imageobj.id}.${extension}`;

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                res.status(400).send({
                    "message": "Invalid file type",
                    "status": "error"
                });
                return;
            }

            user[req.body.image_type] = `/assets/${fileName}`;
            imageobj.image_url = `/assets/${fileName}`;

            await imageobj.save();
            await user.save();

            const uploadPath = path.join(__dirname, `../../assets/${fileName}`);

            file.mv(uploadPath, (err) => {
                if (err) {
                    console.error("Error uploading image:", err);
                    res.status(500).send({
                        "message": "An error occurred while uploading image",
                        "status": "error"
                    });
                    return;
                }
            });

            res.status(200).send({
                "message": "Image uploaded successfully",
                "status": "success"
            });
        } catch (err) {
            console.error("Error uploading image:", err);
            res.status(500).send({
                "message": "An error occurred while uploading image",
                "status": "error"
            });
        }
    }
}

export { getImages, uploadImage };