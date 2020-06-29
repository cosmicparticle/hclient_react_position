import React from "react";
import './index.less';
import openButImg from '../../image/001.png';
import closeButImg from '../../image/002.png';
import Super from "../../super";
import $ from 'jquery';
import RytjEcharts from 'echarts-for-react';

export default class RytjPanel extends React.Component{
    state={rytjMenuId:101421313564705,
        rytjColumnsId:{},
        rytjColumnsFieldId:{},
        qytjMenuId:17,qytjQueryKey:"",qytjStartDate:"",qytjEndDate:"",qytjEntities:[],
        qytjColumnsId:{},
        qytjColumnsFieldId:{},
        报警围栏字段:"报警围栏",
        报警类型字段:"报警类型",
        日期字段:"日期",
        数量字段:"数量"}

    componentDidMount(){
        setTimeout(this.resetRytjPosition,"2000");
        this.request();
    }
    request=()=>{
        this.initRytjLtmplAttr();
        this.initQytjLtmplAttr();
    }
    initRytjLtmplAttr=()=>{
        Super.super({
            url:`api2/entity/${this.state.rytjMenuId}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            console.log("rytjRes==="+JSON.stringify(res))
            let resColumns=res.ltmpl.columns;
            this.initRytjColumnsId(resColumns);
        });
    }
    initQytjLtmplAttr=()=>{
        Super.super({
            url:`api2/entity/${this.state.qytjMenuId}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            console.log("qytjRes==="+JSON.stringify(res))
            let resColumns=res.ltmpl.columns;
            this.initQytjColumnsId(resColumns);
            this.initQytjListByMenuId();
        });
    }
    initRytjColumnsId=(resColumns)=>{
        let rytjColumnsId = {};
        let rytjColumnsFieldId = {};
        resColumns.map((item, index) => {
            //console.log(item.title+",==="+item.id)
            rytjColumnsId[item.title] = item.id;
            rytjColumnsFieldId[item.title] = item.fieldId;
        });
        //console.log(bjtjColumnsId)
        this.setState({rytjColumnsId: rytjColumnsId});
        this.setState({rytjColumnsFieldId: rytjColumnsFieldId});
    }
    initQytjColumnsId=(resColumns)=>{
        let qytjColumnsId = {};
        let qytjColumnsFieldId = {};
        resColumns.map((item, index) => {
            //console.log(item.title+",==="+item.id)
            qytjColumnsId[item.title] = item.id;
            qytjColumnsFieldId[item.title] = item.fieldId;
        });
        //console.log(bjtjColumnsId)
        this.setState({qytjColumnsId: qytjColumnsId});
        this.setState({qytjColumnsFieldId: qytjColumnsFieldId});
    }
    initQytjListByMenuId=()=>{
        let disabledColIds="";
        let days=-7;
        this.state.qytjStartDate=this.getAddDate(days);
        this.state.qytjEndDate=this.getTodayDate();
        Super.super({
            url:`api2/entity/${this.state.qytjMenuId}/list/tmpl`,
            method:'GET',
            query:{disabledColIds:disabledColIds,sortColIds:(this.state.qytjColumnsId[this.state.日期字段]+"_DESC"),criteria_13:this.state.qytjStartDate+"~"+this.state.qytjEndDate}
        }).then((res) => {
            //console.log(res);
            console.log("tmpl==="+JSON.stringify(res));
            this.state.qytjQueryKey=res.queryKey;
            this.initQytjListByQueryKey();
        })
    }
    initQytjListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.qytjQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("data==="+JSON.stringify(res));
            this.setState({qytjEntities:res.entities})
        })
    }
    getTodayDate=()=>{
        let date=new Date();
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        let todayDate=year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
        return todayDate;
    }
    getAddDate=(days)=>{
        let date=new Date();
        date=new Date(date.setDate(date.getDate()+days));
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        let dateOfMonth=date.getDate();
        return year+"-"+(month<10?"0"+month:month)+"-"+(dateOfMonth<10?"0"+dateOfMonth:dateOfMonth);
    }
    substringItemValue(value,index){
        if(value){
            return value.split("@R@")[index];
        }
        else
            return ""
    }
    getRytjOptions(){
        let option = {
            angleAxis: {
            },
            radiusAxis: {
                type: 'category',
                data: ['周二', '周三', '周四'],
                axisLine:{
                    lineStyle:{
                        color:'#fff',
                        width:0
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    },
                },
                z: 10
            },
            polar: {
            },
            series: [{
                type: 'bar',
                barWidth:'5',
                data: [{value:2,itemStyle:{ normal:{color:'#49B637'}}}, {value:3,itemStyle:{ normal:{color:'#06AAE4'}}}, {value:4,itemStyle:{ normal:{color:'#027BDB'}}}],
                coordinateSystem: 'polar',
                name: 'A',
                itemStyle:{normal:{color:'#59F0F6'}},
                stack: 'a'
            }],
            legend: {
                show: true,
                textStyle: {
                    color: '#F39D2E'
                },
                data: ['A']
            }
        };
        return option;
    }
    resetRytjPosition=()=>{
        let nlh=$(".nav-left").css("height");
        nlh=nlh.substring(0,nlh.length-2);
        let logoh=$(".logo").css("height");
        logoh=logoh.substring(0,logoh.length-2)

        let amw=$(".ant-menu").css("width");
        let amh=$(".ant-menu").css("height");
        amh=amh.substring(0,amh.length-2);

        let obiw=$("#openBut_img").css("height");
        obiw=obiw.substring(0,obiw.length-2);

        $("#rytjPanel_div").css("height",nlh-logoh+"px");
        $("#rytjPanel_div").css("margin-left",amw);
        $("#rytjPanel_div").css("margin-top",-parseInt(amh));

        let rpdh=$("#rytjPanel_div").css("height");
        rpdh=rpdh.substring(0,rpdh.length-2);

        $("#openBut_img").css("display","block")
        $("#openBut_img").css("margin-top",(rpdh-obiw)/2);
        $("#closeBut_img").css("margin-top",-(rpdh-obiw)/2-80);
        $("#closeBut_img").css("margin-left","460px");

        $("#main_div").css("height",rpdh);
    }
    openRytjPanelDiv=(flag)=>{
        if(flag){
            $("#rytjPanel_div").css("width","475px");
            $("#main_div").css("display","block");
            $("#openBut_img").css("display","none");
            $("#closeBut_img").css("display","block");
        }
        else{
            $("#rytjPanel_div").css("width","0px");
            $("#main_div").css("display","none");
            $("#openBut_img").css("display","block");
            $("#closeBut_img").css("display","none");
        }
    }
    render() {
        const {qytjEntities,qytjColumnsId,报警围栏字段,报警类型字段,日期字段,数量字段}=this.state;
        return <div className="rytjPanel_div" id="rytjPanel_div">
            <img className="openBut_img" id="openBut_img" src={openButImg} onClick={(e)=>this.openRytjPanelDiv(true)}/>
            <div className="main_div" id="main_div">
                <div className="rytj_title_div">人员统计</div>
                <RytjEcharts option={this.getRytjOptions()}/>
                <div className="qytj_title_div">区域统计</div>
                <div className="qytj_list_div">
                    <div className="title_div">
                        <div className="bjwl_div">{报警围栏字段}</div>
                        <div className="bjlx_div">{报警类型字段}</div>
                        <div className="rq_div">{日期字段}</div>
                        <div className="sl_div">{数量字段}</div>
                    </div>
                    {
                        qytjEntities.map((item,index)=>{
                            return <div className="item_div">
                                <div className="bjwl_div">{this.substringItemValue(item.cellMap[qytjColumnsId[报警围栏字段]],1)}</div>
                                <div className="bjlx_div">{item.cellMap[qytjColumnsId[报警类型字段]]}</div>
                                <div className="rq_div">{item.cellMap[qytjColumnsId[日期字段]]}</div>
                                <div className="sl_div">{item.cellMap[qytjColumnsId[数量字段]]}</div>
                            </div>
                        })
                    }
                </div>
            </div>
            <img className="closeBut_img" id="closeBut_img" src={closeButImg} onClick={(e)=>this.openRytjPanelDiv(false)}/>
        </div>;
    }
}