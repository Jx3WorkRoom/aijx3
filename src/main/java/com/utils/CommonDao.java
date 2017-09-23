package com.utils;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;

import java.util.List;
import java.util.Map;


/**
 * @author hupeng
 */
public class CommonDao {


	private JdbcTemplate jdbcTemplate;
	
	

	
	public CommonDao(JdbcTemplate jdbcTemplate) {
		super();
		this.jdbcTemplate = jdbcTemplate;
	}
	

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}


	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	
	

	public  int[] insertMany(String sql,List inList)throws Exception{
		if(sql == null){
			return null;
		}
		SqlParameterSource[] spsBatch= SqlParameterSourceUtils.createBatch(inList.toArray());
		NamedParameterJdbcTemplate npJdbcTemplate=new NamedParameterJdbcTemplate(jdbcTemplate);
		return npJdbcTemplate.batchUpdate(sql, spsBatch);
	}
	
	public  int insert(String sql,Object obj)throws Exception{	
		if(sql == null){
			return 0;
		}
		if(obj==null){
			return jdbcTemplate .update(sql);
		}else{
			SqlParameterSource sps=new BeanPropertySqlParameterSource(obj);
			NamedParameterJdbcTemplate npJdbcTemplate=new NamedParameterJdbcTemplate(jdbcTemplate);
			return npJdbcTemplate.update(sql, sps);
		}
	}
	
	public  int update(String sql,Object obj)throws Exception{	
		if(sql == null){
			return 0;
		}
		if(obj==null){
			return jdbcTemplate.update(sql);
		}else{
			SqlParameterSource sps=new BeanPropertySqlParameterSource(obj);
			NamedParameterJdbcTemplate npJdbcTemplate=new NamedParameterJdbcTemplate(jdbcTemplate);
			return npJdbcTemplate.update(sql, sps);	
		}
	}
	public  int[] updateMany(String sql,List inList)throws Exception{	
		if(sql == null){
			return null;
		}
		if(inList==null){
			return null;
		}else{
			SqlParameterSource[] spsBatch= SqlParameterSourceUtils.createBatch(inList.toArray());
			NamedParameterJdbcTemplate npJdbcTemplate=new NamedParameterJdbcTemplate(jdbcTemplate);
			return npJdbcTemplate.batchUpdate(sql, spsBatch);
		}
	}

	
	public  <T> List<T> query(String sql, List paramList, Class<T> cls)throws Exception{
		if(sql == null){
			return null;
		}

		if(paramList == null){			
			return jdbcTemplate.query(sql, BeanPropertyRowMapper.newInstance(cls));
		}
		else{
			return jdbcTemplate.query(sql,paramList.toArray(), BeanPropertyRowMapper.newInstance(cls));
		}
	}
	
	public  List<Map<String, Object>> query(String sql, List paramList)throws Exception{
		if(sql == null){
			return null;
		}
		if(paramList == null){
			return jdbcTemplate.queryForList(sql);
		}
		else{
			return jdbcTemplate.queryForList(sql, paramList.toArray());
		}
	}
	
	public  String queryOne(String sql, List paramList)throws Exception{
		if(sql == null){
			return null;
		}
		if(paramList == null){
			return jdbcTemplate.queryForObject(sql, String.class);
		}
		else{
			return jdbcTemplate.queryForObject(sql, paramList.toArray(),String.class);
		}
	}
	
	public  long queryNum(String sql, List paramList)throws Exception{
		if(sql == null){
			return 0;
		}
		String out = "";
		if(paramList == null){
			out = jdbcTemplate.queryForObject(sql, String.class);
		}
		else{
			out = jdbcTemplate.queryForObject(sql, paramList.toArray(),String.class);
		}
		if(MyStringUtils.isEmpty(out)){
			return 0;
		}
		return Long.valueOf(out);
	}
}
