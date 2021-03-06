import React from 'react'
import Select from 'react-select';
import { connect } from 'react-redux';
import { HttpClient, setConfigAxios } from "../api/httpClient";
import Popup from './Popup'
import SockJsClient from 'react-stomp';
import Pagination from "react-js-pagination";
import constants from '../constants'
import { FiChevronDown, FiChevronUp, FiCheck, FiX, FiPlusCircle } from "react-icons/fi";
import loading from '../assets/loader.gif'
require("bootstrap-css-only/css/bootstrap.css");



let isCreator = false
class SoSaoY extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = {
			options: [],
			branchId: 0,
			page: 1,
			size: 10,
			isAdding:  false,
			isEditting: false,
			indexEditting: -1,
			indexDelete: -1,
			isShowPopup: false,
			popupTitle: '',
			popupContent: '',
			customizeCancelButton: '',
			customizeOkButton: '',
			popupStatus: '',
			products: [],
			userInfo: {},
			showMenu: false,
			totalPages: 1,
			totalElements: 0,
		};
	}
	async componentDidMount(){
		this.fetchData()
	}
	fetchData = async (currentPage) => {
		let {page, size} = this.state
		if(currentPage) page = currentPage
		let branchId, curBranch
		const {branch} = this.props.branch
		const userInfo = await JSON.parse(localStorage.getItem('USER_INFO'))
		if(branch.id) branchId = branch.id
		else {
			curBranch = await localStorage.getItem('BRANCH')
			curBranch = JSON.parse(curBranch)
			branchId = curBranch?.id
		}
		const url = '/copy-books?branch-id=' + branchId + '&page='+page+'&size='+size
		const url1 = 'recommendation?branch-id=' + branchId + '&key=JOB_TYPE'
		this.setState({loadding: true})
		try {
			await setConfigAxios()
			const response = await HttpClient.get(url);
			const response1 = await HttpClient.get(url1);
			let options = []
			if(response1?.data?.length > 0){
				response1.data.forEach(ele => {
					const item = {
						value: ele,
						label: ele
					}
					options.push(item)
				});
			}
			this.setState({
				products: response?.data?.content,
				branchId,
				branch: curBranch !== undefined ? curBranch : branch,
				options: [...options],
				userInfo,
				loadding: false,
				page,
				indexEditting: -1,
				totalPages: response?.data?.totalPages,
				totalElements: response?.data?.totalElements
			})
		} catch (error) {
			if(error?.response?.status === 401){
				await localStorage.clear()
				this.setState({
					isShowPopup: true,
					popupTitle: '',
					popupContent:'Phiên đã hết hạn. Vui lòng đăng nhập lại!',
					popupStatus : 'sessionExpire',
					showCancelButton: false,
					oadding: false,
					customizeOkButton: 'OK'
				})
			} else {
				this.setState({
					isShowPopup: true,
					popupTitle: '',
					popupContent: error?.response?.message,
					popupStatus : 'error',
					showCancelButton: false,
					customizeOkButton: 'OK',
					oadding: false,
				})
			}
		}
	}
	handleUserInput(filterText) {
	  this.setState({filterText: filterText});
	};
	handleRowDel(product) {
	  var index = this.state.products.indexOf(product);
	  this.state.products.splice(index, 1);
	  this.setState(this.state.products);
	};
  
	handleAddEvent(evt) {
		const {isAdding, isEditting} = this.state
		if(isEditting) {
			this.setState({
				isShowPopup: true,
				popupTitle: '',
				popupStatus:'saveEdittingRecord',
				popupContent:'Hiện đang có bản ghi đang chỉnh sửa, bạn có muốn lưu lại trước khi tạo bản ghi mới?',
				showCancelButton: true,
				customizeCancelButton: 'Không',
				customizeOkButton: 'Có'
			})
		} else {
			var product = {
				parties: '',
				quantity: 0,
				docType: '',
				fee: 0,
				confirmedBy: "",
				}
				let {products} = this.state
				products.splice(0,0,product)
				if(products.length>10){
					products.pop()
				}
				this.setState({
					products,
					isAdding: true,
					isEditting: false,
					indexEditting: 0,
				});
		}
	}

	handleProductTable(evt) {
		const {indexEditting} = this.state
		const id = evt.target.id
		const name = evt.target.name
		const value = evt.target.value
		let {products} = this.state

		const num = id.indexOf('_')
		const index = id.slice(0, num)
		if(indexEditting !== -1 && index != indexEditting){
			this.setState({
				isShowPopup: true,
				popupTitle: '',
				popupStatus: 'saveToAdd',
				popupContent:'Hiện đang có bản ghi đang chỉnh sửa, bạn có muốn lưu lại trước khi sửa một bản ghi mới?',
				showCancelButton: true,
				customizeCancelButton: 'Không',
				customizeOkButton: 'Có'
			})
		} else {
			products[index][name] = value
			this.setState({
				products,
				indexEditting: index,
				isEditting: true,
			})
		}
	};
	onSave = async(index) => {
		const {indexEditting, products, isAdding, isEditting, branchId, page, size } = this.state
		if(isAdding) { // Trường hợp add
			const book = products[0]
			const url = '/copy-books?branch-id='+branchId
			await setConfigAxios()
			try {
				isCreator = true
				this.setState({loadding: true})
				const response = await HttpClient.post(url, book);
				this.setState({loadding: false})
			} catch (error) {
				this.setState({loadding: false})
			}
		} else { // Trường hợp Edit
			if(index == indexEditting) { // Gọi api edit 
				const product = products[index]
				const url = '/copy-books/' + product.id
				isCreator = true
				try {
					this.setState({loadding: true})
					await setConfigAxios()
					const response = await HttpClient.put(url, product);
				} catch (error) {
					this.setState({loadding: false})
				}
				this.setState({
					isEditting: false,
					indexEditting: -1,
					loadding: false,
					isShowPopup: false,
				})
			} else { // Mở chức năng sửa cho row được chọn 
				this.setState({
					indexEditting: index,
					isShowPopup: false,
				})
			}
		}
	}
	onDelete = async(e, index)=> {
		e.preventDefault();
		this.setState({
			indexDelete: index,
			isShowPopup: true,
			popupTitle: '',
			popupStatus:'deleteRecord',
			popupContent:'Bạn có muốn xoá bản ghi này?',
			showCancelButton: true,
			customizeCancelButton: 'Không',
			customizeOkButton: 'Có'
		})
	}
	toSoChungThuc = () => {
		this.props.history.push('/chungthuc')
	}
	toCongChung = () => {
		this.props.history.push('/congchung')
	}
	onMessage = async (msg) => {
		let { isAdding, isEditting, products, options } = this.state
		if(msg.type == 'COPY_BOOK' && msg.action == 'ADD') {
			let {indexEditting} = this.state
			if(isCreator){ // Người tạo bản ghi
				indexEditting = -1
				isAdding = false
				isEditting = false
				products.shift()
				products.unshift(msg.payload)
				isCreator = false
			} else { // người nhận được socket
				if (isEditting && !isAdding){ // đang sửa 1 bản ghi khác
					indexEditting = parseInt(indexEditting) + 1
					products.unshift(msg.payload)
				} else if(isAdding){ // đang thêm 1 bản ghi khác 
					products.splice(1, 0, msg.payload)
				} else { // đang không thao tác gì cả
					products.unshift(msg.payload)
				}
				if(products.length >= 10){
					products.pop()
				}
			}
			const find = options.findIndex((ele)=> ele.value == msg.payload.docType)
			if(find === -1){
				options.push({
					value: msg.payload.docType,
					label: msg.payload.docType
				})
			}
			this.setState({
				products,
				indexEditting,
				isAdding,
				isEditting,
				options
			})
		} else if(msg.type == 'COPY_BOOK' && msg.action == 'UPDATE'){
			const editIndex = products.findIndex(ele => ele.id === msg.payload.id)
			if(editIndex !== -1){
				products[editIndex] = msg.payload
				this.setState({products})
			}
			isCreator = false
		} else if(msg.type == 'COPY_BOOK' && msg.action == 'DELETE'){
			await this.fetchData()
		}
	}
	onContinueAction = async() =>{
		const {popupStatus} = this.state
		if(popupStatus === 'sessionExpire'){
			this.props.history.push('/')
		} else if(popupStatus === 'deleteRecord'){
			const {indexDelete, products} = this.state
			const url = '/copy-books/' + products[indexDelete].id
			try {
				this.setState({loadding: true})
				const response = await HttpClient.delete(url);
				this.setState({loadding: false})
			} catch (error) {
				await this.fetchData()
			}
		} else if(popupStatus === 'saveEdittingRecord' ||  popupStatus ==='saveToAdd') {
			await this.onSave(this.state.indexEditting)
		}
		this.setState({
			isEditting: false,
			indexEditting: -1,
			loadding: false,
			isShowPopup: false,
		})
	}
	onCancelAction = () => {
		this.setState({
			isShowPopup: false
		})
	}
	changeJobType = (index , value) => {
		let {products} = this.state
		products[index].docType  = value.value
		this.setState({...products})
	}
	changeJobTypeInput = (index , value) => {
		const {products} = this.state
		if(value != '') {
			products[index].docType  = value
			this.setState({products})
		}
	}
	onLogout = async() => {
		await localStorage.removeItem('TOKEN')
		await localStorage.removeItem('BRANCH')
		this.props.history.push('/')
	}
	onCancelEdit = async (e, index) => {
		await this.fetchData()
	}
	onChangePass = () => {
		this.props.history.push('/change-password')
	}
	handlePageChange = async (e) => {
		await this.fetchData(e)
	}
	changeShowMenu = () => {
		this.setState({showMenu: !this.state.showMenu})
	}
 	render() {
		 const {loadding, page, showMenu, branchId, branch, popupTitle, popupContent, customizeCancelButton, customizeOkButton, isShowPopup, indexEditting, options, showCancelButton, userInfo, isAdding } = this.state
		 const url = constants.baseUrl + 'websocket'
	  return (
		<div style={{marginTop: 20, marginLeft: 20}}>
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
			{branchId> 0 && <SockJsClient url= {url} topics={[`/ws/room/${branchId}`]}
				onMessage={(msg) => this.onMessage(msg)}
				onConnect = {()=>{
				}}
				onDisConnect = {()=>{
				}}
				ref={ (client) => { this.clientRef = client }} />}
			<div style = {{flexDirection: 'row', display: 'flex', justifyContent:'space-between'}}>
				<div style={{marginTop: 20}}>
					<button  style={{width: 150, height: 40, fontSize: 14, fontWeight: 'bold', borderTopLeftRadius: 5, borderBottomLeftRadius:5, backgroundColor:'#d5f7de'}} onClick = {this.toCongChung}>Công chứng</button>
					<button style={{width: 150, height: 40, fontSize: 14, fontWeight: 'bold', backgroundColor:'#d5f7de'}} onClick = {this.toSoChungThuc}>Chứng thực</button>
					<button style={{width: 150, height: 40, backgroundColor:'rgba(2, 184, 117, 1)', fontSize: 14, fontWeight: 'bold', borderTopRightRadius: 5, borderBottomRightRadius:5}} >Sao y</button>
				</div>
				<div style ={{}}>
					<span style= {{fontSize: 40, fontWeight:'500', marginRight: 100}}>{branch?.name}</span>
					{branch?.id == 1 && <img width={100} height={100} src={require('../assets/hp.jpg')}></img>}
					{branch?.id == 2 && <img width={100} height={100} src={require('../assets/vuhai.jpg')}></img>}
					{branch?.id == 3 && <img width={100} height={100} src={require('../assets/tplts.jpg')}></img>}
					{branch?.id == 4 && <img width={100} height={100} src={require('../assets/tplnxt.jpg')}></img>}
				</div>
				<span style={{flexDirection: 'row', paddingTop: 10, float: 'right', marginRight: 20}}>
					<span style={{marginRight: 20, fontWeight: 'bold', fontSize: 16}}>{userInfo?.fullName}</span>
					{!showMenu && <span onClick={this.changeShowMenu}><FiChevronDown size ={20}/></span>}
					{showMenu && <span onClick={this.changeShowMenu}><FiChevronUp size ={20}/></span>}
					{showMenu &&<div style ={{}}>
						<div style={{flexDirection: 'column', display: 'flex', alignItems: 'flex-end', borderRadius: 5, borderWidth: 1, borderColor:'black'}}>
							<button style= {{width: 100, marginTop: 10, marginBottom: 5, backgroundColor:'rgba(2, 184, 117, 1)'}} className="btn btn-success" onClick ={this.onChangePass}><span style={{fontSize: 14, fontWeight: '500'}}>Đổi mật khẩu</span></button>
							<button style= {{width: 100, backgroundColor:'rgba(2, 184, 117, 1)'}} className="btn btn-success" onClick ={this.onLogout}><span style={{fontSize: 14, fontWeight: '500'}}>Đăng xuất</span></button>
						</div>
					</div>}
				</span>
			</div>
			<ProductTable 
				onProductTableUpdate={this.handleProductTable.bind(this)} 
				onSave = {this.onSave}
				onDelete = {this.onDelete}
				onCancelEdit = {this.onCancelEdit}
				onRowAdd = {this.handleAddEvent.bind(this)} 
				onRowDel = {this.handleRowDel.bind(this)} 
				products = {this.state.products} 
				filterText = {this.state.filterText}
				indexEditting = {indexEditting}
				options = {options}
				page = {page}
				loadding = {loadding}
				isAdding = {isAdding}
				changeJobType = {this.changeJobType}
				userInfo = {userInfo}
				changeJobTypeInput = {this.changeJobTypeInput}
			/>:
			<Pagination
				activePage={page}
				itemsCountPerPage={10}
				totalItemsCount={this.state.totalElements}
				pageRangeDisplayed={this.state.totalPages}
				onChange={e => this.handlePageChange(e)}
        />
			
		</div>
	  );
  
	}
  }
  
  class ProductTable extends React.Component {
	render() {
	  var onProductTableUpdate = this.props.onProductTableUpdate;
	  var onSave = this.props.onSave;
	  var onDelete = this.props.onDelete;
	  var onCancelEdit = this.props.onCancelEdit;
	  var isAdding = this.props.isAdding;
	  var rowDel = this.props.onRowDel;
		var options = this.props.options;
		var loadding = this.props.loadding;
		var page = this.props.page;
		var userInfo = this.props.userInfo;
		var changeJobType = this.props.changeJobType;
		var changeJobTypeInput = this.props.changeJobTypeInput;
	  var indexEditting = this.props.indexEditting;
	  var product = this.props.products.map(function(product, index) {
		return (
			<ProductRow 
				onProductTableUpdate={onProductTableUpdate} 
				onSave ={onSave} 
				onDelete ={onDelete} 
				onCancelEdit ={onCancelEdit} 
				product={product} 
				userInfo={userInfo} 
				onDelEvent={rowDel.bind(this)} 
				key={product.id} 
				index={index} 
				isAdding={isAdding} 
				indexEditting={indexEditting}
				options={options}
				changeJobType = {changeJobType}
				changeJobTypeInput = {changeJobTypeInput}
			/>)
	  });
	  return (
		<div>
  
		{page ==1 &&<div style={{float: 'left', marginTop: 15}}>
			<button type="button" onClick={this.props.onRowAdd} className="btn btn-success" style={{marginRight: 20, marginBottom: 10, backgroundColor:'rgba(2, 184, 117, 1)'}}>
				<FiPlusCircle size={25} color='white'/>
			</button>
		</div>}
			{ loadding &&
					<div className="loading">
						<img  src={loading} alt="loading"/>
					</div>
			}
			<table className="table table-bordered">
			<thead>
			  <tr>
				<th>Stt</th>
				<th>Số sao y bản chính</th>
				<th>Cá nhân, tổ chức tham sao y chứng thực</th>
				<th>Số lượng</th>
				<th>Loại văn bản sao y</th>
				<th>Lệ phí thu</th>
				<th>CCV xác nhận</th>
				{userInfo.role=='MANAGER'&&<th>Sửa</th>}
				{userInfo.role!='MANAGER' && indexEditting == 0 &&<th>Lưu lại</th>}
				{userInfo.role=='MANAGER'&&<th>Xoá</th>}
			  </tr>
			</thead>
  
			<tbody>
			  {product}
			</tbody>
			</table>
		</div>
	  );
	}
  }
  
  class ProductRow extends React.PureComponent {
	render() {
		const {index, indexEditting, options, userInfo, product, isAdding} = this.props
		const selectedOption = {
			value: product.docType,
			label: product.docType,
		}
	  return (
		<tr className="eachRow">
		  <td style={{alignItems:'center'}}><p style={{fontSize: 16, alignItems:'center', display:'flex', marginTop: 9, flexDirection:'column'}}>{this.props.index + 1}</p></td>
		  <td style={{alignItems:'center'}}><p style={{fontSize: 16, alignItems:'center', display:'flex', marginTop: 9, flexDirection:'column'}}>{product.identifier}</p></td>
		  {/* <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
				"type": "identifier",
				value: product.identifier,
				id: this.props.index + '_soCongChung',
				index: this.props.index,
				indexEditting: indexEditting
		  }}/> */}
		  <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
				type: "parties",
				value: product.parties,
				userInfo: userInfo,
				id: this.props.index + '_nguoiThamGia',
				index: this.props.index,
				indexEditting: indexEditting
		  }}/>
		  <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
				type: "quantity",
				value: product.quantity,
				userInfo: userInfo,
				id: this.props.index + '_quantity',
				index: this.props.index,
				indexEditting: indexEditting
		  }}/>
		  <td>
				<div style={{width: 200}}>
					<Select
						value={selectedOption}
						onChange={value => this.props.changeJobType(index, value)}
						onInputChange={value => this.props.changeJobTypeInput(index, value)}
						options={options}
					/>
				</div>
			</td>
		  <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
				type: "fee",
				value: this.props.product.fee,
				id: this.props.index + '_lePhiThu',
				userInfo: userInfo,
				index: this.props.index,
				indexEditting: indexEditting
		  }}/>
		  <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
				type: "confirmedBy",
				value: this.props.product.confirmedBy,
				userInfo: userInfo,
				id: this.props.index + '_ccvXacNhan',
				index: this.props.index,
				indexEditting: indexEditting
		  }}/>
			{userInfo.role=='MANAGER' && indexEditting != index && <td style={{textAlign: 'center'}}>{ (userInfo?.username == product?.createdBy || (isAdding && index == 0) || (userInfo?.role === 'MANAGER' || userInfo?.role === 'SYS_ADMIN')) ? <button style={{width: 80, height: 30, backgroundColor: 'rgba(2, 184, 117, 1)', borderRadius: 10, fontWeight:'bold'}} onClick= { e => this.props.onSave(index)}>Sửa</button> : '-'}</td>}
			{indexEditting == index && <td style={{textAlign: 'center'}}>{ (userInfo?.username == product?.createdBy || (isAdding && index == 0) || (userInfo?.role === 'MANAGER' || userInfo?.role === 'SYS_ADMIN')) ? (<div style={{flexDirection: 'row', display:'flex', justifyContent: 'center'}}><span style={{width: 30, height: 30, display:'flex', borderRadius:5, backgroundColor: 'rgba(2, 184, 117, 1)', marginRight:10, cursor: 'pointer'}}  onClick= { e => this.props.onSave(index)}><FiCheck size={30} color="#ffffff"/></span> <span style={{width: 30, height: 30, display:'flex', borderRadius:5, backgroundColor:'#ed5e3e', cursor: 'pointer'}}  onClick= { e => this.props.onCancelEdit(e, index)}><FiX size={30} color="#ffffff" /></span> </div>): '-'}</td>}
			{userInfo.role=='MANAGER'&&<td style={{textAlign: 'center'}}>{ (userInfo?.username == product?.createdBy || (isAdding && index == 0) || (userInfo?.role === 'MANAGER' || userInfo?.role === 'SYS_ADMIN'))  ? <button style={{width: 80, height: 30, backgroundColor: '#ed5e3e', borderRadius: 10, fontWeight:'bold'}} onClick= { e => this.props.onDelete(e, index)}>Xoá</button>: '-'}</td>}
		</tr>
	  );
  
	}
  }
  class EditableCell extends React.PureComponent {
  
	render() {
		const {cellData} = this.props
		let size = null
		if(cellData.type === 'parties') {
			size= 40
		} else if(cellData.type === 'identifier'){
			size = 5
		}
		let type ='text'
		if(cellData.type === 'fee' || cellData.type === 'quantity') type = 'number'
	  return (
		<td>
			<input 
				className={cellData.index !== cellData.indexEditting ? "congchung-input" : "congchung-input-border"}
				type={type} 
				size = {size}
				name={cellData.type} 
				id={cellData.id} 
				value={cellData.value} 
				onChange={this.props.onProductTableUpdate} 
				disabled={cellData.type == 'identifier' || (cellData.userInfo.role!='MANAGER' && cellData.index != cellData.indexEditting )}
			/>
		</td>
	  );
	}
  }
function mapStateToProps(state, ownProps) {
	return {
		branch: state.branch
	}
}
export default connect(mapStateToProps, null)(SoSaoY);