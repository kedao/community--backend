import React, {useEffect, useState} from 'react';
import {Link, useLocation, useRouteMatch} from 'react-router-dom';
import classNames from "classnames";
import ReactPaginate from 'react-paginate';
import queryString from "query-string";
import {useToasts} from "react-toast-notifications";
import {Layout} from "@/_components";
import {accountService, article as articleService, Home as homeService, user} from "@/_services";
import {dateSimple} from "./../_helpers/utils";
import AvatarIcon from "@/_assets/images/user.svg";

function SubmitForm({type, onSubmited, formData}) {
    const {addToast} = useToasts();

    const user = accountService.userValue;

    const [commentContent, setContentContent] = useState('');

    const label = type === 'comment' ? '评论' : '回复';

    const handleSubmit = async () => {
        const data = {
            ...formData,
            contents: commentContent,
        }

        try {
            let response;

            if (type === 'comment') {
                response = await articleService.addComment(data);
            } else {
                response = await articleService.addCommentReply(data);
            }

            setContentContent('');
            onSubmited(response);

            addToast(`发表${label}完成，审核中。`, {appearance: 'success'});
        } catch (e) {
            addToast(e || `发表${label}失败`, {appearance: 'error'});
        }
    }

    return (<div className="user-comment u-mt-small o-media-ontainer">
        <div className="avatar-ontainer">
            <img className="avatar-medium-image" alt="" src={user?.headUrl ?? AvatarIcon} />
        </div>
        <div className="comment-create__body">
            {user ? <textarea className="c-input comment-create__input" value={commentContent} onChange={(e) => setContentContent(e.target.value)} placeholder={`请输入${label}内容`} />:
                <div className={classNames("comment-disabled", {"reply-disabled": type !== 'comment'})}>
                    请先 <Link to="/account/login" className={classNames("c-btn c-btn--small c-btn--info")}>登录</Link> 后发表评论
                </div>}
        </div>
        <button className="c-btn c-btn--info" disabled={!commentContent} onClick={handleSubmit}>发表<br />{label}</button>
    </div>)
}

function Reply({comment, reply}) {
    return (
        <div className="user-card-container">
            <div className="user-card-inline">
                <div className="user-card-avatar-container">
                    <img className="user-card-avatar" src={reply.headUrl || AvatarIcon} alt="" />
                </div>

                <div className="user-card-name">
                    <span className="c-stream-item__name">
                        {reply.nickName}
                        {/*<span className="c-stream-item__username">LV{reply.userLevel}</span>*/}
                    </span>
                </div>

                <div className="user-card-remark">
                    {reply.contents}
                </div>
            </div>

            <div className="user-card-reply u-flex u-justify-between">
                <div className="c-stream-item__actionlist">
                    <span className="c-stream-item__action" onClick={ (e) => { e.preventDefault() } }>
                        {dateSimple(reply.createdTime)}
                    </span>
                    {/*
                    <a className="c-stream-item__action" href="#" onClick={ (e) => { e.preventDefault() } }>
                        <i className="fa fa fa-thumbs-up"/>{comment.likeCount}
                    </a>
                    <a className="c-stream-item__action" href="#" onClick={ (e) => { e.preventDefault() } }>
                        <i className="fa fa fa-thumbs-down"/>{comment.stampCount}
                    </a>
                    */}
                </div>
            </div>
        </div>
    )
}

function Comment({article, comment, replying, onReplying}) {
    const user = accountService.userValue;

    const [replies, setReplies] = useState([]);

    const [likes, setLikes] = useState({
        likeCount: 0,
        likeFlag: 0,
        stampCount: 0,
        stampFlag: 0,
    });

    useEffect(() => {
        setReplies(comment.replyResultList.list);
    }, [comment.replyResultList.list]);

    useEffect(() => {
        setLikes({
            likeCount: comment.likeCount,
            likeFlag: comment.likeFlag,
            stampCount: comment.stampCount,
            stampFlag: comment.stampFlag,
        });
    }, [comment.likeFlag, comment.stampFlag, comment.likeCount, comment.stampCount]);

    const handleReplySubmitted = (data) => {
        // setReplies([data, ...replies]);
        onReplying(0);
    }

    const handleLike = () => {
        const updates = {};

        if (likes.likeFlag === 1) {
            updates.likeFlag = 0;
            updates.likeCount = likes.likeCount - 1;
        } else {
            updates.likeFlag = 1;
            updates.likeCount = likes.likeCount + 1;
        }

        if (likes.stampFlag === 1) {
            updates.stampFlag = 0;
            updates.stampCount = likes.stampCount - 1;
        }

        if (updates.stampCount < 0) {
            updates.stampCount = 0;
        }
        if (updates.likeCount < 0) {
            updates.likeCount = 0;
        }

        setLikes({
            ...likes,
            ...updates,
        });

        const response = articleService.likeOrCancelLikeComment({
            action: updates.likeFlag,
            articleCommentId: comment.id,
            authorId: user.id,
        });

        return true;
    }

    const handleUnlike = () => {
        const updates = {};

        if (likes.stampFlag === 1) {
            updates.stampFlag = 0;
            updates.stampCount = likes.stampCount - 1;
        } else {
            updates.stampFlag = 1;
            updates.stampCount = likes.stampCount + 1;
        }

        if (likes.likeFlag === 1) {
            updates.likeFlag = 0;
            updates.likeCount = likes.likeCount - 1;
        }

        if (updates.stampCount < 0) {
            updates.stampCount = 0;
        }
        if (updates.likeCount < 0) {
            updates.likeCount = 0;
        }

        setLikes({
            ...likes,
            ...updates,
        });

        const response = articleService.stampOrCancelStampComment({
            action: updates.stampFlag,
            articleCommentId: comment.id,
        });

        return true;
    }

    return (
        <li className="c-stream-item o-media">
            <div className="o-media__img u-mr-small">
                <div className="c-avatar c-avatar--medium">
                    <img className="c-avatar__img" src={comment.headUrl ? comment.headUrl : AvatarIcon} alt="" />
                </div>
            </div>

            <div className="c-stream-item__content o-media__body">
                <div className="c-stream-item__header">
                    <span className="c-stream-item__name">{comment.nickName}
                        {/*<span
                            className="c-stream-item__username">LV{comment.userLevel}</span>*/}
                    </span>
                    {/*<span className="c-stream-item__time">3m</span>*/}
                </div>

                <div className="u-mb-small">{comment.contents}</div>

                {/*
                <div className="c-stream-item__gallery">
                    <img src="img/tweet1.jpg" alt="Image from Unsplash" />
                    <img src="img/tweet2.jpg" alt="Image from Unsplash" />
                </div>
                */}

                <div className="u-flex u-justify-between">
                    <div className="c-stream-item__actionlist">
                        <span className="c-stream-item__action">
                            {dateSimple(comment.createdTime)}
                        </span>
                        <a className={classNames("c-stream-item__action", {"u-color-danger": likes.likeFlag === 1})} href="#" onClick={ (e) => { handleLike() && e.preventDefault() } }>
                            <i className="fa fa fa-thumbs-up"/>{likes.likeCount}
                        </a>
                        <a className={classNames("c-stream-item__action", {"u-color-danger": likes.stampFlag === 1})} href="#" onClick={ (e) => { handleUnlike() && e.preventDefault() } }>
                            <i className="fa fa fa-thumbs-down"/>{/*likes.stampCount*/}
                        </a>
                    </div>

                    <a className="c-strem-item__actiontoggle" href="#" onClick={ (e) => { if (replying !== comment.id) {onReplying(comment.id)} e.preventDefault() } }>
                        <i className="fa fa-ellipsis-h"/>
                    </a>
                </div>

                {comment.id === replying && <SubmitForm targetId={comment.id} type="reply"
                                                        formData={{
                                                            articleAuthorId: article.userId,
                                                            articleCommentId: comment.id,
                                                            articleId: article.id,
                                                        }}
                                                        onSubmited={handleReplySubmitted}
                />}

                {replies.map((reply) => <Reply key={reply.id} reply={reply} comment={comment} />)}
            </div>
        </li>
    );
}

function Comments({commentCount, article}) {
    const [comments, setComments] = useState([]);

    const [replying, setReplying] = useState(0);

    const [page, setPage] = useState(1);

    const fetchComments = async (articleId, page) => {
        const response = await articleService.queryCommentByPage({
            articleId: articleId,
            pageNum: page,
            pageSize: 10,
        });

        setComments(response.data.list);
    }

    useEffect(() => {
        fetchComments(article.id, page).then();
    }, [article.id]);

    const handleCommentSubmitted = (data) => {
        // setComments([data, ...comments]);
    }

    const handleReplying = (id) => {
        setReplying(id);
    }

    return (
        <>
            <div className="u-mt-medium u-mb-small">
                <div className="c-search-result__metas">
                    <div className="c-search-result__meta">评论({commentCount})</div>
                </div>
            </div>

            <ol className="c-stream border-less">
                {comments.map(comment => <Comment key={comment.id} article={article} comment={comment} replying={replying} onReplying={handleReplying} />)}
            </ol>

            <SubmitForm type="comment" article={article} targetId={article.id}
                        formData={{
                            articleAuthorId: article.userId,
                            articleId: article.id,
                        }}
                        onSubmited={handleCommentSubmitted} />
        </>
    );
}

export { Comments };

export default Comments;
