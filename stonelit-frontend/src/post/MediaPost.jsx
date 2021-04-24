import React, {useState, useEffect} from 'react';
import classNames from 'classnames';
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

import GeneralForm from "./components/GeneralForm";
import {ErrorMessage} from "@/_components/Enhances";
import {articleAdmin as resource, media as mediaService} from "@/_services";
import {useToasts} from "react-toast-notifications";
import MediaUpload from "@/_components/MediaUpload";
import {useRouteMatch} from "react-router-dom";

const actionCreate = resource.createVideo;
const actionUpdate = resource.update;

const validationSchema = Yup.object().shape({
    title: Yup.string().required('请输入标题'),
    // details: Yup.string().required('请输入内容'),
    productId: Yup.string(),
    channelId: Yup.string().required('请选择投稿频道'),
    remark: Yup.string().required('请选择上传视频'),
    coverImage: Yup.string().required('请选择上传封面图片'),
    copyrightNotice: Yup.string().when('articleType', {
        is: '0',
        then: Yup.string().required('请选择原创版权声明')
    }),
    originalUrl: Yup.string().when('articleType', {
        is: '1',
        then: Yup.string().required('请输入转载来源')
    }),
    originalAuth: Yup.string().when('articleType', {
        is: '1',
        then: Yup.string().required('请选择转载授权')
    }),
    acceptTerms: Yup.bool().oneOf([true], '请阅读并接受条款'),
});

const validate = values => {
    const errors = {};

    const regex = /(<([^>]+)>)/ig
    const result = values.details.replace(regex, "");

    if (!result.trim()) {
        errors.details = '请输入内容';
    }

    return errors;
};

function MediaPost({history}) {
    const match = useRouteMatch();
    const {id} = match.params;
    const isCreateMode = !id;

    const {addToast} = useToasts();
    const [pending, setPending] = useState(true);
    const [initialValues, setInitialValues] = useState({
        title: '',
        channelId: '',
        articleType: '0',
        video: '',
        coverImage: '',
        copyrightNotice: '',
        originalUrl: '',
        originalAuth: '',
        remark: '',
        details: '',
        acceptTerms: false,
        state: 0,
        productId: '',
    })

    const actionLabel = isCreateMode ? '投稿' : '编辑';

    useEffect(() => {
        const fetcher = async (id) => {
            const response = await resource.selectById(id);
            const data = {};
            Object.keys(initialValues).forEach((field) => data[field] = response.data[field]);
            if (!data.channelId) {
                data.channelId = '';
            }
            if (!data.productId) {
                data.productId = '';
            }
            if (!data.originalAuth) {
                data.originalAuth = '0';
            }
            data.articleType = data.articleType ? data.articleType.toString() : '0';
            data.originalAuth = data.originalAuth ? data.originalAuth.toString() : '';
            data.recommendFlag = data.recommendFlag ? data.recommendFlag.toString() : '';
            setInitialValues(data);
            setPending(false);
        };

        if (isCreateMode) {
            setPending(false);
        } else {
            fetcher(id)
        }
    }, [id]);

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        // data.productId = 1;

        data.state = 1;
        if (!isCreateMode) {
            data.id = id;
        }

        setStatus();
        (isCreateMode ? actionCreate(data) : actionUpdate(data)).then(() => {
            addToast(`视频投稿完成`, {appearance: 'success'});
            history.push(isCreateMode ? '.' : '..');
        })
        .catch(error => {
            addToast(error ?? `视频投稿失败`, {appearance: 'error'});
        }).finally(() => setSubmitting(false));
    }

    if (pending) {
        return <div>Loading</div>;
    }

    return (
        <Formik initialValues={initialValues} validate={validate} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({errors, touched, isSubmitting, setFieldValue, setErrors, setSubmitting, setFieldTouched, values, handleSubmit, submitForm, ...others}) => {
                const handleSaveDraft = (fields) => {
                    const data = {};
                    Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

                    setErrors({
                        title: '请输入标题'
                    });
                    setFieldTouched('contents', false);

                    if (!values.title) {
                        return setFieldTouched('title', true);
                    } else {
                        setFieldTouched('title', false);
                    }

                    data.state = 0;
                    if (!isCreateMode) {
                        data.id = id;
                    }

                    setSubmitting(true);

                    (isCreateMode ? actionCreate(values) : actionUpdate(data)).then(() => {
                        addToast(`保存草稿完成`, {appearance: 'success'});
                        history.push('/my');
                    })
                    .catch(error => {
                        addToast(error ?? `保存草稿失败`, {appearance: 'error'});
                        setSubmitting(false);
                    })
                }

                const mediaUploadChange = (media) => {
                    const {isUploading} = media;

                    if ((typeof media.url === 'string' || media.url instanceof String)) {
                        console.info('remark', media.url)
                        setFieldValue('remark', media.url);
                    } else {
                        setFieldValue('remark', '');
                    }

                    setFieldTouched('remark', !isUploading);
                }

                return (
                    <Form onSubmit={handleSubmit}>
                        <div className="container u-mt-medium">
                            <div className="row">
                                <div className="col-md-7 col-xl-8">
                                    <MediaUpload onChange={mediaUploadChange}
                                                 api={mediaService.uploadVideo}
                                                 extensions={['.mp4']}
                                                 accept="video/mp4"
                                                 className={classNames({'dropzone--danger': errors.remark && touched.remark})}
                                                 error={touched.remark && touched.remark ? errors.remark : ''}
                                                 uploaded={!!values.remark}
                                                 defaultLabel="点击上传视频"
                                    />

                                    <div className="c-search-form c-search-form--dark">
                                        <div className="c-field">
                                            <label className="c-field__label c-search-form__label"
                                                   htmlFor="search-location">视频标题</label>
                                            <Field name="title" type="text"
                                                   className={classNames('c-input', {'c-input--danger': errors.title && touched.title})}/>
                                            <ErrorMessage name="title" />
                                        </div>
                                    </div>

                                    <div className="c-search-form c-search-form--dark">
                                        <div className="c-field ">
                                            <label className="c-field__label c-search-form__label"
                                                   htmlFor="search-location">视频简介</label>
                                            <Field name="details" as="textarea" rows={10}
                                                   className={classNames('c-input', {'c-input--danger': errors.details && touched.details})}/>
                                            <ErrorMessage name="details" />
                                        </div>
                                    </div>

                                    <div className="u-justify-center">
                                        <div className="u-flex u-mt-medium u-justify-center">
                                            <button type="submit" className="c-btn c-btn--info u-mr-xsmall">投稿</button>
                                            <button type="button" className="c-btn c-btn--secondary" onClick={() => handleSaveDraft(values)}>保存草稿</button>
                                        </div>
                                    </div>
                                </div>

                                <GeneralForm errors={errors} touched={touched} values={values} isVideo={true}
                                             setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default MediaPost;
