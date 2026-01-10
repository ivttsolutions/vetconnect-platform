"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const response_util_1 = require("../utils/response.util");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : undefined,
            message: error.msg,
        }));
        (0, response_util_1.sendError)(res, 'Validation failed', 400, errorMessages);
        return;
    }
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map