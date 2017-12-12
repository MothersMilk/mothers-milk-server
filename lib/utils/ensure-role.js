module.exports = function (requiredRoles) {
    return (req, res, next) => {
        const { roles } = req.user;
        console.log('checkingg....');
        const checked = requiredRoles.map(role => {
            console.log('req.user :', roles);
            console.log('required role under check :', role);
            if(roles && roles.indexOf(role) > -1) {
                next();
                return 'authorized';
            }        
        });
        console.log('checked:', checked);
        if(!checked.includes('authorized')) next({ code: 403, error: `requires ${requiredRoles} role` });
    };
};
