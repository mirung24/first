<%@page import="java.net.URLEncoder"%>
<%@page import="java.util.Date"%>
<%@page import="org.apache.commons.*"%>
<%@page import="java.util.concurrent.TimeUnit"%>
<%@page contentType="text/html;charset=utf-8" import="java.sql.*" import="java.io.*"  import="java.text.*" import="java.util.*" %>
<%@page import="org.codehaus.jettison.json.JSONArray"%>
<%@page import="org.codehaus.jettison.json.JSONObject"%>
<%@page import="org.codehaus.jettison.json.JSONTokener"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.json.simple.*"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="org.json.simple.parser.ParseException"%>
<%@ include file="dbinfo.jsp" %>
<%@ include file="apitrans.jsp" %>    
<%@page import="java.net.URLEncoder"%>
<%@page import="java.net.URLDecoder"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.text.DecimalFormat"%>
<%@page import="java.util.Calendar"%>

<%

response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin")); 
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
response.setHeader("Access-Control-Max-Age", "3600");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");

	request.setCharacterEncoding("utf-8");
	
	String reqGubn = ""; //통신명
	
	Connection dbConn1 = null;
	Connection dbConn2 = null;
	Connection dbConn3 = null;
	
	try{	
		
		reqGubn = request.getParameter("reqGubn");
		
		dbConn1 = getDBConnection(posurl,posuser,pospasswd); // POS DB
		
		dbConn2 = getDBConnection(posurl2,posuser2,pospasswd2); // 원장 DB
		
		dbConn3 = getDBConnection2(charmurl,charmuser,charmpasswd); // 참약사 디비
		
			out.println("=====Start");
			
			String sdate="";
			String edate="";
			
			 DecimalFormat datef = new DecimalFormat("00");
			 
			 Calendar currentCalendar = Calendar.getInstance();
			 
			 currentCalendar.add(currentCalendar.DATE,-1);

			 String strY = Integer.toString(currentCalendar.get(Calendar.YEAR));
			 String strM = datef.format(currentCalendar.get(Calendar.MONTH)+1);
			 String strD = datef.format(currentCalendar.get(Calendar.DATE));
			
			 
			 sdate = strY+strM+strD;
			 
		  	 edate = sdate;
			
			out.println("=====end");
			
		JSONObject masterData = null;
		JSONObject subList = null;
		JSONArray subData = null;
		
		if(reqGubn == null || reqGubn.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E001");
			subList.put("msg","통신명이 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}else{
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","0000");
			subList.put("msg","OK");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		
		
	}catch(Exception e){
		e.printStackTrace();
	} finally {
		dbConn1.close();
		dbConn2.close();
		dbConn3.close();
	}
	
%>