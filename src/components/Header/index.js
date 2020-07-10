import React from 'react'
import {Row,Col,Dropdown,Menu,Icon} from 'antd'
import { withRouter,NavLink } from 'react-router-dom'
import Units from './../../units'
import Super from "./../../super"
import "./index.css"
import defaultImg from './../../image/003.png'
const { SubMenu } = Menu

class Header extends React.Component{
	state={
		bkEntities:[],bkColumnsId:[],bkMenuId:"102281919733819",bkQueryKey:"",pageSize:"100",hydUrl:"http://116.62.163.143:85/hydrocarbon/",
		板块id字段:"板块id",
		板块名称字段:"板块名称",
		图标字段:"图标"
	}
	componentWillMount(){
		this.setState({
			userName:Units.getLocalStorge("name")
		})
		this.getUser()
	}
	componentDidMount(){
		this.initBKListByMenuId();

		let usedBlockId
		const query = window.location.href.split("?")[1];
		if(query){
			const vars =query.split("&")
			for (let i=0;i<vars.length;i++) {
				const pair = vars[i].split("=");
				if(pair[0] === "blockId"){
					usedBlockId=parseInt(pair[1])
				}
			}
		}
		Super.super({
			url:'api2/meta/menu/get_blocks',                   
		}).then((res)=>{
			console.log("blocks1==="+JSON.stringify(res.blocks))
			const currentBlockId=usedBlockId?usedBlockId:res.currentBlockId //判断url里有blockid
			res.blocks.forEach((item)=>{
				if(item.id===currentBlockId){
					this.props.setCurrentList(item)
				}
				item.l1Menus.forEach((it)=>{
					it.blockId=item.id
					it.l2Menus.forEach((i)=>{
						i.blockId=item.id
					})
				})
				item.menus=<Menu>
								{this.renderBlockMenu(item.l1Menus)}
							</Menu>
			})
			this.setState({
				blocks:res.blocks,
				currentBlockId,
			})
		})
	}
	initBKListByMenuId=()=>{
		Super.super({
			url:`api2/entity/${this.state.bkMenuId}/list/tmpl`,
			method:'GET',
		}).then((res) => {
			console.log("aaa==="+JSON.stringify(res));
			//console.log("bkTmpl==="+JSON.stringify(res));
			this.state.bkQueryKey=res.queryKey;
			let resColumns=res.ltmpl.columns;
			this.initBKColumnsId(resColumns);
			this.initBKListByQueryKey();
		})
	}
	initBKColumnsId=(resColumns)=>{
		let bkColumnsId = {};
		resColumns.map((item, index) => {
			//console.log(item.title+",==="+item.id)
			bkColumnsId[item.title] = item.id;
		});
		console.log("bkColumnsId==="+JSON.stringify(bkColumnsId))
		this.setState({bkColumnsId: bkColumnsId});
	}
	initBKListByQueryKey=()=>{
		Super.super({
			url:`api2/entity/list/${this.state.bkQueryKey}/data`,
			method:'GET',
			query:{pageSize:this.state.pageSize}
		}).then((res) => {
			console.log("bkData==="+JSON.stringify(res));
			this.setState({bkEntities:res.entities});
		})
	}
	renderBlockMenu=(data)=>{
		let bkEntities=this.state.bkEntities;
		let bkColumnsId=this.state.bkColumnsId;
		let 板块id字段=this.state.板块id字段;
		let 板块名称字段=this.state.板块名称字段;
		let 图标字段=this.state.图标字段;
		return data.map((item)=>{
			let defImgHtml=<img src={defaultImg} style={{width:'30px',height:'30px'}}/>;
			let navImg="";
			let imgFlag=false;
			{
				navImg=bkEntities.map((bkItem,bkIndex)=>{
					let bkCellMap=bkItem.cellMap;
					if(bkCellMap[bkColumnsId[板块id字段]]==item.id&bkCellMap[bkColumnsId[板块名称字段]]==item.title){
						imgFlag=true;
						return <img src={this.state.hydUrl+bkCellMap[bkColumnsId[图标字段]]} style={{width:'30px',height:'30px'}}/>
					}
				})
			}

			if(item.l2Menus){
				return <SubMenu title={<span>{imgFlag?navImg:defImgHtml}{item.title}</span>} key={item.id}>
							{ this.renderBlockMenu(item.l2Menus) }
						</SubMenu>				
			}
			return  <Menu.Item key={item.id} >
						<NavLink to={`/${item.id}?blockId=${item.blockId}`} target="_blank">{imgFlag?navImg:defImgHtml}{item.title}</NavLink>
					</Menu.Item>
		})		
	}
	loginout=()=>{
		Super.super({
			url:'api2/auth/token',
			method:'DELETE'
		}).then((res)=>{
			window.location.hash = "#/login";
		})

	}
	getUser=()=>{
		Super.super({
			url:'api2/meta/user/current_user',                   
		}).then((res)=>{
			this.setState({
				userName:res.user.username,
				id:res.user.id
			})
		})
	}
	userDetail=(type)=>{
		const {id}=this.state
		this.props.history.push(`/user/${type}/${id}`)
	}
	render(){
		const style={
			marginRight:"8px"
		}
		const {blocks,currentBlockId,bkColumnsId,bkEntities,板块id字段,板块名称字段,图标字段}=this.state
		const menu = (
			<Menu>
				<Menu.Item>
					<span onClick={()=>this.userDetail("detail")}><Icon type="user" style={style}/>用户详情</span>
				</Menu.Item>
				<Menu.Item>
					<span onClick={()=>this.userDetail("edit")}><Icon type="form" style={style}/>用户修改</span>
				</Menu.Item>
				<Menu.Item>
					<span onClick={this.loginout}><Icon type="logout" style={style}/>退出登录</span>
				</Menu.Item>
			</Menu>
		  );
		return (
			<div className="header">
				<Row className="header-top">
					<Col span={18}>
						{blocks && blocks.map((item,index)=>{
							let imgFlag=false;
							return <div style={{float:'left',paddingLeft:10}} key={index} className={item.id===currentBlockId?"active":""}>
										<Dropdown overlay={item.menus}>
											<a className="dropdown-link" 
												href={`#/home?blockId=${item.id}`} 
												target="_blank" 
												rel="noopener noreferrer"
												>
												{
													bkEntities.map((bkItem,bkIndex)=>{
														let bkCellMap=bkItem.cellMap;
														if(bkCellMap[bkColumnsId[板块id字段]]==item.id&bkCellMap[bkColumnsId[板块名称字段]]==item.title){
															console.log("bk==="+bkCellMap[bkColumnsId[图标字段]])
															imgFlag=true;
															return <img src={this.state.hydUrl+bkCellMap[bkColumnsId[图标字段]]} style={{width:'30px',height:'30px'}}/>
														}
													})
												}
												{imgFlag?"":<img src={defaultImg} style={{width:'30px',height:'30px'}}/>}{item.title}<Icon type="caret-down" />
											</a>
										</Dropdown>
									</div>
						})}
					</Col>					
					<Col span={6}>
						<Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
							<div className="userLogin">
								<Icon type="user" />
								<span>
									{this.state.userName}
								</span>								
							</div>							
						</Dropdown>
					</Col>
				</Row>
			</div>
		)
	}
}
export default withRouter(Header)