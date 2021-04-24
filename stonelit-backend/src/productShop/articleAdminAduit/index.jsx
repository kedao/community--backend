import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import {product as resource} from '@/_services';
import {ToolbarSource} from "@/_teleporters/Toolbar";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

import {List} from './List';
import {Create, Edit} from './Editor';

function communityCategory({match}) {
    const {path} = match;

    return (
        <>
            <ToolbarSource>
                <Link to={`/${resource.name}/create`} className="btn btn-link btn-float text-default"><i
                    className="icon-plus-circle2 text-primary"/><span>创建</span></Link>
            </ToolbarSource>
            <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>
            <Switch>
                <Route exact path={path} component={List}/>
                <Route path={`${path}/create`} component={Create}/>
                <Route path={`${path}/edit/:id`} component={Edit}/>
            </Switch>
        </>
    );
}

export {communityCategory};

export default communityCategory;
