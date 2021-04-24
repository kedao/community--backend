import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import {productCategory as resource} from '@/_services';
import {ToolbarSource} from "@/_teleporters/Toolbar";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

import {List} from './List';
import {Create, Edit} from './Editor';

function communityCategory({match}) {
    const {path} = match;

    return (
        <>
            <HeadingSource>{resource.title}</HeadingSource>
            <Switch>
                <Route exact path={path} component={List}/>
                <Route path={`${path}/create`} component={Create}/>
                <Route path={`${path}/edit/:id`} component={Edit}/>
                <Route path={`${path}/:pid`} component={List}/>
            </Switch>
        </>
    );
}

export {communityCategory};

export default communityCategory;
