import React from "react";
import './index.less';
import openButImg from '../../image/001.png';
import closeButImg from '../../image/002.png';
import $ from 'jquery';

export default class RytjPanel extends React.Component{

    componentDidMount(){
        setTimeout(this.resetRytjPosition,"2000");
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
        $("#closeBut_img").css("margin-top",-(rpdh-obiw)/2-80);
        $("#closeBut_img").css("margin-left","360px");

        $("#main_div").css("height",rpdh);
    }
    openRytjPanelDiv=(flag)=>{
        if(flag){
            $("#rytjPanel_div").css("width","375px");
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
        return <div className="rytjPanel_div" id="rytjPanel_div">
            <img className="openBut_img" id="openBut_img" src={openButImg} onClick={(e)=>this.openRytjPanelDiv(true)}/>
            <div className="main_div" id="main_div"></div>
            <img className="closeBut_img" id="closeBut_img" src={closeButImg} onClick={(e)=>this.openRytjPanelDiv(false)}/>
        </div>;
    }
}