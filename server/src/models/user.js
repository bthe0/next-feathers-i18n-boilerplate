const _ = require('lodash');
const { STATUS_NEW } = require('../../../shared/constants');
const config = require('../../../config/shared.json');


/**
 * User Model
 * @param app
 */

module.exports = app => {
    const mongoose = app.get('mongoose');

    /**
     * File loaded inside user service
     */

    const user = new mongoose.Schema({
        username: {
            trim: true,
            required: true,
            type: String,
            match : [
                new RegExp('^[a-z0-9]+$', 'i'),
                '{PATH} \'{VALUE}\' is not valid. Use only letters, numbers, underscore or dot.'
            ],
            async validate(username) {
                const foundUser = await mongoose.model('user', user).findOne({
                    username: {
                        $regex: `^${username}$`,
                        $options: '-i'
                    }
                });

                if (!foundUser) {
                    return Promise.resolve();
                }

                return Promise.reject('Username already exists');
            }
        },
        email: {
            required: true,
            type: String,
            unique: true,
            lowercase: true
        },
        locale: {
            required: true,
            type: String,
            enum: config.languages
        },
        password: {
            required: true,
            type: String
        },
        resetToken: {
            type: String
        },
        resetDate: {
            type: Date
        },
        verifyToken: {
            type: String
        },
        status: {
            type: Number,
            default: STATUS_NEW
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    });

    user.pre('find', function() {
        const { username } = this._conditions;

        if (username) {
            this._conditions.username = new RegExp(username, 'i');
        }
    });

    return mongoose.model('user', user);
};
