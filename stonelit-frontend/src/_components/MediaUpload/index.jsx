import React, {Component} from "react";
import PropTypes from 'prop-types';
import {media as mediaService} from '@/_services';
import classNames from "classnames";

function generatId() {
    return  (new Date().valueOf()) + Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

class MediaUpLoad extends Component {

    state = {
        id: null,
        previewUrl: null,
        url: null,
        file: null,
        isUploading: false,
        isFinished: false,
        error: null,
        progress: 0,
        fileInputKey: 0,
    };

    constructor(props) {
        super(props);

        this.selectFiles = this.selectFiles.bind(this);
        this.upload = this.upload.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);

        this.inputElement = null;
        this.increment = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error !== this.props.error && !this.state.error) {
            // this.setState({error: nextProps.error});
        }
    }

    hasExtension(fileName) {
        const pattern = '(' + this.props.extensions.join('|').replace(/\./g, '\\.') + ')$';
        return new RegExp(pattern, 'i').test(fileName);
    }

    selectFiles(event) {
        const files = event.target.files;

        if (files.length !== 1) {
            return;
        }

        const file = files[0];

        const state = {
            id: generatId(),
            url: null,
            previewUrl: URL.createObjectURL(file),
            file: file,
            isUploading: false,
            isFinished: false,
            error: null,
            progress: 0,
            fileInputKey: this.state.fileInputKey+1,
        }

        if (!this.hasExtension(file.name)) {
            state.error = "所上传的文件类型不支持";
        } else if (file.size > this.props.maxFileSize) {
            state.error = "文件尺寸过大";
        }

        if (state.error) {
            // this.previewUrl = null;
            // this.file = null;
        }

        this.setState(state, !state.error ? this.upload : this.dispatchOnChange);
    }

    upload() {
        const {id, file} = this.state;
        const {api} = this.props;

        this.setState({
            isUploading: true,
        }, this.dispatchOnChange);

        api(file, (event) => {
            if (this.state.id !== id) {
                return;
            }
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        })
            .then((data) => {
                if (this.state.id !== id) {
                    return;
                }

                return data.data;
            })
            .then((data) => {
                // this.props.onChange(this.state.files, uploadStates);

                this.setState({
                    url: data.url,
                    isFinished: true,
                    isUploading: false,
                    progress: 100,
                }, this.dispatchOnChange);
            })
            .catch((e) => {
                if (this.state.id !== id) {
                    return;
                }
                this.setState({
                    error: '文件上传失败',
                    isUploading: false,
                }, this.dispatchOnChange);
            });
    }

    triggerFileUpload() {
        const {onClick} = this.props;

        this.inputElement.click();

        this.dispatchOnChange();
    }

    dispatchOnChange() {
        const {onChange} = this.props;

        onChange({...this.state});
    }

    render() {
        const {error, isUploading, progress} = this.state;
        const {className, accept, uploaded, defaultLabel, onFocus, onBlur} = this.props;

        let textView = <div className="cover-upload-text">{defaultLabel}</div>;
        if (isUploading) {
            textView = <div className="c-progress c-progress--info cover-upload-progress">
                <div className="c-progress__bar" style={{width: progress + '%'}}/>
            </div>;
        } else if (this.state.error || this.props.error) {
            textView = <div className="cover-upload-message">
                <small className="c-field__message u-color-danger cover-upload-message">
                    <i className="fa fa-times-circle"/>{this.state.error ? this.state.error : this.props.error}
                </small></div>;
        }

        return (
            <div className={classNames('dropmedia dropzone-card', className)} style={{height: '110px'}} onClick={this.triggerFileUpload}
                 onFocus={onFocus} onBlur={onBlur}>
                <input key={this.state.fileInputKey} type="file" accept={accept} style={{display: 'none'}}
                       onChange={this.selectFiles}
                       ref={input => this.inputElement = input}
                />
                <div className="dm-message dm-wrap">
                    {!uploaded ?
                    <i className="dm-icon fa fa-cloud-upload"/>:
                    <i className="dm-icon fa fa-check u-text-success"/>}

                    {textView}
                </div>
            </div>
        );
    }
}

MediaUpLoad.defaultProps = {
    className: '',
    style: {},
    extensions: ['.jpg', '.jpeg', '.gif', '.png'],
    accept: "image/*",
    maxFileSize: 512000000,
    // maxFileSize: 1024000, 1M
    uploaded: false,
    // maxFileSize: 1024,
    api: mediaService.uploadImage,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onClick: () => {},
};

MediaUpLoad.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    extensions: PropTypes.array,
    accept: PropTypes.string,
    maxFileSize: PropTypes.number,
    uploaded: PropTypes.bool,
    api: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
};

export default MediaUpLoad;
