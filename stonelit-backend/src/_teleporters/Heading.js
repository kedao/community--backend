import React from "react";
import { createTeleporter } from "./react-teleporter";

const Heading = createTeleporter();

export function HeadingTarget() {
    return (
        <Heading.Target as="h4" />
    );
}

export function HeadingSource(props) {
    return (
        <Heading.Source multiple>
            <i className="icon-arrow-left52 mr-2"/> <span className="font-weight-semibold">{props.children}</span>
        </Heading.Source>
    );
}

export function SubHeadingSource(props) {
    return (
        <Heading.Source multiple>
            {` `} - {props.children}
        </Heading.Source>
    );
}
