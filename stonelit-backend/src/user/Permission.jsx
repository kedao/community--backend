import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {permission as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

import {useToasts} from "react-toast-notifications";
import UIComponent from "@/_components/UI";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import classNames from "classnames";
import DataTable from "react-data-table-component";
import Switch from "react-switch";
import _ from "lodash";

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

const AssignPermission = ({permits}) => {
    const {addToast} = useToasts();
    const [userIds, setUserIds] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const allPermits = useMemo(
        () => {
            const allPermits = {};

            for (const [code] of Object.entries(permits)) {
                allPermits[code] = 1;
            }

            return allPermits;
        },
        [permits]
    );

    const handleChange = (e) => {
        setUserIds(e.target.value);
        setDisabled(!e.target.value);
    }

    const handleSubmit = () => {
        const ids = userIds.split(',');

        setIsSubmitting(true);

        const data = [];

        for (let datum of ids) {
            if (datum) {
                data.push({
                    "id": datum,
                    "permits": allPermits
                });
            }
        }

        resource.updateUserAdminPermit(data).then(() => {
            addToast(`赋予后台权限完成`, {appearance: 'success'});
        })
        .catch(error => {
            addToast(error || `赋予后台权限失败`, {appearance: 'error'});
        }).finally(() => {
            setIsSubmitting(false);
        })
    }

    return (
        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">赋予后台权限</h5>
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
                        赋予后台权限</button>
                </div>
            </div>
        </div>
    );
};

const ManagerPermission = ({permits}) => {
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
    const [permitFilter, setPermitFilter] = useState(null);

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const response = await resource.selectUserWithPermitByPage(page, perPage, userId, nickname, permitFilter);

        setData(response.data.list);
        setTotalRows(response.data.totalCount);
        setToggledClearRows(!toggledClearRows);

        setPending(false);
    };

    useEffect(() => {
        fetcher(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirm = useCallback(
        async () => {
            try {
                await resource.updateUserAdminPermit(selecteds.map(e => ({id: e.id, permits: {}})));
                setModal(false);
                fetcher(1);
            } catch (e) {
                addToast(e || `设置后台权限失败`, {appearance: 'error'});
            }
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [selecteds]
    );

    const ActionComponent = ({row, code, onClick, children, className}) => {
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

    const handlePermitChange = (e) => {
        setPermitFilter(e.target.value);
    }

    const handleSearch = (e) => {
        fetcher(1);
    }

    const handleSelectedRowsChange = (e) => {
        setSelecteds(e.selectedRows);
    }

    const contextActions = useMemo(
        () => <>
            <button className="btn btn-danger mr-1" onClick={handleCancels}>撤销后台权限</button>
        </>,  // eslint-disable-next-line react-hooks/exhaustive-deps
        [selecteds]
    );

    const handleAction = async (row, code) => {
        row = _.cloneDeep(row);

        const permits = row.permissions?.permits ?? {};
        permits[code] = row.permissions.permits[code] === 1 ? 0 : 1;

        try {
            const rows = _.cloneDeep(data);
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].id === row.id) {
                    rows[i].permissions.permits = permits;
                }
            }

            setData(rows);

            await resource.updateUserAdminPermit([{id: row.id, permits}]);
        } catch (e) {

        }
    }

    const ActionSwitchComponent = ({ props, onChange, children, checked }) => {
        const changeHandler = () => onChange(...props);

        return <Switch onClick={changeHandler}
                       className="react-switch"
                       onChange={changeHandler}
                       checked={checked}
                       height={22}
                       handleDiameter={20}
                       width={42}
        >{children}</Switch>;
    };

    const models = [
        {
            name: "用户ID",
            selector: "id",
        },
        {
            name: "用户昵称",
            selector: "nickName",
        },
    ];

    const columns = useMemo(
        () => {
            const permitModels = [];

            if (permits) {
                for (const [code, name] of Object.entries(permits)) {
                    permitModels.push(
                        {
                            name: name,
                            cell: (row) =>
                                <ActionSwitchComponent props={[row, code]} code={code} onChange={handleAction}
                                                       checked={row.permissions?.permits?.[code] === 1} />
                            ,
                        }
                    );
                }
            }

            return [
                ...models,
                ...permitModels,
                {
                    name: "操作",
                    cell: row => <ActionComponent row={row} onClick={handleCancel}
                                                  className={classNames("btn mr-1", 'btn-outline-danger')}>撤销后台权限</ActionComponent>,
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
            ];
        },
        [handleConfirm, permits, data] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const actions = (
        <div className="header-elements">
            <div className="input-group wmin-sm-200">
                <input type="text" className="form-control" onChange={handleUserIdChange} placeholder="输入用户ID" />
                <input type="text" className="form-control" onChange={handleNicknameChange} placeholder="输入用户昵称" />
                <select className="form-control" onChange={handlePermitChange} placeholder="拥有权限">
                    <option value="">拥有权限</option>
                    {Object.entries(permits).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
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
                    title={`权限管理`}
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
                    contextMessage={ {singular: '个用户', plural: '个用户', message: ''} }
                    contextActions={contextActions}
                />
            </div>

            <Modal isOpen={modal} toggle={handleModelClose} className="modal-xs">
                <ModalHeader toggle={handleModelClose} className="d-flex">
                    <i className="fas fa-plus"/> 撤销后台权限
                </ModalHeader>
                <ModalBody>
                    确定撤销用户的后台权限吗？
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirm}>撤销后台权限</Button>{' '}
                    <Button color="secondary" onClick={handleModelClose}>取消</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

function Permission() {
    const [permits, setPermits] = useState({});

    useEffect(() => {
        const fetchPermission = async () => {
            const permits = {};

            const response = await resource.selectAllPermit();
            for (let datum of response.data) {
                permits[datum.permitCode] = datum.permitName;
            }

            setPermits(permits);
        };

        fetchPermission();
    }, []);

    return (
        <div className="content">
            <BreadcrumbLink to={`/user/${resource.name}`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <AssignPermission permits={permits} />
            <ManagerPermission permits={permits} />
        </div>
    );
}

export { Permission };

export default Permission;
