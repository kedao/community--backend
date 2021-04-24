import React, { useState, useEffect } from 'react';
import {Link, NavLink, Route} from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

import FooterLogo from '@/./_assets/images/footer-logo.png';
import WechatQrcode from '@/./_assets/images/wx-qrcode.jpg';
import {Popover} from "react-tiny-popover";

function Footer() {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        // const subscription = accountService.user.subscribe(x => setUser(x));
        // return subscription.unsubscribe; // ralf
    }, []);

    // only show nav when logged in
    /* if (!user) return null; */

    return (
        <footer className="footer-container text-center py-3" style={{backgroundColor: '#2a2a2a'}}>
            <img className="footer-logo mb-3" src={FooterLogo} alt="" />

            <div className="footer-text footer-nav mb-3">
                <Link className="footer-link" to="/page/8">关于我们</Link>{' | '}
                <Link className="footer-link" to="/page/9">社区规则</Link>{' | '}
                <Link className="footer-link" to="/page/10">使用协议</Link>{' | '}
                <Link className="footer-link" to="/page/11">隐私政策</Link>{' | '}
                <a className="mx-1 footer-link" href="https://jq.qq.com/?_wv=1027&k=UQRKndNI" target="_blank"><i className="fab fa-qq"/></a>
                <Popover
                    isOpen={isPopoverOpen}
                    positions={['top']} // preferred positions by priority
                    content={<img className="wx-qrcode-onfooter m-1" src={WechatQrcode} alt="" />}
                >
                    <a className="mx-1 footer-link" href="#" onClick={(e) => setIsPopoverOpen(true) && e.preventDefault() } onMouseOver={() => setIsPopoverOpen(true)} onMouseOut={() => setIsPopoverOpen(false)}><i className="fab fa-weixin"/></a>
                </Popover>
                <a className="mx-1 footer-link" href="https://weibo.com/stonelit" target="_blank"><i className="fab fa-weibo"/></a>
                <a className="mx-1 footer-link" href="mailto:public@stonelit.cn" target="_blank"><i className="fa fa-envelope"/></a>
            </div>

            <div className="footer-copyright my-1">
                <div className="footer-text">
                    © 2021 北京大地之灵科技有限公司
                </div>
                <div className="footer-text">
                    <a className="footer-link" href="http://beian.miit.gov.cn/">京ICP备202109338号</a> | <a className="footer-link" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802034845">京公网安备11010802034845号</a>
                </div>
                <div className="footer-text">
                    <a className="footer-link" href="https://www.12377.cn/">违法不良信息举报中心</a> | 举报邮箱：report@stonelit.cn
                </div>
            </div>
        </footer>
    );
}

export {Footer};

export default Footer;
