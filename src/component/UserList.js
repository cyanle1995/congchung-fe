import React, {Component} from 'react';
import '../App.css';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import Popup from './Popup'
import PopupInput from './PopupInput'
import Select from 'react-select';
import { connect } from 'react-redux';
import constants from '../constants'
class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listUser: [],
			roles: [
				{value: 'SYS_ADMIN', label: 'SYS_ADMIN'},
				{value: 'MANAGER', label: 'MANAGER'},
				{value: 'EMPLOYEE', label: 'EMPLOYEE'},
			],
			page: 1,
			size: 10,
			indexEditing: -1,
			indexDeleting: -1,
			isAdding: false,
			isShowPopup: false,
			isShowPopupInput: false,
			popupStatus: '',
			popupTitle: '',
			popupContent: '',
			customizeCancelButton: '',
			customizeOkButton: '',
		}
	}
	async componentDidMount(){
		await this.fetchData();
	}
	fetchData = async () => {
		let {page, size, roles} = this.state
		const url = constants.baseUrl + 'users?page='+page+'&size='+size
		const urlRole = constants.baseUrl + 'users/roles'
		try {
			await setConfigAxios()
			const response = await HttpClient.get(url)
			const responseRole = await HttpClient.get(urlRole)
			console.log('Response of get users:', response);
			console.log('responseRole', responseRole);
			if(response?.data?.content?.length > 0 && responseRole?.data) {
				this.setState({
					listUser: response?.data?.content,
					isAdding: false,
					indexEditing: -1,
					isShowPopup: false
				})
			}
		} catch (error) {
			console.log(error);
			
		}
	}
	onChangeText = (e, index) => {
		e.preventDefault()
		console.log('OnChangeText');
		const {indexEditting, listUser} = this.state
		const id = e.target.id
		const name = e.target.name
		const value = e.target.value
		console.log('index:', index);
		console.log('name:', name);
		console.log('value:', value);
		listUser[index][name] = value
		this.setState({...listUser})
		
	}
	onChangeActive = (e, index) => {
		console.log(e.target.checked);
		const checked = e.target.checked
		const {listUser} = this.state
		listUser[index].active = !listUser[index].active
		this.setState({...listUser})
	}
	onEdit = async (e, index) => {
		e.preventDefault()
		let {indexEditing, isAdding, listUser} = this.state
		console.log('onEdit:', indexEditing);
		
		if(isAdding){ // trường hợp add new
			const url = constants.baseUrl + 'users'
			try {
				const response = await HttpClient.post(url, listUser[0])
				console.log('Response add:', response);
				await this.fetchData()
			} catch (error) {
				this.setState({
					isShowPopup: true,
					showCancelButton: false,
					customizeOkButton: 'OK',
					popupStatus: 'addUserFail',
					popupContent: 'Lỗi! Không thể thêm mới người dùng.'
				})
			}
		} else {
			this.setState({indexEditing: index})
		}
		

	}
	onDetele = (e, index) => {
		e.preventDefault()
		const {indexEditting} = this.state
		this.setState({
			isShowPopup: true,
			popupStatus: 'delete',
			customizeCancelButton: 'No',
			customizeOkButton: 'Yes',
			popupContent: 'Bạn có muốn xoá bản ghi này?',
			showCancelButton: true,
			indexDeleting: index
		})
	}
	onChangePass = (e, index) => {
		e.preventDefault()
		this.setState({
			isShowPopupInput: true,
			indexEditing: index
		})
	}
	onRowAdd = () => {
		let {listUser} = this.state
		const user = {
			username: '',
			role: '',
			fullName: '',
			active: true,
			password: '',
			email: '',
		}
		listUser.unshift(user)
		this.setState({
			...listUser,
			indexEditing: 0,
			isAdding: true,
		})
	}
	onContinueAction = async () => {
		const {popupStatus, indexDeleting, listUser} = this.state
		if(popupStatus === 'delete'){
			try {
				const url = constants.baseUrl + 'users/' + listUser[indexDeleting].id
				const deleteResponse = await HttpClient.delete(url)
				console.log('deleteResponse:', deleteResponse);
				await this.fetchData()
			} catch (error) {
				this.setState({
					isShowPopup: true,
					showCancelButton: false,
					customizeOkButton: 'OK',
					popupStatus: 'deleteFail',
					popupContent:'Xoá thất bại!'
				})				
			}
		} else if(popupStatus === 'addUserFail' || popupStatus === 'deleteFail' || popupStatus === 'chanegPassSuccess' ) {
			this.setState({isShowPopup: false})
		}
	}
	onCancelAction = () => {
		this.setState({
			isShowPopup: false
		})
	}
	onContinueActionInput = async (e, value) => {
		const {listUser, indexEditing} = this.state
		const url = constants.baseUrl + 'users/admin/reset-password?username=' +listUser[indexEditing]?.username+'&new-password='+value
		console.log(url);
		this.setState({
			isShowPopupInput: false,
			isShowPopup: true,
			popupContent:`'Thay đổi mật khẩu thành công! Mật khẩu mới là: '${value}`,
			popupStatus: 'chanegPassSuccess',
			indexEditing: -1,
			showCancelButton: false,
			customizeOkButton: 'OK'
		})
		try {
			const response = await HttpClient.put(url)
			console.log('Change pass response:', response);
			
		} catch (error) {
			this.setState({
				isShowPopup: true,
				isShowPopupInput: false,
				showCancelButton: false,
				customizeOkButton: 'OK',
				popupStatus: 'changePassFail',
				popupContent:'Thay đổi mật khẩu không thành công!'
			})	
		}
	}
	onCancelActionInput = () =>{
		this.setState({
			isShowPopupInput: false
		})
	}
	changeRole = (index, value) => {
		console.log('changeRole:', value);
		
		let {listUser} = this.state
		listUser[index].role = value.value	
		this.setState({listUser})	
	}
	renderListUser = (listUser) => {
		const {indexEditing, isAdding,} = this.state
		
		return (
			listUser.map( (user, index) => {
				console.log(user);
				const selectedOption = {
					value: user?.role,
					label: user?.role,
				}
				return(
					<tr key={index}>
					<td>{index + 1}</td>
					<td><input className={indexEditing!= index ? "congchung-input" : "congchung-input-border"} disabled = {indexEditing != index} type ="text" size={60} name = 'username' value = {user?.username} onChange={e =>this.onChangeText(e, index)}/></td>
					
					<td>
						<div style={{width: 200}}>
							<Select
								value={selectedOption}
								onChange={value => this.changeRole(index, value)}
								// onInputChange={value => this.props.changeJobTypeInput(index, value)}
								options={this.state.roles}
							/>
						</div>
					</td>
					<td><input className={indexEditing!= index ? "congchung-input" : "congchung-input-border"} disabled = {indexEditing != index} type ="text" size={60} name = 'fullName' value = {user?.fullName} onChange={e =>this.onChangeText(e, index)}/></td>
					<td><input className={indexEditing!= index ? "congchung-input" : "congchung-input-border"} disabled = {indexEditing != index} type ="text" name = 'email' value = {user?.email} onChange={e =>this.onChangeText(e, index)}/></td>
					<td><input className={indexEditing!= index ? "congchung-input" : "congchung-input-border"} type="checkbox" value ={user.active} checked = {user.active} data-toggle="toggle" data-size="xs" onClick={e => this.onChangeActive(e, index)}/></td>
					{isAdding && <td><input disabled = {indexEditing != index} type ="password" name = 'password' value = {user?.password} onChange={e =>this.onChangeText(e, index)}/></td>}
					
					<td style={{width: 80, textAlign:'center'}}><button style={{height: 30, backgroundColor: '#28a745', borderRadius: 10}} onClick ={e=> this.onEdit(e, index)}>{indexEditing == index ? 'Lưu lại': 'Sửa'}</button></td>
					<td style={{width: 80, textAlign:'center'}}><button style={{height: 30, backgroundColor: '#28a745', borderRadius: 10}} onClick ={e=> this.onChangePass(e, index)}>Đổi mật khẩu</button></td>
					<td style={{width: 80, textAlign:'center'}}><button style={{height: 30, backgroundColor: '#ed5e3e', borderRadius: 10}} onClick ={e=> this.onDetele(e, index)}>Xoá</button></td>
				</tr>
				)
			})
		)
	}
	render(){
		const {isAdding,listUser, isShowPopup, popupContent, popupTitle, customizeCancelButton, customizeOkButton, showCancelButton, isShowPopupInput} = this.state
		console.log(listUser);
		
		return (
			<div style={{marginLeft: 20}}>
				<div style={{float: 'left', marginTop: 15}}>
					<button type="button" onClick={this.onRowAdd} className="btn btn-success" style={{marginRight: 20, marginBottom: 10}}>Add</button>
				</div>
				<table className="table table-bordered">
				<thead>
					<tr>
					<th>Stt</th>
					<th>Username</th>
					<th>Role</th>
					<th>Fullname</th>
					<th>Email</th>
					<th>Active</th>
					{isAdding && <th>Password</th>}
					<th style={{width: 80, textAlign:'center'}}>Sửa</th>
					<th style={{width: 100, textAlign:'center'}}>Đổi mật khẩu</th>
					<th style={{width: 80, textAlign:'center'}}>Xoá</th>
					</tr>
				</thead>
		
				<tbody>
					{this.renderListUser(listUser)}
				</tbody>
				</table>
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
				{isShowPopupInput && <PopupInput
					show={true} 
					onContinueAction = {this.onContinueActionInput}	
					onCancelAction = {this.onCancelActionInput}	
				/>}
			</div>
			);
	}
}
export default connect(null, null)(UserList);
