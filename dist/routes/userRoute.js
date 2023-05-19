"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controller/userController");
const router = (0, express_1.default)();
router.get('/', (req, res) => {
    res.send('Welcome to Snapnet! ✍️');
});
router.post('/create-user', userController_1.createUser);
// login
router.post('/login-user', userController_1.LoginUser);
// Admin create user
router.post('/admin-create-citizen/:id', auth_1.auth, userController_1.adminCreateCitizen);
router.post('/admin-create-user/:id', auth_1.auth, userController_1.adminCreateUser);
router.post('/admin-create-state/:id', auth_1.auth, userController_1.adminCreateState);
router.post('/admin-create-lga/:id', auth_1.auth, userController_1.adminCreateLga);
router.post('/admin-create-ward/:id', auth_1.auth, userController_1.adminCreateWard);
// Admin get user by his or her id
router.get('/get-user/:id', auth_1.auth, userController_1.getAllUsers);
router.get('/get-all-citizens', auth_1.auth, userController_1.getAllCitizen);
router.get('/get-citizen-by-id/:id', auth_1.auth, userController_1.getCitizenById);
router.get('/get-all-wards', auth_1.auth, userController_1.getAllWards);
router.get('/get-ward-by-id/:id', auth_1.auth, userController_1.getWardById);
router.get('/get-all-states', auth_1.auth, userController_1.getAllState);
router.get('/get-state-by-id/:id', auth_1.auth, userController_1.getStateById);
router.get('/get-all-lga', auth_1.auth, userController_1.getAllLGA);
router.get('/get-lga-by-id/:id', auth_1.auth, userController_1.getLGAById);
exports.default = router;
//# sourceMappingURL=userRoute.js.map