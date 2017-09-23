package com.mapper;

import com.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
/**
 * Created by Administrator on 2017/6/12 0012.
 */
@Mapper
public interface UserMapper {
    User selectById(String id);
    User selectByUsername(String username);
}
