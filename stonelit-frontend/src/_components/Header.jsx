import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { accountService } from '@/_services';

import AvatarIcon from "@/_assets/images/user.svg";

function Header() {
    const hasBackendRight = accountService.hasBackendRight;
    const user = accountService.userValue;

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // const [dropdownOpen, setDropdownOpen] = useState(false);

    // const toggle = () => setDropdownOpen(prevState => !prevState);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <header className="c-navbar">
            <a className="c-navbar__brand" href="/">
                <img src="/logo.svg" alt="" />
            </a>

            <nav className="c-nav collapse" id="main-nav">
                <ul className="c-nav__list">
                    <li className="c-nav__item">
                        <NavLink className="c-nav__link" to="/">首页</NavLink>
                    </li>
                    <li className="c-nav__item">
                        <NavLink className="c-nav__link" to="/app">APP</NavLink>
                    </li>
                </ul>
            </nav>

            <div className=" has-icon-right  u-hidden-down@tablet u-ml-auto u-mr-small">
                <NavLink to={'/post'}  className="c-btn c-btn--info">投稿</NavLink>
            </div>

            {user && <div className="c-dropdown dropdown">
                <a className="c-avatar c-avatar--xsmall has-dropdown dropdown-toggle" href="#" onClick={e => e.preventDefault()} id="dropdwonMenuAvatar"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img className="c-avatar__img" src={user?.headUrl || AvatarIcon} alt="" />
                </a>

                <div className="c-dropdown__menu dropdown-menu dropdown-menu-right"
                     aria-labelledby="dropdwonMenuAvatar">
                    <Link className="c-dropdown__item dropdown-item" to={`/my`}>我的主页</Link>
                    {hasBackendRight && <a className="c-dropdown__item dropdown-item" href="/backend">管理后台</a>}
                    <Link className="c-dropdown__item dropdown-item" to={`/account/logout`}>退出登录</Link>
                </div>
            </div>}

            {!user && <div className="">
                <Link className="c-avatar c-avatar--xsmall" to="/account/login">
                    <img className="c-avatar__img" src={AvatarIcon} alt="" />
                </Link>
            </div>}
        </header>
    );
}

export {Header};

export default Header;
