import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Link, NavLink, useParams, useLocation, useRouteMatch} from 'react-router-dom';
import {product as resource} from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import queryString from 'query-string';
import UIComponent from '@/_components/UI';
import _ from 'lodash'
import Switch from 'react-switch';
import {Button, Form} from "reactstrap";

function List() {
    const [data, setData] = useState([]);

    const ActionComponent = ({ row, onClick, children, className }) => {
        const clickHandler = () => onClick(row);
        return <Button className={className} onClick={clickHandler}>{children}</Button>;
    };

    const ActionSwitchComponent = ({ row, onChange, children, className }) => {
        const changeHandler = () => onChange(row);

        return <Switch onClick={changeHandler}
            className="react-switch"
            onChange={changeHandler}
            checked={row.onlineFlag === 1}
            height={22}
            handleDiameter={20}
            width={42}
        >{children}</Switch>;
    };

    const handleAction = (row) => {
        const value = row.onlineFlag !== 1;
        const rows = _.cloneDeep(data);

        const changeData = rows.filter(e => e.id === row.id);

        for (let i = 0; i < changeData.length; i++) {
            if (value) {
                changeData[i].onlineFlag = 1;
                resource.restore(changeData[i].id).then();
            } else {
                changeData[i].onlineFlag = 0;
                resource.hide(changeData[i].id).then();
            }
        }

        setData(rows);
    }

    return (
        <div className="content">
            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">{resource.title}</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource={resource.name}
                                           data={data}
                                           setData={setData}
                                           fetchUrl={resource.selectByPage}
                                           removeUrl={resource.remove}
                                           models={[
                        {
                            name: "产品ID",
                            selector: "id",
                        },
                        {
                            name: "产品名称",
                            selector: "productName",
                        },
                         {
                             name: "产品标签",
                             cell: (row) => {
                                 let tags = [];

                                 try {
                                     if (typeof row.tag === 'string' || row.tag instanceof String) {
                                         try {
                                             tags = JSON.parse(row.tag);
                                             if (!Array.isArray(tags)) {
                                                 tags = [];
                                             }
                                         } catch (e) {
                                             console.error(e);
                                         }
                                     }
                                 } catch (e) {
                                     console.error(e)
                                 }

                                 if (Array.isArray(row.tag)) {
                                     tags = row.tag;
                                 }

                                 return tags.join('、')
                             }
                         },
                         {
                             name: "上线状态",
                             cell: (row) =>
                                 <ActionSwitchComponent row={row} onChange={handleAction}  />
                             ,
                             ignoreRowClick: true,
                             // button: true,
                         },
                        {
                            name: "1级类目",
                            selector: "categoryOneName",
                        },
                        {
                            name: "2级类目",
                            selector: "categoryTwoName",
                        },
                        {
                            name: "3级类目",
                            selector: "categoryThreeName",
                        },
                        {
                            name: "创建时间",
                            selector: "createdTime",
                        },
                    ]}
                    />
                </div>
            </div>
        </div>
    );
}

export { List };
