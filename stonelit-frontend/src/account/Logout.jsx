import React from 'react';
import {Redirect} from 'react-router-dom';
import {accountService} from "@/_services";

function Logout() {
    accountService.logout();

    return (
        <Redirect to={'/'} />
    );
}

export { Logout };

export default Logout;
