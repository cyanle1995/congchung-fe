import React, {Component} from 'react';
import '../App.css';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import Popup from './Popup'
import constants from '../constants'
class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPass: '',
			newPass: '',
			confirmPass: '',
			isStartTyping: false,
			isShowPopup: false,
			showCancelButton: false,
			popupContent: '',
			popupStatus: '',
			customizeOkButton: '',

		}
	}
	componentDidMount(){
		
	}
	onChange = (e) => {
		const {name, value} = e.target
		let {newPass, confirmPass} = this.state
		let {isStartTyping} = this.state
		if(name === 'confirmPass') isStartTyping = true
		this.setState({
			[name]: value,
			isStartTyping,
		})
	}
	onSubmit = async (e) =>{
		console.log('onSubmit');
		e.preventDefault()
		try {
			const url = constants.baseUrl + 'users/change-password'
			await setConfigAxios()
			const payload = {
				currentPassword: this.state.currentPass,
				newPassword: this.state.newPass,
			}
			const response = await HttpClient.put(url,payload)
			console.log(response);
			if(response.status === 200){
				this.setState({
					isShowPopup: true,
					popupStatus: 'changePassSuccess',
					showCancelButton: false,
					popupContent: 'Đổi mật khẩu thành công',
					customizeOkButton: 'OK'
				})
			}
		} catch (error) {
			console.log(error.response);
			if(error?.response?.status === 500){
				this.setState({
					isShowPopup: true,
					showCancelButton: false,
					popupContent: 'Lỗi! Đổi mật khẩu không thành công!',
					customizeOkButton: 'OK'
				})
			}
		}
	}
	onCancelAction = () => {
		this.setState({isShowPopup: false})
	}
	onContinueAction = () => {
		if(this.state.popupStatus ==='changePassSuccess'){
			this.props.history.push('/')
		}
		this.setState({isShowPopup: false})
	}
	render(){
		const {isShowPopup, popupContent, popupTitle, customizeOkButton, showCancelButton, isStartTyping, newPass, confirmPass} = this.state
		console.log('pass:', this.state.currentPass);
		console.log('newPass:', this.state.newPass);
		console.log('confirmPass:', this.state.confirmPass);
		
		return (
			<div style={{marginLeft: 20, marginTop: 100, flexDirection:'column', display:'flex', alignItems: 'center'}}>
				{isShowPopup && <Popup
					show={true} 
					title = {popupTitle} 
					content={popupContent} 
					customizeOkButton={customizeOkButton} 
					showCancelButton={showCancelButton} 
					onContinueAction = {this.onContinueAction}	
					onCancelAction = {this.onCancelAction}	
				/>}
				<p style={{fontSize: 30}}>Đổi mật khẩu</p>
				<div>
					<p>Mật khẩu hiện tại:</p>
					<input type= 'password' size = {100} name= 'currentPass' value={this.state.currentPass} onChange={e => this.onChange(e)}/>
				</div>
				<div>
					<p>Mật khẩu mới:</p>
					<input type= 'password' size = {100} name= 'newPass' value={this.state.newPass} onChange={e => this.onChange(e)}/>
				</div>
				<div>
					<p>Xác nhận mật khẩu hiện tại:</p>
					<input type= 'password' size = {100} name= 'confirmPass' value={this.state.confirmPass} onChange={e => this.onChange(e)} style={{marginBottom: 10}}/>
					{isStartTyping && (newPass===confirmPass) &&<p style={{color:'#28a745'}}>Khớp</p>}
					{isStartTyping && (newPass!==confirmPass) &&<p style={{color:'#ed5e3e'}}>Không trùng khớp</p>}
				</div>
				<button
					style={{width: 80, height: 30, backgroundColor: '#abf5bc', borderRadius: 10, marginTop: 20}} 
					onClick= { e => this.onSubmit(e)}
					disabled = {newPass !==confirmPass || !isStartTyping}
				>Đổi mật khẩu</button>
			</div>
			);
	}
}
export default ResetPassword;
