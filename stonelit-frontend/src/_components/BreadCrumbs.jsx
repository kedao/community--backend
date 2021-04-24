import React from 'react';
import {Link, NavLink} from 'react-router-dom';

const BreadCrumbs = ({name, paths}) => {
    if (!paths) {
        paths = [];
    }
    if (paths.length) {
        paths.unshift({link: '/admin', text: '后台管理'});
    }
    paths = paths.map(e => typeof e === 'string' ? ({text: e}) : e);

    return <div className="row">
        <div className="col-xs-12">
            <div className="page-title-box">
                <h4 className="page-title">{name}</h4>
                <ol className="breadcrumb p-0 m-0">
                    {paths.map((e) => e.link ? <li key={e.text}>
                        <NavLink to={e.link}>{e.text}</NavLink>
                    </li> : <li  key={e.text} className="active">
                        {e.text}
                    </li>)}
                </ol>
                <div className="clearfix"/>
            </div>
        </div>
    </div>
}

export default BreadCrumbs;
