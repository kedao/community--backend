import React, {useEffect, useCallback, useMemo} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {productParamSetting as resource} from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import UIComponent from '@/_components/UI';

function List() {
    return (
        <div className="content">
            <div className="card">
                <div className="card-header header-elements-inline">
                    <h5 className="card-title">{resource.title}</h5>
                </div>

                <div className="card-body">
                    <EnhancePaginationTable resource={resource.name}
                                             fetchUrl={resource.selectByPage}
                                             removeUrl={resource.remove}
                                             models={[
                        {
                            name: "编号",
                            selector: "id",
                        },
                        {
                            name: "参数名称",
                            selector: "paramName",
                        },
                        {
                            name: "默认值",
                            selector: "defaultValue",
                        },
                    ]} />
                </div>
            </div>
        </div>
    );
}

export { List };
