import React from 'react';
import {Route, Switch} from 'react-router-dom';

import User from "./User";
import CommunityAuth from "./CommunityAuth";
import Permission from "./Permission";
import Logs from "./Logs";

function UserRoute({match}) {
    const {path} = match;

    return (
        <Switch>
            <Route exact path={path} component={User}/>
            <Route path={`${path}/communityAuth`} component={CommunityAuth}/>
            <Route path={`${path}/permission`} component={Permission}/>
            <Route path={`${path}/logs`} component={Logs}/>
        </Switch>
    );
}

export {UserRoute};

export default UserRoute;
