const Router = require ('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')


//router.post('', authMiddleware, fileController.createDir)
router.post('', authMiddleware, fileController.createDir)
router.post('/upload', authMiddleware, fileController.uploadFile)
router.get('', authMiddleware, fileController.getFiles)
router.get('/all', authMiddleware, fileController.getAllFiles)
router.get('/download', authMiddleware, fileController.downloadFile)
router.delete('/', authMiddleware, fileController.deleteFile)
router.put('/send', authMiddleware, fileController.sendFile)


router.get('/search', authMiddleware, fileController.searchFile)
router.post('/avatar', authMiddleware, fileController.uploadAvatar)
router.delete('/avatar', authMiddleware, fileController.deleteAvatar)
router.put('/profile', authMiddleware, fileController.updateProfile)








module.exports = router