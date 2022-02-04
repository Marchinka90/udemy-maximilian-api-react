const { validationResult, Result } = require('express-validator');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const JWT_SECRET_KEY = 'privat_super_secret_key';

exports.JWT_SECRET_KEY = JWT_SECRET_KEY;

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation data failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'User created successfully.',
                userId: result._id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });  
};
/*
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found!');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
            
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 
            JWT_SECRET_KEY,
            { expiresIn: '1h'}
            );
            res.status(201).json({
                message: 'User logged in successfully.',
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });  
};
*/

/*
exports.getUserStatus = (req, res, next) => { 
    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'User status fetched.',
                status: user.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
*/

exports.updateUserStatus = (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation data failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const newStatus = req.body.status;

    User.findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            user.status = newStatus;
            return user.save();
            
        })
        .then(result => {
            res.status(200).json({
                message: 'User status updated.',
                status: result.status
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// **** ASYNC/AWAIT ****
/*
exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation data failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
            
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        });
        const resutl =await user.save(); 
        res.status(201).json({
            message: 'User created successfully.',
            userId: resutl._id
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };  
};
*/


exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error('A user with this email could not be found!');
            error.statusCode = 401;
            throw error;
        }
                
        const isEqual = await bcrypt.compare(password, user.password);     
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
    
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 
            JWT_SECRET_KEY,
            { expiresIn: '1h'}
        );
            res.status(201).json({
                message: 'User logged in successfully.',
                token: token,
                userId: user._id.toString()
            });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    };  
};



exports.getUserStatus = async (req, res, next) => { 
    try {
        const user = await User.findById(req.userId); 
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'User status fetched.',
            status: user.status
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
}


/*
exports.updateUserStatus = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation data failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const newStatus = req.body.status;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        const result = await user.save();
            
        res.status(200).json({
            message: 'User status updated.',
            status: result.status
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
}
*/