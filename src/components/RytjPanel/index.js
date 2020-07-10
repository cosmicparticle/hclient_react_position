import React from "react";
import './index.css';
import openButImg from '../../image/001.png';
import closeButImg from '../../image/002.png';
import Super from "../../super";
import $ from 'jquery';
import RytjEcharts from 'echarts-for-react';
import BjjcEcharts from 'echarts-for-react';

export default class RytjPanel extends React.Component{
    state={
        rytjMenuId:101421313564705,
        rytjQueryKey:"",
        rytjColumnsId:{},
        rytjColumnsFieldId:{},
        ssrsInfo:"",
        //rytjRaData:[],
        rytjDataList:[],
        rytjLegendData:[],
        rytjSeriesData:[],
        bjjcMenuId:24,
        bjjcQueryKey:"",
        bjjcStartDate:"",
        bjjcEndDate:"",
        bjjcColumnsId:{},
        bjjcColumnsFieldId:{},
        bjjcInfo:"",
        bjjcDataList:[],
        bjjcLegendData:[],
        bjjcSeriesData:[],
        qytjMenuId:17,
        qytjQueryKey:"",
        qytjStartDate:"",
        qytjEndDate:"",
        qytjEntities:[],
        qytjColumnsId:{},
        qytjColumnsFieldId:{},
        报警围栏字段:"报警围栏",
        报警类型字段:"报警类型",
        日期字段:"日期",
        数量字段:"数量",
        人员分类字段:"人员分类",
        实时人数字段:"实时人数"
    }

    componentDidMount(){
        setTimeout(this.resetRytjPosition,"2000");
        window.addEventListener('resize', this.resetRytjPosition);
        this.request();
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this.resetRytjPosition);
    }
    request=()=>{
        this.initRytjLtmplAttr();
        this.initBjjcLtmplAttr();
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
            this.initRytjLegendData(this.state.rytjColumnsFieldId[this.state.人员分类字段]);
        });
    }
    initBjjcLtmplAttr=()=>{
        Super.super({
            url:`api2/entity/${this.state.bjjcMenuId}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            console.log("bjjcRes==="+JSON.stringify(res))
            let resColumns=res.ltmpl.columns;
            this.initBjjcColumnsId(resColumns);
            this.initBjjcLegendData(this.state.bjjcColumnsFieldId[this.state.报警类型字段]);
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
    initRytjLegendData=(fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log("RytjLegendData==="+JSON.stringify(res))
            let rytjLegendData=[];
            let rytjDataList=[];
            res.optionsMap[fieldId].map((item,index)=>{
                rytjLegendData.push(item.title);
                rytjDataList.push({value:0,name:item.title});
            });
            this.state.rytjLegendData=rytjLegendData;
            this.state.rytjDataList=rytjDataList;

            this.initRytjListByMenuId();
        });
    }
    initBjjcLegendData=(fieldId)=>{
        Super.super({
            url:`api2/meta/dict/field_options`,
            method:'GET',
            query: {fieldIds:fieldId}
        }).then((res) => {
            console.log("BjjcLegendData==="+JSON.stringify(res))
            let bjjcLegendData=[];
            let bjjcDataList=[];
            res.optionsMap[fieldId].map((item,index)=>{
                bjjcLegendData.push(item.title);
                bjjcDataList.push({value:0,name:item.title});
            });
            this.state.bjjcLegendData=bjjcLegendData;
            this.state.bjjcDataList=bjjcDataList;

            this.initBjjcListByMenuId();
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
    initBjjcColumnsId=(resColumns)=>{
        let bjjcColumnsId = {};
        let bjjcColumnsFieldId = {};
        resColumns.map((item, index) => {
            //console.log(item.title+",==="+item.id)
            bjjcColumnsId[item.title] = item.id;
            bjjcColumnsFieldId[item.title] = item.fieldId;
        });
        //console.log(bjtjColumnsId)
        this.setState({bjjcColumnsId: bjjcColumnsId});
        this.setState({bjjcColumnsFieldId: bjjcColumnsFieldId});
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
    initRytjListByMenuId=()=>{
        Super.super({
            url:`api2/entity/${this.state.rytjMenuId}/list/tmpl`,
            method:'GET',
        }).then((res) => {
            //console.log(res);
            console.log("rytjTmpl==="+JSON.stringify(res));
            this.state.rytjQueryKey=res.queryKey;
            this.initRytjListByQueryKey();
        })
    }
    initBjjcListByMenuId=()=>{
        this.state.bjjcStartDate=this.getAddDate(-7);
        this.state.bjjcEndDate=this.getTodayDate();
        Super.super({
            url:`api2/entity/${this.state.bjjcMenuId}/list/tmpl`,
            method:'GET',
            query:{criteria_13:this.state.bjjcStartDate+"~"+this.state.bjjcEndDate}
        }).then((res) => {
            //console.log(res);
            console.log("bjjcTmpl==="+JSON.stringify(res));
            this.state.bjjcQueryKey=res.queryKey;
            this.initBjjcListByQueryKey();
        })
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
    /*
    initRytjListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.rytjQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("rytjData==="+JSON.stringify(res));
            let ssrsCount=0;
            let rytjRaData=[];
            let rytjSeriesData=[];
            res.entities.map((item,index)=>{
                let cellMap=item.cellMap;
                let 人员分类=cellMap[this.state.rytjColumnsId[this.state.人员分类字段]];
                let 数量=cellMap[this.state.rytjColumnsId[this.state.数量字段]];
                rytjRaData.push(人员分类+":"+数量);

                let color;
                switch (index) {
                    case 0:
                        color='#49B637';
                        break;
                    case 1:
                        color='#06AAE4';
                        break;
                    case 2:
                        color='#027BDB';
                        break;
                }
                rytjSeriesData.push({value:数量,itemStyle:{ normal:{color:color}}});

                ssrsCount+=parseInt(数量);
            });
            this.state.ssrsCount=ssrsCount;
            this.state.rytjRaData=rytjRaData;
            this.state.rytjSeriesData=rytjSeriesData;
        })
    }
     */
    initRytjListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.rytjQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("rytjData==="+JSON.stringify(res));
            let ssrsCount=0;
            let rytjEntities=res.entities;
            let rytjDataList=this.state.rytjDataList;
            rytjEntities.map((enItem,enIndex)=>{
                let cellMap=enItem.cellMap;
                rytjDataList.map((sdItem,sdIndex)=>{
                    if(cellMap[this.state.rytjColumnsId[this.state.人员分类字段]]==sdItem.name){
                        let 数量=parseInt(cellMap[this.state.rytjColumnsId[this.state.数量字段]]);
                        sdItem.value+=数量;
                        ssrsCount+=数量;
                    }
                })
            })

            this.state.ssrsInfo="实时人数:"+ssrsCount;
            this.setState({rytjSeriesData:rytjDataList});
        })
    }
    initBjjcListByQueryKey=()=>{
        Super.super({
            url:`api2/entity/list/${this.state.bjjcQueryKey}/data`,
            method:'GET',
            query:{pageSize:this.state.pageSize}
        }).then((res) => {
            console.log("bjjcData==="+JSON.stringify(res));
            let ycbjCount=0;
            let bjjcEntities=res.entities;
            let bjjcDataList=this.state.bjjcDataList;
            bjjcEntities.map((enItem,enIndex)=>{
                let cellMap=enItem.cellMap;
                bjjcDataList.map((sdItem,sdIndex)=>{
                    if(cellMap[this.state.bjjcColumnsId[this.state.报警类型字段]]==sdItem.name){
                        let 数量=parseInt(cellMap[this.state.bjjcColumnsId[this.state.数量字段]]);
                        sdItem.value+=数量;
                        ycbjCount+=数量;
                    }
                })
            })

            if(ycbjCount==0){
                this.state.bjjcInfo="正常";
            }
            else{
                this.state.bjjcInfo="异常报警:"+ycbjCount;
            }
            //this.state.bjjcSeriesData=bjjcDataList;
            this.setState({bjjcSeriesData:bjjcDataList});
            console.log("bjjcSeriesData==="+JSON.stringify(this.state.bjjcSeriesData))
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
    /*
    getRytjOptions(){
        let option = {
            angleAxis: {
            },
            radiusAxis: {
                type: 'category',
                //data: ['周二', '周三', '周四'],
                data:this.state.rytjRaData,
                axisTick:{alignWithLabel:true},
                axisLine:{
                    lineStyle:{
                        color:'#fff',
                        width:0
                    }
                },
                axisLabel: {
                    interval:0,
                    textStyle: {
                        color: '#fff',
                    },
                },
                z: 10
            },
            polar: {
            },
            series: [{
                type: 'bar',
                barWidth:'5',
                //data: [{value:2,itemStyle:{ normal:{color:'#49B637'}}}, {value:3,itemStyle:{ normal:{color:'#06AAE4'}}}, {value:4,itemStyle:{ normal:{color:'#027BDB'}}}],
                data:this.state.rytjSeriesData,
                coordinateSystem: 'polar',
                name: this.state.实时人数字段+":"+this.state.ssrsCount,
                itemStyle:{normal:{color:'#59F0F6'}},
                stack: 'a'
            }],
            legend: {
                show: true,
                textStyle: {
                    color: '#F39D2E'
                },
                data: [this.state.实时人数字段+":"+this.state.ssrsCount]
            }
        };
        return option;
    }
     */
    getRytjOptions(){
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                //orient: 'vertical',
                left: 'center',
                textStyle:{
                    color: '#fff'//字体颜色
                },
                //data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                data:this.state.rytjLegendData
            },
            color:['#49B637','#06AAE4','#027BDB'],
            graphic:{
                type:"text",
                left:"center",
                top:"center",
                style:{
                    text:this.state.ssrsInfo,
                    textAlign:"center",
                    fill:"#fff",
                    fontSize:15
                }
            },
            series: [
                {
                    name: '人员分类',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data:this.state.rytjSeriesData
                }
            ]
        };
        return option;
    }
    getBjjcOptions(){
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                //orient: 'vertical',
                left: 'center',
                textStyle:{
                    color: '#fff'//字体颜色
                },
                //data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                data:this.state.bjjcLegendData
            },
            color:['#D06052','#E29F39','#4C9BC7','#0f0','#00f'],
            graphic:{
                type:"text",
                left:"center",
                top:"center",
                style:{
                    text:this.state.bjjcInfo,
                    textAlign:"center",
                    fill:"#fff",
                    fontSize:15
                }
            },
            series: [
                {
                    name: '报警类型',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    /*
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ]
                    */
                    data:this.state.bjjcSeriesData
                }
            ]
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

        $("#openBut_img").css("margin-top",(rpdh-obiw)/2);
        $("#openBut_img").css("margin-left","0px");
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
                <RytjEcharts className="rytj_echarts" option={this.getRytjOptions()}/>
                <div className="bjjc_title_div">报警监测</div>
                <BjjcEcharts className="bjjc_echarts" option={this.getBjjcOptions()}/>
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