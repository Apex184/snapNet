"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const citizenSchema_1 = __importDefault(require("../models/citizenSchema"));
const wardsSchema_1 = __importDefault(require("../models/wardsSchema"));
const citizensData = [
    {
        fullName: 'Citizen 1',
        gender: 'Male',
        address: 'Address 1',
        phone: '1234567890',
        ward: 'Ward 1',
    },
];
const up = async () => {
    const citizensPromises = citizensData.map(async (citizenData) => {
        const ward = await wardsSchema_1.default.findOne({ name: citizenData.ward });
        return new citizenSchema_1.default({
            fullName: citizenData.fullName,
            gender: citizenData.gender,
            address: citizenData.address,
            phone: citizenData.phone,
            ward: ward === null || ward === void 0 ? void 0 : ward._id,
        });
    });
    const citizens = await Promise.all(citizensPromises);
    await citizenSchema_1.default.create(citizens);
    console.log('Citizens created successfully.');
};
exports.up = up;
const down = async () => {
    await citizenSchema_1.default.deleteMany({});
    console.log('Citizens deleted successfully.');
};
exports.down = down;
//# sourceMappingURL=createCitizen.js.map