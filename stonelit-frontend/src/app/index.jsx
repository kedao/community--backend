import React, {useState, useEffect} from 'react';
import {Route, Switch, Redirect, useLocation} from 'react-router-dom';
import {ToastProvider, useToasts} from 'react-toast-notifications'

import {accountService} from '@/_services';
import {Layout, PrivateRoute, Alert} from '@/_components';
import {Home} from '@/home';
import App from './app';
import Test from "@/test";
import Post from "@/post";
import My from "@/my";
import Article from "@/article";
import Page from "@/page";
import Login from "@/account/Login";
import Logout from "@/account/Logout";

import "@/_assets/css/style.css";

function AppRoute() {
    const location = useLocation();
    const {pathname} = useLocation();
    // const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    useEffect(() => {
        accountService.refreshProfile();
        // return subscription.unsubscribe; // ralf
    }, [location]);

    return (
        <ToastProvider placement="top-right" transitionDuration={33} autoDismiss={true} autoDismissTimeout={5000}
                       style={{zIndex: 3000}}>
            <Switch>
                <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)}/>
                <Route exact path="/" component={Home}/>
                <Route path="/app" component={App}/>
                <Route path="/account/login" component={Login}/>
                <Route path="/article/:id" component={Article}/>
                <Route path="/page/:id" component={Page}/>
                <PrivateRoute path="/account/logout" component={Logout}/>
                <PrivateRoute path="/post" component={Post}/>
                <PrivateRoute path="/my" component={My}/>
                <Route path={`/test`} component={Test}/>

                {/*<Redirect from="*" to="/" />*/}
            </Switch>
        </ToastProvider>
    );
}

export {AppRoute};

export default AppRoute;
