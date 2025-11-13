import { ReactNode } from "react";

interface ModalProps {
    id: string
    title: string
    modalSize?: string
    children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ id, title, modalSize, children }) => {
    return (
        <>
            <div className="modal fade" id={id} tabIndex={-1}>
                <div className={`modal-dialog ${modalSize}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id={id + '_btnClose'}>
                            </button>
                        </div>
                        <div className="modal-body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal;