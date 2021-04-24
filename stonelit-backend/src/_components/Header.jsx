import React, { useEffect } from 'react';
import { ToolbarTarget } from "@/_teleporters/Toolbar";
import { BreadcrumbTarget } from "@/_teleporters/Breadcrumb";
import { HeadingTarget } from "@/_teleporters/Heading";

function Header() {
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <div className="page-header page-header-light">
            <div className="page-header-content header-elements-md-inline">
                <div className="page-title d-flex">
                    <HeadingTarget />
                </div>

                <div className="header-elements d-none">
                    <div className="d-flex justify-content-center">
                        <ToolbarTarget />
                    </div>
                </div>
            </div>

            <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                <div className="d-flex">
                    <BreadcrumbTarget />
                </div>

                {/*
                <div className="header-elements d-none">
                    <div className="breadcrumb justify-content-center">
                        <a href="#" className="breadcrumb-elements-item">
                            <i className="icon-comment-discussion mr-2"/>
                            Support
                        </a>

                        <div className="breadcrumb-elements-item dropdown p-0">
                            <a href="#" className="breadcrumb-elements-item dropdown-toggle"
                               data-toggle="dropdown">
                                <i className="icon-gear mr-2"/>
                                Settings
                            </a>

                            <div className="dropdown-menu dropdown-menu-right">
                                <a href="#" className="dropdown-item"><i className="icon-user-lock"/> Account security</a>
                                <a href="#" className="dropdown-item"><i className="icon-statistics"/> Analytics</a>
                                <a href="#" className="dropdown-item"><i className="icon-accessibility"/> Accessibility</a>
                                <div className="dropdown-divider"/>
                                <a href="#" className="dropdown-item"><i className="icon-gear"/> All settings</a>
                            </div>
                        </div>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}

export {Header};

export default Header;
