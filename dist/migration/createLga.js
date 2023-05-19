"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const lgaSchema_1 = __importDefault(require("../models/lgaSchema"));
const stateSchema_1 = __importDefault(require("../models/stateSchema"));
const lgasData = [
    { name: 'LGA 1', state: 'State 1' },
    { name: 'LGA 2', state: 'State 2' },
    { name: 'LGA 3', state: 'State 3' },
    { name: 'LGA 4', state: 'State 4' },
    { name: 'LGA 5', state: 'State 5' },
];
const up = async () => {
    const lgasPromises = lgasData.map(async (lgaData) => {
        const state = await stateSchema_1.default.findOne({ name: lgaData.state });
        return new lgaSchema_1.default({
            name: lgaData.name,
            state: state === null || state === void 0 ? void 0 : state._id,
        });
    });
    const lgas = await Promise.all(lgasPromises);
    await lgaSchema_1.default.create(lgas);
    console.log('LGAs created successfully.');
};
exports.up = up;
const down = async () => {
    await lgaSchema_1.default.deleteMany({});
    console.log('LGAs deleted successfully.');
};
exports.down = down;
//# sourceMappingURL=createLga.js.map