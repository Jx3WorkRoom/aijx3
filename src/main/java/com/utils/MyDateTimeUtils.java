/**
 * 日期时间处理�?
 */
package com.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @author HP
 * 
 */
public class MyDateTimeUtils
{
	/**
	 * 字符串转日期
	 * 
	 * @param DateTime
	 * @return
	 */
	public static Date StrToDate(String DateTime,String Formater)
	{
		SimpleDateFormat sdf = new SimpleDateFormat(Formater);
		Date date = null;
		try
		{
			date = sdf.parse(DateTime);
		}
		catch (ParseException e)
		{
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 日期转换成字符串
	 * 
	 * @param date
	 * @return str
	 */
	public static String DateTimeToStr(Date date, String Formater)
	{
		// "yyyy-MM-dd HH:mm:ss"
		SimpleDateFormat sdt = new SimpleDateFormat(Formater);
		String str = sdt.format(date);
		return str;
	}

	/**
	 * 通过变化的分钟数，得到新的日期
	 * 
	 * @param oldDT
	 *            旧日期
	 * @param IntervalMin
	 *            变化分钟数
	 * @return 新 Date
	 */
	public static Date getNewDateByMinute(Date oldDT, int changeMinute)
	{
		Date newDT = null;
		Calendar ca = Calendar.getInstance();
		ca.setTime(oldDT);
		ca.add(Calendar.MINUTE, changeMinute);
		newDT = ca.getTime();
		return newDT;
	}

	/**
	 * 计算两个日期之间相差的时间
	 * 
	 * @param BeginDate
	 *            较小的时间
	 * @param EndDate
	 *            较大的时间
	 * @param Type
	 *            DAYS,HOURS,MINTUES,SECONDS
	 * @return 相差时间
	 * @throws ParseException
	 */
	public static int TimeBetween(Date BeginDate, Date EndDate, String Type) throws ParseException
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		BeginDate = sdf.parse(sdf.format(BeginDate));
		EndDate = sdf.parse(sdf.format(EndDate));

		Calendar cal = Calendar.getInstance();

		cal.setTime(BeginDate);
		long time1 = cal.getTimeInMillis();

		cal.setTime(EndDate);
		long time2 = cal.getTimeInMillis();

		long lTime = 1;
		Type = Type.toUpperCase();
		if(Type.equals("DAYS"))
		{
			lTime = 1000 * 3600 * 24;
		}
		else if(Type.equals("HOURS"))
		{
			lTime = 1000 * 3600;
		}
		else if(Type.equals("MINTUES"))
		{
			lTime = 1000 * 60;
		}
		else if(Type.equals("SECONDS"))
		{
			lTime = 1000;
		}else if(Type.equals("MilliSECONDS")){
			lTime=1;
		}

		long between = (time2 - time1) / lTime;

		return Integer.parseInt(String.valueOf(between));
	}
}
