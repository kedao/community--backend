import React, {useEffect, useState, useCallback, useMemo} from 'react';
import arrayMove from "array-move";
import {sortableContainer, sortableElement, sortableHandle} from "react-sortable-hoc";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Form, Formik} from "formik";
import Forms from "@/_components/Forms";
import * as Yup from "yup";
import {articleAdminRecommend as resource} from "@/_services";
import {useToasts} from "react-toast-notifications";

export const ONLINE_STATUS = 0; // 正常上架状态

export const ACTION_APPROVE = 0; // 上架
export const ACTION_REJECT = 1; // 下架
export const ACTION_RECOMMEND = 2; // 推荐
export const ACTION_CANCEL = 3; // 取消推荐

export function CreateTopicModel({isOpen, action, markable, onClose, onConfirm}) {
    const [modal, setModal] = useState(false);

    const {addToast} = useToasts();

    useEffect(() => {
        setModal(isOpen);
    }, [isOpen]);

    function handelClose() {
        setModal(false);
        onClose();
    }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('请输入名称'),
        url: Yup.string().required('请输入链接'),
        locations: Yup.number().required('请选择位置'),
        coverImage: Yup.string().required('请上传图片'),
    });

    const [initialValues] = useState({
        title: '',
        url: '',
        locations: '',
        coverImage: '',
    });

    function onSubmit(fields, {setStatus, setSubmitting}) {
        const data = {};
        Object.keys(initialValues).forEach((field) => data[field] = fields[field]);

        setStatus();
        (resource.insertSubject(data)).then(() => {
            handelClose();
            addToast(`插入专题完成`, {appearance: 'success'});
        })
            .catch(error => {
                handelClose();
                addToast(error || `插入专题失败`, {appearance: 'error'});
                setSubmitting(false);
            });
    }

    const locations = useMemo(() => {
        const locations = [{value: '', label: ''}];
        for (let i = 1; i <= 10; i++) {
            locations.push({value: i, label: i});
        }

        return locations;
    }, []);

    return (<Modal isOpen={modal} toggle={handelClose} className="modal-lg">
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({errors, touched, isSubmitting, setFieldValue}) => {
                    return (
                        <Form>
                            <ModalHeader toggle={handelClose} className="d-flex">
                                <i className="fas fa-plus"/> 插入专题
                            </ModalHeader>
                            <ModalBody>
                                <fieldset>
                                    <Forms.Text field="title" label="标题" required={true} />
                                    <Forms.Text field="url" label="链接" required={true} />
                                    <Forms.Image field="coverImage" label="图片" />
                                    <Forms.Select field="locations" options={locations} label="位置" required={true} />
                                </fieldset>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" type="submit" disabled={isSubmitting} className="btn-primary">插入专题</Button>{' '}
                                <Button color="secondary" onClick={handelClose}>取消</Button>
                            </ModalFooter>
                        </Form>
                    );
                }}
            </Formik>

    </Modal>);
}

export function GeneralModel({isOpen, action, markable, onClose, onConfirm}) {
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [actionClassName, setActionClassName] = useState('');
    const [remark, setRemark] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setModal(isOpen);

        let actionClassName = 'btn-danger';
        let disabled = false;

        if (action === ACTION_APPROVE) {
            setTitle('取消撤稿');
            actionClassName = 'btn-success';
        } else if (action === ACTION_CANCEL) {
            setTitle('取消推荐');
        } else if (action === ACTION_REJECT) {
            setTitle('撤稿');
            disabled = true;
        }

        setActionClassName(actionClassName);
        setDisabled(disabled);
    }, [isOpen]);

    function handelClose() {
        setModal(false);
        onClose();
    }

    function handleConfirm() {
        onConfirm(remark);
    }

    function onContentChange(e) {
        setRemark(e.target.value);
        setDisabled(!e.target.value);
    }

    return (<Modal isOpen={modal} toggle={handelClose}>
        <ModalHeader toggle={handelClose} className="d-flex">
            <i className="fas fa-plus"/> {title}
        </ModalHeader>
        <ModalBody>
            {action === ACTION_APPROVE || action === ACTION_CANCEL ?
                <div>确定对稿件进行取消撤稿吗？</div> :

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-12">
                            <label>撤稿原因</label>
                            <textarea rows={5} className="form-control" onChange={onContentChange} />
                        </div>
                    </div>
                </div>
            }
        </ModalBody>
        <ModalFooter>
            <Button color="primary" className={actionClassName} disabled={disabled} onClick={handleConfirm}>{title}</Button>{' '}
            <Button color="secondary" onClick={handelClose}>取消</Button>
        </ModalFooter>
    </Modal>);
}

export function RecommendModel({isOpen, selecteds, onClose, onConfirm}) {
    const [modal, setModal] = useState(false);
    const [items, setItems] = useState([]);
    const [positions, setPositions] = useState({});

    useEffect(() => {
        const positions = {}

        setModal(isOpen);
        setItems(selecteds);
        for (let datum of selecteds) {
            positions[datum.articleId] = 0;
        }
        setPositions(positions);

    }, [isOpen]);

    function handleChange(articleId, value) {
        positions[articleId] = parseInt(value);
    }

    function handelClose() {
        setModal(false);
        onClose();
    }

    function handleConfirm() {
        const data = items.map((e) => ({articleId: e.articleId, recommendType: positions[e.articleId]}));
        onConfirm(data);
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    const DragHandle = sortableHandle(() => <span className="recommend-item-drag-handle drag-handle-init mr-1" title="拖动排序"><i className="icon-three-bars"/></span>);

    const SortableContainer = sortableContainer(({children}) => {
        return <div className="recommend-items">{children}</div>;
    });

    const SortableItem = sortableElement(({item}) => (
        <div className="p-2 mt-1 bg-light border rounded recommend-item">
            <div className="recommend-item-title">
                <DragHandle /> {item.title}
            </div>

            <div className="recommend-item-selects">
                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="0" onChange={(e) => handleChange(item.articleId, e.target.value)} defaultChecked={true} />
                        文章
                    </label>
                </div>

                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="1" onChange={(e) => handleChange(item.articleId, e.target.value)} />
                        大图
                    </label>
                </div>

                <div className="form-check form-check-inline">
                    <label className="form-check-label">
                        <input type="radio" className="form-check-input" name={`check-${item.articleId}`} value="2" onChange={(e) => handleChange(item.articleId, e.target.value)} />
                        大图并置顶
                    </label>
                </div>
            </div>
        </div>
    ));

    return (<Modal isOpen={modal} toggle={handelClose} className="modal-lg">
        <ModalHeader toggle={handelClose} className="d-flex">
            <i className="fas fa-plus"/> 推荐
        </ModalHeader>
        <ModalBody>
            <SortableContainer helperClass="sortableHelper" onSortEnd={onSortEnd} useDragHandle axis="y">
                {items.map((e, i) => <SortableItem key={e.articleId} index={i} item={e} />)}
            </SortableContainer>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" className="btn-success" onClick={handleConfirm}>推荐</Button>{' '}
            <Button color="secondary" onClick={handelClose}>取消</Button>
        </ModalFooter>
    </Modal>);
}
