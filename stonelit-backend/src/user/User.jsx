import React, {useState} from 'react';
import {user as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {HeadingSource} from "@/_teleporters/Heading";

import GeneratedContent from "./_components/GeneratedContent";

function User() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);
    // const [searched, setSearched] = useState(true);

    const fetchUser = async (userId, nickname) => {
        const data = await resource.selectByIdOrNickname(userId, nickname);
        if (data.data) {
            setUser(data.data);
        }

        // setSearched(true);
    }

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    }

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    }

    const handleSearch = (e) => {
        if (!userId && !nickname) {
            return;
        }

        // setSearched(false);
        setUser(null);
        fetchUser(userId, nickname);
    }

    return (
        <div className="content">
            <BreadcrumbLink to={`/${resource.name}`}>{resource.title}</BreadcrumbLink>
            <HeadingSource>{resource.title}</HeadingSource>

            <div className="card">
                <div className="card-header bg-white header-elements-sm-inline">
                    <h6 className="card-title">用户管理</h6>
                    <div className="header-elements">
                        <div className="input-group wmin-sm-200">
                            <input type="text" className="form-control" onChange={handleUserIdChange} placeholder="输入用户ID" />
                            <input type="text" className="form-control" onChange={handleNicknameChange} placeholder="输入用户昵称" />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-light btn-icon" onClick={handleSearch}>查找</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {user && <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header header-elements-inline">
                            <h6 className="card-title">基本信息</h6>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-solid">
                                <tbody>
                                <tr>
                                    <td className="table-active" style={{width: '35%'}}>用户ID</td>
                                    <td>{user.userId}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">用户名</td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">头像</td>
                                    <td>{user.headUrl && <img src={user.headUrl} width="38" height="38" alt="" />}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">用户简介</td>
                                    <td>{user.remark}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">注册时间</td>
                                    <td>{user.createdTime}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">用户当前状态</td>
                                    <td>{user.userCurrentStatus}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">解封时间</td>
                                    <td>{user.effectiveEndDate}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header header-elements-inline">
                            <h6 className="card-title">风控信息</h6>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-solid">
                                <tbody>
                                <tr>
                                    <td className="table-active" style={{width: '35%'}}>命中敏感词</td>
                                    <td>{user.userDataAdminVO.hitSensitiveCount}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">被投诉</td>
                                    <td>{user.userDataAdminVO.byReportCount}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">被投诉原因分布</td>
                                    <td>{user.userDataAdminVO.reportReasonRate}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">机审文本异常</td>
                                    <td>{user.userDataAdminVO.textExceptionCount}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">机审图片异常</td>
                                    <td>{user.userDataAdminVO.imageExceptionCount}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">人工认定异常</td>
                                    <td>{user.userDataAdminVO.userAuditExceptionCount}</td>
                                </tr>
                                <tr>
                                    <td className="table-active">被封禁次数</td>
                                    <td>{user.userDataAdminVO.blackCount}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>}

            {user && <GeneratedContent key={user.id} user={user} />}
        </div>
    );
}

export { User };

export default User;
