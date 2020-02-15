import React from "react"
import ReactDOM from "react-dom"

export interface ModalProps {
    onClose?: () => void
}

export interface ModalState { }

export default
class Modal
extends React.Component<ModalProps, ModalState> {
    render() {
        return <>
            {ReactDOM.createPortal(
                <div
                    className="c-modal"
                    onClick={this.props.onClose}
                >
                    <div
                        className="modal-wrap"
                        onClick={(event: React.MouseEvent) => {
                            event.stopPropagation()
                            event.nativeEvent.stopImmediatePropagation()
                        }}
                    >
                        {this.props.children}
                    </div>
                </div>,
                document.body
            )}
        </>
    }
}