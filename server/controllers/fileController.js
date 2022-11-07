const fileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const fs = require("fs");
const Uuid = require("uuid");
require("dotenv").config();
const path = require("path");

class FileController {
  async createDir(req, res) {
    //console.log("new");
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      console.log(file);
      const parentFile = await File.findOne({ _id: parent });

      if (!parentFile) {
        file.path = name;
        await fileService.createDir(req, file);
      } else {
        file.path = `${parentFile.path}\\${file.name}`;
        await fileService.createDir(req, file);
        console.log(file);
        parentFile.childs.push(file._id);

        await parentFile.save();
      }
      await file.save();
      console.log(file);
      return res.json(file);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async getFiles(req, res) {
    try {
      const { sort } = req.query;
      let files;
      switch (sort) {
        case "name":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ name: 1 });
          break;
        case "type":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ type: 1 });
          break;
        case "date":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ date: 1 });
          break;
        default:
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          });
          break;
      }

      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Can not get files" });
    }
  }

  async getAllFiles(req, res) {
    try {
      const { sort } = req.query;
      const userId = "6321db073bb079c9e2368859";
      let files;
      // switch (sort){
      //     case 'name':
      //         files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name:1})
      //         break;
      //     case 'type':
      //         files = await File.find({user: req.user.id, parent: req.query.parent}).sort({type:1})
      //         break;
      //     case 'date':
      //         files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date:1})
      //         break;
      //     default:
      //         files = await File.find({user: req.user.id, parent: req.query.parent})
      //         break;
      // }

      //files = await File.find({user: req.user.id, parent: req.query.parent})
      files = await File.find({ user: userId });

      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Can not get all files" });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      //console.log(req.body.filename)
      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });
      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.diskSpace) {
        res
          .status(400)
          .json({ message: "There is not enough space on the disk" });
      }
      user.usedSpace = user.usedSpace + file.size;

      let path;
      if (parent) {
        path = `${req.filePath}/${user._id}/${parent.path}/${req.body.filename}`;
      } else {
        path = `${req.filePath}/${user._id}/${req.body.filename}`;
      }

      //console.log(filename)

      if (fs.existsSync(path)) {
        //Если уже есть файл с таким же именем, можно предложить перезаписать?!
        res.status(400).json({ message: "File already exist" });
      }
      file.mv(path);

      const type = req.body.filename.split(".").pop();
      let filePath = req.body.filename;
      if (parent) {
        filePath = parent.path + "/" + req.body.filename;
      }

      const dbFile = new File({
        name: req.body.filename,
        type,
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : null,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Upload error" });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      console.log(file);
      //const path = process.env.filePath + '\\' + req.user.id + '\\' + file.path
      const path = fileService.getPath(req, file);
      console.log(path);
      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }
      return res.status(400).json({ message: "File not found" });
    } catch (error) {
      console.log(e);
      return res.status(500).json({ message: "Download error" });
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      fileService.deleteFile(req, file);
      await file.remove();
      if (file.type === "dir") {
        return res.json({ message: "Dir was deleted" });
      } else {
        return res.json({ message: "File was deleted" });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Dir is not empty" });
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) =>
        file.name.toLowerCase().includes(searchName)
      );
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Searching error" });
    }
  }

  async uploadAvatar(req, res) {
    try {
      //const file=req.files.file
      const file = req.files.file;

      const user = await User.findById(req.user.id);

      //сначала удаляем существующий аватар пользователя !! Если он есть)
      if (user.avatar) {
        fs.unlinkSync(path.join(process.env.PWD, "static") + "/" + user.avatar);
      }

      //генерируем рандомное имя для нового файла аватара
      const avatarName = Uuid.v4() + ".jpg";

      //console.log(path.join(process.env.PWD, 'static') + '/' + avatarName + '\n');
      //console.log(path.join(process.env.PWD, 'static'));

      // Где-то тут ещё можно уменьшить картинку, чтоб занимала меньше места

      file.mv(path.join(process.env.PWD, "static") + "/" + avatarName);
      user.avatar = avatarName;
      await user.save();
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Uploading Avatar error" });
    }
  }
  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      fs.unlinkSync(path.join(process.env.PWD, "static") + "/" + user.avatar);
      user.avatar = null;
      await user.save();
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Uploading Avatar error" });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      console.log(name + email);

      const user = await User.findById(req.user.id);
      user.name = name;
      user.email = email;
      console.log(user);

      //fs.unlinkSync(path.join(process.env.PWD, 'static') + '/' + user.avatar)
      //user.avatar = null
      await user.save();
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Updating Profile error" });
    }
  }
}

module.exports = new FileController();
