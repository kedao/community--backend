import React, {useState} from 'react';
import {Layout} from "@/_components";

import ImageIos from "@/_assets/images/app/1.png";
import ImageAndroid from "@/_assets/images/app/2.png";
import ImageQrCode from "@/_assets/images/app/android-qrcode.png";

function App() {
    const [showAndroid, setShowAndroid] = useState(false);

    return (
        <Layout>
            <section className="hero-section">
                <div className="container">
                    <div className="row figure-holder">
                        <div className="col-12">
                            <h2 className="site-headline">发现智能生活</h2>
                            <div className="site-tagline mb-3">
                                产品库：全网智能产品数据查询，口碑<br />
                                资讯：智能家居攻略、评测、体验<br />
                                社区：专属智能爱好者的交流平台
                            </div>
                            <div className=""><br /><br /></div>
                            <div className="container mx-0 px-0 d-flex app-stores">
                                <div className="row mx-0 px-0">
                                    <div className="col m-1 p-0">
                                        <a href="#" onClick={ (e) => { e.preventDefault() } }>
                                            <img className="app-stores-icon app-stores-icon-ios rounded mx-auto d-block"
                                                 src={ImageIos} alt="IOS商店" />
                                        </a>
                                    </div>
                                    <div className="col m-1 p-0">
                                        <a href="#" onClick={ (e) => { e.preventDefault() } } onMouseEnter={() => setShowAndroid(true)}
                                           onMouseLeave={() => setShowAndroid(false)}>
                                            <img
                                                className="app-stores-icon app-stores-icon-android center rounded mx-auto d-block"
                                                src={ImageAndroid} alt="安卓下载图标" />
                                        </a>
                                        {showAndroid &&
                                        <div className="android-qr m-1 p-1">
                                            <img
                                                className="app-stores-qrcode app-stores-qrcode-android centermx-auto d-block"
                                                src={ImageQrCode}/>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

export { App };

export default App;
