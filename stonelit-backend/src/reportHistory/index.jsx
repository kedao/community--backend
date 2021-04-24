import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ReportHistory from "./ReportHistory";

function UserRoute({match}) {
    const {path} = match;

    return (
        <Switch>
            <Route exact path={path} component={ReportHistory}/>
        </Switch>
    );
}

export {UserRoute};

export default UserRoute;
