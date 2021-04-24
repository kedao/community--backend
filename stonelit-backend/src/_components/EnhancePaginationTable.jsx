import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import DataTable from "react-data-table-component";
import UIComponent from '@/_components/UI';
import {useToasts} from "react-toast-notifications";
import PropTypes from "prop-types";

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

function EnhancePaginationTable ({title, filters, refresh, actions, subActions, customStyles, data, setData, fetchUrl, removeUrl, resource, models, removeable, editable}) {
    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [pickedData, setPickedData] = useState({});
    const [localData, setLocalData] = useState([]);
    const {addToast} = useToasts();

    const fetcher = async (page, size = perPage, params) => {
        setPending(true);

        const response = await fetchUrl(page, size, params);
        if (setData) {
            setData(response.data.list);
        } else {
            setLocalData(response.data.list);
        }
        setTotalRows(response.data.totalCount);

        setPending(false);
    };

    useEffect(() => {
        fetcher(1, perPage, filters);
    }, [filters, refresh]);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleDelete = useCallback(
        row => async () => {
            try {
                await removeUrl([row.id]).then(() => setModal(false));
                fetcher(currentPage, perPage);
                setModal(false);
            } catch (e) {
                addToast(e || `删除失败`, {appearance: 'error'});
                setModal(false);
            }
        },
        [currentPage, perPage, totalRows]
    );

    const ActionComponent = ({ row, onClick, children, className }) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const handleAction = value => {
        setPickedData(value);
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

    const toggle = () => {
        setModal(!modal);
    }

    /*
    const ActionSwitchComponent = ({ row, onChange, children, className }) => {
        const changeHandler = () => {
            const newData = onChange(row, data);
            setData(newData);
        };

        return <Switch
                       className="react-switch"
                       onChange={changeHandler}
                       checked={row.onlineFlag === 1}
                       height={22}
                       handleDiameter={20}
                       width={42}
        >{children}</Switch>;
    };
     */

    const columns = useMemo(
        () => {
            const columns = [...models];

            if (removeable && editable) {
                columns.push(
                    {
                        name: "操作",
                        cell: row => <>
                            {removeable && <ActionComponent row={row} onClick={handleAction}
                                                            className="btn btn-outline grey-400 text-grey-600 border-slate">删除</ActionComponent>}
                            {editable && <Link to={`/${resource}/edit/${row.id}`} className="btn btn-outline-primary ml-1">编辑</Link>}
                        </>,
                        ignoreRowClick: true,
                        allowOverflow: true,
                        // button: true,
                    }
                );
            }

            return columns;
        },
        [data, handleDelete]
    );

    /*
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].customType === 'Switch') {
            columns[i].cell = (row) =>
                <ActionSwitchComponent
                    row={row}
                    onChange={columns[i].customChange}
                />;
        }
    }
    */

    return (
        <div className="card-datatable-inside">
            <DataTable
                columns={columns}
                data={localData}
                progressPending={pending}
                pagination={true}
                paginationServer={true}
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationPerPage={perPage}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                sortable={false}
                title={title}
                noHeader={!title}
                actions={actions}
                paginationResetDefaultPage={true}
                progressComponent={<UITableProgress />}
                noDataComponent={<UINoData />}
                paginationComponentOptions={{
                    noRowsPerPage: true,
                    rowsPerPageText: '每页显示',
                    rangeSeparatorText: '共'
                }}
                subHeader={!!subActions}
                subHeaderComponent={subActions}
                customStyles={customStyles}
            />
            <Modal isOpen={modal} toggle={toggle} className="modal-xs">
                <ModalHeader toggle={toggle} className="d-flex">
                    <i className="fas fa-plus"/> 删除数据
                </ModalHeader>
                <ModalBody>
                    确定要删除这条数据？这一操作不可恢复。
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleDelete(pickedData)}>删除</Button>{' '}
                    <Button color="secondary" onClick={toggle}>取消</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

EnhancePaginationTable.defaultProps = {
    removeable: true,
    editable: true,
};

EnhancePaginationTable.propTypes = {
    removeable: PropTypes.bool,
    editable: PropTypes.bool,
};

export {EnhancePaginationTable};

export default EnhancePaginationTable;
