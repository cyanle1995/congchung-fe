import React, {Component} from 'react';
import '../App.css';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import Popup from './Popup'
import constants from '../constants';
import { ok } from 'assert';
class ForgetPass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			isMatch: false,
			isShowPopup: false,
			popupContent: '',
			popupTitle: '',
			customizeOkButton: '',
			showCancelButton: false,
		}
	}
	onSubmit = async() => {
		const {email} = this.state
		try {
			localStorage.removeItem('TOKEN')
			localStorage.removeItem('BRANCH')
			const url = constants.baseUrl + 'users/forgot-password?email='+email
			const response = await HttpClient.put(url);
			console.log('Response is:', response);
			this.setState({
				isShowPopup: true,
				showCancelButton: false,
				popupContent: 'Hệ thống đã gửi mật khẩu mới đến email của bạn. Vui lòng kiểm tra email.',
				customizeOkButton: 'OK',
			})
		} catch (error) {
			this.setState({
				isShowPopup: true,
				showCancelButton: false,
				popupContent: 'Opp, đã có lỗi xảy ra. Vui lòng thử lại',
				customizeOkButton: 'OK',
			})
		}
	}
	onChangeText = (e) => {
		this.setState({
			[e.target.name] : e.target.value,
		})
	}
	onContinueAction = () => {
		this.props.history.push('/')
	}
	onCancelAction = () => {
		this.setState({
			isShowPopup: false
		})
	}
	render(){
		const {email, customizeCancelButton, customizeOkButton, showCancelButton, popupContent, popupTitle, isShowPopup} = this.state
		return (
			<div className="App" style={{padding: 100, justifyContent: 'center', alignItems:'center'}}>
				<div className="borderLogin" style={{width: '60%', paddingBottom:60, paddingTop:60, justifyContent: 'center', alignItems:'center', display: 'inline-table'}}>
					<h3 style={{marginBottom: 40, fontSize: 35, fontWeight: '500'}}>Thay đổi mật khẩu</h3>
					<div className="form-group" style={{flexDirection:'row', display:'flex', justifyContent:'center', alignItems:'center'}}>
						<label style={{width: 150, fontSize: 14}}>Email:</label>
						<input type="email" name='email' className="form-control input-lg" placeholder="Enter email" style={{width: '60%', fontSize: 16}}
						onChange = {this.onChangeText}
						value={email}
						/>
					</div>
					
					<div style={{width: '20%', display: 'inherit', borderRadius: 10, justifyContent:'center', marginTop: 30}}>
						<button type="submit" className="btn btn-primary btn-block" onClick= {this.onSubmit} disabled ={email.length === 0}><span style={{fontSize: 20, fontWeight:'bold'}}>Gửi</span></button>
					</div>
				</div>
				{isShowPopup && <Popup
				show={true} 
				title = {popupTitle} 
				content={popupContent} 
				customizeOkButton={customizeOkButton} 
				customizeCancelButton={customizeCancelButton} 
				showCancelButton={showCancelButton} 
				onContinueAction = {this.onContinueAction}	
				onCancelAction = {this.onCancelAction}	
			/>}
			</div>
			);
		}
	}

export default ForgetPass;
