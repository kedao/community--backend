import React, {useState} from 'react';
import {reportHistory as resource} from "@/_services";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {EnhancePaginationTable} from "../_components/EnhancePaginationTable";
import DateRangePickerComponent from "react-bootstrap-daterangepicker";
import {Link} from "react-router-dom";

function ReportHistory() {

    return (
        <div className="content">
            <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <div className="card">
                <div className="card-body">
                    <EnhancePaginationTable  resource={resource}
                                             title={resource.title}
                                             fetchUrl={resource.selectByPage}
                                             removeable={false}
                                             editable={false}
                                             models={[
                                                 {
                                                     name: "ID",
                                                     selector: "id",
                                                 },
                                                 {
                                                     name: "关联ID",
                                                     selector: "sourceId",
                                                 },
                                                 {
                                                     name: "分类",
                                                     cell: (row) => (row.category === 0 ? '文章' : '帖子')
                                                 },
                                                 {
                                                     name: "分类名称",
                                                     selector: "categoryName",
                                                 },
                                                 {
                                                     name: "举报内容",
                                                     selector: "contents",
                                                 },
                                                 {
                                                     name: "举报人ID",
                                                     selector: "createdBy",
                                                 },
                                                 {
                                                     name: "举报时间",
                                                     selector: "createdTime",
                                                 },
                                             ]} />
                </div>
            </div>
        </div>
    );
}

export {ReportHistory};

export default ReportHistory;
