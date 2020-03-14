import React, {Component} from 'react';
import '../App.css';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import Popup from './Popup'
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			isShowPopup: false,
			popupContent: '',
			popupTitle: '',
			customizeCancelButton: '',
			customizeOkButton: '',
			showCancelButton: false,
		}
	}
	componentDidMount(){
		// localStorage.removeItem('TOKEN')
		// const token = localStorage.getItem('TOKEN')
		// if(token) this.props.history.push('/department')
	}
	onLogin = async() => {
		const {username, password} = this.state
		const user = {
			username: username,
			password: password,
		}
		try {
			localStorage.removeItem('TOKEN')
			const response = await HttpClient.post('/authenticate', user);
			localStorage.setItem('TOKEN', response.data.token)
			await setConfigAxios()
			const responseGetMe = await HttpClient.get('/users/me');
			localStorage.setItem('USER_INFO', JSON.stringify(responseGetMe.data))
			console.log('responseGetMe:', responseGetMe);
			console.log('Response is:', response);
			this.props.history.push('/department')
		} catch (error) {
			console.log('Login fail:', error.response);
			if(error?.response?.status === 500){
				this.setState({
					isShowPopup: true,
					popupContent: 'Username hoặc Password không đúng!',
					showCancelButton: false,
					customizeOkButton: 'OK'
				})
			}
		}
	}
	onChangeText = (e) => {
		this.setState({
			[e.target.name] : e.target.value 
		})
	}
	handleKeyDown = (e) => {
		if (e.key === 'Enter') {
		  this.onLogin()
		}
	}
	onContinueAction = () => {
		this.setState({
			isShowPopup: false
		})
	}
	onCancelAction = () => {
		this.setState({
			isShowPopup: false
		})
	}
	render(){
		
		const {username, password, customizeCancelButton, customizeOkButton, showCancelButton, popupContent, popupTitle, isShowPopup} = this.state
		return (
			<div className="App" style={{padding: 100, justifyContent: 'center', alignItems:'center'}}>
				<div className="borderLogin" style={{width: '60%', paddingBottom:60, paddingTop:60, justifyContent: 'center', alignItems:'center', display: 'inline-table'}}>
					<h3 style={{marginBottom: 40, fontSize: 35, fontWeight: '500'}}>Đăng nhập</h3>
					<div className="form-group" style={{flexDirection:'row', display:'flex', justifyContent:'center', alignItems:'center'}}>
						<label style={{width: 150, fontSize: 18}}>Username:</label>
						<input type="email" name='username' className="form-control input-lg" placeholder="Enter username" style={{width: '60%', fontSize: 16}}
						onChange = {this.onChangeText}
						value={username}
						/>
					</div>

					<div className="form-group" style={{flexDirection:'row', display:'flex', marginBottom: 10, marginTop: 20, justifyContent:'center', alignItems:'center'}}>
						<label style={{width: 150, fontSize: 18}}>Password:</label>
						<input type="password" name='password' className="form-control input-lg" placeholder="Enter password" style={{width: '60%', fontSize: 16}}
							onChange = {this.onChangeText}
							value={password}
							onKeyDown={this.handleKeyDown}
						/>
					</div>
					<div>
						<a href ='/forget-password'>Quên mật khẩu?</a><br/>
					</div>
					<div style={{width: '20%', display: 'inherit', borderRadius: 10, justifyContent:'center', marginTop: 30}}>
						<button type="submit" className="btn btn-primary btn-block" onClick= {this.onLogin} disabled ={username.length === 0 || password.length === 0}><span style={{fontSize: 20, fontWeight:'bold'}}>Login</span></button>
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

export default Login;
