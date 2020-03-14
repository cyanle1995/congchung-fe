import React, { Component } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
class ModalBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: this.props.show,
			data: this.props.rowData
		};
	}

	continueAction(e) {
		if (this.props.onContinueAction) {
			this.props.onContinueAction(this.props.data, e);
		}
	}

	cancelAction(e) {
		if (this.props.onCancelAction) {
			this.props.onCancelAction(this.props.data, e);
		}
	}
	onCloseAction(e) {
		if (this.props.onCloseAction) {
			this.props.onCloseAction(this.props.data, e);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.show !== this.state.show) {
			this.setState({ show: nextProps.show })
		}
	}
	handleClose = () => {		
		if (this.props.handleClose) {
			this.props.handleClose(this.props.data);
		}else{
			this.setState({ show: false });
		}
	}
	
	handleShow = () => {
		this.setState({ show: true });
	}
	render() {
		return (
			<Modal show={this.state.show} onHide={(e)=>this.handleClose(e)} dialogClassName="custom-modal" backdrop="static">
			<Modal.Header closeButton ></Modal.Header>
				<Modal.Body>
					<Col md={6} sm={6} xs={6}>
						
					</Col>
					<h1>{this.props.title}</h1>
					<h2>{this.props.subtitle}</h2>

					<div style={{marginBottom: 15}}><span style={{fontSize: 14}}>{this.props.content ? this.props.content : ''}</span></div>
					<Row>
						<Col md={6} sm={6} xs={6}>
							{this.props.showCancelButton &&
								<Button className="btn-block" onClick={(e) => this.cancelAction(e)}>{this.props.customizeCancelButton ? this.props.customizeCancelButton : 'Cancel'}</Button>
							}
						</Col>
						<Col md={6} sm={6} xs={6}>
							{!this.props.customizeCloseBtn && <Button className="btn-primary btn-block" onClick={(e) => this.continueAction(e)}>{this.props.customizeOkButton ? this.props.customizeOkButton : 'Continue'}</Button>}
						</Col>
						{this.props.imgSrc && <div className="img-popup"><img src={this.props.imgSrc} /></div>}
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
};

export default ModalBox