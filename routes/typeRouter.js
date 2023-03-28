const Router = require('express')
const router = Router()
const typeController = require('../controllers/typeController')
const checkRoleMiddleware = require('../middlewares/checkRoleMiddleware')

router.post('/', checkRoleMiddleware("ADMIN"), typeController.create)
router.get('/', typeController.getAll)

module.exports = router