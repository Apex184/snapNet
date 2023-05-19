import express, { Request, Response, NextFunction } from 'express';
import { auth, checkAdmin } from '../middleware/auth'
import {
    createUser,
    LoginUser,
    getAllUsers,

    adminCreateCitizen,
    adminCreateUser,
    getAllCitizen,
    getCitizenById,

    adminCreateWard,
    getAllWards,
    getWardById,

    getAllState,
    getStateById,
    adminCreateState,

    getLGAById,
    getAllLGA,
    adminCreateLga,





} from '../controller/userController'

const router = express();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Snapnet! ✍️');
});

router.post('/create-user', createUser);
// login
router.post('/login-user', LoginUser)
// Admin create user
router.post('/admin-create-citizen/:id', auth, adminCreateCitizen);
router.post('/admin-create-user/:id', auth, adminCreateUser);
router.post('/admin-create-state/:id', auth, adminCreateState);
router.post('/admin-create-lga/:id', auth, adminCreateLga);
router.post('/admin-create-ward/:id', auth, adminCreateWard);
// Admin get user by his or her id
router.get('/get-user/:id', auth, getAllUsers);

router.get('/get-all-citizens', auth, getAllCitizen);
router.get('/get-citizen-by-id/:id', auth, getCitizenById);
router.get('/get-all-wards', auth, getAllWards);
router.get('/get-ward-by-id/:id', auth, getWardById);
router.get('/get-all-states', auth, getAllState);
router.get('/get-state-by-id/:id', auth, getStateById);
router.get('/get-all-lga', auth, getAllLGA);
router.get('/get-lga-by-id/:id', auth, getLGAById);


export default router; 