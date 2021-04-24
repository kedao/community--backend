import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Content from "./Content";
import ContentLogs from "./Logs";

function UserRoute({match}) {
    const {path} = match;

    return (
        <Switch>
            <Route exact path={path} component={Content}/>
            <Route path={`${path}/logs`} component={ContentLogs}/>
        </Switch>
    );
}

export {UserRoute};

export default UserRoute;
