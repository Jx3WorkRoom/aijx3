package com.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Administrator on 2017/6/9 0009.
 */
@Controller
public class webAction {
    @RequestMapping(value = {"","/index"})
    public String index() {
        return "index";
    }

    @RequestMapping("/login")
    public String login() {
        return "login";
    }

    @RequestMapping("/accountDetail")
    public String accountDetail() {
        return "accountDetail";
    }

    @RequestMapping("/accountList")
    public String accountList() {
        return "accountList";
    }

    @RequestMapping("/appearanceSale")
    public String appearanceSale() {
        return "appearanceSale";
    }

    @RequestMapping("/blackDetail")
    public String blackDetail() {
        return "blackDetail";
    }

    @RequestMapping("/blackList")
    public String blackList() {
        return "blackList";
    }

    @RequestMapping("/goldExchangeList")
    public String goldExchangeList() {
        return "goldExchangeList";
    }

    @RequestMapping("/levelingList")
    public String levelingList() {
        return "levelingList";
    }

    @RequestMapping("/propSale")
    public String propSale() {
        return "propSale";
    }

    @RequestMapping("/recoverPassword")
    public String recoverPassword() {
        return "recoverPassword";
    }

    @RequestMapping("/register")
    public String register() {
        return "register";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/dataAndSecurity")
    public String dataAndSecurity() {
        return "userCenter/dataAndSecurity";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/userList")
    public String userList() {
        return "userCenter/userList";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/userManage")
    public String userManage() {
        return "userCenter/userManage";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/myCollection")
    public String myCollection() {
        return "userCenter/myCollection";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/myRelease")
    public String myRelease() {
        return "userCenter/myRelease";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/myService")
    public String myService() {
        return "userCenter/myService";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/serviceSetting")
    public String serviceSetting() {
        return "userCenter/serviceSetting";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/report")
    public String report() {
        return "userCenter/report";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/appearanceTransaction")
    public String appearanceTransaction() {
        return "userCenter/appearanceTransaction";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/propTransaction")
    public String propTransaction() {
        return "userCenter/propTransaction";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/quickRelease")
    public String quickRelease() {
        return "userCenter/quickRelease";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/detailRelease")
    public String detailRelease() {
        return "userCenter/detailRelease";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/detailRelease2")
    public String detailRelease2() {
        return "userCenter/detailRelease2";
    }

    @RequestMapping("/404")
    public String notFound() {
        return "userCenter/404";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/accountExchange")
    public String accountExchange() {
        return "userCenter/accountExchange";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/accountTransaction")
    public String accountTransaction() {
        return "userCenter/accountTransaction";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/sale")
    public String saleaction() {
        return "userCenter/sale";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/userservice")
    public String userserviceaction() {
        return "userCenter/userservice";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/usersetting")
    public String usersettingaction() {
        return "userCenter/usersetting";
    }

    @PreAuthorize("hasAnyRole('admin','user')")
    @RequestMapping("/userimgs")
    public String userimgsaction() {
        return "userCenter/userimgs";
    }

    @RequestMapping("/aboutUs")
    public String aboutUsaction() {
        return "aboutUs";
    }

    @RequestMapping("/servicePetorl")
    public String servicePetorlaction() {
        return "servicePetorl";
    }

    @RequestMapping("/questions")
    public String questionsaction() {
        return "questions";
    }

    @RequestMapping("/levelingDetail")
    public String levelingDetailaction() {
        return "levelingDetail";
    }

}
