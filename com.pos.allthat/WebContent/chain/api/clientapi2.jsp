<%@page import="java.util.Date"%>

<%@page import="org.apache.commons.*"%>
<%@page import="java.util.concurrent.TimeUnit"%>
<%@page contentType="text/html;charset=utf-8" import="java.sql.*" import="java.io.*"  import="java.text.*" import="java.util.*" %>
<%@page import="org.codehaus.jettison.json.JSONArray"%>
<%@page import="org.codehaus.jettison.json.JSONObject"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ include file="dbinfo.jsp" %>
<%@ include file="apifnc2.jsp" %>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.net.URLDecoder"%>

<%

response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin")); 
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
response.setHeader("Access-Control-Max-Age", "3600");
response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With, remember-me");
response.setHeader("Content-Type", "application/json");
response.setHeader("Accept", "application/json");

	request.setCharacterEncoding("utf-8");
	
	String reqGubn = ""; //통신명
	String tid = ""; // 
	String serialno = ""; // 기기serial
	String devicenumber = "";
	String apicode ="";
	
	String chaincode ="";
	
	Connection dbConn = null;
	JSONObject resultValue = null;
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
		System.out.println("---------pos---clientapi("+str+")----------------");
		
		while(params.hasMoreElements()) {
		  String reqname = (String) params.nextElement();
		  System.out.println(reqname + " : " + request.getParameter(reqname) + "     "); 
		}
		
		System.out.println("---------pos---clientapi(param End)----------------");
		
		/* Json Data */
		String code = "";
		String msg ="";
		
		
		/* 사업자정보 */
		String corporatenumber = "";
		String userid = "";
		String passwd = "";
		String compcd = "";
		
		reqGubn = request.getParameter("reqGubn");	
		tid = request.getParameter("tid");
		serialno =  request.getParameter("serialno");
		corporatenumber = request.getParameter("corporatenumber");
		
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
		
		if(serialno == null || serialno.equals("")){
			
			subList = new JSONObject();
			subList.put("resname", reqGubn);
			subList.put("code","E003");
			subList.put("msg","POS 단말기의 일련번호가 없습니다.");
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			return;
		}
		
		/* 1:사업자 인증(사업자번호 , TID, 일련번호) 
		    rqgGubn : bizcheck
			req : 
				  corporatenumber : varchar2(20)
		          tid : varchar2(100)
		          serialno : varchar2(100) 
		    res : jsonobject
		          resname : 호출함수명 
		          code    : 정상(0000) , 에러(에러코드)
		          msg     : 정상(공백) , 에러(에러메세지)
		*/
		
		if(reqGubn.equals("bizcheck")){
			
			String compCheck = CompanyCheck(dbConn,corporatenumber,tid,serialno); 
			
			subList = new JSONObject();
			
			if(compCheck.equals("Y")){
				subList.put("resname",reqGubn);
				subList.put("code", "0000");
				subList.put("msg", "");
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
	
			}else{
				subList.put("resname",reqGubn);
				subList.put("code", "E004");
				subList.put("msg", "등록된 가맹점이 아닙니다.(가맹점 등록 여부,tid,serial 번호가 맞는지 확인하세요.)");
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
			}
		}		
		
		/* 1-1:로그인(사업자번호 , 사용자ID , 비밀번호) 
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
	        	  	       
  	     compcd = getCompcd(dbConn,corporatenumber);
 		
  	   if(compcd.length()<10){
			
			subList = new JSONObject();
			
			code = "E999";
			msg="가입되지 않은 거래처입니다.";
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("data", subData);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}else{
			
	  	    chaincode = getChaincode(dbConn,compcd); 
		        	  	       
			/* 2:사용자 목록(사업자번호 , tid , serialno) 
		    rqgGubn : login
			req : 
				  corporatenumber : varchar2(20)
				  tid : varchar2(20)
				  serialno : varchar2(20) 
		    res : jsonobject
		          resname    : 호출함수명 
		          code       : 정상(0000) , 에러(에러코드)
		          msg        : 정상(공백) , 에러(에러메세지)
		          data(JSONArray) : 판매자 변경시 사용
		        	  	       userseq : varchar2(20) : 사용자코드
		        	  	       userid  : varchar2(20) : 사용자아이디
		        	  	       name    : varchar2(20) : 사용자명
			*/
			
	  	   if(reqGubn.equals("userlist")){
				
				subList = new JSONObject();
				
				subData = UserList(dbConn,compcd);   
				
				code = "0000";
				msg="";
				
				subList.put("resname",reqGubn);
				subList.put("code", code);
				subList.put("msg", msg);
				subList.put("data", subData);
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
				
			}
			
			/* 3. GateWay, AOS POS 상품 조회 
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
			
			/* 상품정보(바코드,상품명) */
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
			
			/* 상품조회 : 상품명 */
			
			if(reqGubn.equals("productinfo2")){
				
				subList = new JSONObject();
				
				if(productname!="" && productname!=null){
					
					productname = URLDecoder.decode(productname, "UTF-8");
					
					subData = getProductInfoList2(dbConn,compcd,chaincode,productname); 
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
			
			/* 5. 상품 등록,수정 
		    rqgGubn : productins
			req : 
				    corporatenumber : varchar2(20)
		            tid : varchar2(20)
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
	  				price		    : integer : 단가
	  				stock           : integer : 재고
	 				appropriatestock: integer : 적정재고
		    res : jsonobject
		          resname    : 호출함수명 
		          code       : 정상(0000) , 에러(에러코드)
		          msg        : 정상(공백) , 에러(에러메세지)
			*/
			
			String maker = "";
	  		String size = "";
			String unit = "";
			String spec = "";
			String packingunit = "";
			String stock = "";
			String appstock = "";
			String price = "";
			String salesprice = "";
			
			
			
			if(reqGubn.equals("productins")){
				
				productid = request.getParameter("productid");
				productcd = request.getParameter("productcd");
				barcode = request.getParameter("barcode");
				productname = request.getParameter("productname");
		  		
				productname = URLDecoder.decode(productname, "UTF-8") ;
				
				maker = request.getParameter("maker");
				if(maker==null) maker ="";
				
				maker = URLDecoder.decode(maker, "UTF-8") ;
				
		  		size = request.getParameter("size");
		  		if(size==null) size ="";
				
		  		unit = request.getParameter("unit");
		  		if(unit==null) unit ="";
				
		  		spec = request.getParameter("spec");
		  		if(spec==null) spec ="";
				
		  		packingunit = request.getParameter("packingunit");
		  		if(packingunit==null) packingunit ="";
				
		  		stock = request.getParameter("stock");
		  		if(stock==null) stock ="";
				
		  		appstock = request.getParameter("appstock");
		  		if(appstock==null) appstock ="";
				
		  		price = request.getParameter("price");
		  		if(price==null) price ="";
				
		  		salesprice = request.getParameter("salesprice");
		  		if(salesprice==null) salesprice ="";
				
				subList = new JSONObject();
				
				if(barcode!="" && barcode!=null && productid!=null && productid!=null){
					
					String pdcd = setProductInfoIns(dbConn,compcd,chaincode,productid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,salesprice,stock,appstock);  
					
					if(!pdcd.equals("FAIL")){
						code = "0000";
						msg = "";
					}else{
						code = "E008";
						msg = "상품등록중 장애가 발생하였습니다.";
					}
									
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
			
			String name= request.getParameter("name");
			
			String hp = request.getParameter("hp");
			String sex = request.getParameter("sex");
			String birthday = request.getParameter("birthday");
			
			if(name==null) name="";
			if(hp==null) hp="";
			if(sex==null) sex="";
			if(birthday==null) birthday="";
			
			/* 5. 고객정보조회 
			rqgGubn : customerinfo
			req : 
				    corporatenumber : varchar2(20)
		            compcd          : varchar2(20) : 가맹점코드
		    res : jsonobject
		          resname    : 호출함수명 
		          code       : 정상(0000) , 에러(에러코드)
		          msg        : 정상(공백) , 에러(에러메세지)
		          compcd     : varchar2(20) : 가맹점코드
				  data(JSONArray) : 
		        	  				custcd       : varchar2(20) : 고객코드
		        	  				hp       : varchar2(20) : 휴대폰번호
		        	  				name         : varchar2(20) : 이름
		        	  				birthday     : varchar2(20) : 생년월일
		        	  				sex           : varchar2(20) : 성별
		        	  				
			*/
			if(reqGubn.equals("customerinfo")){
				
				subList = new JSONObject();
				
				name= URLDecoder.decode(name, "UTF-8");
				
				System.out.println("===name==="+name);
				
				subData = getCustInfoList(dbConn,compcd,name,hp);  
				
				code = "0000";
				msg = "";
				subList.put("resname",reqGubn);
				subList.put("code", code);
				subList.put("msg", msg);
				subList.put("data", subData);
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
				
				
			}
			
			/* 5-1. 고객별 구매정보 
			rqgGubn : customersales
			req : 
				    corporatenumber : varchar2(20)
		            compcd          : varchar2(20) : 가맹점코드
		            hp              : varchar2(20) : 휴대폰
		            birthday        : varchar2(20) : 생년월일
		            sex             : varchar2(20) : 성별
		    res : jsonobject
		          resname         : 호출함수명 
		          code            : 정상(0000) , 에러(에러코드)
		          msg             : 정상(공백) , 에러(에러메세지)
		          compcd          : varchar2(20) : 가맹점코드
		          custcd          : varchar2(20) : 고객코드
		          hp              : varchar2(20) : 휴대폰
		          birthday        : varchar2(20) : 생년월일
		          sex             : varchar2(20) : 성별
		          name            : varchar2(20) : 이름
		    	  data(JSONArray) : 
		        	  				sdate       : varchar2(20) : 구매일시
		        	  				productcd   : varchar2(20) : 제품코드
		        	  				productname : varchar2(20) : 제품명
		        	  				spec        : varchar2(20) : 규격
		        	  				unit        : varchar2(20) : 단위
		        	  				maker       : varchar2(20) : 제조사
		        	  				price       : varchar2(20) : 단가
		        	  				cnt         : varchar2(20) : 수량
		        	  				discount    : varchar2(20) : 할인가
		        	  				amt         : varchar2(20) : 구매가
			*/
			
			if(reqGubn.equals("customersales")){
				
				if(hp==null || hp.equals("") || sex==null || sex.equals("") || birthday==null || birthday.equals("")){
					
					code = "E009";
					msg = "고객 확인 정보가 없습니다.";
					
				}else{
					
					subList = new JSONObject();
					subData = getCustSalesList(dbConn,compcd,hp,sex,birthday);
				
					code = "0000";
					msg = "";
				
				}	
				subList.put("resname",reqGubn);
				subList.put("code", code);
				subList.put("msg", msg);
				subList.put("data", subData);
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
			
			}
			
			/*5-2. 고객 등록/수정 
			rqgGubn : customerinfo
			req : 
				    corporatenumber : varchar2(20)
		            hp       : varchar2(20) : 휴대폰번호
	  				name         : varchar2(20) : 이름
	  				birthday     : varchar2(20) : 생년월일
	  				sex           : varchar2(20) : 성별
		    res : jsonobject
		          resname    : 호출함수명 
		          code       : 정상(0000) , 에러(에러코드)
		          msg        : 정상(공백) , 에러(에러메세지)
		        	  				
			*/
			
			String visitdate="";
			String visittime="";
			
			visitdate = request.getParameter("visitdate");
			visittime = request.getParameter("visittime");
			
			if(visitdate==null) visitdate="";
			if(visittime==null) visittime="";
			
			if(reqGubn.equals("customerins")){
				
				if(compcd!="" && name!="" && hp!="" && sex!="" && birthday!="" && visitdate!="" && visittime!=""  ){
	
					subList = new JSONObject();
					
					name= URLDecoder.decode(name, "UTF-8") ;
					
					System.out.println("==name=="+name);
					
			 		int custCnt = setCustIns(dbConn,compcd,name,hp,sex,birthday,visitdate,visittime); 
					
					if(custCnt>0){
						code = "0000";
						msg = "";
					}else{
						code = "E0010";
						msg = "고객 등록중 장애가 발생하얐습니다.";
					}
					
				}else{
					code = "E0010";
					msg = "고객 등록중 누릭된 정보가 존재합니다.";
				}
				
				
				subList.put("resname",reqGubn);
				subList.put("code", code);
				subList.put("msg", msg);
				subList.put("data", subData);
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
				
				
			}
			
			/* 8. 판매+결제정보 
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
					productlist[
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
					
					
					compcd = getCompcd(dbConn,JsonObject.getString("corporatenumber"));
					
					System.out.println("compcd="+compcd);
				
					auth_no = JsonObject.getString("p_auth_no");
					auth_date = JsonObject.getString("p_auth_date");
					auth_time = JsonObject.getString("p_auth_time");
					
					org_auth_no = JsonObject.getString("p_org_auth_no");
					org_auth_date = JsonObject.getString("p_org_auth_date");
					org_auth_time = JsonObject.getString("p_org_auth_time");
					paygubn = JsonObject.getString("p_pay_gubn");
					
					int salescancnt = 0;
					
					salescancnt = setSalesCanData(dbConn,compcd,salesseq,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn);     
					
					if(salescancnt>0){
						code = "0000";
						msg="";
					}else{
						code = "E0120"; 
						msg="중복된 판매번호 입니다.";
					}
					
					subList.put("resname",reqGubn); 
					subList.put("code", code);
					subList.put("msg", msg);
					
					
				}else{ // 승인
					/*
					D1 : 신용승인
					B1 : 현금영수증 승인
					B3 : 자진발급 승인
					AB : 제로페이 승인
					Q1 : 현금수납 승인
					J1 : 현금IC 승인
					A1 : 알리페이 승인
					A3 : 위챗페이 승인
					A5 : 카카오페이 승인
					A7 : 앱카드 승인
					*/
					System.out.println("compcd>>>>>>>>>>="+JsonObject.getString("corporatenumber"));
					
					compcd = getCompcd(dbConn,JsonObject.getString("corporatenumber"));
					
					System.out.println("compcd>>>>>>>>>>="+compcd);
					
					hp = JsonObject.getString("hp");
					birthday = JsonObject.getString("birthday");
					sex = JsonObject.getString("sex");
					name = JsonObject.getString("name");
					
					name = URLDecoder.decode(name, "UTF-8");
					
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
				        
				        productidval[i] = product_info.getString("p_productid");; // 대표코드
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
						salesvatval[i] = product_info.getString("p_vat"); // 부가세
						sizeval[i] = "";
						unitval[i] = "";
						specval[i] = "";

					}
					
					if(vancd == null || vancd.equals("")){
						vancd="V01";
					}

					int salescnt = setSalesData(dbConn,compcd,chaincode,salesseq,paymethod,cardno,tid,hp,birthday,sex,name,auth_date,auth_time,org_auth_no,org_auth_date,prescription, 
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
					
					subList.put("resname",reqGubn); 
					subList.put("code", code);
					subList.put("msg", msg);
					
				}
				
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write(subList.toString());
				
			}
			
			/* 9. 판매데이터 취소용 */
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
			
			/* 10. 제품 최고,최저가 구하기 */
			if(reqGubn.equals("getBarcodePriceInfo")){
				
				barcode = request.getParameter("barcode");
				
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
			
		/* 11. 세트상품 등록  
		    rqgGubn : setproductins
			req : 
				    corporatenumber : varchar2(20)
		            compcd          : varchar2(20) : 가맹점코드
		            setname         : varchar2(20) : 세트상품명
		            data(JSONArray) : 
		  				productid      : varchar2(20) : 제품코드
		  				productcd      : varchar2(20) : 제품코드
		  				price          : integer : 
		  				discount       : integer : 
		  				cnt            : integer : 
		  				amt            : integer : 
		    res : jsonobject
		          resname       : 호출함수명 
		          code          : 정상(0000) , 에러(에러코드)
		          msg           : 정상(공백) , 에러(에러메세지)
		          setcode       : varchar2(20) : 세트상품코드
		*/
		if(reqGubn.equals("setproductins")){
			
			String setname = "";
			String setprice="";
			String setdiscount="";
			String setamt="";
			
			String setins="";
			
			String productlist="";
			
			setins = request.getParameter("setins");
			
			System.out.println("setins="+setins);
			
			
			JSONTokener tokener1 = new JSONTokener(setins);
	        JSONObject JsonObject1 = new JSONObject(tokener1);
			
	        setname = JsonObject1.getString("setname");
	        setprice = JsonObject1.getString("setprice");
	        setdiscount = JsonObject1.getString("setdiscount");
	        setamt = JsonObject1.getString("setamt");
	        productlist = JsonObject1.getString("productlist");
	        
	        System.out.println("=setname="+setname);
	        System.out.println("=setprice="+setprice);
	        System.out.println("=setdiscount="+setdiscount);
	        System.out.println("=setamt="+setamt);
	        System.out.println("=prodlist="+productlist);
	        
	        
	        JSONArray productArray1 = (JSONArray) new JSONTokener(productlist).nextValue();
			
			int product1ArrayCnt = productArray1.length();
			
			System.out.println("product1ArrayCnt="+product1ArrayCnt);
			
			String productInfoArr1 = null;
			String p_product_code = null;
			String p_barcode = null;
			
			System.out.println("salesseq="+salesseq);
			System.out.println("product="+product);
				
			String[] prodval = null;
			prodval = new String[product1ArrayCnt];
	
			String[] priceval = null;
			priceval = new String[product1ArrayCnt];
			
			String[] discountval = null;
			discountval = new String[product1ArrayCnt];
			
			String[] amtval = null;
			amtval = new String[product1ArrayCnt];
	
			String[] cntval = null;
			cntval = new String[product1ArrayCnt];
			
			for(int i=0;i<product1ArrayCnt;i++){
	
				productInfoArr1 = String.valueOf(productArray1.get(i));
				
				JSONTokener p_product_info1 = new JSONTokener(productInfoArr1);
		        JSONObject product_info1 = new JSONObject(p_product_info1);
		        
		        prodval[i] = product_info1.getString("productcd"); // 제품코드
		        priceval[i] = product_info1.getString("price"); // 단가
		        discountval[i] = product_info1.getString("discount"); // 할인가
		        amtval[i] = product_info1.getString("amt"); // 판매가
		        cntval[i] = product_info1.getString("cnt"); // 수량
		        
			}
			
	        
			for(int j=0;j<product1ArrayCnt;j++){
				
				System.out.println("prodval===="+prodval[j]);
				System.out.println("priceval===="+priceval[j]);
				System.out.println("discountval===="+discountval[j]);
				System.out.println("amtval===="+amtval[j]);
				System.out.println("cntval===="+cntval[j]);
				
			}
			
			
			String setcode = "";
			
			setcode = setSetProductData(dbConn,compcd,setname,setprice,setdiscount,setamt,prodval,priceval,discountval,amtval,cntval);    
			
			subList = new JSONObject();
			
			if(setcode!=null && setcode.length()>3){
				
				code = "0000";
				msg = "";
								
			}else{
				code = "E007";
				msg = "세트상품등록중 장애가 발생하였습니다.";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("setcode", setcode);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		
		/* 11-1. 세트상품 수정  
		    rqgGubn : setproductins
			req : 
				    corporatenumber : varchar2(20)
		            compcd          : varchar2(20) : 가맹점코드
		            setname         : varchar2(20) : 세트상품명
		            data(JSONArray) : 
		  				productid      : varchar2(20) : 제품코드
		  				productcd      : varchar2(20) : 제품코드
		  				price          : integer : 
		  				discount       : integer : 
		  				cnt            : integer : 
		  				amt            : integer : 
		    res : jsonobject
		          resname       : 호출함수명 
		          code          : 정상(0000) , 에러(에러코드)
		          msg           : 정상(공백) , 에러(에러메세지)
		          setcode       : varchar2(20) : 세트상품코드
		*/
		if(reqGubn.equals("setproductupd")){
		
		String setcode = "";
		String setname = "";
		String setprice="";
		String setdiscount="";
		String setamt="";
		
		String setins="";
		
		String productlist="";
		
		setins = request.getParameter("setins");
		
		System.out.println("setins="+setins);
		
		
		JSONTokener tokener1 = new JSONTokener(setins);
	    JSONObject JsonObject1 = new JSONObject(tokener1);
		
	    setcode = JsonObject1.getString("setcode");
	    setname = JsonObject1.getString("setname");
	    setprice = JsonObject1.getString("setprice");
	    setdiscount = JsonObject1.getString("setdiscount");
	    setamt = JsonObject1.getString("setamt");
	    productlist = JsonObject1.getString("productlist");
	    
	    System.out.println("=setcode="+setcode);
	    System.out.println("=setname="+setname);
	    System.out.println("=setprice="+setprice);
	    System.out.println("=setdiscount="+setdiscount);
	    System.out.println("=setamt="+setamt);
	    System.out.println("=prodlist="+productlist);
	    
	    
	    JSONArray productArray1 = (JSONArray) new JSONTokener(productlist).nextValue();
		
		int product1ArrayCnt = productArray1.length();
		
		System.out.println("product1ArrayCnt="+product1ArrayCnt);
		
		String productInfoArr1 = null;
		String p_product_code = null;
		String p_barcode = null;
		
		System.out.println("salesseq="+salesseq);
		System.out.println("product="+product);
			
		String[] prodval = null;
		prodval = new String[product1ArrayCnt];
	
		String[] priceval = null;
		priceval = new String[product1ArrayCnt];
		
		String[] discountval = null;
		discountval = new String[product1ArrayCnt];
		
		String[] amtval = null;
		amtval = new String[product1ArrayCnt];
	
		String[] cntval = null;
		cntval = new String[product1ArrayCnt];
		
		for(int i=0;i<product1ArrayCnt;i++){
	
			productInfoArr1 = String.valueOf(productArray1.get(i));
			
			JSONTokener p_product_info1 = new JSONTokener(productInfoArr1);
	        JSONObject product_info1 = new JSONObject(p_product_info1);
	        
	        prodval[i] = product_info1.getString("productcd"); // 제품코드
	        priceval[i] = product_info1.getString("price"); // 단가
	        discountval[i] = product_info1.getString("discount"); // 할인가
	        amtval[i] = product_info1.getString("amt"); // 판매가
	        cntval[i] = product_info1.getString("cnt"); // 수량
	        
		}
		
	    
		for(int j=0;j<product1ArrayCnt;j++){
			
			System.out.println("prodval===="+prodval[j]);
			System.out.println("priceval===="+priceval[j]);
			System.out.println("discountval===="+discountval[j]);
			System.out.println("amtval===="+amtval[j]);
			System.out.println("cntval===="+cntval[j]);
			
		}
		
		int setcnt = 0;
		
		setcnt = setSetProductUpdate(dbConn,compcd,setcode,setname,setprice,setdiscount,setamt,prodval,priceval,discountval,amtval,cntval);    
		
		subList = new JSONObject();
		
		if(setcnt>0){
			
			code = "0000";
			msg = "";
							
		}else{
			code = "E007";
			msg = "세트상품 수정중 장애가 발생하였습니다.";
		}
		
		subList.put("resname",reqGubn);
		subList.put("code", code);
		subList.put("msg", msg);
		subList.put("setcode", setcode);
		
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(subList.toString());
		
	}
		
		/* 6-1. 세트조회  
		    rqgGubn : setproductinfo
			
		*/
		if(reqGubn.equals("getSetInfo")){
			
			subList = new JSONObject();
			
			subData = getSetInfoList(dbConn,compcd);    
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("JSON", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 6-1. 세트상품조회  
	    rqgGubn : setproductinfo
		
	*/
		if(reqGubn.equals("getSetProductInfo")){
			
		    String setcode = "";
	
		    setcode = request.getParameter("setcode");
		    
			subList = new JSONObject();
	
			if(setcode!=null && setcode!=""){
				subData = getSetProductList(dbConn,compcd,setcode);
				code = "0000";
				msg="";
		    }else{
				code = "E0200";
				msg="세트코드가 없습니다";
		    }
			
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("JSON", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());		
			
			
		}
	
		
		/* 7. 다빈도 등록  
		    rqgGubn : dabindoins
			req : 
				    corporatenumber : varchar2(20)
				    title         : varchar2(20) : 타이틀
					num            : integer      : 타이틀 순번
					productcd       : varchar2(20) : 제품코드
		            setcode         : varchar2(20) : 세트코드
		            subnum            : integer      : 페이징내순번
			
			res : jsonobject
		         resname       : 호출함수명 
		         code          : 정상(0000) , 에러(에러코드)
		         msg           : 정상(공백) , 에러(에러메세지)
		         dabindocd        : varchar2(20) : 가맹점코드
			     data(JSONArray) : 
				  				productcd      : varchar2(20) : 제품코드
				  				setcode        : varchar2(20) : 세트제품코드
				  		
		*/
		if(reqGubn.equals("dabinins")){
			
			String dabindocd = "";
			String title = "";
			String num ="";
			String dabinpdcd = "";
			
			productcd ="";
			String setcode = "";
			
			String subnum = "";
			
			dabindocd = request.getParameter("dabindocd");
			title = request.getParameter("title");
			num = request.getParameter("num");
			productcd = request.getParameter("productcd");
			setcode = request.getParameter("setcode");
			subnum = request.getParameter("subnum");
			dabinpdcd = request.getParameter("dabinpdcd");
			
			productcd = request.getParameter("productcd");
			
			int pcount = 1;
			String pdcd1="";
			
			if(productcd!=null && !productcd.equals("")){
				
				productid = request.getParameter("productid");
				barcode = request.getParameter("barcode");
				productname = request.getParameter("productname");
				maker = request.getParameter("maker");
				if(maker==null) maker="";
				
				packingunit = request.getParameter("packingunit");
				if(packingunit==null) packingunit="1";
				
				price = request.getParameter("price");
				if(price==null) price="0";
				
				stock = request.getParameter("stock");
				if(stock==null) stock="";
				
				appstock = request.getParameter("appstock");
				if(appstock==null) appstock="";
				
				spec = request.getParameter("spec");
				if(spec==null) spec="";
				
				unit = request.getParameter("unit");
				if(unit==null) unit="";
				
				size = request.getParameter("size");
				if(size==null) size="";
				
				String purprice = request.getParameter("purprice");
				
				if(purprice==null) purprice="";
		
				/* 상품 등록,수정 */
				
				if(barcode!="" && barcode!=null && productid!=null && productid!=null){
					pdcd1 = setProductInfoIns(dbConn,compcd,chaincode,productid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,price,stock,appstock);
					
					productcd = pdcd1;
					
				}else{
					pdcd1="FAIL";
				} 
				
			}
			
			subList = new JSONObject();
			
			if(!pdcd1.equals("FAIL")){
				dabindocd = setSetDabindoData(dbConn,compcd,dabindocd,title,num,productcd,setcode,subnum,dabinpdcd);    
			}
			
			if(dabindocd!=null && dabindocd.length()>3){
				code = "0000";
				msg = "";
			}else{
				code = "E007";
				msg = "다빈도 상품등록중 장애가 발생하였습니다.";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("dabindocd", dabindocd);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			
			
		}
		
		/* 7. 타이틀 수정  */
		if(reqGubn.equals("setdabindotit")){
			
			String dabindocd = "";
			String title = "";
			String num="";
			
			dabindocd = request.getParameter("dabindocd");
			title = request.getParameter("title");
			num = request.getParameter("num");
					
			int dabincnt = setSetDabindoTitle(dbConn,compcd,dabindocd,title,num);      
			
			subList = new JSONObject();
			
			if(dabincnt>0){
				
				code = "0000";
				msg = "";
								
			}else{
				code = "E008";
				msg = "다빈도 타이틀 수정중 장애가 발생하였습니다.";
			}
			
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
		}
		
		/* 7-1. 다빈도 타이틀 조회 및 상품 조회 
		    rqgGubn : getDabindoInfo
		*/
		
		if(reqGubn.equals("getDabindoInfo")){
			
			String dabindocd ="";
			dabindocd = request.getParameter("dabindocd");	
			if(dabindocd==null) dabindocd="";
			
			String num ="";
			num = request.getParameter("num");	
			if(num==null || num.equals("")) num="1";
			
			subList = new JSONObject();
	
			subData = getDabindoList(dbConn,compcd,dabindocd,num);
			
			code = "0000";
			msg="";
		    
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			subList.put("JSON", subData);
		
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());		
			
		}
		
		/* 7-2. 다빈도 삭제  */
		if(reqGubn.equals("deldabindo")){
			
			String dabindocd = "";
			String title = "";
			String setcode ="";
			String subnum ="";
			int delcnt = 0;
			
			dabindocd = request.getParameter("dabindocd");
			productcd = request.getParameter("productcd");
			if(productcd==null) productcd="";
			
			setcode = request.getParameter("setcode");
			if(setcode==null) setcode="";
			subnum =  request.getParameter("subnum");	
			
			delcnt = delDabindo(dbConn,compcd,dabindocd,setcode,productcd,subnum);     
			
			subList = new JSONObject();
		
			if(delcnt>0){
				
				code = "0000";
				msg = "";
								
			}else{
				code = "E007";
				msg = "다빈도 상품 삭제중 장애가 발생하였습니다.";
			}
		
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(subList.toString());
			
			
			
		}
		
		/* 7-3. 다빈도 상품이동  */
		if(reqGubn.equals("setProductchange")){
			
			String productnum="";
			String prodpdArr = null;
			
			productnum = request.getParameter("productnum");
					
			JSONArray prodArray = (JSONArray) new JSONTokener(productnum).nextValue();
			
			int prodArrayCnt = prodArray.length();
			
			System.out.println("product1ArrayCnt="+prodArrayCnt);
			
			String[] prodpdval = null;
			prodpdval = new String[prodArrayCnt];
	
			String[] subnumVal = null;
			subnumVal = new String[prodArrayCnt];
		
			for(int i=0;i<prodArrayCnt;i++){
	
				prodpdArr = String.valueOf(prodArray.get(i));
				
				JSONTokener p_product_info1 = new JSONTokener(prodpdArr);
		        JSONObject product_info1 = new JSONObject(p_product_info1);
		        
		        prodpdval[i] = product_info1.getString("dabinpdcd"); // 상품위치코드
		        subnumVal[i] = product_info1.getString("subnum"); // 상품위치
	
			}
			
			for(int j=0;j<prodArrayCnt;j++){
				
				System.out.println("prodval===="+prodpdval[j]);
				System.out.println("priceval===="+subnumVal[j]);
				
			}
			
			int setprodsubnum=0;
			
			subList = new JSONObject();
			
			 setprodsubnum = setProdChange(dbConn,compcd,prodpdval,subnumVal,prodArrayCnt);    
			
			if(setprodsubnum>0){
				
				code = "0000";
				msg = "";
								
			}else{
				code = "E011";
				msg = "다빈도 상품 이동중 장애가 발생하였습니다.";
			}
		
			subList.put("resname",reqGubn);
			subList.put("code", code);
			subList.put("msg", msg);
			
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
		
		String compconfig = request.getParameter("compconfig"); 
		String retomeip = request.getParameter("retomeip"); 
		
		if(compconfig==null) compconfig="";
		if(retomeip==null) retomeip="";
		
		if(reqGubn.equals("configsave")){
			
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
		
		if(reqGubn.equals("configinfo")){
			
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

	}	
		
	}catch(Exception e){
		e.printStackTrace();
		response.setContentType("application/json;charset=UTF-8");
	} finally {
		dbConn.close();
	}
	
	// System.out.println("\n>>result:" + subList.toString());
	// System.out.println("----------------------------"); 
%>