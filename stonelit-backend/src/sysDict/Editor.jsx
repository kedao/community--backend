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

                                        <Forms.Text field="dictCode" label="字典编码" readOnly={!isCreateMode} required={true} errors={errors} touched={touched} />
                                        <Forms.Text field="dictName" label="字典名称" required={true} errors={errors} touched={touched} />
                                        <Forms.Text field="dictValue" label="字典值" required={true} errors={errors} touched={touched} />
                                        <Forms.Select field="dictType" label="字典类型" options={[{value: '0', label: '键值'}, {value: '1', label: '树形结构'}]} required={false} errors={errors} touched={touched} />
                                        <Forms.Text field="pid" label="父主键ID" required={false} errors={errors} touched={touched} />
                                        <Forms.Text field="dictGroup" label="字典分组" required={false} errors={errors} touched={touched} />
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

export const Create = ({history, match}) => (<Editor history={history} match={match} />)
export const Edit = ({history, match}) => (<Editor history={history} match={match} />)

export {Editor};
