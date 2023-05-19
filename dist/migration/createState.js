"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const stateSchema_1 = __importDefault(require("../models/stateSchema"));
const statesData = ['State 1', 'State 2', 'State 3', 'State 4', 'State 5'];
const up = async () => {
    const states = statesData.map((stateName) => new stateSchema_1.default({ name: stateName }));
    await stateSchema_1.default.create(states);
    console.log('States created successfully.');
};
exports.up = up;
const down = async () => {
    await stateSchema_1.default.deleteMany({});
    console.log('States deleted successfully.');
};
exports.down = down;
//# sourceMappingURL=createState.js.map