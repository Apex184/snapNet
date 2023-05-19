import { Request, Response } from 'express';
import User from '../models/userSchema'
import { generateLoginToken } from '../util/utils';
import { UserType } from '../models/userSchema'
import Citizen from '../models/citizenSchema'
import Ward from '../models/wardsSchema'
import LGA from '../models/lgaSchema'
import State from '../models/stateSchema'
import { createAdminUserSchema } from '../util/validateData'
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    errorResponse,
    serverError,
    successResponse,
    successResponseLogin
} from '../util/helperMethod';

const jwtsecret = process.env.JWT_SECRET as string;

export const createUser = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { name, email, password, userType } = req.body;
        if (!userType) {
            return errorResponse(res, 'Usertype is required', httpStatus.CONFLICT);
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType: userType.Regular || userType.Admin,
        });
        await user.save();

        return successResponse(res, 'User registered successfully', httpStatus.OK, user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};


export const LoginUser = async (req: Request, res: Response): Promise<unknown> => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) return errorResponse(res, 'User not found', httpStatus.BAD_REQUEST);
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) return errorResponse(res, 'Wrong credentials', httpStatus.BAD_REQUEST);
        const { id } = user;

        if (validUser) {
            const token = generateLoginToken({ id });

            return successResponseLogin(res, 'Login successful', httpStatus.OK, { user: user }, token);
        }

    } catch (error) {
        console.log(error);
        return serverError(res);

    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params
        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to access this resource' });
        }

        const users = await User.find();
        if (users.length === 0) {
            return errorResponse(res, 'No users found', httpStatus.NOT_FOUND);
        }

        return successResponse(res, 'Fetched users successfully', httpStatus.OK, { users });
    } catch (error) {
        console.error(error);
        return serverError(res);
    }
};

// create user
export const adminCreateUser = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;
        const { name, email, password, userType } = req.body;

        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'User with this phone number already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!name || !email) {
            return errorResponse(res, 'Fill all required fields', httpStatus.BAD_REQUEST);
        }

        const newUser = new User({
            name,
            email,
            userType: UserType.Regular
        });

        await newUser.save();
        return successResponse(res, 'New citizen registered successfully', httpStatus.OK, newUser);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};



// create citizen
export const adminCreateCitizen = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;
        const { phone, gender, address, fullName } = req.body;

        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }

        const existingUser = await Citizen.findOne({ phone });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'User with this phone number already exists' });
        }

        if (!gender || !address || !fullName || !phone) {
            return errorResponse(res, 'Fill all required fields', httpStatus.BAD_REQUEST);
        }
        const newUser = new Citizen({
            phone,
            gender,
            address,
            fullName
        });

        await newUser.save();
        return successResponse(res, 'New citizen registered successfully', httpStatus.OK, newUser);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};


export const getAllCitizen = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const citizens = await Citizen.find({}, 'id fullName gender').populate('ward');
        return successResponse(res, 'All citizens fetched successfully', httpStatus.OK, citizens);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
    }
};



export const getCitizenById = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;

        const citizen = await Citizen.findById(id).populate('ward');
        if (!citizen) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return successResponse(res, 'Citizen detail fetched successfully', httpStatus.OK, citizen);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred' });
    }
};




// create ward
export const adminCreateWard = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }

        const existingUser = await Ward.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }

        if (!name) {
            return errorResponse(res, 'Name required fields', httpStatus.BAD_REQUEST);
        }

        const newUser = new Ward({

            name
        });

        await newUser.save();
        return successResponse(res, 'New ward registered successfully', httpStatus.OK, newUser);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};


export const getAllWards = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const wards = await Ward.find({}, 'id fullName gender');
        return successResponse(res, 'All ward fetched by idsuccessfully', httpStatus.OK, wards);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


export const getWardById = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;

        const ward = await Ward.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return successResponse(res, 'Ward detail fetched successfully', httpStatus.OK, ward);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}



// create LGA
export const adminCreateLga = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }

        const existingUser = await LGA.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }

        if (!name) {
            return errorResponse(res, 'Name required fields', httpStatus.BAD_REQUEST);
        }

        const newUser = new LGA({

            name
        });

        await newUser.save();
        return successResponse(res, 'New LGA registered successfully', httpStatus.OK, newUser);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};


export const getAllLGA = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const wards = await LGA.find({}, 'id fullName gender');
        return successResponse(res, 'All LGA fetched by idsuccessfully', httpStatus.OK, wards);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


export const getLGAById = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;

        const ward = await LGA.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'Citizen not found' });
        }
        return successResponse(res, 'LGA detail fetched successfully', httpStatus.OK, ward);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


// create State
export const adminCreateState = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;
        const { name, state } = req.body;

        const requestingUser = await User.findById(id);
        if (!requestingUser || requestingUser.userType !== UserType.Admin) {
            return res.status(httpStatus.FORBIDDEN).json({ error: 'You are not authorized to create a new user' });
        }

        const existingUser = await LGA.findOne({ name: req.body.name });
        if (existingUser) {
            return res.status(httpStatus.BAD_REQUEST).json({ error: 'Ward with this name already exists' });
        }

        if (!name) {
            return errorResponse(res, 'Name required fields', httpStatus.BAD_REQUEST);
        }

        const newUser = new State({
            name,
            state
        });

        await newUser.save();
        return successResponse(res, 'New State registered successfully', httpStatus.OK, newUser);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
};


export const getAllState = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const wards = await State.find({}, 'id fullName gender');
        return successResponse(res, 'All State fetched by successfully', httpStatus.OK, wards);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


export const getStateById = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const { id } = req.params;

        const ward = await State.findById(id);
        if (!ward) {
            return res.status(404).json({ error: 'State not found' });
        }
        return successResponse(res, 'State detail fetched successfully', httpStatus.OK, ward);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}







