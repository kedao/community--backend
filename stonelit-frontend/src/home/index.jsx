import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import classNames from "classnames";
import ReactPaginate from 'react-paginate';
import queryString from "query-string";
import {Layout} from "@/_components";
import {Home as homeService} from "@/_services";
import {dateSimple} from "./../_helpers/utils";

function PostItem({item}) {
    return (
        <div className="col-md-12">
            <div className="c-search-result">
                <div className="o-media-ontainer">
                    <div className="o-media__body">
                        <h4 className="c-search-result__title"><Link to={`/article/${item.id}`}>{item.title}</Link></h4>
                        <div className="c-search-result__metas">
                            <div className="c-search-result__meta">{item.nickName}</div>
                            <div className="c-search-result__meta">{dateSimple(item.createdTime)}</div>
                        </div>
                    </div>

                    <div className="o-media__img u-ml-medium">
                        <div className="c-avatar c-avatar--medium">
                            <img className="c-cover__img" src={item.coverImage} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Home() {
    const location = useLocation();

    const [channels, setChannels] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [channelId, setChannelId] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            const response = await homeService.selectIndexArticleChannel();
            const data = response.data;

            setChannels(data);

            return data;
        };

        fetch();
    }, []);

    useEffect(() => {
        const query = queryString.parse(location.search)
        const channelId = query.channelId ? parseInt(query.channelId) : 1;
        setChannelId(!isNaN(channelId) ? channelId : 1);
        setPage(1);
    }, [location.search]);

    useEffect(() => {
        const fetch = async (channelId, page) => {
            const response = await homeService.selectArticleCardByPage(channelId, page, 15);
            const data = response.data;

            setPageCount(data.totalPage > 0 ? data.totalPage : 1);
            setData(data.list);

            return data;
        };

        if (channelId <= 0) {
            return;
        }

        fetch(channelId, page);
    }, [channelId, page]);

    const onPageClick = (page) => {
        setPage(page);
    }

    return (
        <Layout>
            <div className="container home-container u-mb-medium u-mt-medium">
                <div className="row u-mb-large">
                    <div className="col-md-12 u-mb-medium">
                        {channels.map(e => <Link key={e.id} to={`/?channelId=${e.id}`}><span className={classNames("c-badge", {"c-badge--clean": channelId !== e.id, "c-badge--success": channelId === e.id})}>{e.title}</span></Link>)}
                    </div>

                    {data.map((item) => <PostItem key={item.id} item={item} />)}

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
                </div>
            </div>
        </Layout>
    );
}

export { Home };

export default Home;
