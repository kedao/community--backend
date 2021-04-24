import React, { useEffect } from 'react';

function Footer() {
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <div className="navbar navbar-expand-lg navbar-light">
            <div className="navbar-collapse collapse" id="navbar-footer">
                <span className="navbar-text">
                    &copy; 2021 点石后台管理.
                </span>
            </div>
        </div>
    );
}

export {Footer};

export default Footer;
