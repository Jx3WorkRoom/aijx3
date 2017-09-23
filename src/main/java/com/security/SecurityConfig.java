package com.security;

import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
//@EnableWebSecurity: 禁用Boot的默认Security配置，配合@Configuration启用自定义配置
// （需要扩展WebSecurityConfigurerAdapter）
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true): 启用Security注解，
// 例如最常用的@PreAuthorize
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // Configure spring security's authenticationManager with custom
        // user details service
        auth.userDetailsService(this.userService);
    }

    /**
     * 设置静态资源不被拦截
     */
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/dist/**","/**/favicon.ico" );
    }

    @Override
    //configure(HttpSecurity): Request层面的配置，对应XML Configuration中的<http>元素
    //定义URL路径应该受到保护，哪些不应该
    protected void configure(HttpSecurity http) throws Exception {
//        http.authorizeRequests().anyRequest().authenticated();//用户登录后才可以访问
        http
                .authorizeRequests()
                // 例如以下代码指定了/和/index不需要任何认证就可以访问，其他的路径都必须通过身份验证。
                .antMatchers(
                            "/",
                            "/index",
                            "/accountDetail",
                            "/accountList",
                            "/appearanceSale",
                            "/blackDetail",
                            "/blackList",
                            "/goldExchangeList",
                            "/levelingList",
                            "/propSale",
                            "/recoverPassword",
                            "/register",
                            "/dist/**"
                            )
                .permitAll()
                .and()
                //通过formLogin()定义当需要用户登录时候，转到的登录页面。
                .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
                //注销
                .logout()
//                .logoutSuccessUrl("/login") //退出登录后的默认网址是”/login”  ;
                .permitAll();
//                .and()
//                .rememberMe()//登录后记住用户，下次自动登录,数据库中必须存在名为persistent_logins的表
//                .tokenValiditySeconds(1209600);
        //关闭csrf 防止循环定向
        http.csrf().disable();
    }

}
