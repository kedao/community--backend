import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { createTeleporter } from "./react-teleporter";

const Breadcrumb = createTeleporter();

export function BreadcrumbTarget() {
    return (
        <Breadcrumb.Target as="div" className="breadcrumb" />
    );
}

export function BreadcrumbLink(props) {
    const exactMatch = useRouteMatch({ path: props.to, exact: true });
    const {to, ...others} = props;

    return (
        <Breadcrumb.Source multiple>
            {exactMatch ? <span {...others} className="breadcrumb-item active">
                    {props.to === '/' && <i className="icon-home2 mr-2"/>} {props.children}</span>
            : <Link {...props} className="breadcrumb-item">
                    {props.to === '/' && <i className="icon-home2 mr-2"/>} {props.children}</Link>}
        </Breadcrumb.Source>
    );
}
