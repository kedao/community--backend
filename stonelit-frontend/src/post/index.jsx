import React from 'react';

import {Link, Route, Switch} from "react-router-dom";
import TextPost from "./TextPost";
import MediaPost from "./MediaPost";
import PostPost from "./Post";
import {Layout} from "@/_components";

function Select() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <div className="u-mv-large u-text-center">
                        <h2 className="u-mb-xsmall">内容投稿</h2>
                        <p className="u-text-mute u-h6">请从下面选择文章、视频投稿方式，或者发帖</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-lg-4">
                    <div className="c-card u-p-medium u-text-center u-mb-medium" data-mh="landing-cards">
                        <img className="u-mb-small" src="/assets/img/icon-intro1.svg" alt="iPhone icon" />

                        <h4 className="u-h6 u-text-bold u-mb-small">
                        </h4>
                        <Link className="c-btn c-btn--info" to="/post/text">文章投稿</Link>
                    </div>
                </div>

                <div className="col-sm-12 col-lg-4">
                    <div className="c-card u-p-medium u-text-center u-mb-medium" data-mh="landing-cards">
                        <img className="u-mb-small" src="/assets/img/icon-intro2.svg" alt="iPhone icon" />

                        <h4 className="u-h6 u-text-bold u-mb-small">
                        </h4>
                        <Link className="c-btn c-btn--info" to="/post/media">视频投稿</Link>
                    </div>
                </div>

                <div className="col-sm-12 col-lg-4">
                    <div className="c-card u-p-medium u-text-center u-mb-medium" data-mh="landing-cards">

                        <img className="u-mb-small" src="/assets/img/icon-intro3.svg" alt="iPhone icon" />

                        <h4 className="u-h6 u-text-bold u-mb-small">
                        </h4>
                        <Link className="c-btn c-btn--info" to="/post/post">发帖</Link>
                    </div>
                </div>
            </div>
        </div>

    );
}

function Post({match}) {
    const {path} = match;

    return (
        <Layout>
            <Switch>
                <Route exact path={path} component={Select}/>
                <Route path={`${path}/text/:id`} component={TextPost}/>
                <Route path={`${path}/text`} component={TextPost}/>
                <Route path={`${path}/media/:id`} component={MediaPost}/>
                <Route path={`${path}/media`} component={MediaPost}/>
                <Route path={`${path}/post`} component={PostPost}/>
            </Switch>
        </Layout>
    );
}

export { Post };

export default Post;
