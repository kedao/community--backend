import React, {useEffect, useState, useCallback} from 'react';
import {Link, useLocation} from 'react-router-dom';
import classNames from "classnames";
import ReactPaginate from 'react-paginate';
import queryString from "query-string";
import {Layout} from "@/_components";
import {accountService, articleAdmin} from "@/_services";
import {dateSimple} from "@/_helpers/utils";
import {userProfile} from "@/_services";
import AvatarIcon from "@/_assets/images/user.svg";
import UnavailableImage from "@/_assets/images/unavailable.svg";

function PostItem({item, onRemove, fromDraft}) {
    let status;
    let linkToEdit = `/post/${(item.category === 0 ? 'text' : 'media')}/${item.id}`;
    let linkTo = linkToEdit;

    if (item.state === 0) {
        status = '草稿';
    } else {
        if (item.auditState === 1) {
            status = '审核通过';
            linkTo = `/article/${item.id}`;
        } else  if (item.auditState === 2) {
            status = '审核失败';
        } else {
            status = '待审核';
        }
    }

    return (
        <div className="col-md-12">
            <div className="c-search-result">
                <div className="o-media-ontainer">
                    <div className="o-media__body">
                        <h4 className="c-search-result__title"><Link to={linkTo}>{item.title}</Link></h4>
                        <div className="c-search-result__metas">
                            <div className="c-search-result__meta">
                                {status}
                                {' '}&nbsp;|&nbsp; {' '}
                                <Link to={linkToEdit}>编辑</Link>
                                    {' '}&nbsp;|&nbsp;{' '}
                                    <a href="#" onClick={() => onRemove(item)}
                                                  className="u-text-danger"
                                                  data-toggle="modal"
                                                  data-target="#confirmModal"
                                >删除</a>
                            </div>
                            <div className="c-search-result__meta">{dateSimple(item.createdTime)}</div>
                        </div>
                    </div>

                    <div className="o-media__img u-ml-medium">
                        <div className="c-avatar c-avatar--medium">
                            <img className="c-cover__img" src={item.coverImage || UnavailableImage} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function My() {
    const user = accountService.userValue;

    const location = useLocation();

    const [userInfo, setInfo] = useState({
        headUrl: user.headUrl,
        nickName: user.nickName,
        remark: '',
        articleCount: 0,
        draftArticleCount: 0,
    });

    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [queryType, setQueryType] = useState(1);
    const [removing, setRemoving] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            const response = await userProfile.myBaseInfo();
            setInfo(response.data);

            return data;
        };

        fetch();
    }, []);

    useEffect(() => {
        const query = queryString.parse(location.search)
        const queryType = query.queryType ? parseInt(query.queryType) : 1;
        setQueryType(!isNaN(queryType) ? queryType : 1);
        setPage(1);
    }, [location.search]);

    useEffect(() => {
        const fetch = async (queryType, page) => {
            const response = await userProfile.myArticleInfo(queryType, page, 15);
            const data = response.data;

            setPageCount(data.totalPage > 0 ? data.totalPage : 1);
            setData(data.list);

            return data;
        };

        fetch(queryType, page);
    }, [queryType, page]);

    const onPageClick = ({selected}) => {
        setPage(selected+1);
    }

    const handleRemoving = (item) => {
        setRemoving(item.id);
    }

    /* eslint-disable */
    const handleRemove = useCallback(() => {
        articleAdmin.remove([removing]).then(() => {
            const newData = data.filter((e) => e.id !== removing);
            setData(newData);

            $("#confirmModal").modal('hide');
        })
    }, [removing]);

    return (
        <Layout>
            <div className="container home-container u-mb-medium u-mt-medium">
                <div className="c-card u-p-medium u-mb-medium my-profile">
                    <div className="c-avatar c-avatar--large u-mb-small u-inline-flex">
                        <img className="c-avatar__img" src={userInfo.headUrl ? userInfo.headUrl : AvatarIcon} alt="" />
                    </div>

                    <div className="u-text-center my-profile-detail">
                        <h3 className="u-h5">{userInfo.nickName}</h3>
                        {userInfo.sign && <p>{userInfo.sign}</p>}
                        {!userInfo.sign && <p className="u-text-mute u-text-small">暂无个人介绍</p>}
                    </div>
                </div>

                <div className="row u-mb-large">
                    <div className="col-md-12 u-mb-medium font-875">
                        {/*我的投稿({userInfo.articleCount}) | 我的草稿({userInfo.draftArticleCount})*/}

                        <Link to={`?queryType=1`}><span className={classNames("c-badge", {"c-badge--clean": queryType !== 1, "c-badge--success": queryType === 1})}>我的投稿({userInfo.articleCount})</span></Link>
                        <Link to={`?queryType=0`}><span className={classNames("c-badge", {"c-badge--clean": queryType !== 0, "c-badge--success": queryType === 0})}>我的草稿({userInfo.draftArticleCount})</span></Link>
                    </div>

                    {data.map((item) => <PostItem key={item.id} onRemove={handleRemoving} fromDraft={queryType === 0} item={item} />)}

                    <ReactPaginate
                        previousLabel={<i className="fa fa-caret-left"/>}
                        nextLabel={<i className="fa fa-caret-right"/>}
                        breakLabel={'...'}
                        breakClassName={'c-pagination__item'}
                        breakLinkClassName={'c-pagination-break__link'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={onPageClick}
                        previousClassName={'c-pagination__item'}
                        previousLinkClassName={'c-pagination__link'}
                        nextClassName={'c-pagination__item'}
                        nextLinkClassName={'c-pagination__link'}
                        pageClassName={'c-pagination__item'}
                        pageLinkClassName={'c-pagination__link'}
                        activeLinkClassName={'is-active'}
                        containerClassName={'c-pagination u-justify-center u-mt-medium col-md-12'}
                    />

                    <div className="c-modal modal fade" id="confirmModal" tabIndex="-1" role="dialog">
                        <div className="c-modal__dialog modal-dialog" role="document">
                            <div className="c-modal__content">
                                <div className="c-modal__header">
                                    <h3 className="c-modal__title">删除投稿</h3>

                                    <span className="c-modal__close" data-dismiss="modal">
                                        <i className="fa fa-close"/>
                                    </span>
                                </div>

                                <div className="c-modal__body">
                                    <div className="c-field u-mb-xsmall">
                                        删除后将不可恢复，确定要删除这篇投稿吗？
                                    </div>
                                </div>

                                <div className="c-modal__footer u-justify-center">
                                    <button className="c-btn c-btn--danger" onClick={handleRemove}>删除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export { My };

export default My;
