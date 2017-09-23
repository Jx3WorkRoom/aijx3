package com.service;

import com.mapper.UserMapper;
import com.model.User;
import com.utils.MyDateTimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.Dao.userDao;

import java.util.Date;

/**
 * Created by Administrator on 2016/12/13.
 */
@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    userDao userDao;
    @Override
    public UserDetails loadUserByUsername(String username) {
        if (username.isEmpty()) {
            throw new BadCredentialsException("用户名不能为空!");
        }
        User user = userMapper.selectByUsername(username);
        if( user == null ){
            throw new BadCredentialsException("用户不存在!");
        }
        String password = user.getPassword();
//        password = MD5Util.getEncrypt(password);
        String date = null;
        try {
            date = userDao.queryAdminLockTime(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(date==null){
                return user;
            }
            String now = MyDateTimeUtils.DateTimeToStr(new Date(),"yyyy-MM-dd HH:mm:ss");
            int   res   =   date.compareTo(now);
            if(res>0){
                throw new BadCredentialsException("该账号被管理员禁用到"+date+"!");
            }else{
                user.setPassword(password);
                return user;
            }
        }
}
