"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const wardsSchema_1 = __importDefault(require("../models/wardsSchema"));
const lgaSchema_1 = __importDefault(require("../models/lgaSchema"));
const wardsData = [
    { name: 'Ward 1', lga: 'LGA 1' },
    { name: 'Ward 2', lga: 'LGA 2' },
    { name: 'Ward 3', lga: 'LGA 3' },
    { name: 'Ward 4', lga: 'LGA 4' },
    { name: 'Ward 5', lga: 'LGA 5' },
];
const up = async () => {
    const wardsPromises = wardsData.map(async (wardData) => {
        const lga = await lgaSchema_1.default.findOne({ name: wardData.lga });
        return new wardsSchema_1.default({
            name: wardData.name,
            lga: lga === null || lga === void 0 ? void 0 : lga._id,
        });
    });
    const wards = await Promise.all(wardsPromises);
    await wardsSchema_1.default.create(wards);
    console.log('Wards created successfully.');
};
exports.up = up;
const down = async () => {
    await wardsSchema_1.default.deleteMany({});
    console.log('Wards deleted successfully.');
};
exports.down = down;
//# sourceMappingURL=createWard.js.map