import React, {useEffect, useCallback, useMemo} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {sysDict as resource} from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import UIComponent from '@/_components/UI';

function ImagesUpload() {
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
                            name: "字典编码",
                            selector: "dictCode",
                        },
                        {
                            name: "字典名称",
                            selector: "dictName",
                        },
                        {
                            name: "字典值",
                            selector: "dictValue",
                        },
                    ]} />
                </div>
            </div>
        </div>
    );
}

export default ImagesUpload;
