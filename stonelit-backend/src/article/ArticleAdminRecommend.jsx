import React, {useEffect, useState, useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {articleAdminRecommend as resource} from '@/_services';
import UIComponent from '@/_components/UI';
import {Button} from "reactstrap";
import DataTable from "react-data-table-component";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {ToolbarSource} from "@/_teleporters/Toolbar";
import {useToasts} from "react-toast-notifications";
import {
    GeneralModel,
    ONLINE_STATUS,
    ACTION_APPROVE,
    ACTION_REJECT,
    ACTION_RECOMMEND,
    ACTION_CANCEL, CreateTopicModel
} from "./_components";

const fetchUrl = resource.selectByPage;

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

function ArticleAdminRecommendList({caption, topest, refresh, onRefresh}) {
    const [data, setData] = useState([]);

    const {addToast} = useToasts();

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [action, setAction] = useState(0);
    const [modal, setModal] = useState(false);
    const [selecteds, setSelecteds] = useState([]);

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const fn = topest ? resource.selectAllTopRecommend : resource.selectByPage;
        const response = await fn(page, size);
        setData(topest ? response.data : response.data.list);
        setTotalRows(response.data.totalCount);

        setPending(false);
    };

    useEffect(() => {
        fetcher(currentPage, setPerPage);
    }, [refresh]);

    const handleConfirm = useCallback(
        rows => async (p) => {
            let param;
            let data;
            let fn;

            if (action !== ACTION_RECOMMEND) {
                data = rows.map(e => e.articleId);
                param = p;

                switch (action) {
                    case ACTION_APPROVE:
                        fn = resource.cancelOffLine;
                        break;

                    case ACTION_REJECT:
                        fn = resource.offLine;
                        break;

                    case ACTION_CANCEL:
                        fn = resource.cancelRecommend;
                        break;

                    default:
                        break;
                }
            } else {
                fn = resource.recommend;

                data = p;
            }

            await fn(data, param);
            setModal(false);
            onRefresh();
            // fetcher(currentPage, perPage);
            // setToggledClearRows(!toggledClearRows);
        },
        [selecteds, action]
    );

    const ActionComponent = ({row, onClick, children, className}) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const handleCancelMode = value => {
        setSelecteds([value]);
        setAction(ACTION_CANCEL);
        setModal(true);
    }

    const handleSetTop = async (row) => {
        try {
            await resource.setTop(row.articleId);
            // fetcher(currentPage, perPage);
            onRefresh();
        } catch (e) {
            addToast(e || `设置置顶失败`, {appearance: 'error'});
        }
    }

    const handleCancelSetTop = async (row) => {
        try {
            await resource.cancelSetTop(row.articleId);
            // fetcher(currentPage, perPage);
            onRefresh();
        } catch (e) {
            addToast(e || `取消置顶失败`, {appearance: 'error'});
        }
    }

    const handleAsArticle = async (row) => {
        try {
            await resource.setAsArticle(row.articleId);
            // fetcher(currentPage, perPage);
            onRefresh();
        } catch (e) {
            addToast(e || `设置文章卡片失败`, {appearance: 'error'});
        }
    }

    const handleAsCover = async (row) => {
        try {
            await resource.setBigImage(row.articleId);
            // fetcher(currentPage, perPage);
            onRefresh();
        } catch (e) {
            addToast(e || `设置大图卡片失败`, {appearance: 'error'});
        }
    }

    const handlePageChange = page => {
        setCurrentPage(page);
        fetcher(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetcher(page, newPerPage);
    };

    const handleModelClose = () => {
        setModal(false);
    }

    const models = [
        /*
        {
            name: "文章ID",
            selector: "articleId",
        },
         */
        {
            name: "作者",
            selector: "authorId",
            width: "60px",
        },
        {
            name: "标题",
            selector: "title",
            width: "300px",
            cell: row => <a href={`/article/${row.articleId}?with=dirty`} target="_blank">{row.title}</a>,
        },
        {
            name: "内容类型",
            selector: "category",
            cell: (row) => row.category === 0 ? '文章' : '视频',
            width: "100px",
        },
        {
            name: "投稿频道",
            selector: "channelName",
            width: "100px",
        },
        {
            name: "稿件状态",
            cell: (row) => {
                // console.info(row.onlineStatus);

                if (row.onlineStatus !== ONLINE_STATUS) {
                    return '撤稿';
                }
                if (row.recommendFlag !== 1) {
                    return '未推荐';
                }

                switch (row.recommendType) {
                    case 0:
                        return '文章卡片';

                    case 1:
                        return '大图卡片';

                    default:
                        return '置顶大图';
                }
            },
            width: "100px",
        },
        {
            name: "投稿时间",
            selector: "createdTime",
            width: "100px",
        },
        {
            name: "过审时间",
            selector: "auditTime",
        },
        {
            name: "推荐时间",
            selector: "recommendTime",
        },];

    const columns = useMemo(
        () => [
            ...models,
            {
                name: "操作",
                cell: row => row.onlineStatus === ONLINE_STATUS && row.recommendFlag !== 0 && <>
                    {row.recommendType !== 0 &&
                    <ActionComponent row={row} onClick={row.recommendType !== 2 ? handleSetTop : handleCancelSetTop}
                                     className={classNames("btn mr-1", row.recommendType !== 2 ? 'btn-outline-success' : 'btn-outline-danger')}>{row.recommendType !== 2 ? '置顶' : '取消置顶'}</ActionComponent>}
                    {!topest && row.recommendType !== 2 &&
                    <ActionComponent row={row} onClick={row.recommendType !== 1 ? handleAsCover : handleAsArticle}
                                     className={classNames("btn btn-outline-primary mr-1")}>{row.recommendType !== 1 ? '大图' : '文章'}</ActionComponent>}
                    {!topest && <ActionComponent row={row} onClick={handleCancelMode}
                                     className="btn-outline-danger">撤回推荐</ActionComponent>}
                </>,
                width: "200px",
                ignoreRowClick: true,
                allowOverflow: true,
                // button: true,
            },
        ],
        [handleConfirm]
    );

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                progressPending={pending}
                pagination={!topest}
                paginationServer={true}
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                sortable={false}
                title={caption || resource.title}
                paginationResetDefaultPage={true}
                progressComponent={<UITableProgress/>}
                noDataComponent={<UINoData/>}
                paginationComponentOptions={{
                    noRowsPerPage: true,
                    rowsPerPageText: '每页显示',
                    rangeSeparatorText: '共'
                }}
            />

            <GeneralModel isOpen={modal} action={action} onClose={handleModelClose}
                          onConfirm={handleConfirm(selecteds)}/>
        </>
    );
}

function ArticleAdminRecommend() {
    const [refresh, setRefresh] = useState(0);
    const [model, setModel] = useState(false);

    const handleRefresh = () => {
        setRefresh(new Date(new Date().getTime()))
    }

    const onHandleInsertSubject = () => {
        setModel(true);
    }

    const handleOnClose = () => {
        setModel(false);
    }

    return (
        <div className="content">
            <BreadcrumbLink to={`/article/recommend`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <ToolbarSource>
                <button onClick={onHandleInsertSubject} className="btn btn-link btn-float text-default"><i
                    className="icon-plus-circle2 text-primary"/><span>插入专题</span></button>
            </ToolbarSource>

            <div className="card">
                <div className="card-datatable">
                    <ArticleAdminRecommendList refresh={refresh} onRefresh={handleRefresh} caption="置顶推荐" topest={true} />
                    <div className="mt-4" />
                    <ArticleAdminRecommendList refresh={refresh} onRefresh={handleRefresh} topest={false} />
                </div>
            </div>

            <CreateTopicModel isOpen={model} onClose={handleOnClose} />
        </div>
    );
}

export {ArticleAdminRecommend};

export default ArticleAdminRecommend;
