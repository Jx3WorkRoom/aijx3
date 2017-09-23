package com.action;

import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/6/12 0012.
 */
@RestController
@RequestMapping("/action")
public class indexAction {
    @Autowired
    UserService userService;
    public  UserDetails loadUserByUsername(){
        //获得当前登陆用户对应的对象。
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        //获得当前登陆用户所拥有的所有权限。
        //Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        String username =userDetails.getUsername();
        UserDetails user =  userService.loadUserByUsername(username);
        return user;
    }
}
