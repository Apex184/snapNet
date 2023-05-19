"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStateById = exports.getAllState = exports.adminCreateState = exports.getLGAById = exports.getAllLGA = exports.adminCreateLga = exports.getWardById = exports.getAllWards = exports.adminCreateWard = exports.getCitizenById = exports.getAllCitizen = exports.adminCreateCitizen = exports.adminCreateUser = exports.getAllUsers = exports.LoginUser = exports.createUser = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const utils_1 = require("../util/utils");
const userSchema_2 = require("../models/userSchema");
const citizenSchema_1 = __importDefault(require("../models/citizenSchema"));
const wardsSchema_1 = __importDefault(require("../models/wardsSchema"));
const lgaSchema_1 = __importDefault(require("../models/lgaSchema"));
const stateSchema_1 = __importDefault(require("../models/stateSchema"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helperMethod_1 = require("../util/helperMethod");
const jwtsecret = process.env.JWT_SECRET;
const createUser = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body;
        if (!userType) {
            return (0, helperMethod_1.errorResponse)(res, 'Usertype is required', http_status_1.default.CONFLICT);
        }
        const existingUser = await userSchema_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = new userSchema_1.default({
            name,
            email,
            password: hashedPassword,
            userType: userType.Regular || userType.Admin,
        });
        await user.save();
        return (0, helperMethod_1.successResponse)(res, 'User registered successfully', http_status_1.default.OK, user);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.createUser = createUser;
const LoginUser = async (req, res) => {
    try {
        const user = await userSchema_1.default.findOne({ email: req.body.email });
        if (!user)
            return (0, helperMethod_1.errorResponse)(res, 'User not found', http_status_1.default.BAD_REQUEST);
        const validUser = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validUser)
            return (0, helperMethod_1.errorResponse)(res, 'Wrong credentials', http_status_1.default.BAD_REQUEST);
        const { id } = user;
        if (validUser) {
            const token = (0, utils_1.generateLoginToken)({ id });
            return (0, helperMethod_1.successResponseLogin)(res, 'Login successful', http_status_1.default.OK, { user: user }, token);
        }
    }
    catch (error) {
        console.log(error);
        return (0, helperMethod_1.serverError)(res);
    }
};
exports.LoginUser = LoginUser;
const getAllUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to access this resource' });
        }
        const users = await userSchema_1.default.find();
        if (users.length === 0) {
            return (0, helperMethod_1.errorResponse)(res, 'No users found', http_status_1.default.NOT_FOUND);
        }
        return (0, helperMethod_1.successResponse)(res, 'Fetched users successfully', http_status_1.default.OK, { users });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethod_1.serverError)(res);
    }
};
exports.getAllUsers = getAllUsers;
// create user
const adminCreateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, userType } = req.body;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }
        const existingUser = await userSchema_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: 'User with this phone number already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        if (!name || !email) {
            return (0, helperMethod_1.errorResponse)(res, 'Fill all required fields', http_status_1.default.BAD_REQUEST);
        }
        const newUser = new userSchema_1.default({
            name,
            email,
            userType: userSchema_2.UserType.Regular
        });
        await newUser.save();
        return (0, helperMethod_1.successResponse)(res, 'New citizen registered successfully', http_status_1.default.OK, newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};
exports.adminCreateUser = adminCreateUser;
// create citizen
const adminCreateCitizen = async (req, res) => {
    try {
        const { id } = req.params;
        const { phone, gender, address, fullName } = req.body;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }
        const existingUser = await citizenSchema_1.default.findOne({ phone });
        if (existingUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: 'User with this phone number already exists' });
        }
        if (!gender || !address || !fullName || !phone) {
            return (0, helperMethod_1.errorResponse)(res, 'Fill all required fields', http_status_1.default.BAD_REQUEST);
        }
        const newUser = new citizenSchema_1.default({
            phone,
            gender,
            address,
            fullName
        });
        await newUser.save();
        return (0, helperMethod_1.successResponse)(res, 'New citizen registered successfully', http_status_1.default.OK, newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};
exports.adminCreateCitizen = adminCreateCitizen;
const getAllCitizen = async (req, res) => {
    try {
        const citizens = await citizenSchema_1.default.find({}, 'id fullName gender').populate('ward');
        return (0, helperMethod_1.successResponse)(res, 'All citizens fetched successfully', http_status_1.default.OK, citizens);
    }
    catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getAllCitizen = getAllCitizen;
const getCitizenById = async (req, res) => {
    try {
        const { id } = req.params;
        const citizen = await citizenSchema_1.default.findById(id).populate('ward');
        if (!citizen) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return (0, helperMethod_1.successResponse)(res, 'Citizen detail fetched successfully', http_status_1.default.OK, citizen);
    }
    catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getCitizenById = getCitizenById;
// create ward
const adminCreateWard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }
        const existingUser = await wardsSchema_1.default.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }
        if (!name) {
            return (0, helperMethod_1.errorResponse)(res, 'Name required fields', http_status_1.default.BAD_REQUEST);
        }
        const newUser = new wardsSchema_1.default({
            name
        });
        await newUser.save();
        return (0, helperMethod_1.successResponse)(res, 'New ward registered successfully', http_status_1.default.OK, newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};
exports.adminCreateWard = adminCreateWard;
const getAllWards = async (req, res) => {
    try {
        const wards = await wardsSchema_1.default.find({}, 'id fullName gender');
        return (0, helperMethod_1.successResponse)(res, 'All ward fetched by idsuccessfully', http_status_1.default.OK, wards);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getAllWards = getAllWards;
const getWardById = async (req, res) => {
    try {
        const { id } = req.params;
        const ward = await wardsSchema_1.default.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return (0, helperMethod_1.successResponse)(res, 'Ward detail fetched successfully', http_status_1.default.OK, ward);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getWardById = getWardById;
// create LGA
const adminCreateLga = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }
        const existingUser = await lgaSchema_1.default.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }
        if (!name) {
            return (0, helperMethod_1.errorResponse)(res, 'Name required fields', http_status_1.default.BAD_REQUEST);
        }
        const newUser = new lgaSchema_1.default({
            name
        });
        await newUser.save();
        return (0, helperMethod_1.successResponse)(res, 'New LGA registered successfully', http_status_1.default.OK, newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};
exports.adminCreateLga = adminCreateLga;
const getAllLGA = async (req, res) => {
    try {
        const wards = await lgaSchema_1.default.find({}, 'id fullName gender');
        return (0, helperMethod_1.successResponse)(res, 'All LGA fetched by idsuccessfully', http_status_1.default.OK, wards);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getAllLGA = getAllLGA;
const getLGAById = async (req, res) => {
    try {
        const { id } = req.params;
        const ward = await lgaSchema_1.default.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return (0, helperMethod_1.successResponse)(res, 'LGA detail fetched successfully', http_status_1.default.OK, ward);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getLGAById = getLGAById;
// create State
const adminCreateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, state } = req.body;
        const requestingUser = await userSchema_1.default.findById(id);
        if (!requestingUser || requestingUser.userType !== userSchema_2.UserType.Admin) {
            return res.status(http_status_1.default.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }
        const existingUser = await lgaSchema_1.default.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }
        if (!name) {
            return (0, helperMethod_1.errorResponse)(res, 'Name required fields', http_status_1.default.BAD_REQUEST);
        }
        const newUser = new stateSchema_1.default({
            name,
            state
        });
        await newUser.save();
        return (0, helperMethod_1.successResponse)(res, 'New State registered successfully', http_status_1.default.OK, newUser);
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};
exports.adminCreateState = adminCreateState;
const getAllState = async (req, res) => {
    try {
        const wards = await stateSchema_1.default.find({}, 'id fullName gender');
        return (0, helperMethod_1.successResponse)(res, 'All State fetched by successfully', http_status_1.default.OK, wards);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getAllState = getAllState;
const getStateById = async (req, res) => {
    try {
        const { id } = req.params;
        const ward = await stateSchema_1.default.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'State not found' });
        }
        return (0, helperMethod_1.successResponse)(res, 'State detail fetched successfully', http_status_1.default.OK, ward);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
exports.getStateById = getStateById;
//# sourceMappingURL=userController.js.map