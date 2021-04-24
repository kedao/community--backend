import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import classNames from "classnames";
import {useToasts} from "react-toast-notifications";
import {Layout} from "@/_components";
import {article as articleService} from "@/_services";
import AvatarIcon from "@/_assets/images/user.svg";
import ArticleComment from "./comment";
import {dateSimple} from "@/_helpers/utils";
import ReactPlayer from 'react-player'

function Article() {
    const match = useRouteMatch();
    const {addToast} = useToasts();

    const id = match.params.id;
    const [pending, setPending] = useState(true);

    const [article, setArticle] = useState(null);

    useEffect(() => {
        document.body.className = 'blank';
        return () => { document.body.className = ''; }
    });

    useEffect(() => {
        const fetch = async () => {
            setPending(true);

            const response = await articleService.queryDetailById(id);
            const data = response.data;

            setArticle(data);

            setPending(false);

            return data;
        };

        fetch();
    }, [id]);

    return (
        <Layout>
            <div className="container home-container u-mb-medium u-mb-medium">
                {pending && <div>Loading</div>}
                {!pending && !article && <div>没有找个文章，或者该文章在审核中</div>}
                {article && <div className="row u-mb-large">
                    <div className="col-md-12">
                        <div className="u-mt-medium u-text-center">
                            <img src={article.coverImage} className="cover-image" />
                        </div>

                        <div className="u-mt-medium u-mb-medium u-text-center">
                            <h2 className="post-title">
                                {article.title}
                            </h2>
                        </div>

                        <div className="c-search-result article-search border-less">
                            <div className="o-media-ontainer">
                                <div className="o-media__img u-mr-medium">
                                    <div className="c-avatar c-avatar--medium">
                                        <img className="c-cover__img" alt="" src={article.headUrl || AvatarIcon} />
                                    </div>
                                </div>
                                <div className="o-media__body">
                                    <h4 className="c-search-result__title">
                                        {article.nickName}&nbsp;
                                        {/*<span className="c-badge c-badge--success">Lv{article.userLevel}</span>*/}
                                    </h4>
                                    <div className="c-search-result__metas">
                                        <div className="c-search-result__meta">{article.sign}</div>
                                        <div className="c-search-result__meta">
                                            <button className={classNames("c-btn c-btn--small c-btn--fullwidth", 1 ? "c-btn--info" : "c-btn--secondary")}>关注</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="u-mt-medium ">
                            <div className="c-search-result__metas">
                                <div className="c-search-result__meta">{article.visitCount}次浏览 &middot; {dateSimple(article.createdTime)} <span className="c-badge c-badge--success">{article.channelName}</span></div>
                            </div>
                        </div>

                        <div className="c-card u-mt-small u-mb-medium  u-mb-medium content-container border-less">
                            {article.category === 0 ?
                            <div dangerouslySetInnerHTML={{__html: article.details}} />:
                            <ReactPlayer url={article.remark} controls width="100%" height="100%" playing={true} />}
                        </div>

                        <ArticleComment commentCount={article.commentCount} article={article} />
                    </div>
                </div>
                }
            </div>
        </Layout>
    );
}

export { Article };

export default Article;
