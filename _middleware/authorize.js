const jwt = require('express-jwt');
const { secret } = require('config.json');
const db = require('_helpers/db');

module.exports = {
    authorize,
    authorizeAdminRole,
};

function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.data.id);
            
            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}

function authorizeAdminRole() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await db.User.findByPk(req.user.data.id);

            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized' });

            // check role user
            if(user.role !== "ADMIN_ROLE"){
                return res.status(403).json({message: 'Access is denied'})
            }

            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}