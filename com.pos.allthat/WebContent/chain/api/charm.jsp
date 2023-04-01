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
<%@ include file="trans.jsp" %>       
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
	
	
	Connection dbConn1 = null;
	Connection dbConn2 = null;
	
	/* 가맹점 인증 
	   : userid  null 시 대표 아이디로 자동 로그인 처리
	   : 사용자 등록은 가맹점 WEB에서 등록
	*/
	
	try{	
		
		out.println("=====Start");
		
		dbConn1 = getDBConnection(posurl,posuser,pospasswd); 
		
		dbConn2 = getDBConnection(charmurl,charmuser,charmpasswd); 
		
		
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

		out.println("=sdate=="+sdate);
		System.out.println("=sdate=="+sdate);

		setCharmSalesData(dbConn1,dbConn2,sdate,edate); //  참약사 데이타 이관  

		System.out.println("=edate=="+edate);

		out.println("=end=="+edate);

	}catch(Exception e){
		e.printStackTrace();
	} finally {
		dbConn1.close();
		dbConn2.close();
	}
	
%>