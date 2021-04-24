import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ArticleAdminAduit from "./ArticleAdminAduit";
import articleAdminReview from "./ArticleAdminReview";
import articleAdminRecommend from "./ArticleAdminRecommend";
import articleAdminLogs from "./Logs";

function Article({match}) {
    const {path} = match;

    return (
        <Switch>
            {/*<Route exact path={path} component={ArticleAdminAduit}/>*/}
            <Route path={`${path}/aduit`} component={ArticleAdminAduit}/>
            <Route path={`${path}/review`} component={articleAdminReview}/>
            <Route path={`${path}/recommend`} component={articleAdminRecommend}/>
            <Route path={`${path}/logs`} component={articleAdminLogs}/>
        </Switch>
    );
}

export {Article};

export default Article;
