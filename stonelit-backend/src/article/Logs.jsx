import React from 'react';
import {auditHistoryService as resource} from "@/_services";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {EnhancePaginationTable} from "../_components/EnhancePaginationTable";

function ArticleLogs() {
    return (
        <div className="content">
            <BreadcrumbLink to={`/article/logs`}>投稿审核纪录</BreadcrumbLink>
            <HeadingSource>投稿审核纪录</HeadingSource>

            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">投稿审核纪录</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource={resource}
                                             fetchUrl={resource.selectByPage}
                                             removeable={false}
                                             editable={false}
                                             models={[
                                                 {
                                                     name: "来源ID",
                                                     selector: "sourceId",
                                                 },
                                                 {
                                                     name: "类别",
                                                     selector: "categoryName",
                                                 },
                                                 {
                                                     name: "详情",
                                                     selector: "details",
                                                 },
                                                 {
                                                     name: "时间",
                                                     selector: "createdTime",
                                                 },
                                             ]} />
                </div>
            </div>
        </div>
    );
}

export {ArticleLogs};

export default ArticleLogs;
