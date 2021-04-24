import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import { List } from './List';
//import { Create } from './Create';
// import { Edit } from './Edit';

import {Create, Edit} from './Editor';

import {ToolbarSource} from "@/_teleporters/Toolbar";
import { BreadcrumbLink } from "@/_teleporters/Breadcrumb";
import { HeadingSource } from "@/_teleporters/Heading";

export const resource = 'community';
export const resourceName = '社区';

function communityCategory({ match }) {
    const { path } = match;

    return (
        <>
            <ToolbarSource>
                <Link to={`/${resource}/create`} className="btn btn-link btn-float text-default"><i
                    className="icon-plus-circle2 text-primary"/><span>创建</span></Link>
            </ToolbarSource>
            <BreadcrumbLink to={`/${resource}`}>{resourceName}</BreadcrumbLink>
            <HeadingSource>{resourceName}</HeadingSource>
            <Switch>
                <Route exact path={path} component={List} />
                <Route path={`${path}/create`} component={Create} />
                <Route path={`${path}/edit/:id`} component={Edit} />
            </Switch>
        </>
    );
}

export { communityCategory };

export default communityCategory;
