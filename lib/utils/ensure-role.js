module.exports = function (requiredRoles) {
    return (req, res, next) => {
        const { roles } = req.user;
        if(roles) {
            if(requiredRoles.some(role => roles.indexOf(role) > -1)) return next();
        }

        next({ code: 403, error: `requires ${requiredRoles} role`});
    };
};
