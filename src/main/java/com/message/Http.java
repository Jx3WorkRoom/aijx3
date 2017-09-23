package com.message;

import com.utils.Commons;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.print.attribute.standard.MediaSize;
import java.io.IOException;
import java.util.Random;

@RestController
@RequestMapping("/message")
public class Http {

    @RequestMapping(value="sendMessage",method = RequestMethod.GET)
    public String sendMessage(
            @RequestParam(value="tel",required = true) String tel,
            @RequestParam(value="type",required = true) int type
    ) throws IOException{
        if(Commons.checkNumMap.size()>40){
            Commons.checkNumMap.clear();
        }

        String numStr ="0123456789";
        StringBuilder sb =new StringBuilder(4);
        for(int i=0;i<4;i++){
            char ch =numStr.charAt(new Random().nextInt(numStr.length()));
            sb.append(ch);
        }
        String checkNum = sb.toString();
        String Text = "";
        /*
            type:1注册
                 2修改密码
                 3找回密码
                 4修改绑定手机
         */
        if(type==1){
            Text ="【爱剑三】尊敬的用户，本次您申请用户注册的验证码："+checkNum+"。如有疑问，请联系官网首页客服。";
        }else if(type==2){
            Text ="【爱剑三】尊敬的用户，本次您申请修改密码的验证码："+checkNum+"。如有疑问，请联系官网首页客服。";
        }else if(type==3){
            Text ="【爱剑三】尊敬的用户，本次您申请找回密码的验证码："+checkNum+"。如有疑问，请联系官网首页客服。";
        }else if(type==4){
            Text ="【爱剑三】尊敬的用户，本次您申请修改绑定手机的验证码："+checkNum+"。如有疑问，请联系官网首页客服。";
        }
        String Url = "http://sh2.cshxsp.com/sms.aspx?action=send";
        HttpClient client = new HttpClient();
        PostMethod post = new PostMethod(Url);
        post.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");
        NameValuePair userid = new NameValuePair("userid","");
        NameValuePair account = new NameValuePair("account","jksc940");
        NameValuePair password= new NameValuePair("password","ab12563011");
        NameValuePair mobile = new NameValuePair("mobile",tel);
        NameValuePair content = new NameValuePair("content",Text);
        NameValuePair sendTime = new NameValuePair("sendTime","");
        NameValuePair extno = new NameValuePair("extno","");
        post.setRequestBody(new NameValuePair[]{userid,account,password,mobile,content,sendTime,extno});
        int statu =client.executeMethod(post);
        System.out.println("statu="+statu);
        String str = post.getResponseBodyAsString();
        System.out.println(str);

        try{
            Document doc = DocumentHelper.parseText(str);
            Element rootElt = doc.getRootElement();
            String returnstatus = rootElt.elementText("returnstatus").trim();
            String message=rootElt.elementText("message").trim();
            String remainpoint=rootElt.elementText("remainpoint").trim();
            String taskID=rootElt.elementText("taskID").trim();
            String successCounts=rootElt.elementText("successCounts").trim();
//            System.out.println("返回状态为:"+returnstatus);
//            System.out.println("返回信息提示:"+message);
//            System.out.println("返回余额:"+remainpoint);
//            System.out.println("返回任务批次:"+taskID);
//            System.out.println("返回成功条数:"+successCounts);
        } catch (DocumentException e) {
            e.printStackTrace();
            return "发送验证码失败!";
        }
        Commons.checkNumMap.put(tel,checkNum);
        System.out.println("用户"+tel+"的验证码:"+checkNum);
        return "已发送验证码!";
    }

    @RequestMapping(value = "checkNum",method = RequestMethod.GET)
    public String checkNum(
            @RequestParam(value = "tel",required = true) String tel,
            @RequestParam(value = "checkNum",required = true) String checkNum
    ) throws  IOException{
        String num = Commons.checkNumMap.get(tel);
        try{
            if(num.equals(checkNum)){
                return "1";
            }else {
                return "0";
            }
        }catch (Exception e){
            return "0";
        }
    }
}
