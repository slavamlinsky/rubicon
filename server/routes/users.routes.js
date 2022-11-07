const Router = require ('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')
const usersController = require('../controllers/usersController')


//router.get('', authMiddleware, usersController.getUsers)

//Если пользователь не авторизоват, то у него нет Токена и ролей.
//А если есть роли, то значит он уже авторизован в системе 
router.get('', roleMiddleware(['USER']), usersController.getUsers)

// router.delete('/', authMiddleware, usersController.deleteUser)
// router.get('/search', authMiddleware, usersController.searchUser)

module.exports = router