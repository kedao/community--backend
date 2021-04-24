import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import Forms from "@/_components/Forms";
import * as Yup from 'yup';

import {sysDict as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {SubHeadingSource} from "@/_teleporters/Heading";

const actionFetch = resource.selectById;
const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    dictCode: Yup.string().required('请输入字典编码'),
    dictName: Yup.string().required('请输入字典名称'),
    dictType: Yup.number(),
    dictValue: Yup.string().required('请输入字典值'),
    pid: Yup.number(),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [initialValues, setInitialValues] = useState({
        dictCode: '',
        dictName: '',
        dictType: '0',
        dictValue: '',
        pid: '',
        dictGroup: '',
    })

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        setInitialValues(data);
        setPending(true);
    };

    useEffect(() => {
        if (isCreateMode) {
            setPending(true);
        } else {
            fetcher(id)
        }
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resource.title}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
            .catch(error => {
                addToast(error ?? `${actionLabel}${resource.title}失败`, {appearance: 'error'});
                setSubmitting(false);
            });
    }

    return <div className="content">
        <BreadcrumbLink to={match.path}>{actionLabel}{resource.title}</BreadcrumbLink>
        <SubHeadingSource>{`${actionLabel}${resource.title}`}</SubHeadingSource>

        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">{`${actionLabel}${resource.title}`}</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入或者选择表单项目，项目<span className="text-danger">*</span>为必选项。</p>

                {pending ?
                    <Formik key={key} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({errors, touched, isSubmitting, setFieldValue}) => {
                            return (
                                <Form>
                                    <fieldset>
                                        <legend className="text-uppercase font-size-sm font-weight-bold">基本资料</legend>

                                        <Forms.Images images={['https://image-1305077657.cos.ap-nanjing.myqcloud.com/48acda2f33ab477199dbb1e59d1d1502.jpg', 'https://image-1305077657.cos.ap-nanjing.myqcloud.com/0cda242429b94d18865d5ebf4aedb2c1.jpg', 'https://image-1305077657.cos.ap-nanjing.myqcloud.com/c2f22731436a4d8db1064dfb87464af7.jpg', 'https://image-1305077657.cos.ap-nanjing.myqcloud.com/25c3dba9a3e14cfb88ea527e37b77ae7.jpeg', 'https://image-1305077657.cos.ap-nanjing.myqcloud.com/372540ccc3614cb3a9af85e05196167a.jpeg', 'https://image-1305077657.cos.ap-nanjing.myqcloud.com/44d4c126f4e3454ea9c46a5a3b4d24a0.png']} field="images" label="图片" />
                                    </fieldset>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting &&
                                            <i className="icon-spinner2 spinner mr-1" />}
                                            保存</button>
                                        <Link to={isCreateMode ? '.' : '..'} className="btn btn-light ml-1">取消</Link>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik> : null}
            </div>
        </div>
    </div>;
};

export default Editor;
