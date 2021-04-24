import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {Sidebar, Header, Footer} from '@/_components';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";

function Layout({children}) {
    // const {pathname} = useLocation();
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    return (
        <>
            {/*<Nav />*/}
            <BreadcrumbLink to="/">管理后台</BreadcrumbLink>

            <div className="page-content">
                <Sidebar />

                <div className="content-wrapper">
                    <Header />
                    {children}
                    <Footer />
                </div>
            </div>
        </>
    );
}

export {Layout};
