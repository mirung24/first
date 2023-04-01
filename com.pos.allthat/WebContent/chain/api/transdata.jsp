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
	
	
	Connection dbConn1 = null;
	Connection dbConn2 = null;
//	Connection dbConn3 = null;
	
	/* 가맹점 인증 
	   : userid  null 시 대표 아이디로 자동 로그인 처리
	   : 사용자 등록은 가맹점 WEB에서 등록
	*/
	
	String rtype=request.getParameter("rtype");
	
	try{	
		
		out.println("=====Start");
		
		dbConn1 = getDBConnection(posurl,posuser,pospasswd); // POS DB
		
		dbConn2 = getDBConnection(posurl2,posuser2,pospasswd2); // 원장 DB
		
	//	dbConn3 = getDBConnection2(charmurl,charmuser,charmpasswd); // 참약사 디비
		
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
		 
		 
		 // if(rtype.equals("product")){
		//	setTransData(dbConn2,dbConn1); // 가맹점 및 상품 이관
		// }else if(rtype.equals("sales")){ 
		//  setDeleteTemp(dbConn1);    // Temp 테이블 삭제 
		
		out.println("=sdate=="+sdate);
		
		// for(int i =20230325;i<=20230326;i++){
			
		// sdate = i+"";
		// edate = i+"";
		
			System.out.println("=sdate=="+sdate);
		
			setTransData(dbConn2,dbConn1); // 가맹점 및 상품 이관
			setTransData2(dbConn2,dbConn1,sdate,edate);    // 결제코드 있는것
		    setTransData4(dbConn2,dbConn1,sdate,edate);    // 현금수납(결제코드 있는것) 
			productCheck(dbConn1,sdate);                   // 누락제품등록
			
			setCompanySumary(dbConn1,sdate,edate);        // 일별 집계 생성
			
		//	setCharmSalesData(dbConn1,dbConn3,sdate,edate); //  참약사 데이타 이관   

			//	setTransData3(dbConn2,dbConn1,sdate,edate);    // 결제코드 없는것
			//	setTransData5(dbConn2,dbConn1,sdate,edate);    // 현금수납(결제코드 없는것)

				
		// }
		
		out.println("=edate=="+edate);
		
		// }else if(rtype.equals("charm")){ 
		// 	setCharmSalesData(dbConn1,dbConn3,sdate,edate); //  참약사 데이타 이관 
		// }else if(rtype.equals("sales3")){  
		
		// }else{ 
			
		// }
		
		out.println("=end=="+sdate);
		
	}catch(Exception e){
		e.printStackTrace();
	} finally {
		dbConn1.close();
		dbConn2.close();
	//	dbConn3.close();
	}
	
%>