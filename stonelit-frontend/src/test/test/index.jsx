import React, {useState, useEffect} from 'react';
import {Route, Switch, Redirect, useLocation} from 'react-router-dom';
import {ToastProvider, useToasts} from 'react-toast-notifications'

import {Role} from '@/_helpers';
import {accountService} from '@/_services';
import {Layout, PrivateRoute, Alert} from '@/_components';
import {Home} from '@/home';
import ArticleChannels from "@/admin/articleChannel";
import communityCategory from "@/admin/communityCategory";
import community from "@/admin/community";
import statisticPage from "@/admin/statisticPage";
import product from "@/admin/product";
import productBrand from "@/admin/productBrand";
import productCategory from "@/admin/productCategory";
import productShop from "@/admin/productShop";
import productParamSetting from "@/admin/productParamSetting";
import sysDict from "@/admin/sysDict";
import Test from "@/test";

import {BreadcrumbTarget, BreadcrumbLink} from "@/_teleporters/Breadcrumb";

function App() {
    const {pathname} = useLocation();
    const [user, setUser] = useState({});

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    return (
        <ToastProvider placement="top-right" transitionDuration={33} autoDismiss={true} autoDismissTimeout={5000}
                       style={{zIndex: 3000}}>
            <Layout>
                <Switch>
                    <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)}/>
                    <PrivateRoute exact path="/" component={Home}/>

                    <Route path={`/articleChannel`} component={ArticleChannels}/>
                    <Route path={`/communityCategory`} component={communityCategory}/>
                    <Route path={`/community`} component={community}/>
                    <Route path={`/statisticPage`} component={statisticPage}/>
                    <Route path={`/product`} component={product}/>
                    <Route path={`/productBrand`} component={productBrand}/>
                    <Route path={`/productShop`} component={productShop}/>
                    <Route path={`/productCategory`} component={productCategory}/>
                    <Route path={`/productParamSetting`} component={productParamSetting}/>
                    <Route path={`/sysDict`} component={sysDict}/>
                    <Route path={`/test`} component={Test}/>

                    {/*<Redirect from="*" to="/" />*/}
                </Switch>

            </Layout>
        </ToastProvider>
    );
}

export {App};
