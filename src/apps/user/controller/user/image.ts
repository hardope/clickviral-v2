import { Request, Response } from "express";
import { User, UserImage } from "../../models";

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

            let imagesJson = images.map(image => image.toJSON());

            res.status(200).send({
                "data": imagesJson,
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

    return async (req, res: Response) => {
        try {
            const swap = {
                'profile': 'profileImage',
                'cover': 'coverImage'
            };

            if (!req.file) {
                res.status(400).send({
                    "message": "No image uploaded",
                    "status": "bad_request"
                });
                return;
            }

            if (!req.body.image_type || !['profile', 'cover'].includes(req.body.image_type)) {
                res.status(400).send({
                    "message": "Invalid image type",
                    "status": "false"
                });
                return;
            }

            const image = new UserImage({
                user_id: req.user.id,
                url: req.file.filename,
                type: swap[req.body.image_type]
            });

            await image.save();

            var user = await User.findById(req.user.id);
            if (!user) {
                res.status(404).send({
                    "message": "User not found",
                    "status": "not_found"
                });
                return;
            }
            user[swap[req.body.image_type]] = req.file.filename;
            user.save();

            res.status(201).send({
                "data": image.toJSON(),
                "message": "Image uploaded successfully",
                "status": "success"
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                "message": "An error occurred while uploading image",
                "status": "error"
            });
        }
    }
}

export { getImages, uploadImage };