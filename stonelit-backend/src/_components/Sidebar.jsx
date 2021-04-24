import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { permissions } from '@/_helpers/role';
import { accountService } from '@/_services';

function SidebarItem({to, children, icon, model}) {
    if (model) {
        const hasRight = accountService.checkRight(model);
        if (!hasRight) {
            return null;
        }
    }

    return (
        <li className="nav-item">
            <NavLink to={to} className="nav-link" exact>
                <i className={classNames(icon ? icon : 'icon-home4')} />
                <span>{children}</span>
            </NavLink>
        </li>
    )
}

function Sidebar() {
    const user = accountService.userValue || {};

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <div className="sidebar sidebar-dark sidebar-main sidebar-expand-md">

            <div className="sidebar-mobile-toggler text-center">
                <a href="#" className="sidebar-mobile-main-toggle">
                    <i className="icon-arrow-left8"/>
                </a>
                导航
                <a href="#" className="sidebar-mobile-expand">
                    <i className="icon-screen-full"/>
                    <i className="icon-screen-normal"/>
                </a>
            </div>

            <div className="sidebar-content">
                <div className="sidebar-user">
                    <div className="card-body">
                        <div className="media">
                            <div className="mr-3">
                                <a href="#" onClick={ (e) => { e.preventDefault() } }><img
                                    src={user.headUrl}
                                    width="38" height="38" className="rounded-circle" alt=""/></a>
                            </div>

                            <div className="media-body">
                                <div className="media-title font-weight-semibold">{user.nickName}</div>
                                <div className="font-size-xs opacity-50">
                                    <i className="icon-user font-size-sm"/> {user.username}
                                </div>
                            </div>

                            <div className="ml-3 align-self-center">
                                <a href="/account/logout" className="text-white"><i className="icon-switch2"/></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card card-sidebar-mobile">
                    <ul className="nav nav-sidebar" data-nav-type="accordion">
                        <li className="nav-item">
                            <a href="/" className="nav-link">
                                <i className="icon-home4" />
                                点石官网
                            </a>
                        </li>

                        <li className="nav-item-header">
                            <div className="text-uppercase font-size-xs line-height-xs">后台管理</div>
                            <i className="icon-menu" title=""/>
                        </li>

                        {accountService.checkRight(permissions.dashboard) ?
                        <SidebarItem to={`/`} icon={"icon-stats-bars"}>看板</SidebarItem> :
                        <SidebarItem to={`/`} icon={"icon-home2"}>后台首页</SidebarItem>}
                        <SidebarItem to={`/product`} model={permissions.productMaintain} icon="icon-gift">产品</SidebarItem>
                        <SidebarItem to={`/content`} model={permissions.auditManage} icon="icon-clipboard3">内容审核</SidebarItem>
                        {/*<SidebarItem to={`/content/logs`} icon="icon-clipboard5">内容审核纪录</SidebarItem>*/}
                        <SidebarItem to={`/article/aduit`} model={permissions.articleManage} icon="icon-stack">投稿管理</SidebarItem>
                        <SidebarItem to={`/article/review`} model={permissions.articleManage} icon="icon-spell-check">过审稿件</SidebarItem>
                        <SidebarItem to={`/article/recommend`} model={permissions.articleManage} icon="icon-star-full2">推荐列表</SidebarItem>
                        <SidebarItem to={`/article/logs`} model={permissions.articleManage} icon="icon-clipboard5">投稿审核纪录</SidebarItem>
                        <SidebarItem to={`/user`} model={permissions.userManage} icon="icon-user">用户管理</SidebarItem>
                        <SidebarItem to={`/user/logs`} model={permissions.userManage} icon="icon-notebook">登录记录</SidebarItem>
                        <SidebarItem to={`/user/communityAuth`} model={permissions.communityManage} icon="icon-library2">社区管理</SidebarItem>
                        <SidebarItem to={`/user/permission`} model={permissions.permissionManage} icon="icon-shield-check">权限管理</SidebarItem>
                        <SidebarItem to={`/userFeedback`} model={permissions.userManage} icon="icon-bubble-dots3">用户反馈</SidebarItem>
                        <SidebarItem to={`/reportHistory`} model={permissions.userManage} icon="icon-bubble-notification">举报历史</SidebarItem>
                        <SidebarItem to={`/statisticPage`} model={permissions.staticManage} icon="icon-link">固定页</SidebarItem>

                        {accountService.checkRight(permissions.configCenter) && <>
                        <li className="nav-item-header">
                            <div className="text-uppercase font-size-xs line-height-xs">配置中心</div>
                            <i className="icon-menu" title=""/>
                        </li>

                        <SidebarItem to={`/articleChannel`} icon="icon-grid">频道管理</SidebarItem>
                        <SidebarItem to={`/communityCategory`} icon="icon-puzzle2">社区类目</SidebarItem>
                        <SidebarItem to={`/community`} icon="icon-office">社区</SidebarItem>
                        <SidebarItem to={`/productBrand`} icon="icon-price-tag2">产品品牌</SidebarItem>
                        <SidebarItem to={`/productShop`} icon="icon-cart">产品商城</SidebarItem>
                        <SidebarItem to={`/productCategory`} icon="icon-diff-modified">产品类目</SidebarItem>
                        <SidebarItem to={`/productParamSetting`} icon="icon-unfold">产品参数库</SidebarItem>
                        <SidebarItem to={`/sysDict`} icon="icon-book">数据字典</SidebarItem>
                        </>}
                    </ul>
                </div>
            </div>
        </div>
    );

}

export {Sidebar};

export default Sidebar;
