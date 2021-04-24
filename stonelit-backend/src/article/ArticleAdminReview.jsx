import React, {useEffect, useState, useCallback, useMemo} from 'react';
import classNames from 'classnames';
import {articleAdminReview as resource} from '@/_services';
import UIComponent from '@/_components/UI';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import DataTable from "react-data-table-component";
import {sortableContainer, sortableElement, sortableHandle} from "react-sortable-hoc";
import arrayMove from "array-move";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

const fetchUrl = resource.selectByPage;

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

const ONLINE_STATUS = 0; // 正常上架状态

const ACTION_APPROVE = 0; // 上架
const ACTION_REJECT = 1; // 下架
const ACTION_RECOMMEND = 2; // 推荐
const ACTION_CANCEL = 3; // 取消推荐

function GeneralModel({isOpen, action, markable, onClose, onConfirm}) {
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [actionClassName, setActionClassName] = useState('');
    const [remark, setRemark] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setModal(isOpen);

        let actionClassName = 'btn-danger';
        let disabled = false;

        if (action === ACTION_APPROVE) {
            setTitle('取消撤稿');
            actionClassName = 'btn-success';
        } else if (action === ACTION_CANCEL) {
            setTitle('取消推荐');
        } else if (action === ACTION_REJECT) {
            setTitle('撤稿');
            disabled = true;
        }

        setActionClassName(actionClassName);
        setDisabled(disabled);
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    function handelClose() {
        setModal(false);
        onClose();
    }

    function handleConfirm() {
        onConfirm(remark);
    }

    function onContentChange(e) {
        setRemark(e.target.value);
        setDisabled(!e.target.value);
    }

    return (<Modal isOpen={modal} toggle={handelClose}>
        <ModalHeader toggle={handelClose} className="d-flex">
            <i className="fas fa-plus"/> {title}
        </ModalHeader>
        <ModalBody>
            {action === ACTION_APPROVE || action === ACTION_CANCEL ?
                <div>确定对稿件进行取消撤稿吗？</div> :

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-12">
                            <label>撤稿原因</label>
                            <textarea rows={5} className="form-control" onChange={onContentChange} />
                        </div>
                    </div>
                </div>
            }
        </ModalBody>
        <ModalFooter>
            <Button color="primary" className={actionClassName} disabled={disabled} onClick={handleConfirm}>{title}</Button>{' '}
            <Button color="secondary" onClick={handelClose}>取消</Button>
        </ModalFooter>
    </Modal>);
}

function RecommendModel({isOpen, selecteds, onClose, onConfirm}) {
    const [modal, setModal] = useState(false);
    const [items, setItems] = useState([]);
    const [positions, setPositions] = useState({});

    useEffect(() => {
        const positions = {}

        setModal(isOpen);
        setItems(selecteds);
        for (let datum of selecteds) {
            positions[datum.articleId] = 0;
        }
        setPositions(positions);

    }, [isOpen]);

    function handleChange(articleId, value) {
        positions[articleId] = parseInt(value);
    }

    function handelClose() {
        setModal(false);
        onClose();
    }

    function handleConfirm() {
        const data = items.map((e) => ({articleId: e.articleId, recommendType: positions[e.articleId]}));
        onConfirm(data);
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    const DragHandle = sortableHandle(() => <span className="recommend-item-drag-handle drag-handle-init mr-1" title="拖动排序"><i className="icon-three-bars"/></span>);

    const SortableContainer = sortableContainer(({children}) => {
        return <div className="recommend-items">{children}</div>;
    });

    const SortableItem = sortableElement(({item}) => (
        <div className="p-2 mt-1 bg-light border rounded recommend-item">
            <div className="recommend-item-title">
                <DragHandle /> {item.title}
            </div>

            <div className="recommend-item-selects">
                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="0" onChange={(e) => handleChange(item.articleId, e.target.value)} defaultChecked={true} />
                        文章
                    </label>
                </div>

                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="1" onChange={(e) => handleChange(item.articleId, e.target.value)} />
                        大图
                    </label>
                </div>

                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="2" onChange={(e) => handleChange(item.articleId, e.target.value)} />
                        大图并置顶
                    </label>
                </div>
            </div>
        </div>
    ));

    return (<Modal isOpen={modal} toggle={handelClose} className="modal-lg">
        <ModalHeader toggle={handelClose} className="d-flex">
            <i className="fas fa-plus"/> 推荐
        </ModalHeader>
        <ModalBody>
            <SortableContainer helperClass="sortableHelper" onSortEnd={onSortEnd} useDragHandle axis="y">
                {items.map((e, i) => <SortableItem key={e.articleId} index={i} item={e} />)}
            </SortableContainer>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" className="btn-success" onClick={handleConfirm}>推荐</Button>{' '}
            <Button color="secondary" onClick={handelClose}>取消</Button>
        </ModalFooter>
    </Modal>);
}

function ArticleAdminReview() {
    const [data, setData] = useState([]);

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [action, setAction] = useState(0);
    const [toggledClearRows, setToggledClearRows] = useState(false);
    const [modal, setModal] = useState(false);
    const [recommendModal, setRecommendModal] = useState(false);
    const [recommendable, setRecommendable] = useState(true);
    const [selecteds, setSelecteds] = useState([]);

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const response = await fetchUrl(page, size);
        setData(response.data.list);
        setTotalRows(response.data.totalCount);

        setPending(false);
    };

    useEffect(() => {
        fetcher(1);
    }, []);

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
            setRecommendModal(false);
            fetcher(currentPage, perPage);
            setToggledClearRows(!toggledClearRows);
        },
        [selecteds, action]
    );

    const ActionComponent = ({ row, onClick, children, className }) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const handleApproveMode = value => {
        setSelecteds([value]);
        setAction(ACTION_APPROVE);
        setModal(true);
    }

    const handleRejectMode = value => {
        setSelecteds([value]);
        setAction(ACTION_REJECT);
        setModal(true);
    }

    const handleCancelMode = value => {
        console.info('handleCancelMode');

        setSelecteds([value]);
        setAction(ACTION_CANCEL);
        setModal(true);
    }

    const handleRecommendMode = value => {
        setSelecteds([value]);
        setAction(ACTION_RECOMMEND);
        setRecommendModal(true);
    }

    const handleApproveBatch = () => {
        setAction(ACTION_APPROVE);
        setModal(true);
    }

    const handleRejectBatch = () => {
        setAction(ACTION_REJECT);
        setModal(true);
    }

    const handleRecommendBatch = () => {
        setAction(ACTION_RECOMMEND);
        setRecommendModal(true);
    }

    const handleCancelBatch = () => {
        setAction(ACTION_CANCEL);
        setModal(true);
    }

    const handleSelectedRowsChange = (e) => {
        const selecteds = e.selectedRows;
        let recommendable = true;

        for (let datum of selecteds) {
            if (datum.onlineStatus === 1) {
                recommendable = false;
                break;
            }
        }

        setRecommendable(recommendable);
        setSelecteds(selecteds);
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

    const handleRecommendClose = () => {
        setRecommendModal(false);
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
            cell: row => <a href={`/article/${row.articleId}?with=dirty`} rel="noreferrer" target="_blank">{row.title}</a>,
            width: "300px",
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
            width: "120px",
        },
        {
            name: "稿件状态",
            cell: (row) => {
                if (row.onlineStatus !== ONLINE_STATUS) {
                    return '撤稿';
                }

                return row.recommendFlag === 1 ? '推荐' : '未推荐';
            },
            width: "100px",
        },
        {
            name: "投稿时间",
            selector: "createdTime",
        },
        {
            name: "过审时间",
            selector: "auditTime",
        },
        ];

    const columns = useMemo(
        () => [
            ...models,
            {
                name: "操作",
                cell: row => <>
                    <ActionComponent row={row} onClick={row.onlineStatus !== ONLINE_STATUS ? handleApproveMode : handleRejectMode} className={classNames("btn mr-1", row.onlineStatus !== ONLINE_STATUS ? 'btn-outline-success' : 'btn-outline-danger')}>{row.onlineStatus === ONLINE_STATUS ? '撤稿' : '取消撤稿'}</ActionComponent>
                    {row.onlineStatus === ONLINE_STATUS && <ActionComponent row={row} onClick={row.recommendFlag !== 1 ? handleRecommendMode : handleCancelMode} className={classNames("btn mr-1", row.recommendFlag !== 1 ? 'btn-outline-success' : 'btn-outline-danger')}>{row.recommendFlag !== 1 ? '推荐' : '取消推荐'}</ActionComponent>}
                </>,
                ignoreRowClick: true,
                allowOverflow: true,
                // button: true,
            },
        ],
        [handleConfirm]
    );

    const contextActions = useMemo(
        () => <>
            <button className="btn btn-success mr-1" onClick={handleApproveBatch}>取消撤稿</button>
            <button className="btn btn-danger mr-1" onClick={handleRejectBatch}>撤稿</button>
            <button className="btn btn-success mr-1" disabled={!recommendable} onClick={handleRecommendBatch}>推荐</button>
            <button className="btn btn-danger" disabled={!recommendable} onClick={handleCancelBatch}>取消推荐</button>
        </>,
        [selecteds]
    );

    // console.info(selecteds);

    return (
        <div className="content">
            <BreadcrumbLink to={`/article/review`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <div className="card">
                <div className="card-datatable">
                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={pending}
                        pagination={true}
                        paginationServer={true}
                        paginationTotalRows={totalRows}
                        paginationDefaultPage={currentPage}
                        paginationPerPage={perPage}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        sortable={false}
                        title={resource.title}
                        paginationResetDefaultPage={true}
                        progressComponent={<UITableProgress />}
                        noDataComponent={<UINoData />}
                        paginationComponentOptions={{
                            noRowsPerPage: true,
                            rowsPerPageText: '每页显示',
                            rangeSeparatorText: '共'
                        }}
                        selectableRows={true}
                        clearSelectedRows={toggledClearRows}
                        onSelectedRowsChange={handleSelectedRowsChange}
                        contextMessage={ {singular: '个稿件', plural: '个稿件', message: ''} }
                        contextActions={contextActions}
                    />

                    <GeneralModel isOpen={modal} action={action} onClose={handleModelClose} onConfirm={handleConfirm(selecteds)} />
                    <RecommendModel isOpen={recommendModal} selecteds={selecteds} action={action} onClose={handleRecommendClose} onConfirm={handleConfirm(selecteds)} />

                    {/*
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="d-flex">
                            <i className="fas fa-plus"/> {action ? '取消' : ''}撤稿
                        </ModalHeader>
                        <ModalBody>
                            {action ?
                                <div>确定对稿件进行取消撤稿吗？</div> :

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>撤稿原因</label>
                                            <textarea rows={5} className="form-control" onChange={onContentChange} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" className={action ? 'btn-success' : 'btn-danger'} disabled={!confirmable} onClick={handleConfirm(selecteds)}>{action ? '取消' : ''}撤稿</Button>{' '}
                            <Button color="secondary" onClick={toggle}>取消</Button>
                        </ModalFooter>
                    </Modal>
                    */}
                </div>
            </div>
        </div>
    );
}

export { ArticleAdminReview };

export default ArticleAdminReview;
