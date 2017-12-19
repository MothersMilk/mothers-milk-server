module.exports = function (requiredRoles) {
    return (req, res, next) => {
        const { roles } = req.user;
        if(roles) {
            // "some" exits after first true
            if(requiredRoles.some(role => roles.indexOf(role) > -1)) return next();
        }
        
        next({ code: 403, error: `requires ${requiredRoles} role` });
    };
};
