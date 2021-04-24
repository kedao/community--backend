import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {articleAdminAduit as resource} from '@/_services';
import UIComponent from '@/_components/UI';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import DataTable from "react-data-table-component";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

const fetchUrl = resource.selectByPage;

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

function ArticleAdminAduit() {
    const [data, setData] = useState([]);

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [approve, setApprove] = useState(false);
    const [confirmable, setConfirmable] = useState(false);
    const [toggledClearRows, setToggledClearRows] = useState(false);
    const [remark, setRemark] = useState('');
    const [modal, setModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

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
        row => async () => {
            await (approve ? resource.approve : resource.reject)(selectedIds, remark).then(() => setModal(false));
            fetcher(currentPage, perPage);
            setToggledClearRows(!toggledClearRows);
        },
        [selectedIds, approve, remark]
    );

    const ActionComponent = ({ row, onClick, children, className }) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const setupApprove = (approve) => {
        console.info('approve', approve);

        setApprove(approve);
        setRemark('');
        setConfirmable(approve);
        setModal(true);
    }

    const onApprove = value => {
        console.info('onApprove');
        setSelectedIds([value.articleId]);
        setupApprove(true);
    }

    const onReject = value => {
        setSelectedIds([value.articleId]);
        setupApprove(false);
    }

    const onBatchApprove = () => {
        setupApprove(true);
    }

    const onBatchReject = () => {
        setupApprove(false);
    }

    const onSelectedRowsChange = (e) => {
        setSelectedIds(e.selectedRows.map(e => e.articleId));
    }

    const handlePageChange = page => {
        setCurrentPage(page);
        fetcher(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetcher(page, newPerPage);
    };

    function toggle() {
        setModal(!modal);
    }

    const onContentChange = (e) => {
        setRemark(e.target.value);
        setConfirmable(!!e.target.value);
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
            cell: row => <a href={`/article/${row.articleId}?with=dirty`} target="_blank">{row.title}</a>,
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
        },
        {
            name: "投稿时间",
            selector: "createdTime",
        }];

    const columns = useMemo(
        () => [
            ...models,
            {
                name: "操作",
                cell: row => <>
                    <ActionComponent row={row} onClick={onApprove} className="btn btn-outline-success mr-1">通过</ActionComponent>
                    <ActionComponent row={row} onClick={onReject} className="btn btn-outline-danger">拒绝</ActionComponent>
                </>,
                ignoreRowClick: true,
                allowOverflow: true,
                // button: true,
            }
        ],
        [handleConfirm]
    );

    // console.info(selectedIds);

    return (
        <div className="content">
            <BreadcrumbLink to={`/article/aduit`}>{resource.title}</BreadcrumbLink>
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
                        onSelectedRowsChange={onSelectedRowsChange}
                        contextMessage={ {singular: '个项目', plural: '个项目', message: ''} }
                        contextActions={<>
                            <button className="btn btn-success mr-1" onClick={onBatchApprove}>通过</button>
                            <button className="btn btn-danger" onClick={onBatchReject}>拒绝</button>
                        </>}
                    />

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="d-flex">
                            <i className="fas fa-plus"/> {approve ? '通过' : '拒绝'}稿件
                        </ModalHeader>
                        <ModalBody>
                            {approve ?
                                <div>确定对稿件进行审核通过吗？</div> :

                                <div className="form-group">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <label>拒绝过审原因</label>
                                            <textarea rows={5} className="form-control" onChange={onContentChange} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" className={approve ? 'btn-success' : 'btn-danger'} disabled={!confirmable} onClick={handleConfirm(selectedIds)}>{approve ? '通过' : '拒绝'}稿件</Button>{' '}
                            <Button color="secondary" onClick={toggle}>取消</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export { ArticleAdminAduit };

export default ArticleAdminAduit;
