import React, {Component} from "react";
import PropTypes from 'prop-types';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {media} from '@/_services';

import './index.css';

const UploadPreview = ({url, hasError, uploading, percentage}) => (
    <div className="upload-preview-frame">
        <img className={'upload-preview-image' + (hasError ? ' upload-preview-image-error' : '')} alt="" src={url}/>
        {hasError &&
        <div className="upload-preview-state">
            <i className="icon-warning upload-preview-text text-danger"/>
        </div>}

        {uploading &&
        <div className="upload-thumb-progress">
            <div className="progress">
                <div
                    className={'progress-bar progress-bar-striped' + (hasError ? ' progress-bar-danger bg-danger' : ' progress-bar-success bg-success')}
                    style={{'width': percentage + '%'}}>
                </div>
            </div>
        </div>}
    </div>
);

const DragHandle = sortableHandle(() => <span className="file-drag-handle drag-handle-init p-2" title="拖拽排序"><i className="icon-three-bars"/></span>);

const SortableItem = sortableElement(({url, hasError, uploading, percentage, onRemove}) => (
    <div className="multiple-upload-preview">
        <UploadPreview url={url} hasError={hasError} uploading={uploading} percentage={percentage} />

        <div className="file-thumbnail-footer">
            <div className="file-actions">
                <div className="file-footer-buttons">
                    <button type="button" className="kv-file-remove" title="排序" onClick={onRemove}><i className="icon-bin"/></button>
                </div>
            </div>
            <DragHandle />
            <div className="clearfix" />
        </div>
    </div>
));

const SortableContainer = sortableContainer(({children}) => {
    return <div className="multiple-files-container">{children}</div>;
});

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

class UploadImages extends Component {

    increment = 0;

    constructor(props) {
        super(props);

        this.selectFiles = this.selectFiles.bind(this);
        this.upload = this.upload.bind(this);
        this.uploads = this.uploads.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);

        const images = props.images ? props.images: [];
        for (let i = 0; i < images.length; i++) {
            if (typeof images[i] === 'string' || images[i] instanceof String) {
                images[i] = {
                    url: images[i],
                    id: (new Date().valueOf()) + s4(),
                }
            }

            if (!images[i].id) {
                images[i].id = (new Date().valueOf()) + s4();
            }
        }

        this.state = {
            files: !props.multiple && images.length > 1 ? [images[0]] : images,
            uploadStates: {},
            fileInputKey: 0,
        };

        this.inputElement = null;
        this.increment = 0;
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({files}) => ({
            files: arrayMove(files, oldIndex, newIndex),
        }), this.dispatchOnChange);
    };

    componentWillReceiveProps(nextProps) {
        /*
        if (nextProps.images !== this.props.images) {
            this.setState({files: nextProps.images});
        }
         */
    }

    selectFiles(event) {
        const {files, uploadStates} = this.state;

        if (!this.props.multiple) {
            files.length = 0
        }

        for (let i = 0; i < event.target.files.length; i++) {
            const image = event.target.files[i];
            const id = ++this.increment;

            files.push({
                id: id,
                url: URL.createObjectURL(image),
                type: 'new',
            });

            uploadStates[id] = {
                id: id,
                file: image,
                percentage: 0,
                started: false,
                finished: false,
                error: null,
            };
        }

        this.props.onChange(files, uploadStates);

        this.setState({
            files: files,
            uploadStates: uploadStates,
            fileInputKey: this.state.fileInputKey+1,
        }, () => {
            this.uploads();
        });
    }

    uploads() {
        const {uploadStates} = this.state;

        for (let datum of Object.values(uploadStates)) {
            if (datum.started === false) {
                this.upload(datum);
                uploadStates[datum.id].started = true;
            }
        }

        this.props.onChange(this.state.files, uploadStates);
        this.setState({uploadStates}, this.dispatchOnChange);
    }

    upload(item) {
        media.uploadImage(item.file, (event) => {
            const {uploadStates} = this.state;
            uploadStates[item.id].percentage = Math.round((100 * event.loaded) / event.total);
            this.setState({uploadStates}, this.dispatchOnChange);
        })
            .then((data) => {
                return data.data;
            })
            .then((data) => {
                const {uploadStates} = this.state;

                uploadStates[item.id].percentage = 100;
                uploadStates[item.id].finished = true;
                uploadStates[item.id].url = data.url;
                uploadStates[item.id].data = data;

                this.props.onChange(this.state.files, uploadStates);

                this.setState({uploadStates}, this.dispatchOnChange);
            })
            .catch((e) => {
                console.error(e);
                const {uploadStates} = this.state;

                uploadStates[item.id].error = '文件上传失败';

                this.props.onChange(this.state.files, uploadStates);

                this.setState({uploadStates}, this.dispatchOnChange);
                // this.dispatchOnError('文件上传失败');
            });
    }

    triggerFileUpload() {
        this.inputElement.click();
    }

    onRemove(index) {
        const {files} = this.state;
        files.splice(index, 1);
        this.setState({files}, this.dispatchOnChange);
    }

    dispatchOnChange() {
        const {onFileChange} = this.props;
        const {files, uploadStates} = this.state;

        if (!onFileChange) {
            return;
        }

        let isUploading = false;
        let hasError = false;

        const urls = [];
        for (let datum of files) {
            if (datum.type === 'new') {
                if (!uploadStates[datum.id]) {
                    continue;
                }

                if (uploadStates[datum.id].finished) {
                    urls.push(uploadStates[datum.id].url);
                } else if (uploadStates[datum.id].error) {
                    hasError = true;
                } else {
                    isUploading = true;
                }
            } else {
                urls.push(datum.url);
            }
        }

        onFileChange(urls, isUploading, hasError);
        // this.props.onChange(this.state.files, uploadStates);
    }

    dispatchOnError(error) {
        // const {files, uploadStates} = this.state;
        this.props.onError && this.props.onError(error);
    }

    renderMultiple() {
        const {files, uploadStates} = this.state;

        return (<SortableContainer onSortEnd={this.onSortEnd} useDragHandle axis="xy">
            {files.map((item, index) => (
                <SortableItem key={`item-${item.url}-${item.id}`} index={index} value={item}
                              url={item.url}
                              hasError={uploadStates[item.id] && uploadStates[item.id].error}
                              uploading={uploadStates[item.id] && !uploadStates[item.id].finished}
                              percentage={uploadStates[item.id] ? uploadStates[item.id].percentage : 0}
                              onRemove={() => this.onRemove(index)} />
            ))}

            {files.length === 0 && <div className="upload-preview-unavailable-multiple">
                <div className="upload-preview-state">
                    {/*<i className="icon-spinner2 spinner upload-preview-text" />*/}
                    <i className="icon-image4 upload-preview-text text-grey"/>
                </div>
            </div>}
        </SortableContainer>)
    }

    renderSingle() {
        const {files, uploadStates} = this.state;

        return <div className="file-container">
            {files.map((item) => <div className="multiple-upload-preview" key={item.id ? item.id : item.url}>
                                    <UploadPreview
                                      url={item.url}
                                      hasError={uploadStates[item.id] && uploadStates[item.id].error}
                                      uploading={uploadStates[item.id] && !uploadStates[item.id].finished}
                                      percentage={uploadStates[item.id] ? uploadStates[item.id].percentage : 0} /></div>)}
            {files.length === 0 &&
            <div className="upload-preview">
                <div className="upload-preview-frame upload-preview-unavailable">
                    <div className="upload-preview-state">
                        {/*<i className="icon-spinner2 spinner upload-preview-text" />*/}
                        <i className="icon-image4 upload-preview-text text-grey"/>
                    </div>
                </div>
            </div>}
        </div>;
    }

    render() {
        return (
            <div className={`files-upload-container ${this.props.className}`}>
                {this.props.multiple ? this.renderMultiple() : this.renderSingle()}
                <div className="upload-container">
                    <input key={this.state.fileInputKey} type="file" accept="image/*" style={{display: 'none'}}
                           onChange={this.selectFiles}
                           ref={input => this.inputElement = input}
                           multiple={!!this.props.multiple}
                    />
                    <button
                        type="button"
                        className={this.props.buttonClassName}
                        onClick={this.triggerFileUpload}
                    >
                        上传图片
                    </button>
                </div>
            </div>
        );
    }
};

UploadImages.defaultProps = {
    className: '',
    style: {},
    multiple: false,
    extensions: ['.jpg', '.jpeg', '.gif', '.png'],
    maxFileSize: 5242880,
    buttonText: "上传图片",
    buttonClassName: "btn btn-success",
    buttonStyles: {},
    onChange: () => {},
};

UploadImages.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    multiple: PropTypes.bool,
    extensions: PropTypes.array,
    maxFileSize: PropTypes.number,
    buttonText: PropTypes.string,
    buttonClassName: PropTypes.string,
    buttonStyles: PropTypes.object,
    images: PropTypes.array,
    onChange: PropTypes.func,
};

export default UploadImages;
