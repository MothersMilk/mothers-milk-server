module.exports = function (requiredRoles) {
    return (req, res, next) => {
        console.log('checking authorization for roles', requiredRoles);
        const { roles } = req.user;
        console.log('with req.user roles :', roles);
        const checked = requiredRoles.map(role => {
            if(roles && roles.indexOf(role) > -1) {
                next();
                return 'authorized';
            }        
        });
        if(!checked.includes('authorized')) next({ code: 403, error: `requires ${requiredRoles} role` });
    };
};
