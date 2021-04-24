import React from "react";
import { createTeleporter } from "./react-teleporter";

const Toolbar = createTeleporter();

export function ToolbarTarget() {
    return (
        <Toolbar.Target
            role="toolbar"
            aria-orientation="horizontal"
            aria-label="Toolbar"
        />
    );
}

export function ToolbarSource({ children, ...others }) {
    return <Toolbar.Source>
        <div className="header-elements d-none">
            <div className="d-flex justify-content-center">
                {children}
            </div>
        </div>
    </Toolbar.Source>;
}
