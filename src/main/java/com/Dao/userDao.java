package com.Dao;

import com.utils.CommonDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class userDao {
    private JdbcTemplate jdbcTemplate;
    private CommonDao commondao;
    public userDao(JdbcTemplate jdbcTemplate) {
        super();
        this.jdbcTemplate = jdbcTemplate;
        if(this.jdbcTemplate !=null)
            this.commondao = new CommonDao(this.jdbcTemplate);
    }

    public List<Map<String,Object>> queryIndex(int tradeType) throws Exception {
        StringBuilder sql = new StringBuilder();
        List<Object> paramList = new ArrayList<Object>();
        sql.append(" select a.*,b.USER_FOLLOW,B.USER_ISVALID FROM c_post_bar_12 a LEFT JOIN f_user_follow b on a.main_id = b.main_id " +
                " WHERE a.TRADE_TYPE = "+tradeType+
                " AND a.BELONG_QF is not NULL" +
                " AND a.TIXIN is not NULL" +
                " AND a.REPLY_CONTENT IS NOT NULL" +
                " AND a.PRICE_NUM is NOT null"+
                " GROUP BY a.MAIN_ID ORDER BY a.REPLY_TIME DESC LIMIT 0,10");
        System.out.println(sql);
        return this.commondao.query(sql.toString(), paramList);
    }

    public String queryAdminLockTime(String username) throws Exception {
        StringBuilder sql = new StringBuilder();
        List<Object> paramList = new ArrayList<Object>();
        sql.append(" select admin_lock from f_user_info where login_name='"+username+"'");
        System.out.println(sql);
        return this.commondao.queryOne(sql.toString(), paramList);
    }
}
