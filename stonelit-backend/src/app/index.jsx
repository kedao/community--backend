import React, {useState, useEffect} from 'react';
import {Route, Switch, Redirect, useLocation} from 'react-router-dom';
import {ToastProvider} from 'react-toast-notifications'
import {accountService} from '@/_services';
import {Layout, PrivateRoute} from '@/_components';
import {Home} from '@/home';
import Article from "@/article";
import ArticleChannel from "@/articleChannel";
import communityCategory from "@/communityCategory";
import community from "@/community";
import content from "@/content";
import statisticPage from "@/statisticPage";
import product from "@/product";
import productBrand from "@/productBrand";
import productCategory from "@/productCategory";
import productShop from "@/productShop";
import productParamSetting from "@/productParamSetting";
import sysDict from "@/sysDict";
import Test from "@/test";
import User from "@/user";
import reportHistory from "@/reportHistory";
import UserFeedback from "@/userFeedback";

import "@/_assets/css/style.css";

function Login() {
    useEffect(() => {
        window.location.href = "/account/login";
    }, []);

    return null;
}

function App() {
    const {pathname} = useLocation();
    const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    useEffect(() => {
        accountService.refreshProfile();
        // return subscription.unsubscribe; // ralf
    }, []);

    return (
        <ToastProvider placement="top-right" transitionDuration={33} autoDismiss={true} autoDismissTimeout={5000}
                       style={{zIndex: 3000}}>
            <Layout>
                <Switch>
                    <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)}/>
                    <PrivateRoute exact path="/" component={Home}/>

                    <PrivateRoute path={`/article`} component={Article}/>
                    <PrivateRoute path={`/articleChannel`} component={ArticleChannel}/>
                    <PrivateRoute path={`/communityCategory`} component={communityCategory}/>
                    <PrivateRoute path={`/community`} component={community}/>
                    <PrivateRoute path={`/content`} component={content}/>
                    <PrivateRoute path={`/statisticPage`} component={statisticPage}/>
                    <PrivateRoute path={`/product`} component={product}/>
                    <PrivateRoute path={`/productBrand`} component={productBrand}/>
                    <PrivateRoute path={`/productShop`} component={productShop}/>
                    <PrivateRoute path={`/productCategory`} component={productCategory}/>
                    <PrivateRoute path={`/productParamSetting`} component={productParamSetting}/>
                    <PrivateRoute path={`/sysDict`} component={sysDict}/>
                    <PrivateRoute path={`/test`} component={Test}/>
                    <PrivateRoute path={`/user`} component={User}/>
                    <PrivateRoute path={`/userFeedback`} component={UserFeedback}/>
                    <PrivateRoute path={`/reportHistory`} component={reportHistory}/>

                    <Route path={`/login`} component={Login}/>

                    {/*<Redirect from="*" to="/" />*/}
                </Switch>

            </Layout>
        </ToastProvider>
    );
}

export {App};
