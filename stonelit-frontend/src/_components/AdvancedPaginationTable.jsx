import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import _ from 'lodash'
import {Link} from "react-router-dom";
import DataTable from "react-data-table-component";
import UIComponent from '@/_components/UI';
import Switch from "react-switch";

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

function AdvancedPaginationTable ({fetchUrl, removeUrl, resource, models, toggleProduct}) {
    const [data, setData] = useState([]);
    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [pickedData, setPickedData] = useState({});

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

    const handleMoreAction = async (row) => {
        await toggleProduct([row.id]);
        // row.id = 111;
        // fetcher(currentPage, perPage);

        const rows = [...data];
        rows[0].onlineFlag = 0;
        rows[0].id = 0;

        setData(rows);

        console.info(data);
    };

    const handleDelete = useCallback(
        row => async () => {
            await removeUrl([row.id]).then(() => setModal(false));
            fetcher(currentPage, perPage);
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

    function toggle() {
        setModal(!modal);
    }

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

    const columns = useMemo(
        () => [
            ...models,
            {
                cell: row => <>
                    <ActionComponent row={row} onClick={handleAction} className="c-btn c-btn--small c-btn--secondary">删除</ActionComponent>
                    <Link to={`/admin/${resource}/edit/${row.id}`} className="c-btn c-btn--small c-btn--info ml-1">编辑</Link>
                </>,
                ignoreRowClick: true,
                allowOverflow: true,
                // button: true,
            }
        ],
        [handleDelete]
    );

    for (let i = 0; i < columns.length; i++) {
        if (columns[i].customType === 'Switch') {
            columns[i].cell = (row) =>
                <ActionSwitchComponent
                    row={row}
                    onChange={columns[i].customChange}
                />;
        }
    }

    return (
        <>
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
                noHeader={true}
                paginationResetDefaultPage={true}
                progressComponent={<UITableProgress />}
                noDataComponent={<UINoData />}
                paginationComponentOptions={{
                    noRowsPerPage: true,
                    rowsPerPageText: '每页显示',
                    rangeSeparatorText: '共'
                }}
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
        </>
    );
}

export {AdvancedPaginationTable};

export default AdvancedPaginationTable;