const imgur = require("imgur");
const fs = require("fs");
async function imgUploader(req, res, next) {
  try {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }
    let sampleFile = req.files.id_img;
    let uploadPath = __dirname + "/../uploads/" + sampleFile.name;

    // sampleFile.mv(uploadPath, function (err) {
    //   if (err) {
    //     return res.status(500).send(err.message);
    //   } else {
    //     const urlObject = await imgur.uploadFile(uploadPath);
    //     fs.unlinkSync(uploadPath);
    //     req.imgurl = urlObject && urlObject.link;
    //     //console.log(urlObject);
    //     console.log(req.imgurl);
    //   }
    // });
    await sampleFile.mv(uploadPath);
    const urlObject = await imgur.uploadFile(uploadPath);
    fs.unlinkSync(uploadPath);
    req.imgurl = urlObject.link;
  } catch (err) {
    res.status(500).send("Sorry something went wrong!");
  }

  next();
}

module.exports = { imgUploader };
