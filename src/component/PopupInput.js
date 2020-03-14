import React, { Component } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
class ModalBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			show: this.props.show,
			data: this.props.rowData,
			password: '',
		};
	}

	continueAction(e) {
		if (this.props.onContinueAction) {
			this.props.onContinueAction(e, this.state.password);
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

					<div className="form-group" style={{flexDirection:'row', display:'flex', marginBottom: 10, marginTop: 20, justifyContent:'center', alignItems:'center'}}>
						<label style={{width: 150, fontSize: 18}}>Password:</label>
						<input type="password" name='password' className="form-control input-lg" placeholder="Enter password" style={{width: '60%', fontSize: 16}}
							onChange = { e => this.setState({password: e.target.value})}
							value={this.state.password}
							onKeyDown={this.handleKeyDown}
						/>
					</div>
					<Row>
						<Col md={6} sm={6} xs={6}>
							<Button className="btn-block" onClick={(e) => this.cancelAction(e)}>{this.props.customizeCancelButton ? this.props.customizeCancelButton : 'Cancel'}</Button>
						</Col>
						<Col md={6} sm={6} xs={6}>
							{!this.props.customizeCloseBtn && <Button className="btn-primary btn-block" onClick={(e) => this.continueAction(e)}>OK</Button>}
						</Col>
						{this.props.imgSrc && <div className="img-popup"><img src={this.props.imgSrc} /></div>}
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
};

export default ModalBox