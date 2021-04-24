import React from 'react';
import {Route, Switch} from 'react-router-dom';

import UserFeedback from "./UserFeedback";

function Index({match}) {
    const {path} = match;

    return (
        <Switch>
            <Route exact path={path} component={UserFeedback}/>
        </Switch>
    );
}

export {Index};

export default Index;
