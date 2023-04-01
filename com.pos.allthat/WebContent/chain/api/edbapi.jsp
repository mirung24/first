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
<%@ include file="apifnc.jsp" %>   
<%@page import="java.net.URLEncoder"%>
<%@page import="java.net.URLDecoder"%>


<%

response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin")); 
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
response.setHeader("Access-Control-Max-Age", "3600");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");

	request.setCharacterEncoding("utf-8");
	
	String reqGubn = ""; //통신명
	String tid = ""; // 
	String serialno = ""; // 기기serial
	String devicenumber = "";
	String apicode ="";
	
	Connection dbConn = null;
	JSONObject masterData = null;
	JSONObject subList = null;
	JSONArray subData = null;
	
	/* 가맹점 인증 
	   : userid  null 시 대표 아이디로 자동 로그인 처리
	   : 사용자 등록은 가맹점 WEB에서 등록
	*/
	
	try{	
		
		dbConn = getDBConnection(posurl,posuser,pospasswd);
		
		long time = System.currentTimeMillis();
		SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd a hh:mm");
		String str = dayTime.format(new Date(time));
		
		 
		Enumeration params = request.getParameterNames();
		System.out.println("---------pos---edbapi("+params+")----------------");
		
		/* Json Data */
		String code = "";
		String msg ="";
		
		
		/* 사업자정보 */
		String corporatenumber = "";
		String userid = "";
		String passwd = "";
		String compcd = "";
		String chaincode = "";
		
		corporatenumber = request.getParameter("p_biz_no");
		reqGubn = request.getParameter("reqGubn");	
		
		System.out.println("reqGubn="+reqGubn);
		
		tid = request.getParameter("tid");
		if(tid==null) tid="test1111";
		
		serialno =  request.getParameter("serialno");
		if(serialno==null) serialno="test2222";
				
		if(reqGubn == null || reqGubn.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E001");
			subList.put("msg","통신명이 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		
		
		if(corporatenumber == null || corporatenumber.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E004");
			subList.put("msg","사업자번호가 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		
		if(tid == null || tid.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E002");
			subList.put("msg","POS 단말기의 TID가 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		
		/*
		if(serialno == null || serialno.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E003");
			subList.put("msg","POS 단말기의 일련번호가 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		*/
		
		/*  가맹점 등록 */
		if(reqGubn.equals("companyIns")){
			
			String chainname = "";
			String companyname = "";
			String president = "";
			String presidentcnt = "";
			String registerdate = "";
			String canceldate = "";
			String address = "";
			String address2 = "";
			String tel = "";
			String hp = "";
			String fax = "";
			String email = "";
			String taxusername = "";
			String taxusertel = "";
			String taxuseremail = "";
			String opendate = "";
			String remarks = "";
			
			chainname = request.getParameter("chainname");
			if(chainname==null) chainname="";
			
			companyname = request.getParameter("companyname");
			if(companyname==null) companyname="";
			
			corporatenumber = request.getParameter("p_biz_no");
			if(corporatenumber==null) corporatenumber="";
			
			president = request.getParameter("president");
			if(president==null) president="";
			
			registerdate = request.getParameter("presidentcnt");
			if(registerdate==null) registerdate="";
			
			canceldate = request.getParameter("canceldate");
			if(canceldate==null) canceldate="";
			
			address = request.getParameter("address");
			if(address==null) address="";
			
			address2 = request.getParameter("address2");
			if(address2==null) address2="";
			
			tel = request.getParameter("tel");
			if(tel==null) tel="";
			
			hp = request.getParameter("hp");
			if(hp==null) hp="";
			
			fax = request.getParameter("fax");
			if(fax==null) fax="";
			
			email = request.getParameter("email");
			if(email==null) email="";
			
			taxusername = request.getParameter("taxusername");
			if(taxusername==null) taxusername="";
			
			taxusertel = request.getParameter("taxusertel");
			if(taxusertel==null) taxusertel="";
			
			taxuseremail = request.getParameter("taxuseremail");
			if(taxuseremail==null) taxuseremail="";
			
			opendate = request.getParameter("opendate");
			if(opendate==null) opendate="";
			
			remarks = request.getParameter("remarks");
			if(remarks==null) remarks="";
			
			tid = request.getParameter("tid");
			if(tid==null) tid="";
			
			String muserid = setCompanyInfo(dbConn,chainname,companyname,corporatenumber,president,presidentcnt,registerdate,canceldate,address,address2,tel,hp,fax,email,taxusername,taxusertel,taxuseremail,opendate,remarks,tid);   
			
			if(muserid.equals(corporatenumber)){
				code ="0000";
				msg="";
			}else{
				code ="E013";
				msg="가맹점등록중 장애가 발생하였습니다.";
				muserid="";
			}
			
			subList = new JSONObject();
			
			subList.put("resname", reqGubn);
			subList.put("code",code);
			subList.put("msg",msg);
			subList.put("muserid",muserid);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		/* 가맹점 등록끝*/
		
		compcd = getCompcd(dbConn,corporatenumber);
		
		chaincode = getChaincode(dbConn,compcd); 
		
		if(chaincode==null || chaincode.equals("")) chaincode="999999999";
		
		System.out.println("compcd="+compcd);
		System.out.println("chaincode="+chaincode);
		
		if(compcd==null || compcd.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E011");
			subList.put("msg","가입되지 않은 사업자입니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		
		/* 로그인(사업자번호 , 사용자ID , 비밀번호) 
	    rqgGubn : login
		req : 
			  corporatenumber : varchar2(20)
	          userid : varchar2(20)
	          passwd : varchar2(20) 
	    res : jsonobject
	          resname    : 호출함수명 
	          code       : 정상(0000) , 에러(에러코드)
	          msg        : 정상(공백) , 에러(에러메세지)
	          data(JSONArray) : 판매자 변경시 사용
	        	           compcd  : varchar2(20) : 가맹점코드
	        	  	       userseq : varchar2(20) : 사용자코드
	        	  	       userid  : varchar2(20) : 사용자아이디
	        	  	       name    : varchar2(20) : 사용자명
		*/
		if(reqGubn.equals("login")){

			subList = new JSONObject();
			
			subData = LoginPost(dbConn,corporatenumber,userid,passwd);  
			
			if(subData.length() == 0){
				code = "E005";
				msg = "아이디 또는 비밀번호를 확인하세요";
			}else{
				code = "0000";
				msg="";
				loginHistroy(dbConn, userid, devicenumber); // 접속이력 등록
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("data", subData);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* GateWay, AOS POS 상품 조회 
	    rqgGubn : productinfo
		req : 
			  corporatenumber : varchar2(20)
	          tid : varchar2(20)
	          productid : varchar2(20)
	    res : jsonobject
	          resname    : 호출함수명 
	          code       : 정상(0000) , 에러(에러코드)
	          msg        : 정상(공백) , 에러(에러메세지)
	          data(JSONObject) : 
	        	  				productid       : varchar2(20) : 대표코드
	        	  				productcd       : varchar2(20) : 제품코드
	        	  				barcode         : varchar2(20) : 바코드
	        	  				productname     : varchar2(20) : 제품명
	        	  				maker           : varchar2(20) : 제조사
	        	  				size            : varchar2(20) : 사이즈
	        	  				unit            : varchar2(20) : 단위
	        	  				spec            : varchar2(20) : 규격
	        	  				packingunit     : varchar2(20) : 포장단위
	        	  				salesprice      : integer      : 판매가
	        	  				purchaseprice   : integer : 최근구입가
	        	  				price		    : integer : 단가
	        	  				mmprice        : integer : 체인점내 최다판매가
	        	  				miprice        : integer : 체인점내 최소판매가
	        	  				maprice        : integer : 체인점내 최대판매가
	        	  				stock           : integer : 재고
	        	  				appropriatestock: integer : 적정재고
		*/
		
		/* 상품정보 */
		String productid = "";
		String productcd = "";
		String productname = "";
		String barcode = "";
		
		productid = request.getParameter("productid"); // 대표코드
		productcd = request.getParameter("productcd"); // 제품코드
		productname = request.getParameter("productname"); // 제품명
		barcode = request.getParameter("barcode"); // 바코드
		
		if(productid==null) productid="";
		if(productcd==null) productcd="";
		if(barcode==null) barcode="";
		if(productname==null) productname="";
		
		if(reqGubn.equals("productinfo")){
			
			subList = new JSONObject();
			
			if(barcode!="" && barcode!=null){
				
				subData = getProductInfoList(dbConn,compcd,barcode,chaincode,productid); 
				code = "0000";
				msg = "";
								
			}else{
				code = "E007";
				msg = "제품정보가 없습니다.";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("data", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 단말기 설정 저장 
	    rqgGubn : configsave
		req : 
				corporatenumber : varchar2(20)
				compcd          : varchar2(20) : 가맹점코드
		    	connfigdata     : varchar2(2000) : 설정정보
				
	    res : jsonobject
	          resname    : 호출함수명 
	          code       : 정상(0000) , 에러(에러코드)
	          msg        : 정상(공백) , 에러(에러메세지)
	          data       : connfigdata
		*/
		
		String compconfig = request.getParameter("req_jsonData"); 
		String retomeip = request.getParameter("retomeip"); 
		
		if(compconfig==null) compconfig="";
		if(retomeip==null) retomeip="";
		
		if(reqGubn.equals("putTermConfig")){
			
			subList = new JSONObject();
			
			int configcnt = setCompconfigInfo(dbConn,compcd, compconfig,retomeip);   
			
			if(configcnt == 0){
				code = "E006";
				msg = "설정정보 등록중 장애가 발생하였습니다.";
			}else{
				code = "0000";
				msg="";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("data", compconfig);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 단말기 설정 정보 
	    rqgGubn : configinfo
		req : 
			  corporatenumber : varchar2(20)
	    res : jsonobject
	          resname    : 호출함수명 
	          code       : 정상(0000) , 에러(에러코드)
	          msg        : 정상(공백) , 에러(에러메세지)
	          data	     : compconfig
		*/
		
		if(reqGubn.equals("getTermConfig")){
			
			subList = new JSONObject();
			
			String configdata = getCompconfigInfo(dbConn,compcd); 
			
			code = "0000";
			msg="";
			
			subList.put("resname",reqGubn); 
			subList.put("code", code);
			subList.put("msg", msg); 
			subList.put("data", configdata);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 판매+결제정보 
	    rqgGubn : payment
		req : 
			    corporatenumber : varchar2(20)
	            compcd          : varchar2(20)  : 가맹점코드
	            salesseq        : varchar2(100) : "CP" + 사업자번호 + TID + yyMMddHHmmss + 단말기 일련번호
				paymethod		: varchar2(6)   : 결제타입(카드,현금등)(코드테이블 참조)
				paygubn			: varchar2(6)   : 결제구분(결제,취소)(코드테이블 참조)
				hp				: varchar2(20)  : 휴대폰번호(없으면 공백)
				birthday 		: varchar2(20)	: 생년월일(없으면 공백)
				sex				: varchar2(2)	: 성별(남:M,여:F)
				name			: varchar2(50)	: 고객명(없으면 공백)
				auth_no			: varchar2(100)	: 승인번호
				auth_date		: varchar2(10)	: 승인일자
				auth_time		: varchar2(20)	: 승인시분초
				saleuserid		: varchar2(20)	: 판매자 아이디
				org_auth_no		: vRCHAR2(20)	: 원승인번호(결제취소시)
				prescription    : varchar2(100)	: 처방전 넘버
				etcamt		    : integer		: 금액
				Array[
							productcd   : varchar2(100)	: 제품코드
							productname	: varchar2(100)	: 제품명
							stock		: integer		: 재고
							appstock	: integer		: 적정재고
							packingunit : integer		: 포장단위
							maker		: varchar2(100) : 제조사
							cnt			: integer		: 판매수량
							price		: integer		: 단가
							discount	: integer		: 할인가
							amt			: integer		: 판매가
							vat			: varchar2(2)   : 부가세(Y:포함,N:별도)
							total		: varchar2(2)   : 합계
							purprice    : integer       : 직전구입가
							purcomp     : varchar2(20)  : 작전 구입처 사업자 번호
							purname     : varchar2(100)  :직전구입처명
							purdate     : varchar2(10)  : 직전구입일자
							producttype : varchar2(10)	: ETC / OTC (조제의약품일경우 ETC , 그외 OTC)
						]
		res : jsonobject
	         resname       : 호출함수명 
	         code          : 정상(0000) , 에러(에러코드)
	         msg           : 정상(공백) , 에러(에러메세지)
		*/
		
		String salesseq = null;
		String paymethod = null;

		String hp = null;
		String birthday  = null;
		String sex  = null;
		String name	 = null;
		
		String auth_no  = null;
		String auth_date  = null;
		String auth_time  = null;
		String org_auth_no  = null;
		String org_auth_date = null;
		
		String org_auth_time = "";
		String paygubn = "";
		String card = "";
		String money = "";
		String etcamt = "";
		String money_no = "";

		String cardgubn = ""; // 매입사
		String vancd = ""; // 결제 밴
		
		String installments = "";
		String salesid = "";
		String amt = "";
		String vat = "";
		String discount = "";
		String total = "";
		String cardno = "";
		String prescription = null;
		
		String cadno = null;
		String install  = null;
		
		String product = null;
		String trans_filler = "";
		
		if(reqGubn.equals("putSalesData")){
		
			String productlist = request.getParameter("productlist");

			JSONTokener tokener = new JSONTokener(productlist);
	        JSONObject JsonObject = new JSONObject(tokener);
			
	         // System.out.println("productlist="+productlist);
	 		
			salesseq = JsonObject.getString("p_unique_id");
			paymethod = JsonObject.getString("p_pay_method");
			
			
			subList = new JSONObject();
			
			if(paymethod.equals("D4") || paymethod.equals("B2") || paymethod.equals("B4") || paymethod.equals("AC") || paymethod.equals("Q2") || paymethod.equals("J4") || paymethod.equals("A2") || paymethod.equals("A4") || paymethod.equals("A6") || paymethod.equals("A8") ){ // 승인 취소
				/* 
				D4 : 신용 취소
				B2 : 현금영수증 취소
				B4 : 자진발급 취소
				AC : 제로페이 취소
				Q2 : 현금수납 취소
				J4 : 현금IC 취소
				A2 : 알리페이 취소
				A4 : 위챗페이 취소
				A6 : 카카오페이 취소
				A8 : 앱카드 취소"
				*/
				
				auth_no = JsonObject.getString("p_auth_no");
				auth_date = JsonObject.getString("p_auth_date");
				auth_time = JsonObject.getString("p_auth_time");
				
				org_auth_no = JsonObject.getString("p_org_auth_no");
				org_auth_date = JsonObject.getString("p_org_auth_date");
				org_auth_time = JsonObject.getString("p_org_auth_time");
				paygubn = JsonObject.getString("p_pay_gubn");
				
				int salescancnt = 0;
				
				System.out.println("salesseq="+salesseq);
				System.out.println("org_auth_no="+org_auth_no);
				System.out.println("org_auth_date="+org_auth_date);
				
				if(org_auth_no.length()<2) org_auth_no=auth_no;
				
				System.out.println("org_auth_no="+org_auth_no);
				
				salescancnt = setSalesCanData(dbConn,compcd,salesseq,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn);    
				
				if(salescancnt>0){
					code = "0000";
					msg="";
				}else{
					code = "E0120"; 
					msg="결제취소시 장애가 발생 하였습니다.";
				}
				
				subList.put("resname",reqGubn); 
				subList.put("code", code);
				subList.put("msg", msg);
				
				
			}else{ // 승인
				
				System.out.println("productlist="+productlist);
				
				hp = JsonObject.getString("p_phone_num");
				birthday = JsonObject.getString("p_birthday");
				sex = JsonObject.getString("p_gender");
				name = JsonObject.getString("p_name");
				
				name = URLDecoder.decode(name, "UTF-8");
				
				auth_no = JsonObject.getString("p_auth_no");
				auth_date = JsonObject.getString("p_auth_date");
				auth_time = JsonObject.getString("p_auth_time");
				org_auth_no = JsonObject.getString("p_org_auth_no");
				org_auth_date = JsonObject.getString("p_org_auth_date");
				prescription = JsonObject.getString("p_prescription_num");
				org_auth_time = JsonObject.getString("p_org_auth_time");
				paygubn = JsonObject.getString("p_pay_gubn");
				
				System.out.println("paygubn="+paygubn);
				
				card = JsonObject.getString("p_card");
				money = JsonObject.getString("p_money");
				etcamt = JsonObject.getString("etcamt");
				
				money_no = JsonObject.getString("p_money_no");
				
				cardgubn = JsonObject.getString("p_cardgubn");
				vancd = JsonObject.getString("p_vancd");
				
				installments = JsonObject.getString("p_install");
				salesid = JsonObject.getString("salesid");
				
				amt = JsonObject.getString("amt");
				vat = JsonObject.getString("vat");
				discount = JsonObject.getString("discount");
				total = JsonObject.getString("total");
				
				auth_date = auth_date.replaceAll("-", "");
				
				cardno = JsonObject.getString("p_cardno");
				install = JsonObject.getString("p_install");
				tid = JsonObject.getString("p_tid");
				trans_filler = JsonObject.getString("trans_filler");
				
				product = JsonObject.getString("p_goods_list");
				
				if(vancd == null || vancd.equals("")){ 
					vancd="V01";
				}
				
				System.out.println("product="+product);
				
				int salescnt = 0;
				
				if(product.length()>=2){
				
					JSONArray productArray = (JSONArray) new JSONTokener(product).nextValue();
					
					int productArrayCnt = productArray.length();
					
					System.out.println("productArrayCnt="+productArrayCnt);
					
					
					String productInfoArr = null;
					String p_product_code = null;
					String p_barcode = null;
					
					System.out.println("salesseq="+salesseq);
					System.out.println("product="+product);
						
					String[] productidval = null;
					productidval = new String[productArrayCnt];
		
					String[] productcdval = null;
					productcdval = new String[productArrayCnt];
					
					String[] productbarcodeval = null;
					productbarcodeval = new String[productArrayCnt];
					
					String[] productnameval = null;
					productnameval = new String[productArrayCnt];
		
					String[] productmakerval = null;
					productmakerval = new String[productArrayCnt];
		
					String[] productpackingkval = null;
					productpackingkval = new String[productArrayCnt];
		
					String[] productstockval = null;
					productstockval = new String[productArrayCnt];
					
					String[] productappstockval = null;
					productappstockval = new String[productArrayCnt];
					
					String[] salescntval = null;
					salescntval = new String[productArrayCnt];
					
					String[] salespriceval = null;
					salespriceval = new String[productArrayCnt];
					
					String[] salesdiscountval = null;
					salesdiscountval = new String[productArrayCnt];
					
					String[] salestotalval = null;
					salestotalval = new String[productArrayCnt];
					
					String[] salesvatval = null;
					salesvatval = new String[productArrayCnt];
					
					String[] buypriceval = null;
					buypriceval = new String[productArrayCnt];
					
					String[] sizeval = null;
					sizeval = new String[productArrayCnt];
					
					String[] unitval = null;
					unitval = new String[productArrayCnt];
					
					String[] specval = null;
					specval = new String[productArrayCnt];
					
					System.out.println("============productArrayCnt============="+productArrayCnt);
					
					for(int i=0;i<productArrayCnt;i++){
		
						productInfoArr = String.valueOf(productArray.get(i));
						
						JSONTokener p_product_info = new JSONTokener(productInfoArr);
				        JSONObject product_info = new JSONObject(p_product_info);
				        
				        productidval[i] = product_info.getString("p_productid"); // 대표코드
				        productcdval[i] = product_info.getString("p_productcd"); //제품코드
				        productbarcodeval[i] = product_info.getString("p_barcode"); //제품바코드
						productnameval[i] = URLDecoder.decode(product_info.getString("p_goods_name"), "UTF-8"); // 제품명
						productmakerval[i] = URLDecoder.decode(product_info.getString("p_pharmcist"), "UTF-8"); // 제조사
						productpackingkval[i] = product_info.getString("p_unit_cnt"); // 포장수량
						productstockval[i] = product_info.getString("p_stock_cnt"); // 현재고
						productappstockval[i] = product_info.getString("p_prop_stock_cnt"); //적정재고
						salescntval[i] = product_info.getString("p_cnt"); // 판매수량
						salespriceval[i] = product_info.getString("p_sell_amt"); // 판매가
						salesdiscountval[i] = product_info.getString("p_discnt_amt"); // 할인가
						salestotalval[i] = product_info.getString("p_total_amt"); // 총금액 
						buypriceval[i] = product_info.getString("p_buy_amt"); // 사입가
						salesvatval[i] = "1";
						sizeval[i] = "";
						unitval[i] = "";
						specval[i] = "";
						
					}
					
					System.out.println("============pass=============");
					
					 salescnt = setSalesData(dbConn,compcd,chaincode,salesseq,paymethod,cardno,tid,hp,birthday,sex,name,auth_date,auth_time,org_auth_no,org_auth_date,prescription, 
							amt,vat,discount,total,productidval,productcdval,productbarcodeval,productnameval,productmakerval,productpackingkval,productstockval,productappstockval,
							salescntval,salespriceval,salesdiscountval,salestotalval,buypriceval,salesvatval,sizeval,unitval,specval,productArrayCnt,
							auth_no,org_auth_time,paygubn,card,money,etcamt,money_no,cardgubn,installments,salesid,trans_filler,vancd); 
					
				}else{
					 salescnt = setPaymentData(dbConn,compcd,chaincode,salesseq,paymethod,cardno,tid,hp,birthday,sex,name,auth_date,auth_time,org_auth_no,org_auth_date,prescription, 
							amt,vat,discount,total,auth_no,org_auth_time,paygubn,card,money,etcamt,money_no,cardgubn,installments,salesid,trans_filler,vancd); 
				}  
					 
				if(salescnt>0){
					code = "0000";
					msg="";
				}else{
					code = "E0120"; 
					msg="중복된 판매번호 입니다.";
				}
			
			}	
				
			subList.put("resname",reqGubn); 
			subList.put("code", code);
			subList.put("msg", msg);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		
		if(reqGubn.equals("putSalesData2")){
			
			String productlist = request.getParameter("productlist");

			JSONTokener tokener = new JSONTokener(productlist);
	        JSONObject JsonObject = new JSONObject(tokener);
			
	        System.out.println("productlist="+productlist);
	 		
			salesseq = JsonObject.getString("p_unique_id");
			paymethod = JsonObject.getString("p_pay_method");
			hp = JsonObject.getString("p_phone_num");
			birthday = JsonObject.getString("p_birthday");
			sex = JsonObject.getString("p_gender");
			name = JsonObject.getString("p_name");
			
			auth_no = JsonObject.getString("p_auth_no");
			auth_date = JsonObject.getString("p_auth_date");
			auth_time = JsonObject.getString("p_auth_time");
			org_auth_no = JsonObject.getString("p_org_auth_no");
			org_auth_date = JsonObject.getString("p_org_auth_date");
			prescription = JsonObject.getString("p_prescription_num");
			org_auth_time = JsonObject.getString("p_org_auth_time");
			paygubn = JsonObject.getString("p_pay_gubn");
			
			card = JsonObject.getString("p_card");
			money = JsonObject.getString("p_money");
			etcamt = JsonObject.getString("etcamt");
			
			money_no = JsonObject.getString("p_money_no");
			cardgubn = JsonObject.getString("p_cardgubn");
			
			if(cardgubn.length()==3){
				cardgubn = cardgubn.substring(1,3);
			}
			
			vancd = JsonObject.getString("p_vancd");
			installments = JsonObject.getString("p_install");
			salesid = JsonObject.getString("salesid"); 
			
			amt = JsonObject.getString("amt");
			vat = JsonObject.getString("vat");
			discount = JsonObject.getString("discount");
			total = JsonObject.getString("total");
			
			auth_date = auth_date.replaceAll("-", "");
			
			cardno = JsonObject.getString("p_cardno");
			install = JsonObject.getString("p_install");
			tid = JsonObject.getString("p_tid");
			trans_filler = JsonObject.getString("trans_filler");
			
			product = JsonObject.getString("p_goods_list");
			
			JSONArray productArray = (JSONArray) new JSONTokener(product).nextValue();
			
			int productArrayCnt = productArray.length();
			
			System.out.println("productArrayCnt="+productArrayCnt);
			
			
			String productInfoArr = null;
			String p_product_code = null;
			String p_barcode = null;
			
			System.out.println("salesseq="+salesseq);
			System.out.println("product="+product);
				
			String[] productidval = null;
			productidval = new String[productArrayCnt];

			String[] productcdval = null;
			productcdval = new String[productArrayCnt];
			
			String[] productbarcodeval = null;
			productbarcodeval = new String[productArrayCnt];
			
			String[] productnameval = null;
			productnameval = new String[productArrayCnt];

			String[] productmakerval = null;
			productmakerval = new String[productArrayCnt];

			String[] productpackingkval = null;
			productpackingkval = new String[productArrayCnt];

			String[] productstockval = null;
			productstockval = new String[productArrayCnt];
			
			String[] productappstockval = null;
			productappstockval = new String[productArrayCnt];
			
			String[] salescntval = null;
			salescntval = new String[productArrayCnt];
			
			String[] salespriceval = null;
			salespriceval = new String[productArrayCnt];
			
			String[] salesdiscountval = null;
			salesdiscountval = new String[productArrayCnt];
			
			String[] salestotalval = null;
			salestotalval = new String[productArrayCnt];
			
			String[] salesvatval = null;
			salesvatval = new String[productArrayCnt];
			
			String[] buypriceval = null;
			buypriceval = new String[productArrayCnt];
			
			String[] sizeval = null;
			sizeval = new String[productArrayCnt];
			
			String[] unitval = null;
			unitval = new String[productArrayCnt];
			
			String[] specval = null;
			specval = new String[productArrayCnt];
			
			for(int i=0;i<productArrayCnt;i++){

				productInfoArr = String.valueOf(productArray.get(i));
				
				JSONTokener p_product_info = new JSONTokener(productInfoArr);
		        JSONObject product_info = new JSONObject(p_product_info);
		        
		        productidval[i] = product_info.getString("p_productid"); // 대표코드
		        productcdval[i] = product_info.getString("p_productcd"); //제품코드
		        productbarcodeval[i] = product_info.getString("p_barcode"); //제품바코드
				productnameval[i] = product_info.getString("p_goods_name"); // 제품명
				productmakerval[i] = product_info.getString("p_pharmcist"); // 제조사
				productpackingkval[i] = product_info.getString("p_unit_cnt"); // 포장수량
				productstockval[i] = product_info.getString("p_stock_cnt"); // 현재고
				productappstockval[i] = product_info.getString("p_prop_stock_cnt"); //적정재고
				salescntval[i] = product_info.getString("p_cnt"); // 판매수량
				salespriceval[i] = product_info.getString("p_sell_amt"); // 판매가
				salesdiscountval[i] = product_info.getString("p_discnt_amt"); // 할인가
				salestotalval[i] = product_info.getString("p_total_amt"); // 총금액 
				buypriceval[i] = product_info.getString("p_buy_amt"); // 사입가
				salesvatval[i] = "1";
				sizeval[i] = "";
				unitval[i] = "";
				specval[i] = "";
				
			}
			
			if(vancd == null || vancd.equals("")){
				vancd="V01";
			}

			int salescnt = setSalesData(dbConn,compcd,chaincode,salesseq,paymethod,cadno,tid,hp,birthday,sex,name,auth_date,auth_time,org_auth_no,org_auth_date,prescription, 
					amt,vat,discount,total,
					productidval,productcdval,productbarcodeval,productnameval,productmakerval,productpackingkval,productstockval,productappstockval,
					salescntval,salespriceval,salesdiscountval,salestotalval,buypriceval,salesvatval,sizeval,unitval,specval,productArrayCnt,
					auth_no,org_auth_time,paygubn,card,money,etcamt,money_no,cardgubn,installments,salesid,trans_filler,vancd); 
			
			if(salescnt>0){
				code = "0000";
				msg="";
			}else{
				code = "E0120"; 
				msg="중복된 판매번호 입니다.";
			}
			
			subList = new JSONObject();
			
			subList.put("resname",reqGubn); 
			subList.put("code", code);
			subList.put("msg", msg);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		
		

		/* 판매데이터 취소용 */
		if(reqGubn.equals("getSalesData")){
			
			salesseq = request.getParameter("p_unique_id");
			
			System.out.println("compcd="+compcd);
			System.out.println("salesseq="+salesseq);
			
			
			subList = new JSONObject();
			
			if(salesseq!="" && salesseq!=null){
				
				int cancelChkcnt=0;
				
				cancelChkcnt = getSalesCheck(dbConn,compcd,salesseq);  
				
				if(cancelChkcnt==0){
					subData = getSalesList(dbConn,compcd,salesseq);
					
					code = "0000";
					msg = "";
					
				}else{
					code = "E888";
					msg = "판매 취소된 건입니다.";
				}
								
			}else{
				code = "E007";
				msg = "판매번호가 없습니다.";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("JSON", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 제품 최고,최저가 구하기 */
		if(reqGubn.equals("getBarcodePriceInfo")){
			
			barcode = request.getParameter("p_barcode");
			
			subList = new JSONObject();
			
			if(barcode!="" && barcode!=null){
				
				subData = getProductPriceList(dbConn,compcd,barcode,chaincode);   
				code = "0000";
				msg = "";
								
			}else{
				code = "E007";
				msg = "바코드가 없습니다.";
			}
			
			subList.put("resname",reqGubn); 
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("JSON", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			
		}
		 
		
	}catch(Exception e){
		e.printStackTrace();
		subList = new JSONObject();
		
		subList.put("code", "E001");
		subList.put("msg", e.getMessage());
		subList.put("resname", "");
		
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(subList.toString());
		
	} finally {
		dbConn.close();
	}
	
%>