import React from 'react';
import { statisticPage as resource } from '@/_services';
import {EnhancePaginationTable} from '@/_components';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useToasts} from "react-toast-notifications";

function List() {
    const {addToast} = useToasts();

    const onCopy = () => {
        addToast(`已经拷贝至剪切板`, {appearance: 'success'});
    }

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
                             name: "标题",
                             selector: "categoryName",
                         },
                         {
                             name: "拷贝链接",
                             cell: row => <>
                                 <CopyToClipboard
                                     className="btn btn-outline-primary"
                                     onCopy={onCopy}
                                     text={`/page/${row.id}`}>
                                     <button >拷贝链接</button>
                                 </CopyToClipboard>
                             </>,
                             ignoreRowClick: true,
                             allowOverflow: true,
                             // button: true,
                         },
                    ]} />
                </div>
            </div>
        </div>
    );
}

export { List };
