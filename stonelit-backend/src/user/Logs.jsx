import React, {useState} from 'react';
import {sysActionLog as resource} from "@/_services";
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";
import {EnhancePaginationTable} from "../_components/EnhancePaginationTable";
import DateRangePickerComponent from "react-bootstrap-daterangepicker";

function UserLogs() {
    const [inputteds, setInputteds] = useState({
        startDate: '',
        endDate: '',
        userId: '',
    });
    const [filters, setFilters] = useState({});

    const handleFiltered = () => {
        setFilters(inputteds);
    }

    const actions = (
        <div className="header-elements">
            <div className="input-group wmin-sm-500">
                <DateRangePickerComponent
                    initialSettings={{
                        autoUpdateInput: false,
                        timePicker: false,
                        firstDay: 1,
                        locale: {
                            format: "YYYY-MM-DD",
                            cancelLabel: '取消',
                            applyLabel: "确定",
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                        },
                    }}
                    onApply={(e, picker) => {
                        const startDate = picker.startDate.format('YYYY-MM-DD');
                        const endDate = picker.endDate.format('YYYY-MM-DD');

                        setInputteds({
                            ...inputteds,
                            startDate: startDate,
                            endDate: endDate,
                            // dateRange: `${startDate} - ${endDate}`
                        });
                    }}
                >
                    <input readOnly type="text" className={'form-control'} value={inputteds.startDate + (inputteds.startDate ? ' - ' : '') + inputteds.endDate} placeholder="时间" style={{backgroundColor: '#FFF'}} />
                </DateRangePickerComponent>
                <input type="text" className="form-control" onChange={(e) => setInputteds({...inputteds, userId: e.target.value})} placeholder="操作人ID" />
                <div className="input-group-append" style={{zIndex: 0}}>
                    <button type="button" className="btn btn-light btn-icon" onClick={handleFiltered}>查找</button>
                </div>
            </div>
        </div>
    );

    /*
    if (filters.userId && !/^[0-9]+$/.test(filters.userId)) {
        filters.userId = '-1';
    }
     */

    return (
        <div className="content">
            <BreadcrumbLink to={`/user/logs`}>登录记录</BreadcrumbLink>
            <HeadingSource>登录记录</HeadingSource>

            <div className="card">
                <div className="card-body">
                    <EnhancePaginationTable  resource={resource}
                                             title="登录记录"
                                             fetchUrl={resource.selectByPage}
                                             removeable={false}
                                             editable={false}
                                             actions={actions}
                                             filters={filters}
                                             models={[
                                                 {
                                                     name: "ID",
                                                     selector: "id",
                                                 },
                                                 {
                                                     name: "操作人",
                                                     selector: "createdBy",
                                                 },
                                                 {
                                                     name: "操作ip",
                                                     selector: "ip",
                                                 },
                                                 {
                                                     name: "日志名称",
                                                     selector: "name",
                                                 },
                                                 {
                                                     name: "日志消息",
                                                     selector: "message",
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

export {UserLogs};

export default UserLogs;
