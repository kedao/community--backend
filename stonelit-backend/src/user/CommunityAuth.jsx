import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {communityAuth as resource, post as postService} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {useToasts} from "react-toast-notifications";
import UIComponent from "@/_components/UI";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import classNames from "classnames";
import DataTable from "react-data-table-component";

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

const AssignCommunityAuth = () => {
    const {addToast} = useToasts();
    const [userIds, setUserIds] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => {
        setUserIds(e.target.value);
        setDisabled(!e.target.value);
    }

    const handleSubmit = () => {
        const ids = userIds.split(',');

        setIsSubmitting(true);

        resource.assign(ids).then(() => {
            addToast(`赋予版务权限完成`, {appearance: 'success'});
        })
        .catch(error => {
            addToast(error || `赋予版务权限失败`, {appearance: 'error'});
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    return (
        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">赋予版务权限</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入用户ID，以逗号分割</p>

                <div className="form-group">
                    <textarea rows={5} className="form-control" onChange={handleChange} />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting || disabled}>
                        {isSubmitting &&
                        <i className="icon-spinner2 spinner mr-1" />}
                        赋予版务权限</button>
                </div>
            </div>
        </div>
    );
};

const ManagerCommunityAuth = () => {
    const [data, setData] = useState([]);

    const {addToast} = useToasts();

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [selecteds, setSelecteds] = useState([]);
    const [toggledClearRows, setToggledClearRows] = useState(false);
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const response = await resource.queryAllAdminUser(userId, nickname);
        setData(response.data);
        setTotalRows(response.data.totalCount);
        setToggledClearRows(!toggledClearRows);

        setPending(false);
    };

    useEffect(() => {
        fetcher(currentPage, setPerPage);
    }, []);

    const handleConfirm = useCallback(
        async () => {
            try {
                await resource.remove(selecteds.map(e => e.userId));
                setModal(false);
                fetcher();
            } catch (e) {
                addToast(e || `设置版务权限失败`, {appearance: 'error'});
            }
        },
        [selecteds]
    );

    const ActionComponent = ({row, onClick, children, className}) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const handleCancel = (row) => {
        setSelecteds([row]);
        setModal(true);
    }

    const handleCancels = () => {
        setModal(true);
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

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    }

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    }

    const handleSearch = (e) => {
        fetcher(1);
    }

    const handleSelectedRowsChange = (e) => {
        setSelecteds(e.selectedRows);
    }

    const contextActions = useMemo(
        () => <>
            <button className="btn btn-danger mr-1" onClick={handleCancels}>撤销版务权限</button>
        </>,
        [selecteds]
    );

    const models = [
        {
            name: "用户ID",
            selector: "userId",
        },
        {
            name: "用户昵称",
            selector: "nickName",
        },
    ];

    const columns = useMemo(
        () => [
            ...models,
            {
                name: "操作",
                cell: row => <ActionComponent row={row} onClick={handleCancel}
                                              className={classNames("btn mr-1", 'btn-outline-danger')}>撤销版务权限</ActionComponent>,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
        ],
        [handleConfirm]
    );

    const actions = (
        <div className="header-elements">
            <div className="input-group wmin-sm-200">
                <input type="text" className="form-control" onChange={handleUserIdChange} placeholder="输入用户ID" />
                <input type="text" className="form-control" onChange={handleNicknameChange} placeholder="输入用户昵称" />
                <div className="input-group-append" style={{zIndex: 0}}>
                    <button type="button" className="btn btn-light btn-icon" onClick={handleSearch}>查找</button>
                </div>
            </div>
        </div>
    );

    return (
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
                    title={`版务权限`}
                    noHeader={false}
                    actions={actions}
                    paginationResetDefaultPage={true}
                    progressComponent={<UITableProgress/>}
                    noDataComponent={<UINoData/>}
                    paginationComponentOptions={{
                        noRowsPerPage: true,
                        rowsPerPageText: '每页显示',
                        rangeSeparatorText: '共'
                    }}
                    selectableRows={true}
                    clearSelectedRows={toggledClearRows}
                    onSelectedRowsChange={handleSelectedRowsChange}
                    contextMessage={ {singular: '个稿件', plural: '个用户', message: ''} }
                    contextActions={contextActions}
                />
            </div>

            <Modal isOpen={modal} toggle={handleModelClose} className="modal-xs">
                <ModalHeader toggle={handleModelClose} className="d-flex">
                    <i className="fas fa-plus"/> 撤销版务权限
                </ModalHeader>
                <ModalBody>
                    确定撤销用户的版务权限吗？
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirm}>撤销版务权限</Button>{' '}
                    <Button color="secondary" onClick={handleModelClose}>取消</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

const PostManager = () => {
    const {addToast} = useToasts();
    const [post, setPost] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const actions = {
        setBoutique: '设为精华',
        cancelBoutique: '取消精华',
        setTop: '设为置顶',
        cancelTop: '取消置顶',
        del: '删除帖子',
    };

    const handleChange = (e) => {
        setPost(e.target.value);
        setDisabled(!e.target.value);
    }

    const handleSubmit = (action) => () => {
        let postId = null;

        const match = /^https?:\/\/[:0-9a-z.]+\/post\/([0-9]+)/i;
        if (/^[0-9]$/.test(post)) {
            postId = post;
        } else if (match.test(post)) {
            const result = match.exec(post);
            postId = result[1];
        } else {
            return addToast(`请输入帖子ID或者URL`, {appearance: 'error'});
        }

        setIsSubmitting(true);

        const fn = postService[action];

        fn(postId).then(() => {
            addToast(`${actions[action]}完成`, {appearance: 'success'});
        })
        .catch(error => {
            addToast(error || `${actions[action]}失败`, {appearance: 'error'});
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    return (
        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">帖子管理</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入帖子ID或者URL</p>

                <div className="form-group">
                    <input type="text" className="form-control" onChange={handleChange} />
                </div>

                <div className="text-center">
                    {Object.entries(actions).map(([action, label]) => <button key={action} type="submit" className="btn btn-primary mr-1" onClick={handleSubmit(action)} disabled={isSubmitting || disabled}>
                        {isSubmitting &&
                        <i className="icon-spinner2 spinner mr-1" />}
                        {label}</button>)}
                </div>
            </div>
        </div>
    );
};

function CommunityAuth() {
    return (
        <div className="content">
            <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <AssignCommunityAuth />
            <ManagerCommunityAuth />
            <PostManager />
        </div>
    );
}

export { CommunityAuth };

export default CommunityAuth;
