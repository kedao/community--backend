import React, {useState} from 'react';
import {userFeedback as resource} from "@/_services";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {EnhancePaginationTable} from "../_components/EnhancePaginationTable";

function UserFeedback() {
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
                                                     name: "反馈内容",
                                                     selector: "contents",
                                                 },
                                                 {
                                                     name: "回复内容",
                                                     selector: "replyContent",
                                                 },
                                                 {
                                                     name: "截图内容",
                                                     cell: (row) => (row.imageList || []).map((e) => <img src={e} className="mr-1" width="38" height="38" />),
                                                 },
                                                 {
                                                     name: "状态",
                                                     cell: (row) => ['待回复', '已回复', '已关闭'][row.state]
                                                 },
                                                 {
                                                     name: "更新人ID",
                                                     selector: "updatedBy",
                                                 },
                                                 {
                                                     name: "更新时间",
                                                     selector: "updatedTime",
                                                 },
                                                 {
                                                     name: "创建时间",
                                                     selector: "createdTime",
                                                 },
                                             ]} />
                </div>
            </div>
        </div>
    );
}

export {UserFeedback};

export default UserFeedback;
