import React from 'react'
import { Menu, Button} from 'antd';
//import Super from "./../../super"
import { NavLink,withRouter } from 'react-router-dom'
import './index.css'
import RytjPanel from '../../components/RytjPanel'
import Units from '../../units'
import dingWeiImg from './../../image/003.jpg'
import Super from "../../super";
import $ from 'jquery';
const SubMenu = Menu.SubMenu;



class NavLeft extends React.Component{

	state={
		menuTreeNode:[],
		selectedKeys:[],
		openKeys:[],
		collapsed: false,
		bkEntities:[],bkColumnsId:[],bkMenuId:"102281919733819",bkQueryKey:"",pageSize:"100",
		板块id字段:"板块id",
		图标字段:"图标",
		mtnAttr:{l1Menus:"",menuId:"",key:"",open:""}
	}
	getCurrentMenuId(){
        const pathname = this.props.history.location.pathname;
        let menuId = pathname.split("/")[1];
//        console.log('ssssssssss');
        const execResult = /\/customPage\/(\d+)\//.exec(pathname);
        if(execResult) menuId = execResult[1];
        return menuId;
	}
	componentWillReceiveProps(){
		const menuId = this.getCurrentMenuId();
		const {open}=this.state
		const key=[]
		for(let k in open){
			open[k].forEach((it)=>{
				if(it.toString()===menuId){
					key.push(k)
				}
			})
		}
		this.setState({
			selectedKeys:[menuId],
			openKeys:key
		})
	}
	componentDidMount(){
        this.props.onRef(this)
    }
	initBKListByMenuId=()=>{
		Super.super({
			url:`api2/entity/${this.state.bkMenuId}/list/tmpl`,
			method:'GET',
		}).then((res) => {
			this.state.bkQueryKey=res.queryKey;
			let resColumns=res.ltmpl.columns;
			this.initBKColumnsId(resColumns);
			this.initBKListByQueryKey();
		})
	}
	initBKColumnsId=(resColumns)=>{
		let bkColumnsId = {};
		resColumns.map((item, index) => {
			bkColumnsId[item.title] = item.id;
		});
		this.setState({bkColumnsId: bkColumnsId});
	}
	initBKListByQueryKey=()=>{
		Super.super({
			url:`api2/entity/list/${this.state.bkQueryKey}/data`,
			method:'GET',
			query:{pageSize:this.state.pageSize}
		}).then((res) => {
			this.setState({bkEntities:res.entities});

			let l1Menus=this.state.mtnAttr.l1Menus;
			let menuId=this.state.mtnAttr.menuId;
			let key=this.state.mtnAttr.key;
			let open=this.state.mtnAttr.open;
			this.setState({
				menuTreeNode:this.renderMenu(l1Menus),
				selectedKeys:[menuId],
				openKeys:key,
				open
			})
		})
	}
	setMenuTreeNode=(list)=>{
		//console.log("list==="+JSON.stringify(list))
		const menuId = this.getCurrentMenuId();
		const open={}
		list.l1Menus.forEach((item)=>{
			if(item.l2Menus){
				const ids=[]
				item.l2Menus.forEach((it)=>{
					ids.push(it.id)
				})
				open[item.id]=ids
			}
		})
		const key=[]
		for(let k in open){
			open[k].forEach((it)=>{
				if(it.toString()===menuId){
					key.push(k)
				}
			})
		}

		let mtnAttr={l1Menus:list.l1Menus,menuId:menuId,key:key,open:open};//这里先把这几个属性配置好了，下一个方法里面要用
		this.setState({mtnAttr:mtnAttr});
		this.initBKListByMenuId();
	}
	renderMenu=(data)=>{
		let bkEntities=this.state.bkEntities;
		let bkColumnsId=this.state.bkColumnsId;
		let 板块id字段=this.state.板块id字段;
		let 图标字段=this.state.图标字段;
		return data.map((item)=>{
			if(item.l2Menus){
				let imgFlag=false;
				return <SubMenu title={
					<span>
					{
						bkEntities.map((bkItem,bkIndex)=>{
							let bkCellMap=bkItem.cellMap;
							if(bkCellMap[bkColumnsId[板块id字段]]==item.id){
								imgFlag=true;
								return <img src={'http://116.62.163.143:85/hydrocarbon/'+bkCellMap[bkColumnsId[图标字段]]} style={{width:'30px',height:'30px'}}/>
							}
						})
					}
					{imgFlag?"":<img src={dingWeiImg} style={{width:'30px',height:'30px'}}/>}{item.title}{item.id}
					</span>
				} key={item.id}>
							{ this.renderMenu(item.l2Menus) }
						</SubMenu>				
			}
			return  <Menu.Item key={item.id} >
						<NavLink to={item.customPagePath? `/customPage/${item.id}/${item.customPagePath}`: `/${item.id}`}>{item.title}</NavLink>
				    </Menu.Item>
		})
	}
	handleOpen=(openKeys)=>{
		if(openKeys.length>1){
			openKeys.splice(0,1);
		}	
		this.setState({
			openKeys
		})
	}


	toggleCollapsed = () => {
		this.setState({
		  collapsed: !this.state.collapsed,
		});
	  };

	render(){
		const { menuTreeNode,selectedKeys,openKeys }=this.state
		
		return (
			<div>
				<div className="logo">
					<a href="#/home"><h1>{Units.programName_NavLeft()}</h1></a>
					{/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}> */}
						{/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)} */}
						按钮
					{/* </Button> */}
				</div>
				<Menu 
					mode="inline"
					theme="dark"
					onOpenChange={this.handleOpen} //手风琴
					selectedKeys={selectedKeys}
					openKeys={openKeys}
					inlineCollapsed={this.state.collapsed}
					>
					{menuTreeNode}
				</Menu>
				<RytjPanel/>

			</div>
		)
	}
}
export default withRouter(NavLeft)
