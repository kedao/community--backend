import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { accountService } from '@/_services';
import {Role} from "@/_helpers";

function PrivateRoute({ component: Component, roles, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const user = accountService.userValue;
            if (!user) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />
            }

            if (roles) {
                const userRoles = user?.roleCodeList ?? [];
                let checked = false;

                for (let role of roles) {
                    if (userRoles.includes(role)) {
                        checked = true;
                        break;
                    }
                }

                if (!checked) {
                    return <Redirect to={{ pathname: '/'}} />
                }
            }

            /*
            // check if route is restricted by role
            if (roles && roles.indexOf(user.role) === -1) {
                // role not authorized so redirect to home page
                return <Redirect to={{ pathname: '/'}} />
            }
             */

            // authorized so return component
            return <Component {...props} />
        }} />
    );
}

export { PrivateRoute };