module.exports = function (requiredRoles) {
    return (req, res, next) => {
        const { roles } = req.user;
        const checked = requiredRoles.map(role => {
            if(roles && roles.indexOf(role) > -1) {
                next();
                return 'authorized';
            }        
        });
        if(!checked.includes('authorized')) next({ code: 403, error: `requires ${requiredRoles} role` });
    };
};
