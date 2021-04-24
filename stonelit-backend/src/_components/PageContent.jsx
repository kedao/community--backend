import React, { useState, useEffect } from 'react';

function PageContent() {
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <div className="navbar navbar-expand-lg navbar-light">
            <div className="text-center d-lg-none w-100">
                <button type="button" className="navbar-toggler dropdown-toggle" data-toggle="collapse"
                        data-target="#navbar-footer">
                    <i className="icon-unfold mr-2"/>
                    Footer
                </button>
            </div>

            <div className="navbar-collapse collapse" id="navbar-footer">
                <span className="navbar-text">
                    &copy; 2021.
                </span>
            </div>
        </div>
    );
}

export {PageContent};
export default PageContent;
