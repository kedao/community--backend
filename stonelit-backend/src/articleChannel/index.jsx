import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import { List } from './List';
//import { Create } from './Create';
// import { Edit } from './Edit';

import {Create, Edit} from './Editor';

import {ToolbarSource} from "@/_teleporters/Toolbar";
import { BreadcrumbLink } from "@/_teleporters/Breadcrumb";
import { HeadingSource } from "@/_teleporters/Heading";

function Users({ match }) {
    const { path } = match;

    return (
        <>
            <ToolbarSource>
                <Link to="/articleChannel/create" className="btn btn-link btn-float text-default"><i
                    className="icon-plus-circle2 text-primary"/><span>创建</span></Link>
            </ToolbarSource>
            <BreadcrumbLink to="/articleChannel">频道管理</BreadcrumbLink>
            <HeadingSource>频道首页</HeadingSource>
            <Switch>
                <Route exact path={path} component={List} />
                <Route path={`${path}/create`} component={Create} />
                <Route path={`${path}/edit/:id`} component={Edit} />
            </Switch>
        </>
    );
}

export { Users };

export default Users;
