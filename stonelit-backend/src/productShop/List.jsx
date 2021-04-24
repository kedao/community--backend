import React from 'react';
import { productShop as resource } from '@/_services';
import {EnhancePaginationTable} from '@/_components';

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
                            name: "名称",
                            selector: "shopName",
                        }
                    ]} />
                </div>
            </div>
        </div>
    );
}

export { List };
