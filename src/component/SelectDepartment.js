import React, {Component} from 'react';
import '../App.css';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import { connect } from 'react-redux';
class SelectDepartment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			branches: [],
			userInfo: {},
		}
	}
	async componentDidMount(){
		const token = await localStorage.getItem('TOKEN')
		let userInfo = await localStorage.getItem('USER_INFO')
		userInfo = JSON.parse(userInfo)
		console.log('COMPORNENS', token);
		console.log('COMPORNENS', userInfo);
		await setConfigAxios()
		try {
			const response = await HttpClient.get('/branches');
			console.log('Response branch:', response);
			if(response.data){
				this.setState({
					branches: response.data,
					userInfo,
				})
			}
		} catch (error) {
			console.log('error:', error);
		}
	}
	gotoMain = async (e, branchId, dispatch) => {
		console.log('ID:', branchId);
		e.preventDefault()
		const {branches} = this.state
		const branch = branches.find(b => b.id === branchId)
		console.log(branch);
		
		if(branch) 
			await localStorage.setItem('BRANCH', JSON.stringify(branch))
		this.props.dispatch({
			type: 'GET_BRANCH',
			payload: this.state.branches.find(b => b.id ===branchId),
		});
		this.props.history.push('/congchung')
	}
	gotoManagement = async (e) => {
		e.preventDefault()
		this.props.history.push('/user-list')
	}
	render(){
		const {branches, userInfo} = this.state
		return (
		<div style={{padding: 150}}>
			<div style={{marginBottom: 50, display: 'flex', justifyContent:'center'}}>
				{userInfo?.role ==='SYS_ADMIN'&&
					<button type="submit" className="btn btn-primary btn-block" style={{ width: 200, height: 50, fontSize: 18}} onClick ={e =>this.gotoManagement(e)}>Quản lý nhân viên</button>
				}
			</div>
			<div className="App" style={{ flexDirection:'row',display:'flex', justifyContent: 'center', alignItems:'center'}}>
				<div style={{width: '30%', flexDirection: 'row'}}>
					<button type="submit" className="btn btn-primary btn-block" style={{marginBottom: 50, height: 50, fontSize: 18}} onClick ={e =>this.gotoMain(e, branches[0]?.id)}>{branches[0]?.name}</button>
					<button type="submit" className="btn btn-primary btn-block" style={{ height: 50, fontSize: 18}} onClick ={e =>this.gotoMain(e, branches[1]?.id)}>{branches[1]?.name}</button>
				</div>
				<div style={{width: '30%', flexDirection: 'row', marginLeft: 50}}>
					<button type="submit" className="btn btn-primary btn-block" style={{marginBottom: 50, height: 50, fontSize: 18}} onClick ={e =>this.gotoMain(e, branches[2]?.id)}>{branches[2]?.name}</button>
					<button type="submit" className="btn btn-primary btn-block" style={{ height: 50, fontSize: 18}} onClick ={e =>this.gotoMain(e, branches[3]?.id)}>{branches[3]?.name}</button>
				</div>
			</div>
		</div>
		);
	}
}
export default connect(null, null)(SelectDepartment);
