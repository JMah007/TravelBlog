const Joi = require("joi");

const registerVal = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required."
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long."
    })
});

const loginVal = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required."
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required."
    })
});

// Couldnt get joi validation for title and content worked out


module.exports = { registerVal, loginVal };
