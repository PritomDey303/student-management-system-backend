const imgur = require("imgur");
const fs = require("fs");
async function imgUploader(req, res, next) {
  try {
    if (!req.files) {
      return res.json({
        status: 500,
        msg: "Sorry! Something went wrong.",
      });
    }
    let sampleFile = req.files.id_img;
    if (sampleFile.size <= 500000) {
      if (
        sampleFile.mimetype === "image/jpeg" ||
        sampleFile.mimetype === "image/jpg" ||
        sampleFile.mimetype === "image/png" ||
        sampleFile.mimetype === "image/gif"
      ) {
        let uploadPath = __dirname + "/../uploads/" + sampleFile.name;

        await sampleFile.mv(uploadPath);
        const urlObject = await imgur.uploadFile(uploadPath);
        fs.unlinkSync(uploadPath);
        req.imgurl = urlObject.link;
        next();
      } else {
        return res.json({
          status: 500,
          msg: "The image is invalid or not supported.Allowed types: png, jpg, jpeg, gif.",
        });
      }
    } else {
      return res.json({
        status: 500,
        msg: "Image size should be not be greater than 500KB.",
      });
    }
  } catch (err) {
    res.json({
      status: 500,
      msg: "Image upload failed.",
    });
  }
}

module.exports = { imgUploader };
