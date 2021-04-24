import React, {useEffect, useState, useMemo} from 'react';
import classNames from 'classnames';
import DataTable from "react-data-table-component";
import UIComponent from '@/_components/UI';
import {user as resource} from '@/_services';

const fetchUrl = resource.selectContentByType;

const UITableProgress = UIComponent.tableProgress;
const UINoData = UIComponent.tableNoData;

function GeneratedContent({user}) {
    const [data, setData] = useState([]);

    const [contentType, setContentType] = useState(0);

    const [pending, setPending] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(30);
    const [currentPage, setCurrentPage] = useState(1);

    const fetcher = async (page, size = perPage) => {
        setPending(true);

        const response = await fetchUrl(user.userId, contentType, page, size);
        setData(response.data.list);
        setTotalRows(response.data.totalCount);

        setPending(false);
    };

    const handlePageChange = page => {
        setCurrentPage(page);
        fetcher(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        fetcher(page, newPerPage);
    };

    useEffect(() => {
        fetcher(currentPage);
    }, [contentType, user.userId]);


    const handleContentTypeChange = (contentType, e) => {
        setContentType(contentType);
        e.preventDefault();
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
            name: "文本内容",
            selector: "contents",
        },
        {
            name: "图像地址列表",
            selector: "imageList",
            cell: (row) => {
                if (!row.imageList) {
                    return "";
                }

                return row.imageList.map((e) => <img src={e.url} className="mr-1" width="38" height="38" alt="" />);
            },
        },
        {
            name: "发布时间",
            selector: "createdTime",
        },
       ];

    const columns = useMemo(
        () => [
            ...models,
        ],
        []
    );

    return (
        <div className="card">
            <div className="card-header bg-light pb-0 pt-sm-0 header-elements-sm-inline">
                <div className="header-elements">
                    <ul className="nav nav-tabs nav-tabs-highlight card-header-tabs">
                        <li className="nav-item">
                            <a href="#" onClick={(e) => handleContentTypeChange(0, e)} className={classNames("nav-link", {active: contentType === 0})} >
                                文章评论1
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => handleContentTypeChange(1, e)} className={classNames("nav-link", {active: contentType === 1})} >
                                产品评价
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => handleContentTypeChange(2, e)} className={classNames("nav-link", {active: contentType === 2})} >
                                发帖
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" onClick={(e) => handleContentTypeChange(3, e)} className={classNames("nav-link", {active: contentType === 3})} >
                                回帖
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="card-body">
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
                    title={resource.title}
                    paginationResetDefaultPage={true}
                    progressComponent={<UITableProgress/>}
                    noDataComponent={<UINoData/>}
                    paginationComponentOptions={{
                        noRowsPerPage: true,
                        rowsPerPageText: '每页显示',
                        rangeSeparatorText: '共'
                    }}
                />
            </div>
        </div>
    );
}

export {GeneratedContent};

export default GeneratedContent;
