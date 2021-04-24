import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

function Sidebar() {
    const [user, setUser] = useState({});

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
                Navigation
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
                                <a href="#"><img
                                    src="/backend/global_assets/images/placeholders/placeholder.jpg"
                                    width="38" height="38" className="rounded-circle" alt=""/></a>
                            </div>

                            <div className="media-body">
                                <div className="media-title font-weight-semibold">Victoria Baker</div>
                                <div className="font-size-xs opacity-50">
                                    <i className="icon-pin font-size-sm"/> &nbsp;Santa Ana, CA
                                </div>
                            </div>

                            <div className="ml-3 align-self-center">
                                <a href="#" className="text-white"><i className="icon-cog3"/></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card card-sidebar-mobile">
                    <ul className="nav nav-sidebar" data-nav-type="accordion">

                        <li className="nav-item-header">
                            <div className="text-uppercase font-size-xs line-height-xs">后台管理</div>
                            <i className="icon-menu" title="Main"/></li>
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link active">
                                <i className="icon-home4"/>
                                <span>
									看板
								</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/product" className="nav-link">
                                <i className="icon-stack2"/>
                                <span>
									产品
								</span>
                            </NavLink>
                        </li>
                        <li className="nav-item nav-item-submenu">
                            <a href="#" onClick={ (e) => { e.preventDefault() } } className="nav-link"><i className="icon-wrench"/> <span>配置项</span></a>

                            <ul className="nav nav-group-sub" data-submenu-title="Layouts">
                                <li className="nav-item"><NavLink to="/articleChannel" className="nav-link">频道管理</NavLink></li>
                                <li className="nav-item"><NavLink to="/communityCategory" className="nav-link">社区类目</NavLink></li>
                                <li className="nav-item"><NavLink to="/community" className="nav-link">社区</NavLink></li>
                                <li className="nav-item"><NavLink to="/statisticPage" className="nav-link">固定页</NavLink></li>
                                <li className="nav-item"><NavLink to="/productBrand" className="nav-link">产品品牌</NavLink></li>
                                <li className="nav-item"><NavLink to="/productShop" className="nav-link">产品商城</NavLink></li>
                                <li className="nav-item"><NavLink to="/productCategory" className="nav-link">产品类目</NavLink></li>
                                <li className="nav-item"><NavLink to="/productParamSetting" className="nav-link">产品参数库</NavLink></li>
                                <li className="nav-item"><NavLink to="/sysDict" className="nav-link">数据字典</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );

}

export {Sidebar};

export default Sidebar;
