import React, {useState} from 'react';
import {ErrorMessage, Field} from "formik";

export const AsyncSelect = ({field, label, required, ...others}) => {
    return (<div className="form-group row">
        <label className="col-lg-2 col-form-label font-weight-semibold">{label} {required && <span className="text-danger">*</span>}</label>
        <Field
            name={field}
        >
            {({ field, form, meta }) => {
                const {setFieldValue} = form;

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
                    }
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

export default AsyncSelect;
