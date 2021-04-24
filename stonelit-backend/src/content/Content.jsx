import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {contentAdmin as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import DataTable from "react-data-table-component";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import classNames from "classnames";
import UIComponent from "@/_components/UI";
import {ACTION_APPROVE, ACTION_REJECT} from "@/article/_components";
import {useToasts} from "react-toast-notifications";
import {lenString, subString} from "@/_helpers";

const fetchUrl = resource.selectNeedAuditContent;

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

const waitAuditCount = 'waitAuditCount'; // 待审数量
const autoTextExceptionCount = 'autoTextExceptionCount'; // 机审文本异常
const autoImageExceptionCount = 'autoImageExceptionCount'; // 机审图片异常
const hasReportCount = 'hasReportCount'; // 有投诉
const hitSensitiveCount = 'hitSensitiveCount'; // 命中敏感词
const totalNormalCount = 'totalNormalCount'; // 全部正常

const autoAuditFlags = {
    0: '待审核',
    1: '审核通过',
    2: '图片异常',
    3: '文本异常',
    4: '文本图片都异常',
};

const totalItems = [waitAuditCount, autoTextExceptionCount, autoImageExceptionCount, hasReportCount, hitSensitiveCount, totalNormalCount];

const allContentTypes = {
    0: '评论',
    1: '产品评价',
    2: '帖子',
    3: '回帖',
};

const queryMethods = {
    0: resource.queryArticleCommentHeadInfo,
    1: resource.queryProductCommentHeadInfo,
    2: resource.queryPostHeadInfo,
    3: resource.queryPostReplyHeadInfo,
}

const initTotals = {};
for (let [value] of Object.entries(allContentTypes)) {
    initTotals[value] = {};

    for (let item of totalItems) {
        initTotals[value][item] = 'N/A';
    }
}

const contentExceptions = {
    0: '全部内容',
    1: '任意一个模块异常',
    2: '自定义满足一下任意条件',
};

const sorts = {
    createdTime: '发布时间最新',
    likeCount: '点赞数量最高',
    replyCount: '回复最多',
};

const numbers = [];
for (let i = 1; i < 10; i++) {
    numbers.push({value: i, label: i});
}

function Counter() {
    const [totals, setTotals] = useState(initTotals);

    useEffect(() => {
        const fetch = async () => {
            const data = {...totals};

            for (let [type, method] of Object.entries(queryMethods)) {
                const response = await method();

                for (let item of totalItems) {
                    data[type][item] = response.data[item];
                }
            }

            setTotals(data);
        };

        fetch();
    }, []);

    const data = useMemo(
        () => {
            for (let [value, type] of Object.entries(allContentTypes)) {

            }
        },
        [allContentTypes]
    );

    return (
        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">待审核数量</h5>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th className="table-active"/>
                        <th className="table-active" style={{width: "14%"}}>待审核数量</th>
                        <th className="table-active" style={{width: "14%"}}>机审文本异常</th>
                        <th className="table-active" style={{width: "14%"}}>机审图片异常</th>
                        <th className="table-active" style={{width: "14%"}}>有投诉</th>
                        <th className="table-active" style={{width: "14%"}}>命中敏感词</th>
                        <th className="table-active" style={{width: "14%"}}>全部正常</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(allContentTypes).map(([type, name]) => <tr key={type}>
                        <td className="table-active">{name}</td>
                        {totalItems.map((item) => <td key={item} className={classNames({'text-muted': typeof totals[type][item] === 'string' || totals[type][item] instanceof String})}>
                            <span >{totals[type][item]}</span>
                        </td>)}
                    </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function List({applyFetch, perPage, contentTypes, userId, contentException, hitSensitive, hitSensitiveCount, report, reportCount, imageExceptionFlag, textExceptionFlag, sortField}) {
    const [data, setData] = useState([]);

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage_, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [action, setAction] = useState(0);
    const [toggledClearRows, setToggledClearRows] = useState(false);
    const [modal, setModal] = useState(false);
    const [content, setContent] = useState('');
    const [contentModal, setContentModal] = useState(false);
    const [selecteds, setSelecteds] = useState([]);
    const {addToast} = useToasts();

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const params = {
            contentTypes, userId, contentException,
            imageExceptionFlag, textExceptionFlag, sortField,
            hitSensitiveCount: hitSensitive && hitSensitiveCount > 0 ? hitSensitiveCount : null,
            reportCount: report && reportCount > 0 ? reportCount : null,
        };

        if (contentException === 2) {
            if (hitSensitive && hitSensitiveCount > 0) {
                params.hitSensitiveCount = hitSensitiveCount;
            }
            if (report && reportCount > 0) {
                params.reportCount = reportCount;
            }
        }

        const response = await fetchUrl(params, page, size);
        setData(response.data);
        setTotalRows(response.data.totalCount);

        setPending(false);
    };

    useEffect(() => {
        fetcher(1);
    }, [applyFetch]);

    const handleConfirm = useCallback(
        async () => {
            let fn;
            let actionName;

            if (action === ACTION_APPROVE) {
                fn = resource.approveAuditContent;
                actionName = '认定正常';
            } else {
                fn = resource.rejectAuditContent;
                actionName = '认定违规';
            }

            try {
                await fn(selecteds.map(e => ({id: e.id, contentType: e.contentType})));
                setModal(false);
                fetcher(1);
                setToggledClearRows(!toggledClearRows);
            } catch (e) {
                addToast(e || `设置${actionName}失败`, {appearance: 'error'});
            }
        },
        [selecteds, action]
    );

    const ActionComponent = ({ row, onClick, children, className }) => {
        const clickHandler = () => onClick([row]);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const handleApproveMode = selecteds => {
        setSelecteds(selecteds);
        setAction(ACTION_APPROVE);
        setModal(true);
    }

    const handleRejectMode = selecteds => {
        setSelecteds(selecteds);
        setAction(ACTION_REJECT);
        setModal(true);
    }

    const handleSelectedRowsChange = (e) => {
        const selecteds = e.selectedRows;
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

    const handleContentClose = () => {
        setContentModal(false);
    }

    const models = [
        {
            name: "内容ID",
            selector: "id",
        },
        {
            name: "作者",
            selector: "nickName",
        },
        {
            name: "标题",
            selector: "title",
        },
        {
            name: "内容类型",
            cell: (row) => allContentTypes.hasOwnProperty(row.contentType) ? allContentTypes[row.contentType] : '',
        },
        {
            name: "文本内容",
            selector: "contents",
            width: '300px',
            cell: (row) => {
                const length = 200;
                let string = row.contents.replace(/(<([^>]+)>)/gi, "");

                // string = '旷视科技曾经有过早日突围的希望。最初其属意港股市场，2019年5月完成D轮融资后（当时估值约40亿美元），旷视不久便向港交所递交申请，打响了AI独角兽上市的首枪。印奇在后来接受《财经》采访时提到，当时是“最好的上市时机”——遗憾的是，这一被命名为“金刚”的上市计划最终搁浅。结果就是，已完成七轮融资的旷视科技，至今仍饱受因“IPO不可控”而带来的压力。';

                if (lenString(string) <= length) {
                    return string;
                }

                // string = subString(string, 200, '');

                return <a href="#" onClick={(e) => {
                    setContent(string);
                    setContentModal(true);
                    e.preventDefault();
                }
                }>{subString(string, length, '')}</a>
            },
        },
        {
            name: "图像地址列表",
            selector: "imageList",
            cell: (row) => {
                if (!row.imageList) {
                    return "";
                }

                return row.imageList.map((url, i) => <a key={`${url}-${i}`} href={url} target="_blank"><img src={url} className="mr-1" width="38" height="38" /></a>);
            },
        },
        {
            name: "敏感词",
            selector: "hitSensitiveCount",
        },
        {
            name: "投诉",
            selector: "reportCount",
        },
        {
            name: "投稿频道",
            selector: "channelName",
        },
        {
            name: "投诉分布",
            selector: "reportCountRate",
        },
        {
            name: "机审文本",
            selector: "autoAuditFlag",
            cell: (row) => autoAuditFlags.hasOwnProperty(row.autoAuditFlag) ? autoAuditFlags[row.autoAuditFlag] : '',
        },
        {
            name: "机审核文本异常原因",
            selector: "textExceptionReason",
        },
        {
            name: "机审核图片异常原因",
            selector: "imageExceptionReason",
        },
        {
            name: "发布时间",
            selector: "createdTime",
        },
    ];

    const columns = useMemo(
        () => [
            ...models,
            {
                name: "操作",
                cell: row => <>
                    <ActionComponent row={row} onClick={handleApproveMode} className={classNames("btn mr-1", 'btn-outline-success')}>认定正常</ActionComponent>
                    <ActionComponent row={row} onClick={handleRejectMode} className={classNames("btn mr-1", 'btn-outline-danger')}>认定违规</ActionComponent>
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
            <button className="btn btn-success mr-1" onClick={e => handleApproveMode(selecteds)}>认定正常</button>
            <button className="btn btn-danger" onClick={e => handleRejectMode(selecteds)}>认定违规</button>
        </>,
        [selecteds]
    );

    // console.info(selecteds);

    return (
        <div className="card-datatable">
            <DataTable
                columns={columns}
                data={data}
                progressPending={pending}
                pagination={false}
                paginationServer={true}
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                sortable={false}
                title={"内容列表"}
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
                contextMessage={ {singular: '个内容', plural: '个内容', message: ''} }
                contextActions={contextActions}
            />

            <Modal isOpen={modal} toggle={handleModelClose} className="modal-xs">
                <ModalHeader toggle={handleModelClose} className="d-flex">
                    <i className="fas fa-plus"/> 认定{action === ACTION_APPROVE ? '正常' : '违规'}
                </ModalHeader>
                <ModalBody>
                    确定对此内容进行认定{action === ACTION_APPROVE ? '正常' : '违规'}吗？
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirm}>认定{action === ACTION_APPROVE ? '正常' : '违规'}</Button>{' '}
                    <Button color="secondary" onClick={handleModelClose}>取消</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={contentModal} toggle={handleContentClose}>
                <ModalHeader toggle={handleContentClose} className="d-flex">
                    <i className="fas fa-plus"/> 内容
                </ModalHeader>
                <ModalBody>
                    123
                    {content}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={handleContentClose}>关闭</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

function ListContainer() {
    const [contentTypes, setContentTypes] = useState([0, 1, 2, 3]);
    const [userId, setUserId] = useState(null);
    const [contentException, setContentException] = useState(0);
    const [hitSensitive, setHitSensitive] = useState(1);
    const [hitSensitiveCount, setHitSensitiveCount] = useState(1);
    const [report, setReport] = useState(1);
    const [reportCount, setReportCount] = useState(1);
    const [imageExceptionFlag, setImageExceptionFlag] = useState(1);
    const [textExceptionFlag, setTextExceptionFlag] = useState(1);
    const [refresh, setRefresh] = useState(true);
    const [sortField, setSortField] = useState('createdTime');
    const [applyFetch, setApplyFetch] = useState(false);
    const [perPage, setPerPage] = useState(5);

    const handleContentTypeChange = (e) => {
        const value = parseInt(e.target.value);
        const index = contentTypes.findIndex(function(val, index, arr) {
            return val === value;
        });

        if (e.target.checked) {
            if (index < 0) {
                setContentTypes([...contentTypes, value]);
            }
        } else {
            if (index >= 0) {
                const types = [...contentTypes];
                types.splice(index, 1);

                setContentTypes(types);
            }
        }
    }

    const handleUserIdChange = (e) => {
        setUserId(e.target.value ? e.target.value : null);
    }

    const handleContentExceptionChange = (e) => {
        const value = parseInt(e.target.value);
        setContentException(value);
    }

    const handleHitSensitiveChange = (e) => {
        setHitSensitive(e.target.checked ? 1 : 0)
    }

    const handleHitSensitiveCountChange = (e) => {
        setHitSensitiveCount(parseInt(e.target.value))
    }

    const handleReportChange = (e) => {
        setReport(e.target.checked ? 1 : 0)
    }

    const handleReportCountChange = (e) => {
        setReportCount(parseInt(e.target.value))
    }

    const handleImageExceptionFlagChange = (e) => {
        setImageExceptionFlag(e.target.checked ? 1 : 0)
    }

    const handleTextExceptionFlagChange = (e) => {
        setTextExceptionFlag(e.target.checked ? 1 : 0)
    }

    const handleSortFieldChange = (e) => {
        setSortField(e.target.value);
    }

    const handleRefreshChange = (e) => {
        setRefresh(!!e.target.checked);
    }

    const handleApplyFetch = (e) => {
        setApplyFetch(!applyFetch);
    }

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    }

    return (
        <div className="card">
            <div className="card-header bg-white header-elements-inline">
                <h6 className="card-title">审核内容</h6>
                <div className="header-elements">
                    <form action="#">
                        <div className="form-check">
                            <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" defaultChecked={true} onChange={handleRefreshChange} /> 自动刷新
                            </label>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card-body pb-0">
                <div className="row form-group">
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">内容类型</span>
                            </span>
                            <div className="form-control-box" placeholder="">
                                {Object.entries(allContentTypes).map(([value, label]) =>
                                    <div key={value} className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input" name="contentType" value={value} onChange={handleContentTypeChange} defaultChecked={contentTypes.includes(parseInt(value))} />
                                            {label}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-prepend">
                                <span className="input-group-text">指定作者ID</span>
                            </span>
                            <input type="text" className="form-control" onChange={handleUserIdChange} placeholder="" />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-prepend">
                            <span className="input-group-text">内容异常</span>
                        </span>
                        <div className="form-control-box" placeholder="">
                            {Object.entries(contentExceptions).map(([value, label]) =>
                                <div key={value} className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" name="contentException" value={value} onChange={handleContentExceptionChange} defaultChecked={contentException === parseInt(value)} />
                                        {label}
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {contentException === 2 &&
                <div className="row form-group">
                    <div className="col-md-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input"
                                                   onChange={handleHitSensitiveChange} defaultChecked={true}/>
                                            敏感词
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-control-box" placeholder="">
                                命中 <select onChange={handleHitSensitiveCountChange}>
                                {numbers.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                            </select> 个及以上敏感词
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <div className="form-check form-check-inline">
                                        <label className="form-check-label">
                                            <input type="checkbox" className="form-check-input"
                                                   onChange={handleReportChange} defaultChecked={true}/>
                                            用户投诉
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-control-box" placeholder="">
                                <select onChange={handleReportCountChange}>
                                    {numbers.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                </select> 个及以上用户投诉
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="input-group">
                            <div className="form-control-box form-control-dark">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input"
                                               onChange={handleImageExceptionFlagChange} defaultChecked={true}/>
                                        机审文本异常
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="input-group">
                            <div className="form-control-box form-control-dark">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input"
                                               onChange={handleTextExceptionFlagChange} defaultChecked={true}/>
                                        机审图片异常
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }

                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-prepend">
                            <span className="input-group-text">加载顺序</span>
                        </span>
                        <div className="form-control-box" placeholder="">
                            {Object.entries(sorts).map(([value, label]) =>
                                <div key={value} className="form-check form-check-inline">
                                    <label className="form-check-label">
                                        <input type="radio" className="form-check-input" name="sortField" value={value} onChange={handleSortFieldChange} defaultChecked={sortField === value} />
                                        {label}
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-header page-header-light pb-3 text-center">
                每次加载 <select className="form-control" style={{width: 'auto', display: 'inline'}} onChange={handlePerPageChange}>
                {[5, 10, 15, 30].map((e) => <option key={e} value={e}>{e}条</option>)}
            </select> 内容
                <button type="submit" className="btn btn-primary ml-2" onClick={handleApplyFetch}>
                    加载待审核内容</button>
            </div>

            <List applyFetch={applyFetch} perPage={perPage} userId={userId} contentTypes={contentTypes}
                  contentException={contentException} hitSensitive={hitSensitive} hitSensitiveCount={hitSensitiveCount}
                  report={report} reportCount={reportCount} imageExceptionFlag={imageExceptionFlag}
                  textExceptionFlag={textExceptionFlag} refresh={refresh} sortField={sortField} />
        </div>
    )
}

function Content() {
    return (
        <div className="content">
            <BreadcrumbLink to={`/content`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <Counter />
            <ListContainer />
        </div>
    );
}

export { Content };

export default Content;
