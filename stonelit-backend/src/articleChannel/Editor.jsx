import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import * as Yup from 'yup';
import { articleChannel } from '@/_services';
import { BreadcrumbLink } from "@/_teleporters/Breadcrumb";
import { SubHeadingSource } from "@/_teleporters/Heading";

const actionCreate = articleChannel.create;
const actionUpdate = articleChannel.update;

const resource = '频道';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required('请输入频道名称'),
    sort: Yup.number(),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [initialValues, setInitialValues] = useState({
        title: '',
        indexFlag: '1',
        sort: ''
    })

    const fetcher = async (id) => {
        const response = await articleChannel.selectById(id);
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

        if (data.sort === '') {
            data.sort = '0';
        }
        if (!isCreateMode) {
            data.id = id;
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resource}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            addToast(error ?? `${actionLabel}${resource}失败`, {appearance: 'error'});
            setSubmitting(false);
        });
    }

    return <div className="content">
        <BreadcrumbLink to={match.path}>{actionLabel}{resource}</BreadcrumbLink>
        <SubHeadingSource>{`${actionLabel}${resource}`}</SubHeadingSource>

        <div className="card">
            <div className="card-header header-elements-inline">
                <h5 className="card-title">{`${actionLabel}${resource}`}</h5>
            </div>

            <div className="card-body">
                <p className="mb-4">请输入或者选择表单项目，项目*为必选项。</p>

                {pending ?
                    <Formik key={key} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({errors, touched, isSubmitting, setFieldValue}) => {
                            return (
                                <Form>
                                    <fieldset className="mb-3">
                                        <legend className="text-uppercase font-size-sm font-weight-bold">基本资料
                                        </legend>

                                        <div className="form-group">
                                            <label>频道名称 <span className="text-danger">*</span></label>
                                            <Field name="title" type="text"
                                                   className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}/>
                                            <ErrorMessage name="title" component="div"
                                                          className="invalid-feedback"/>
                                        </div>

                                        <div className="form-group">
                                            <label>是否展示在首页</label>
                                            <Field name="indexFlag" as="select"
                                                   className={'form-control' + (errors.indexFlag && touched.indexFlag ? ' is-invalid' : '')}>
                                                <option value="1">是</option>
                                                <option value="0">否</option>
                                            </Field>
                                            <ErrorMessage name="indexFlag" component="div"
                                                          className="invalid-feedback"/>
                                        </div>

                                        <div className="form-group">
                                            <label>排序</label>
                                            <Field name="sort" type="text"
                                                   className={'form-control' + (errors.sort && touched.sort ? ' is-invalid' : '')}/>
                                            <ErrorMessage name="sort" component="div" className="invalid-feedback"/>
                                        </div>
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
}

export const Create = ({history, match}) => (<Editor history={history} match={match} />)
export const Edit = ({history, match}) => (<Editor history={history} match={match} />)

export {Editor};
