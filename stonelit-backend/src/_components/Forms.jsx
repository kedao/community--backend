import React, {useState} from 'react';
import {ErrorMessage, Field} from "formik";
import DateRangePickerComponent from "react-bootstrap-daterangepicker";
import AsyncSelectComponent from 'react-select/async';
import CreatableSelect from "react-select/creatable/dist/react-select.esm";
import UploadImages from "@/_components/ImagesUpload";

import 'bootstrap-daterangepicker/daterangepicker.css';

export const Text = ({field, label, required, remark, ...props}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>

        <Field
            name={field}
        >
            {({ field, meta }) => (
                <div className="col-lg-10">
                    <input {...field} type="text" {...props} className={'form-control' + (meta.touched && meta.error ? ' is-invalid' : '')} />
                    {meta.touched &&
                    meta.error && <div className="invalid-feedback">{meta.error}</div>}

                    {remark && <span className="form-text text-muted">{remark}</span>}
                </div>
            )}
        </Field>
    </div>);
}

export const TextArea = ({field, label, required, rows = 5}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>

        <Field
            name={field}
        >
            {({ field, meta }) => (
                <div className="col-lg-10">
                    <textarea {...field} rows={rows} className={'form-control' + (meta.touched && meta.error ? ' is-invalid' : '')} />
                    {meta.touched &&
                    meta.error && <div className="invalid-feedback">{meta.error}</div>}
                </div>
            )}
        </Field>
    </div>);
}

export const Select = ({field, label, required, options = []}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
       
        <Field
            name={field}
        >
            {({ field, meta }) => (
                <div className="col-lg-10">
                    <select {...field} className={'form-control' + (meta.touched && meta.error ? ' is-invalid' : '')}>
                        {options && options.map((e) => <option key={e.value + e.label} value={e.value}>{e.label}</option>)}
                    </select>
                    {meta.touched && meta.error && <div className="invalid-feedback">{meta.error}</div>}
                </div>
            )}
        </Field>
    </div>);
}

export const CreatableReSelect = ({field, label, required, noOptionsMessage, formatCreateLabel, placeholder, ...others}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
        <Field
            name={field}
        >
            {({ field, form, meta }) => {
                const {setFieldValue} = form;

                const {initialValue} = meta;
                let options = [];
                if (typeof initialValue === 'string' || initialValue instanceof String) {
                    try {
                        options = JSON.parse(initialValue);
                        if (!Array.isArray(options)) {
                            options = [];
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                if (Array.isArray(initialValue)) {
                    options = [...initialValue];
                }
                for (let i = 0; i < options.length; i++) {
                    options[i] = {
                        value: String(options[i]),
                        label: String(options[i]),
                    }
                }

                if (!noOptionsMessage) {
                    noOptionsMessage = '请输入内容';
                }
                if (!placeholder) {
                    placeholder = '请输入内容';
                }
                if (!formatCreateLabel) {
                    formatCreateLabel = '按回车确定';
                }

                const defaultProps = {
                    isMulti: true,
                    onChange: (e) => setFieldValue(field.name, e.map(e => e.label)),
                    defaultValue: options,
                    noOptionsMessage: noOptionsMessage instanceof Function ? noOptionsMessage : () => noOptionsMessage,
                    formatCreateLabel: formatCreateLabel instanceof Function ? formatCreateLabel : () => formatCreateLabel,
                    placeholder: placeholder,
                    components: {IndicatorSeparator:() => null}
                }

                const props = {...defaultProps, ...others};
                return <div className="col-lg-10">
                    <CreatableSelect {...props} />
                    {/*<input {...field} type="hidden" />*/}
                    {meta.touched && meta.error && <div className="invalid-feedback">{meta.error}</div>}
                </div>
            }}
        </Field>

        <ErrorMessage name={field} component="div" className="invalid-feedback"/>
    </div>);
}

export const AsyncSelect = ({field, label, required, ...others}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
        <Field
            name={field}
        >
            {({ field, form, meta }) => {
                const {setFieldValue} = form;

                const defaultValue = meta.initialValue;

                const defaultProps = {
                    placeholder: '',
                    defaultOptions: true,
                    loadingMessage: () => '搜索中',
                    noOptionsMessage: () => '没有匹配结果',
                    onChange: e => setFieldValue(field.name, e.value),
                    isInvalid: meta.error && meta.touched,
                    styles: {
                        control: base => ({
                            ...base,
                            boxShadow: 'none',
                            borderColor: meta.error && meta.touched ? 'red' : '#ddd'
                        })
                    },
                    components: {IndicatorSeparator:() => null},
                    defaultValue
                }

                const props = {...defaultProps, ...others};

                return <div className="col-lg-10">
                    <AsyncSelectComponent
                        {...props}
                    />
                    {meta.touched && meta.error && <div className="invalid-feedback invalid-feedback-display">{meta.error}</div>}
                </div>
            }}
        </Field>
    </div>);
}

export const DateTimePicker = ({field, label, required, errors, touched, options = []}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
        <div className="col-lg-10">
            <Field
                name={field}
            >
                {({ field, form, meta }) => {
                    const {setFieldValue} = form;

                    const handleEvent = (e, picker) => {
                        const datetime = picker.startDate.format("YYYY-MM-DD HH:mm:ss");
                        setFieldValue(field.name, datetime);
                    }

                    return <div>
                        <DateRangePickerComponent
                            initialSettings={{
                                timePicker: true,
                                singleDatePicker: true,
                                showDropdowns: true,
                                timePicker24Hour: true,
                                firstDay: 1,
                                locale: {
                                    format: "YYYY-MM-DD HH:mm:ss",
                                    cancelLabel: '取消',
                                    applyLabel: "确定",
                                    daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                                    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                                }
                            }}
                            onApply={handleEvent}
                        >
                            <input {...field} readOnly type="text" className={'form-control' + (meta.touched && meta.error ? ' is-invalid' : '')} style={{backgroundColor: '#FFF'}} />
                        </DateRangePickerComponent>
                        {meta.touched && meta.error && <div className="invalid-feedback">{meta.error}</div>}
                    </div>
                }}
            </Field>
        </div>
    </div>);
}

export const Image = ({field, label, required}) => {
    const [specifyError, setSpecifyError] = useState(null);

    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
            <Field
                name={field}
            >
                {({ field, form, meta }) => {
                    const {setFieldValue, setFieldTouched} = form;
                    const {initialValue} = meta;
                    const images = [];

                    if ((typeof initialValue === 'string' || initialValue instanceof String) && initialValue) {
                        images.push(initialValue);
                    }

                    const onFileChange = (urls, isUploading, hasError) => {
                        setFieldValue(field.name, urls && urls.length ? urls[0] : '');

                        if (isUploading) {
                            setFieldTouched(field.name, false, false);
                            setSpecifyError('图片上传中');
                        } else if (hasError) {
                            setFieldTouched(field.name, true, true);
                            setSpecifyError('图片上传失败');
                        } else {
                            setFieldTouched(field.name, false, false);
                            setSpecifyError('');
                        }
                    }

                    const onError = (error) => {
                        console.info('onError', onError);
                        // setFieldError(field.name, error);
                    }

                    return (
                        <div className="col-lg-10">
                            <UploadImages onFileChange={onFileChange} onError={onError} images={images} buttonClassName="btn btn-light" />
                            {meta.touched && (specifyError || meta.error) && <div className="invalid-feedback">{specifyError ?? meta.error}</div>}
                        </div>
                    )
                }}
            </Field>
    </div>);
}

export const Images = ({field, label, required, ...others}) => {
    const [specifyError, setSpecifyError] = useState(null);

    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
            <Field
                name={field}
            >
                {({ field, form, meta }) => {
                    const {setFieldValue, setFieldTouched} = form;
                    const {initialValue} = meta;
                    let images = [];

                    if (typeof initialValue === 'string' || initialValue instanceof String) {
                        try {
                            images = JSON.parse(initialValue);
                            if (!Array.isArray(images)) {
                                images = [];
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    } else if (Array.isArray(initialValue)) {
                        images = [...initialValue];
                    }

                    if ((typeof initialValue === 'string' || initialValue instanceof String) && initialValue) {
                        images.push(initialValue);
                    }

                    const onFileChange = (urls, isUploading, hasError) => {
                        setFieldValue(field.name, urls);

                        if (isUploading) {
                            setFieldTouched(field.name, false, false);
                            setSpecifyError('图片上传中');
                        } else if (hasError) {
                            setFieldTouched(field.name, true, true);
                            setSpecifyError('图片上传失败');
                        } else {
                            setFieldTouched(field.name, false, false);
                            setSpecifyError('');
                        }
                    }

                    const onError = (error) => {
                        console.info('onError', onError);
                        // setFieldError(field.name, error);
                    }

                    const props = {...others, ...{images}};

                    return (
                        <div className="col-lg-10">
                            <UploadImages {...props} multiple={true} onFileChange={onFileChange} onError={onError} buttonClassName="btn btn-light" />
                            {meta.touched && (specifyError || meta.error) && <div className="invalid-feedback">{specifyError ?? meta.error}</div>}
                        </div>
                    )
                }}
            </Field>
    </div>);
}

export default {
    Text,
    TextArea,
    Select,
    AsyncSelect,
    CreatableReSelect,
    DateTimePicker,
    Image,
    Images,
};
