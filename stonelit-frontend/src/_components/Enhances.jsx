import React from 'react';
import {ErrorMessage as FormikErrorMessage} from "formik";
import classNames from "classnames";

export const ErrorMessage = ({...props}) => {
    return <FormikErrorMessage {...props} render={msg =>
        <div className={classNames("c-field__message u-color-danger", props.className)}><i className="fa fa-times-circle"/> {msg}</div>}/>
}
