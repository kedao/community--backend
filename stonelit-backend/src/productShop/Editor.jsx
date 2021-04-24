import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import {useToasts} from "react-toast-notifications";
import * as Yup from 'yup';

import {productShop as resource} from '@/_services';
import {BreadcrumbLink} from "@/_teleporters/Breadcrumb";
import {SubHeadingSource} from "@/_teleporters/Heading";

import UploadImages from "@/_components/ImagesUpload";
import UploadValidation from "@/_components/ImagesUpload/UploadValidation";

const actionFetch = resource.selectById;
const actionCreate = resource.create;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    shopName: Yup.string()
        .required('请输入名称'),
});

const Editor = ({history, match}) => {
    const id = match.params.id;
    const isCreateMode = !id;
    const actionLabel = isCreateMode ? '添加' : '编辑';
    const key = id ?? 'create';

    const {addToast} = useToasts();
    const [pending, setPending] = useState(false);
    const [files, setFiles] = useState([]);
    const [coverImage, setCoverImage] = useState('');
    const [uploadStates, setUploadStates] = useState({});
    const [initialValues, setInitialValues] = useState({
        shopName: '',
        contents: '',
    })

    const fetcher = async (id) => {
        const response = await actionFetch(id);
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
        setInitialValues(data);
        if (response.data.logo) {
            setCoverImage(response.data.logo);
        }
        setPending(true);
    };

    useEffect(() => {
        if (isCreateMode) {
            setPending(true);
        } else {
            fetcher(id)
        }
    }, [id]);

    const onUploadImagesChange = (files, uploadStates) => {
        setFiles(files);
        setUploadStates(uploadStates);
    }

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const uploadValidation = new UploadValidation(files, uploadStates);

        if (uploadValidation.checkHasError()) {
            setSubmitting(false);
            return addToast('图片上传失败，请重新上传', {appearance: 'error'});
        }
        if (uploadValidation.checkIsUploading()) {
            setSubmitting(false);
            return addToast('图片上传中，请稍后', {appearance: 'error'});
        }

        const fileUrls = uploadValidation.getFileUrls();
        if (fileUrls.length === 0) {
            setSubmitting(false);
            // return addToast('请上传一张图片', {appearance: 'error'});
        }

        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        if (!isCreateMode) {
            data.id = id;
        }
        data.coverImage = fileUrls && fileUrls.length ? fileUrls[0] : '';

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`${actionLabel}${resource.title}完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            console.info(error);
            addToast(`${actionLabel}${resource.title}失败`, {appearance: 'error'});
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
                                    <fieldset className="mb-3">
                                        <legend className="text-uppercase font-size-sm font-weight-bold">基本资料</legend>

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">名称 <span className="text-danger">*</span></label>

                                            <div className="col-lg-10">
                                                <Field name="shopName" type="text"
                                                       className={'form-control' + (errors.shopName && touched.shopName ? ' is-invalid' : '')}/>
                                                <ErrorMessage name="shopName" component="div"
                                                              className="invalid-feedback"/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label className="col-lg-2 col-form-label font-weight-semibold">图片</label>
                                            <div className="col-lg-10">
                                                <UploadImages onChange={onUploadImagesChange} id={'x' + key} key={'y' + key} images={coverImage ? [{url: coverImage}] : []} buttonClassName="btn btn-light" />
                                            </div>
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
};

export const Create = ({history, match}) => (<Editor history={history} match={match} />)
export const Edit = ({history, match}) => (<Editor history={history} match={match} />)

export {Editor};
