package com.model;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Table;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.UUID;

/**
 * Created by Administrator on 2016/12/9.
 */
@Table(name = "userinfo")
public class User implements Serializable, UserDetails  {
    private String id;
    private String username;
    private String password;
    private String role;
    private Integer UserGroup;
    private Integer UserAuthority;
    private String EmployeeNo;

    public User(){}

    public User(String username, String password, String  role,Integer UserGroup,Integer UserAuthority,String EmployeeNo){
        this.setUsername(username);
        this.setPassword(password);
        this.setRole(role);
        this.setEmployeeNo( EmployeeNo );
        this.setUserAuthority( UserAuthority );
        this.setUserGroup( UserGroup );
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority(getRole()));
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getUserGroup() {
        return UserGroup;
    }

    public void setUserGroup(Integer userGroup) {
        UserGroup = userGroup;
    }

    public Integer getUserAuthority() {
        return UserAuthority;
    }

    public void setUserAuthority(Integer userAuthority) {
        UserAuthority = userAuthority;
    }

    public String getEmployeeNo() {
        return EmployeeNo;
    }

    public void setEmployeeNo(String employeeNo) {
        EmployeeNo = employeeNo;
    }

}
