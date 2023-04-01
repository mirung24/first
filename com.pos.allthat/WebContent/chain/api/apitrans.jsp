<%@page contentType="text/html;charset=utf-8" import="java.sql.*"
	import="java.io.*" import="java.text.*" import="java.util.*"%>
<%@page import="java.sql.SQLException"%>
<%@ page import = "java.util.Calendar" %>
<%@page import="org.codehaus.jettison.json.JSONArray"%>
<%@page import="org.codehaus.jettison.json.JSONObject"%>
<%@page import="org.codehaus.jettison.json.JSONTokener"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.json.simple.*"%>
<%@page import="org.json.simple.parser.JSONParser"%>
<%@page import="org.json.simple.parser.ParseException"%>
<%@page contentType="text/html;charset=utf-8" import="java.sql.*" import="java.io.*"  import="java.text.*" import="java.util.*" %>

<%!public Connection getDBConnection(String url, String user, String passwd) throws Exception {
	
		Connection con = null;
		Class.forName("com.mysql.jdbc.Driver").newInstance();
		con = DriverManager.getConnection(url, user, passwd);
		return con;
	}
	
	public Connection getDBConnection2(String url, String user, String passwd) throws Exception {
		
		Connection con = null;
		Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
		con = DriverManager.getConnection(url, user, passwd);
		return con;
	}

	// set pharmpost disconnection
	public void setDisDBConnection(Connection con) throws Exception {
		if (con != null) {
			con.close();
		}
	}
	
	public JSONObject setErrorMessage(String errorCode, String errorMsg) throws Exception {

		JSONObject master = new JSONObject();
		master.put("rescode", errorCode);
		master.put("resmsg", errorMsg);
		JSONObject returnValue = new JSONObject();
		returnValue.put("master", master);
		return returnValue;
	}
	
	/*
 	용도 : 데이타 이관 쿼리 : 판매,결제
	작성자 : jerry
	작성일 : 2023.01030
	*/
	public void setTransData2(Connection con,Connection con2,String sdate,String edate) throws Exception {
		
		System.out.println("============================sdate================="+sdate);
		
		Statement stmt = null;
		PreparedStatement pstmt = null;
		PreparedStatement pstmt2 = null;
		
		ResultSet rs = null;
		String sql = null;
		String sql2 = null;
		String sql3 = null;
		
		sql = new String();
		sql2 = new String();
		sql3 = new String();
		
		int rescnt = 0;
		
		sql =( " SELECT  ");
		sql =sql + ("		S.busi_no compcd, ");
		sql =sql + ("		S.id salescd, ");
		sql =sql + ("		S.reg_dttm salesdate, ");
		sql =sql + ("		S.sales_date salesday, ");
		sql =sql + ("		S.sales_time salestime, ");
		sql =sql + ("		case when replace(S.product_code,' ','') is null then S.barcode when S.product_code='' then S.barcode when S.product_code=' ' then S.barcode else S.product_code end productcd, ");
		sql =sql + ("		S.pay_method pay_method, ");
		sql =sql + ("		S.sales_cnt cnt, ");
		sql =sql + ("		S.sales_price price, ");
		sql =sql + ("		S.discount_price discount, ");
		sql =sql + ("		S.total_price amt, ");
		sql =sql + ("		0 vat, ");
		sql =sql + ("		S.total_price total, ");
		sql =sql + ("		S.gender sex, ");
		sql =sql + ("		'' hp, ");
		sql =sql + ("		case when replace(S.product_code,' ','') is null then S.barcode when S.product_code='' then S.barcode when S.product_code=' ' then S.barcode else S.product_code end productid, ");
		sql =sql + ("		S.u_id paymentcd, ");
		sql =sql + ("		S.birth_year birth_year, ");
		sql =sql + ("		S.purchase_price purprice, ");
		sql =sql + ("		SUBSTRING(S.sales_time, 1, 2) salesti ");
		sql =sql + ("		FROM atpos_sales S ");
		sql =sql + ("		WHERE S.barcode IS NOT NULL and S.sales_date between '"+ sdate +"' and '"+ edate +"' ");
		
		System.out.println("sql:판매내역 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		sql2 =( " insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,productid,paymentcd,productsid,birth_year,purprice,salesti) ");
		sql2 =sql2 + (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update upddt = now() ");
		
		pstmt = con2.prepareStatement(sql2.toString());
		
		while (rs.next() && rs != null) {
			
			pstmt.setString(1,"CTR"+rs.getString("compcd"));
			pstmt.setString(2,rs.getString("salescd"));
			pstmt.setString(3,rs.getString("salesdate"));
			pstmt.setString(4,rs.getString("salesday"));
			pstmt.setString(5,rs.getString("salestime"));
			pstmt.setString(6,rs.getString("productid"));
			pstmt.setString(7,rs.getString("pay_method"));
			pstmt.setString(8,rs.getString("cnt"));
			pstmt.setString(9,rs.getString("price"));
			pstmt.setString(10,rs.getString("discount"));
			pstmt.setString(11,rs.getString("amt")); 
			pstmt.setString(12,rs.getString("vat")); 
			pstmt.setString(13,rs.getString("total")); 
			pstmt.setString(14,rs.getString("sex")); 
			pstmt.setString(15,rs.getString("hp")); 
			pstmt.setString(16,rs.getString("productid")); 
			pstmt.setString(17,rs.getString("paymentcd")); 
			pstmt.setString(18,"PSI"+rs.getString("productid"));
			pstmt.setString(19,rs.getString("birth_year")); 
			pstmt.setString(20,rs.getString("purprice")); 
			pstmt.setString(21,rs.getString("salesti")); 
			
			rescnt = rescnt+pstmt.executeUpdate();
			
		}
		
		System.out.println("sql:판매내역 등록 rescnt="+rescnt);
		
		sql =null;
		pstmt = null;
		sql2 = null;
		rs = null;
		
		/* 결제 등록 */
		sql =( " SELECT ");
		sql = sql +( " T.busi_no compcd, ");
		sql = sql +( " 	IFNULL(S.u_id, T.id) paymentcd, ");
		sql = sql +( " 	(CASE  ");
		sql = sql +( " 			WHEN T.trans_type IN ('credit', 'npg') THEN (CASE ");
		sql = sql +( " 					WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A1' ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A3' ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A5' ");
		sql = sql +( " 					WHEN T.app_card='O' THEN 'A7' ");
		sql = sql +( " 				ELSE 'D1' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 			ELSE (CASE ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A2' ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A4' ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A6' ");
		sql = sql +( " 				WHEN T.app_card='O' THEN 'A8' ");
		sql = sql +( " 				ELSE 'D4' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='cash' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql +( " 				WHEN T.card_num='0100001234' THEN 'B3' ");
		sql = sql +( " 				ELSE 'B1' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 			ELSE (CASE ");
		sql = sql +( " 				WHEN T.card_num='0100001234' THEN 'B4' ");
		sql = sql +( " 				ELSE 'B2' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='coin' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN 'Q1' ");
		sql = sql +( " 			ELSE 'Q2' ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='cashic' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN 'J1' ");
		sql = sql +( " 			ELSE 'J4' ");
		sql = sql +( " 		END) ");
		sql = sql +( " 	END) paymethod, ");
		sql = sql +( " 	T.auth_no auth_no, ");
		sql = sql +( " 	REPLACE(T.run_date, '-', '') auth_date, ");
		sql = sql +( " 	T.run_time auth_time, ");
		sql = sql +( " 	T.org_auth_no org_auth_no, ");
		sql = sql +( " 	(CASE WHEN T.org_trx_date='00000000' THEN '' ELSE T.org_trx_date END) org_auth_date, ");
		sql = sql +( " 	'' org_auth_time, ");
		sql = sql +( " 	(CASE WHEN T.trx_cl_cd='AP' THEN 'ACC' ELSE 'CAN' END) paygubn, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('credit', 'npg') THEN T.won_amt ELSE 0 END) card, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.won_amt ELSE 0 END) money, ");
		sql = sql +( " 	T.otc_amt amt, ");
		sql = sql +( " 	T.tax vat, ");
		sql = sql +( " 	T.won_amt total, ");
		sql = sql +( " 	IFNULL(S.discount_price, 0) discount, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.card_num ELSE 0 END) money_no, ");
		sql = sql +( " 	E.prescription_no prescription_no, ");
		sql = sql +( " 	C.at_card_code cardgubn, ");
		sql = sql +( " 	T.run_hal installments, ");
		sql = sql +( " 	'' salesid, ");
		sql = sql +( " 	'' name, ");
		sql = sql +( " 	E.birth_year birthday, ");
		sql = sql +( " 	E.gender sex, ");
		sql = sql +( " 	'' hp, ");
		sql = sql +( " 	T.trml_no tid, ");
		sql = sql +( " 	E.goods_name productnames, ");
		sql = sql +( " 		T.card_num cardno, ");
		sql = sql +( " 	T.etc_amt etcamt, ");
		sql = sql +( " 	SUBSTRING(T.run_time, 1, 2) auth_ti, ");
		sql = sql +( " 	T.filler trans_filler, ");
		sql = sql +( " 	'V01' vancd, ");
		sql = sql +( " 	T.reg_dttm regdt ");
		sql = sql +( " FROM  ");
		sql = sql +( " ( ");
		sql = sql +( " 	SELECT *  ");
		sql = sql +( " 	FROM allthatpay.trans  ");
		sql = sql +( " 	WHERE 1=1  ");
		sql = sql +( " 	AND run_date BETWEEN '"+ sdate +"' and '"+ edate +"' ");
		sql = sql +( " 	AND van_type IN ('ATP', 'KICC')  AND ret_code='0000' ");
		sql = sql +( " 	AND busi_no IN (SELECT busi_no FROM atpos_users) ");
		sql = sql +( " ) T ");
		sql = sql +( " 	LEFT OUTER JOIN  ");
		sql = sql +( " ( ");
		sql = sql +( " 	SELECT *  ");
		sql = sql +( " 	FROM ( ");
		sql = sql +( " 		SELECT u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no, SUM(discount_price) discount_price, MIN(id) mas_id, COUNT(*) prod_cnt  ");
		sql = sql +( " 		FROM atpos_sales  ");
		sql = sql +( " 		WHERE 1=1  ");
		sql = sql +( " 		AND sales_date BETWEEN '"+ sdate +"' and '"+ edate +"' ");
		sql = sql +( " 		GROUP BY u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no ");
		sql = sql +( " 		) BB ");
		sql = sql +( " ) S ");
		sql = sql +( " ON T.run_date=S.sales_date AND T.busi_no=S.busi_no AND T.trx_cl_cd=S.pay_gubn AND T.auth_no=S.auth_no AND T.filler LIKE CONCAT('%', S.u_id, '%') ");
		sql = sql +( " LEFT OUTER JOIN allthatpay.at_vancard_code C ");
		sql = sql +( " ON T.trans_type NOT IN ('cash', 'coin') AND SUBSTRING(T.purch_code,-2)=C.card_code AND T.van_type=C.van ");
		sql = sql +( " LEFT OUTER JOIN (SELECT * FROM allthatpay.franchisee WHERE 1=1) D ");
		sql = sql +( " ON T.busi_no=D.busi_num ");
		sql = sql +( " LEFT OUTER JOIN atpos_sales E ");
		sql = sql +( " ON S.mas_id=E.id ");
		sql = sql +( " WHERE 1=1 ");
		System.out.println("sql:결제내역 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
	    
		/*
		sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
		sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
		sql2 =sql2 + (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? ) on duplicate key update upddt = now() ");
		*/
		sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
		sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
		sql2 =sql2 + ("  select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? from dual  ");
		sql2 =sql2 + ("  where 0 = ( ");
		sql2 =sql2 + ("  	select count(*) ");
		sql2 =sql2 + ("  	from pos_payment  ");
		sql2 =sql2 + ("  	where compcd=?  ");
		sql2 =sql2 + ("  	      and auth_no=?  ");
		sql2 =sql2 + ("  	      and auth_date=? "); 
		sql2 =sql2 + ("  	      and paygubn=? ");
		sql2 =sql2 + ("  	      and total=? ");
		sql2 =sql2 + ("  	      and auth_time between date_format(adddate(cast(concat(?,?) as datetime), interval - 300 second),'%H%i%s') and date_format(adddate(cast(concat(?,?) as datetime), interval 100 second),'%H%i%s') ");
		sql2 =sql2 + ("  ) ");
		sql2 =sql2 + ("  on duplicate key update upddt = now() ");
		
		
		pstmt = con2.prepareStatement(sql2.toString());
		
		rescnt = 0;
		
		int i=0;
		String name ="";
		
		while (rs.next() && rs != null) {
			i++;
			System.out.println("================="+i);
			System.out.println("================="+rs.getString("paymentcd"));
			
			if(rs.getString("trans_filler") == null || rs.getString("trans_filler").equals("")){
				name="";
			}else{
				
				String aa=rs.getString("trans_filler");
				
				int aa1 = aa.indexOf("*");
				if(aa1>0){
					
				String aa2 = aa.substring(0,aa1);
				
				int aa3 = aa2.lastIndexOf("|");
				
				String aa4 = aa.substring(aa1,aa.length());
				
				int aa5 = aa4.indexOf("|");
				
				String aa6 = aa.substring(aa3+1, aa5+aa3+2);
					name=aa6;
				}else{
					name="";
				}
			
			}
			
			pstmt.setString(1,"CTR"+rs.getString("compcd"));
			pstmt.setString(2,rs.getString("paymentcd"));
			pstmt.setString(3,rs.getString("paymethod"));
			pstmt.setString(4,rs.getString("auth_no"));
			pstmt.setString(5,rs.getString("auth_date"));
			pstmt.setString(6,rs.getString("auth_time"));
			pstmt.setString(7,rs.getString("org_auth_no"));
			pstmt.setString(8,rs.getString("org_auth_date"));
			pstmt.setString(9,rs.getString("org_auth_time"));
			pstmt.setString(10,rs.getString("paygubn"));
			pstmt.setString(11,rs.getString("card")); 
			pstmt.setString(12,rs.getString("money")); 
			pstmt.setString(13,rs.getString("amt")); 
			pstmt.setString(14,rs.getString("vat")); 
			pstmt.setString(15,rs.getString("total")); 
			pstmt.setString(16,rs.getString("discount")); 
			pstmt.setString(17,rs.getString("money_no")); 
			pstmt.setString(18,rs.getString("prescription_no"));
			pstmt.setString(19,rs.getString("cardgubn")); 
			pstmt.setString(20,rs.getString("installments")); 
			pstmt.setString(21,rs.getString("salesid")); 
			pstmt.setString(22,name); 
			pstmt.setString(23,rs.getString("birthday")); 
			pstmt.setString(24,rs.getString("sex")); 
			pstmt.setString(25,rs.getString("hp")); 
			pstmt.setString(26,rs.getString("tid")); 
			pstmt.setString(27,rs.getString("cardno")); 
			pstmt.setString(28,rs.getString("etcamt")); 
			pstmt.setString(29,rs.getString("auth_ti")); 
			pstmt.setString(30,rs.getString("trans_filler")); 
			pstmt.setString(31,rs.getString("vancd")); 
			pstmt.setString(32,rs.getString("productnames")); 
			
			pstmt.setString(33,rs.getString("compcd")); 
			pstmt.setString(34,rs.getString("auth_no")); 
			pstmt.setString(35,rs.getString("auth_date")); 
			pstmt.setString(36,rs.getString("paygubn")); 
			pstmt.setString(37,rs.getString("total")); 
			pstmt.setString(38,rs.getString("auth_date")); 
			pstmt.setString(39,rs.getString("auth_time")); 
			pstmt.setString(40,rs.getString("auth_date")); 
			pstmt.setString(41,rs.getString("auth_time")); 
			
			rescnt = rescnt+pstmt.executeUpdate();
			
		}
		
		System.out.println("sql:결제내역 등록 rescnt="+rescnt);
		
		pstmt = null;
		pstmt2 = null;
		stmt = null;
		sql = null;
		sql2 = null;
		sql3 = null;
			
		if (pstmt != null)
			pstmt.close();
		if (pstmt2 != null)
			pstmt2.close();
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		
		if (sql != null)
			sql = null;
		if (sql2 != null)
			sql2 = null;
		
	}
	
	
	/*
 	용도 : 데이타 이관 쿼리 : 판매,결제 누락건
	작성자 : jerry
	작성일 : 2023.01031
	*/
	public void setTransData3(Connection con,Connection con2,String sdate,String edate) throws Exception {
		
		Statement stmt = null;
		PreparedStatement pstmt = null;
		PreparedStatement pstmt2 = null;
		PreparedStatement pstmt3 = null;
		
		ResultSet rs = null;
		String sql = null;
		String sql2 = null;
		String sql3 = null;
		String sql4 = null;
		
		sql = new String();
		sql2 = new String();
		sql3 = new String();
		sql4 = new String();
		
		int rescnt = 0;
		int rescnt1 = 0;
		
		sql =null;
		pstmt = null;
		sql2 = null;
		rs = null;
		
		/* 결제 등록 */
		sql =( " SELECT ");
		sql = sql +( " T.busi_no compcd, ");
		sql = sql +( " 	S.u_id paymentcd, ");
		sql = sql +( " 	(CASE  ");
		sql = sql +( " 			WHEN T.trans_type IN ('credit', 'npg') THEN (CASE ");
		sql = sql +( " 					WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A1' ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A3' ");
		sql = sql +( " 					WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A5' ");
		sql = sql +( " 					WHEN T.app_card='O' THEN 'A7' ");
		sql = sql +( " 				ELSE 'D1' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 			ELSE (CASE ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A2' ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A4' ");
		sql = sql +( " 				WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A6' ");
		sql = sql +( " 				WHEN T.app_card='O' THEN 'A8' ");
		sql = sql +( " 				ELSE 'D4' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='cash' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql +( " 				WHEN T.card_num='0100001234' THEN 'B3' ");
		sql = sql +( " 				ELSE 'B1' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 			ELSE (CASE ");
		sql = sql +( " 				WHEN T.card_num='0100001234' THEN 'B4' ");
		sql = sql +( " 				ELSE 'B2' ");
		sql = sql +( " 			END) ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='coin' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN 'Q1' ");
		sql = sql +( " 			ELSE 'Q2' ");
		sql = sql +( " 		END) ");
		sql = sql +( " 		WHEN T.trans_type='cashic' THEN (CASE ");
		sql = sql +( " 			WHEN T.trx_cl_cd='AP' THEN 'J1' ");
		sql = sql +( " 			ELSE 'J4' ");
		sql = sql +( " 		END) ");
		sql = sql +( " 	END) paymethod, ");
		sql = sql +( " 	T.auth_no auth_no, ");
		sql = sql +( " 	REPLACE(T.run_date, '-', '') auth_date, ");
		sql = sql +( " 	T.run_time auth_time, ");
		sql = sql +( " 	T.org_auth_no org_auth_no, ");
		sql = sql +( " 	(CASE WHEN T.org_trx_date='00000000' THEN '' ELSE T.org_trx_date END) org_auth_date, ");
		sql = sql +( " 	'' org_auth_time, ");
		sql = sql +( " 	(CASE WHEN T.trx_cl_cd='AP' THEN 'ACC' ELSE 'CAN' END) paygubn, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('credit', 'npg') THEN T.won_amt ELSE 0 END) card, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.won_amt ELSE 0 END) money, ");
		sql = sql +( " 	T.otc_amt amt, ");
		sql = sql +( " 	T.tax vat, ");
		sql = sql +( " 	T.won_amt total, ");
		sql = sql +( " 	IFNULL(S.discount_price, 0) discount, ");
		sql = sql +( " 	(CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.card_num ELSE 0 END) money_no, ");
		sql = sql +( " 	E.prescription_no prescription_no, ");
		sql = sql +( " 	C.at_card_code cardgubn, ");
		sql = sql +( " 	T.run_hal installments, ");
		sql = sql +( " 	'' salesid, ");
		sql = sql +( " 	'' name, ");
		sql = sql +( " 	E.birth_year birthday, ");
		sql = sql +( " 	E.gender sex, ");
		sql = sql +( " 	'' hp, ");
		sql = sql +( " 	T.trml_no tid, ");
		sql = sql +( " 	E.goods_name productnames, ");
		sql = sql +( " 		T.card_num cardno, ");
		sql = sql +( " 	T.etc_amt etcamt, ");
		sql = sql +( " 	SUBSTRING(T.run_time, 1, 2) auth_ti, ");
		sql = sql +( " 	T.filler trans_filler, ");
		sql = sql +( " 	'V01' vancd, ");
		sql = sql +( " 	T.reg_dttm regdt ");
		sql = sql +( " FROM  ");
		sql = sql +( " ( ");
		sql = sql +( " 	SELECT *  ");
		sql = sql +( " 	FROM allthatpay.trans  ");
		sql = sql +( " 	WHERE 1=1  ");
		sql = sql +( " 	AND run_date BETWEEN '"+ sdate +"' and '"+ edate +"' ");
		sql = sql +( " 	AND van_type IN ('ATP', 'KICC') ");
		sql = sql +( " 	AND busi_no IN (SELECT busi_no FROM atpos_users) ");
		sql = sql +( " ) T ");
		sql = sql +( " 	LEFT OUTER JOIN  ");
		sql = sql +( " ( ");
		sql = sql +( " 	SELECT *  ");
		sql = sql +( " 	FROM ( ");
		sql = sql +( " 		SELECT u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no, SUM(discount_price) discount_price, MIN(id) mas_id, COUNT(*) prod_cnt  ");
		sql = sql +( " 		FROM atpos_sales  ");
		sql = sql +( " 		WHERE 1=1  ");
		sql = sql +( " 		AND sales_date BETWEEN '"+ sdate +"' and '"+ edate +"' ");
		sql = sql +( " 		GROUP BY u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no ");
		sql = sql +( " 		) BB ");
		sql = sql +( " ) S ");
		sql = sql +( " ON T.run_date=S.sales_date AND T.busi_no=S.busi_no AND T.trx_cl_cd=S.pay_gubn AND T.auth_no=S.auth_no AND T.filler LIKE CONCAT('%', S.u_id, '%') ");
		sql = sql +( " LEFT OUTER JOIN allthatpay.at_vancard_code C ");
		sql = sql +( " ON T.trans_type NOT IN ('cash', 'coin') AND SUBSTRING(T.purch_code,-2)=C.card_code AND T.van_type=C.van ");
		sql = sql +( " LEFT OUTER JOIN (SELECT * FROM allthatpay.franchisee WHERE 1=1) D ");
		sql = sql +( " ON T.busi_no=D.busi_num ");
		sql = sql +( " LEFT OUTER JOIN atpos_sales E ");
		sql = sql +( " ON S.mas_id=E.id ");
		sql = sql +( " WHERE 1=1 and S.u_id is null ");
		System.out.println("sql:결제내역 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
		sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
		sql2 =sql2 + (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? ) on duplicate key update upddt = now() ");
		
		pstmt = con2.prepareStatement(sql2.toString());
		
		/*
		sql3 = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
		sql3 =  sql3 + (" select compcd ,fn_getuuid('SAL'),cast(auth_date as date),auth_date,auth_time,'ALLTAHT9999999999',paymethod,'1',etcamt,'0', ");
		sql3 = sql3 +  ("  0,0,etcamt,sex,hp,'','ALLTAHT9999999999', etcamt ,paymentcd,'ALLTAHT9999999999',birthday, substr(auth_time,1,2) from pos_payment where compcd=? and paymentcd=? ");
		
		System.out.println("sql:제품 판매(ETC  등록) 등록="+sql3.toString());

		pstmt2 = con2.prepareStatement(sql3.toString());
		
		
		sql4 = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
		sql4 = sql4 + (" select compcd ,fn_getuuid('SAL'),cast(auth_date as date),auth_date,auth_time,'TNS9999999999',paymethod,'1',amt,discount, ");
		sql4 = sql4 +  ("  amt,vat,total,sex,hp,'','TNS9999999999','0' etcamt ,paymentcd,'SNS9999999999',birthday, substr(auth_time,1,2) from pos_payment where compcd=? and paymentcd=? ");
		
		System.out.println("sql:제품 판매(미등록 판매) 등록="+sql3.toString());

		pstmt3 = con2.prepareStatement(sql4.toString()); 
		*/
		
		int i=0;
		int j=0;
		
		while (rs.next() && rs != null) {
			i++;
			
			// System.out.println("================="+rs.getString("paymentcd"));
			
			pstmt.setString(1,"CTR"+rs.getString("compcd"));
			pstmt.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
			pstmt.setString(3,rs.getString("paymethod"));
			pstmt.setString(4,rs.getString("auth_no"));
			pstmt.setString(5,rs.getString("auth_date"));
			pstmt.setString(6,rs.getString("auth_time"));
			pstmt.setString(7,rs.getString("org_auth_no"));
			pstmt.setString(8,rs.getString("org_auth_date"));
			pstmt.setString(9,rs.getString("org_auth_time"));
			pstmt.setString(10,rs.getString("paygubn"));
			pstmt.setString(11,rs.getString("card")); 
			pstmt.setString(12,rs.getString("money")); 
			pstmt.setString(13,rs.getString("amt")); 
			pstmt.setString(14,rs.getString("vat")); 
			pstmt.setString(15,rs.getString("total")); 
			pstmt.setString(16,rs.getString("discount")); 
			pstmt.setString(17,rs.getString("money_no")); 
			pstmt.setString(18,rs.getString("prescription_no"));
			pstmt.setString(19,rs.getString("cardgubn")); 
			pstmt.setString(20,rs.getString("installments")); 
			pstmt.setString(21,rs.getString("salesid"));
			pstmt.setString(22,rs.getString("name")); 
			pstmt.setString(23,rs.getString("birthday"));
			pstmt.setString(24,rs.getString("sex"));
			pstmt.setString(25,rs.getString("hp")); 
			pstmt.setString(26,rs.getString("tid")); 
			pstmt.setString(27,rs.getString("cardno")); 
			pstmt.setString(28,rs.getString("etcamt")); 
			pstmt.setString(29,rs.getString("auth_ti")); 
			pstmt.setString(30,rs.getString("trans_filler")); 
			pstmt.setString(31,rs.getString("vancd")); 
			pstmt.setString(32,rs.getString("productnames")); 
			
			rescnt = rescnt+pstmt.executeUpdate();
			
			/*
			System.out.println("========"+"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
			pstmt3.setString(1,"CTR"+rs.getString("compcd"));
			pstmt3.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
			
			rescnt = rescnt+pstmt3.executeUpdate();
			
			if(rs.getString("etcamt")!="" && rs.getString("etcamt")!="0" && rs.getString("etcamt")!=null && rs.getString("etcamt").length()>1){
				j++;
				System.out.println("====etcamt=="+rs.getString("etcamt"));
				pstmt2.setString(1,"CTR"+rs.getString("compcd"));
				pstmt2.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
				
				rescnt1 = rescnt1+pstmt2.executeUpdate();
				
			}
			*/
			
		}
		
		System.out.println("================="+i);
		// System.out.println("================="+j);
		
		System.out.println("sql:결제내역 등록 rescnt="+rescnt);
		// System.out.println("sql:결제내역 등록 rescnt1="+rescnt1);
		
		pstmt = null;
		pstmt2 = null;
		pstmt3 = null;
		stmt = null;
		sql = null;
		sql2 = null;
		sql3 = null;
		sql4 = null;
			
		if (pstmt != null)
			pstmt.close();
		
		if (pstmt2 != null)
			pstmt2.close();
		
		if (pstmt3 != null)
			pstmt3.close();
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		
		if (sql != null)
			sql = null;
		if (sql2 != null)
			sql2 = null;
		if (sql3 != null)
			sql3 = null;
		if (sql4 != null)
			sql4 = null;
			
	}
	
	/*
 	용도 : 데이타 이관 쿼리 : 현금수납
	작성자 : jerry
	작성일 : 2023.01031
	*/
	public void setTransData4(Connection con,Connection con2,String sdate,String edate) throws Exception {
		
		Statement stmt = null;
		PreparedStatement pstmt = null;
		PreparedStatement pstmt2 = null;
		
		ResultSet rs = null;
		String sql = null;
		String sql2 = null;
		String sql3 = null;
		
		sql = new String();
		sql2 = new String();
		sql3 = new String();
		
		int rescnt = 0;
		/* 결제 등록 */
		sql =(" SELECT ");
		sql = sql + ("   T.busi_no compcd, ");
		sql = sql + ("     IFNULL(S.u_id, T.id) paymentcd, ");
		sql = sql + ("     (CASE  ");
		sql = sql + ("        WHEN T.trans_type IN ('credit', 'npg') THEN (CASE ");
		sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A1' ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A3' ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A5' ");
		sql = sql + ("              WHEN T.app_card='O' THEN 'A7' ");
		sql = sql + ("              ELSE 'D1' ");
		sql = sql + ("           END) ");
		sql = sql + ("           ELSE (CASE ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A2' ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A4' ");
		sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A6' ");
		sql = sql + ("              WHEN T.app_card='O' THEN 'A8' ");
		sql = sql + ("              ELSE 'D4' ");
		sql = sql + ("           END) ");
		sql = sql + ("        END) ");
		sql = sql + ("        WHEN T.trans_type='cash' THEN (CASE ");
		sql = sql + ("          WHEN T.trx_cl_cd='AP' THEN (CASE ");
		sql = sql + ("              WHEN T.card_num='0100001234' THEN 'B3' ");
		sql = sql + ("              ELSE 'B1' ");
		sql = sql + ("           END) ");
		sql = sql + ("          ELSE (CASE ");
		sql = sql + ("              WHEN T.card_num='0100001234' THEN 'B4' ");
		sql = sql + ("              ELSE 'B2' ");
		sql = sql + ("           END) ");
		sql = sql + ("        END) ");
		sql = sql + ("        WHEN T.trans_type='coin' THEN (CASE ");
		sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN 'Q1' ");
		sql = sql + ("           ELSE 'Q2' ");
		sql = sql + ("        END) ");
		sql = sql + ("        WHEN T.trans_type='cashic' THEN (CASE ");
		sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN 'J1' ");
		sql = sql + ("           ELSE 'J4' ");
		sql = sql + ("       END) ");
		sql = sql + ("     END) paymethod, ");
		sql = sql + ("     T.auth_no auth_no, ");
		sql = sql + ("     REPLACE(T.run_date, '-', '') auth_date, ");
		sql = sql + ("     T.run_time auth_time, ");
		sql = sql + ("     T.org_auth_no org_auth_no, ");
		sql = sql + ("     (CASE WHEN T.org_trx_date='00000000' THEN '' ELSE T.org_trx_date END) org_auth_date, ");
		sql = sql + ("     '' org_auth_time, ");
		sql = sql + ("     (CASE WHEN T.trx_cl_cd='AP' THEN 'ACC' ELSE 'CAN' END) paygubn, ");
		sql = sql + ("     (CASE WHEN T.trans_type IN ('credit', 'npg') THEN T.won_amt ELSE 0 END) card, ");
		sql = sql + ("     (CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.won_amt ELSE 0 END) money, ");
		sql = sql + ("     T.otc_amt amt, ");
		sql = sql + ("     T.tax vat, ");
		sql = sql + ("     T.won_amt total, ");
		sql = sql + ("     IFNULL(S.discount_price, 0) discount, ");
		sql = sql + ("     (CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.card_num ELSE 0 END) money_no, ");
		sql = sql + ("     E.prescription_no prescription_no, ");
		sql = sql + ("     C.at_card_code cardgubn, ");
		sql = sql + ("     T.run_hal installments, ");
		sql = sql + ("     '' salesid, ");
		sql = sql + ("     '' name, ");
		sql = sql + ("     E.birth_year birthday, ");
		sql = sql + ("     E.gender sex, ");
		sql = sql + ("     '' hp, ");
		sql = sql + ("     T.trml_no tid, ");
		sql = sql + ("     E.goods_name productnames, ");
		sql = sql + ("     T.card_num cardno, ");
		sql = sql + ("    T.etc_amt etcamt, ");
		sql = sql + ("     SUBSTRING(T.run_time, 1, 2) auth_ti, ");
		sql = sql + ("     T.filler trans_filler, ");
		sql = sql + ("     'ATP' vancd, ");
		sql = sql + ("     T.reg_dttm regdt ");
		sql = sql + ("  FROM  ");
		sql = sql + ("  ( ");
		sql = sql + ("     SELECT *  ");
		sql = sql + ("     FROM allthatpay.trans  ");
		sql = sql + ("     WHERE 1=1  ");
		sql = sql + ("     AND run_date BETWEEN '"+ sdate +"' and '"+ edate +"'  ");
		sql = sql + ("     AND van_type IN ('KICC','ATP') ");
		sql = sql + ("     AND trans_type='coin' AND ret_code='0000' ");
		sql = sql + ("     AND busi_no IN (SELECT busi_no FROM atpos_users) ");
		sql = sql + ("  ) T ");
		sql = sql + ("     LEFT OUTER JOIN  ");
		sql = sql + ("  ( ");
		sql = sql + ("     SELECT *  ");
		sql = sql + ("     FROM ( ");
		sql = sql + ("        SELECT u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no, SUM(discount_price) discount_price, MIN(id) mas_id, COUNT(*) prod_cnt  ");
		sql = sql + ("        FROM atpos_sales  ");
		sql = sql + ("        WHERE 1=1  ");
		sql = sql + ("        AND sales_date BETWEEN '"+ sdate +"' and '"+ edate +"'  ");
		sql = sql + ("        GROUP BY u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no ");
		sql = sql + ("     ) BB ");
		sql = sql + ("  ) S ");
		sql = sql + ("  ON T.run_date=S.sales_date AND T.busi_no=S.busi_no AND T.trx_cl_cd=S.pay_gubn AND T.auth_no=S.auth_no ");
		sql = sql + ("  LEFT OUTER JOIN allthatpay.at_vancard_code C ");
		sql = sql + ("  ON T.trans_type NOT IN ('cash', 'coin') AND SUBSTRING(T.purch_code,-2)=C.card_code AND T.van_type=C.van AND T.filler LIKE CONCAT('%', S.u_id, '%') ");
		sql = sql + ("  LEFT OUTER JOIN (SELECT * FROM allthatpay.franchisee WHERE 1=1) D ");
		sql = sql + ("  ON T.busi_no=D.busi_num ");
		sql = sql + ("  LEFT OUTER JOIN atpos_sales E ");
		sql = sql + ("  ON S.mas_id=E.id ");
		sql = sql + ("  WHERE 1=1  ");
		
		
		System.out.println("sql:현금수납내역 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		/*
		sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
		sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
		sql2 =sql2 + (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? ) on duplicate key update upddt = now() ");
		*/
		
		sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
		sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
		sql2 =sql2 + ("  select ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? from dual  ");
		sql2 =sql2 + ("  where 0 = ( ");
		sql2 =sql2 + ("  	select count(*) ");
		sql2 =sql2 + ("  	from pos_payment  ");
		sql2 =sql2 + ("  	where compcd=?  ");
		sql2 =sql2 + ("  	      and auth_no=?  ");
		sql2 =sql2 + ("  	      and auth_date=? "); 
		sql2 =sql2 + ("  	      and paygubn=? ");
		sql2 =sql2 + ("  	      and total=? ");
		sql2 =sql2 + ("  	      and auth_time between date_format(adddate(cast(concat(?,?) as datetime), interval - 300 second),'%H%i%s') and date_format(adddate(cast(concat(?,?) as datetime), interval 100 second),'%H%i%s') ");
		sql2 =sql2 + ("  ) ");
		sql2 =sql2 + ("  on duplicate key update upddt = now() ");

		
		pstmt = con2.prepareStatement(sql2.toString());
		
		int i=0;
		
		String name="";
		
		while (rs.next() && rs != null) {
			i++;
			System.out.println("================="+i);
			System.out.println("================="+rs.getString("paymentcd"));
			
			if(rs.getString("trans_filler") == null || rs.getString("trans_filler").equals("")){
				name="";
			}else{
				
				String aa=rs.getString("trans_filler");
				
				int aa1 = aa.indexOf("*");
				if(aa1>0){
					
				String aa2 = aa.substring(0,aa1);
				
				int aa3 = aa2.lastIndexOf("|");
				
				String aa4 = aa.substring(aa1,aa.length());
				
				int aa5 = aa4.indexOf("|");
				
				String aa6 = aa.substring(aa3+1, aa5+aa3+2);
					name=aa6;
				}else{
					name="";
				}
			
			}
			
			pstmt.setString(1,"CTR"+rs.getString("compcd"));
			pstmt.setString(2,rs.getString("paymentcd"));
			pstmt.setString(3,rs.getString("paymethod"));
			pstmt.setString(4,rs.getString("auth_no"));
			pstmt.setString(5,rs.getString("auth_date"));
			pstmt.setString(6,rs.getString("auth_time"));
			pstmt.setString(7,rs.getString("org_auth_no"));
			pstmt.setString(8,rs.getString("org_auth_date"));
			pstmt.setString(9,rs.getString("org_auth_time"));
			pstmt.setString(10,rs.getString("paygubn"));
			pstmt.setString(11,rs.getString("card")); 
			pstmt.setString(12,rs.getString("money")); 
			pstmt.setString(13,rs.getString("amt")); 
			pstmt.setString(14,rs.getString("vat")); 
			pstmt.setString(15,rs.getString("total")); 
			pstmt.setString(16,rs.getString("discount")); 
			pstmt.setString(17,rs.getString("money_no")); 
			pstmt.setString(18,rs.getString("prescription_no"));
			pstmt.setString(19,rs.getString("cardgubn")); 
			pstmt.setString(20,rs.getString("installments")); 
			pstmt.setString(21,rs.getString("salesid")); 
			pstmt.setString(22,name); 
			pstmt.setString(23,rs.getString("birthday")); 
			pstmt.setString(24,rs.getString("sex")); 
			pstmt.setString(25,rs.getString("hp")); 
			pstmt.setString(26,rs.getString("tid")); 
			pstmt.setString(27,rs.getString("cardno")); 
			pstmt.setString(28,rs.getString("etcamt")); 
			pstmt.setString(29,rs.getString("auth_ti")); 
			pstmt.setString(30,rs.getString("trans_filler")); 
			pstmt.setString(31,rs.getString("vancd")); 
			pstmt.setString(32,rs.getString("productnames")); 
			
			pstmt.setString(33,rs.getString("compcd")); 
			pstmt.setString(34,rs.getString("auth_no")); 
			pstmt.setString(35,rs.getString("auth_date")); 
			pstmt.setString(36,rs.getString("paygubn")); 
			pstmt.setString(37,rs.getString("total")); 
			pstmt.setString(38,rs.getString("auth_date")); 
			pstmt.setString(39,rs.getString("auth_time")); 
			pstmt.setString(40,rs.getString("auth_date")); 
			pstmt.setString(41,rs.getString("auth_time")); 
			
			rescnt = rescnt+pstmt.executeUpdate();
			
			/*
			if(rs.getString("etcamt")!="" && rs.getString("etcamt")!="0" && rs.getString("etcamt")!=null && rs.getString("etcamt").length()>1){
				System.out.println("====etcamt=="+rs.getString("etcamt"));
				pstmt2.setString(1,"CTR"+rs.getString("compcd"));
				pstmt2.setString(2,rs.getString("paymentcd"));
				
				rescnt = rescnt+pstmt2.executeUpdate();
				
			}
			*/
			
		}
		
		System.out.println("sql:결제내역 등록 rescnt="+rescnt);
		
		pstmt = null;
		pstmt2 = null;
		stmt = null;
		sql = null;
		sql2 = null;
		sql3 = null;
			
		if (pstmt != null)
			pstmt.close();
		if (pstmt2 != null)
			pstmt2.close();
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		
		if (sql != null)
			sql = null;
		if (sql2 != null)
			sql2 = null;
		
	}
	
	/*
	용도 : 데이타 이관 쿼리 : 현금수납,결제 누락건
	작성자 : jerry
	작성일 : 2023.01031
	*/
	public void setTransData5(Connection con,Connection con2,String sdate,String edate) throws Exception {
	
	Statement stmt = null;
	PreparedStatement pstmt = null;
	PreparedStatement pstmt2 = null;
	PreparedStatement pstmt3 = null;
	
	ResultSet rs = null;
	String sql = null;
	String sql2 = null;
	String sql3 = null;
	String sql4 = null;
	
	sql = new String();
	sql2 = new String();
	sql3 = new String();
	sql4 = new String();
	
	int rescnt = 0;
	int rescnt1 = 0;
	
	sql =null;
	pstmt = null;
	sql2 = null;
	rs = null;
	
	/* 결제 등록 */
	sql =(" SELECT ");
	sql = sql + ("   T.busi_no compcd, ");
	sql = sql + ("     S.u_id paymentcd, ");
	sql = sql + ("     (CASE  ");
	sql = sql + ("        WHEN T.trans_type IN ('credit', 'npg') THEN (CASE ");
	sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN (CASE ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A1' ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A3' ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A5' ");
	sql = sql + ("              WHEN T.app_card='O' THEN 'A7' ");
	sql = sql + ("              ELSE 'D1' ");
	sql = sql + ("           END) ");
	sql = sql + ("           ELSE (CASE ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='03' THEN 'A2' ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='04' THEN 'A4' ");
	sql = sql + ("              WHEN SUBSTRING(T.issue_code,-2)='60' THEN 'A6' ");
	sql = sql + ("              WHEN T.app_card='O' THEN 'A8' ");
	sql = sql + ("              ELSE 'D4' ");
	sql = sql + ("           END) ");
	sql = sql + ("        END) ");
	sql = sql + ("        WHEN T.trans_type='cash' THEN (CASE ");
	sql = sql + ("          WHEN T.trx_cl_cd='AP' THEN (CASE ");
	sql = sql + ("              WHEN T.card_num='0100001234' THEN 'B3' ");
	sql = sql + ("              ELSE 'B1' ");
	sql = sql + ("           END) ");
	sql = sql + ("          ELSE (CASE ");
	sql = sql + ("              WHEN T.card_num='0100001234' THEN 'B4' ");
	sql = sql + ("              ELSE 'B2' ");
	sql = sql + ("           END) ");
	sql = sql + ("        END) ");
	sql = sql + ("        WHEN T.trans_type='coin' THEN (CASE ");
	sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN 'Q1' ");
	sql = sql + ("           ELSE 'Q2' ");
	sql = sql + ("        END) ");
	sql = sql + ("        WHEN T.trans_type='cashic' THEN (CASE ");
	sql = sql + ("           WHEN T.trx_cl_cd='AP' THEN 'J1' ");
	sql = sql + ("           ELSE 'J4' ");
	sql = sql + ("       END) ");
	sql = sql + ("     END) paymethod, ");
	sql = sql + ("     T.auth_no auth_no, ");
	sql = sql + ("     REPLACE(T.run_date, '-', '') auth_date, ");
	sql = sql + ("     T.run_time auth_time, ");
	sql = sql + ("     T.org_auth_no org_auth_no, ");
	sql = sql + ("     (CASE WHEN T.org_trx_date='00000000' THEN '' ELSE T.org_trx_date END) org_auth_date, ");
	sql = sql + ("     '' org_auth_time, ");
	sql = sql + ("     (CASE WHEN T.trx_cl_cd='AP' THEN 'ACC' ELSE 'CAN' END) paygubn, ");
	sql = sql + ("     (CASE WHEN T.trans_type IN ('credit', 'npg') THEN T.won_amt ELSE 0 END) card, ");
	sql = sql + ("     (CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.won_amt ELSE 0 END) money, ");
	sql = sql + ("     T.otc_amt amt, ");
	sql = sql + ("     T.tax vat, ");
	sql = sql + ("     T.won_amt total, ");
	sql = sql + ("     IFNULL(S.discount_price, 0) discount, ");
	sql = sql + ("     (CASE WHEN T.trans_type IN ('cash', 'coin') THEN T.card_num ELSE 0 END) money_no, ");
	sql = sql + ("     E.prescription_no prescription_no, ");
	sql = sql + ("     C.at_card_code cardgubn, ");
	sql = sql + ("     T.run_hal installments, ");
	sql = sql + ("     '' salesid, ");
	sql = sql + ("     '' name, ");
	sql = sql + ("     E.birth_year birthday, ");
	sql = sql + ("     E.gender sex, ");
	sql = sql + ("     '' hp, ");
	sql = sql + ("     T.trml_no tid, ");
	sql = sql + ("     E.goods_name productnames, ");
	sql = sql + ("     T.card_num cardno, ");
	sql = sql + ("    T.etc_amt etcamt, ");
	sql = sql + ("     SUBSTRING(T.run_time, 1, 2) auth_ti, ");
	sql = sql + ("     T.filler trans_filler, ");
	sql = sql + ("     'ATP' vancd, ");
	sql = sql + ("     T.reg_dttm regdt ");
	sql = sql + ("  FROM  ");
	sql = sql + ("  ( ");
	sql = sql + ("     SELECT *  ");
	sql = sql + ("     FROM allthatpay.trans  ");
	sql = sql + ("     WHERE 1=1  ");
	sql = sql + ("     AND run_date BETWEEN '"+ sdate +"' and '"+ edate +"'  ");
	sql = sql + ("     AND van_type IN ('KICC','ATP') ");
	sql = sql + ("     AND trans_type='coin' ");
	sql = sql + ("     AND busi_no IN (SELECT busi_no FROM atpos_users) ");
	sql = sql + ("  ) T ");
	sql = sql + ("     LEFT OUTER JOIN  ");
	sql = sql + ("  ( ");
	sql = sql + ("     SELECT *  ");
	sql = sql + ("     FROM ( ");
	sql = sql + ("        SELECT u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no, SUM(discount_price) discount_price, SUM(total_price) tot_price, MIN(id) mas_id, COUNT(*) prod_cnt  ");
	sql = sql + ("        FROM atpos_sales  ");
	sql = sql + ("        WHERE 1=1  ");
	sql = sql + ("        AND sales_date BETWEEN '"+ sdate +"' and '"+ edate +"'  ");
	sql = sql + ("        GROUP BY u_id, pay_method, pay_gubn, auth_no, sales_date, busi_no ");
	sql = sql + ("     ) BB ");
	sql = sql + ("  ) S ");
	sql = sql + ("  ON T.run_date=S.sales_date AND T.busi_no=S.busi_no AND T.trx_cl_cd=S.pay_gubn AND T.auth_no=S.auth_no AND T.won_amt=S.tot_price AND T.filler LIKE CONCAT('%', S.u_id, '%') ");
	sql = sql + ("  LEFT OUTER JOIN allthatpay.at_vancard_code C ");
	sql = sql + ("  ON T.trans_type NOT IN ('cash', 'coin') AND SUBSTRING(T.purch_code,-2)=C.card_code AND T.van_type=C.van ");
	sql = sql + ("  LEFT OUTER JOIN (SELECT * FROM allthatpay.franchisee WHERE 1=1) D ");
	sql = sql + ("  ON T.busi_no=D.busi_num ");
	sql = sql + ("  LEFT OUTER JOIN atpos_sales E ");
	sql = sql + ("  ON S.mas_id=E.id ");
	sql = sql + ("  WHERE 1=1 and length(ifnull(S.u_id,'1'))<2 ");
	System.out.println("sql:현금수납내역 조회="+sql.toString());
	
	stmt = con.createStatement();
	rs = stmt.executeQuery(sql.toString());
	
	sql2 =( " insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat,total, ");
	sql2 = sql2	+ (" discount,money_no,prescription_no,	cardgubn,installments,salesid,name,birthday,sex,hp,tid,cardno,etcamt,auth_ti,trans_filler,vancd,regdt,productnames) ");
	sql2 =sql2 + (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now(),? ) on duplicate key update upddt = now() ");
	
	pstmt = con2.prepareStatement(sql2.toString());
	
	/*
	sql3 = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
	sql3 =  sql3 + (" select compcd ,fn_getuuid('SAL'),cast(auth_date as date),auth_date,auth_time,'ALLTAHT9999999999',paymethod,'1',etcamt,'0', ");
	sql3 = sql3 +  ("  0,0,etcamt,sex,hp,'','ALLTAHT9999999999', etcamt ,paymentcd,'ALLTAHT9999999999',birthday, substr(auth_time,1,2) from pos_payment where compcd=? and paymentcd=? ");
	
	System.out.println("sql:제품 판매(ETC  등록) 등록="+sql3.toString());

	pstmt2 = con2.prepareStatement(sql3.toString());
	
	
	sql4 = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
	sql4 = sql4 + (" select compcd ,fn_getuuid('SAL'),cast(auth_date as date),auth_date,auth_time,'TNS9999999999',paymethod,'1',amt,discount, ");
	sql4 = sql4 +  ("  amt,vat,total,sex,hp,'','TNS9999999999','0' etcamt ,paymentcd,'SNS9999999999',birthday, substr(auth_time,1,2) from pos_payment where compcd=? and paymentcd=? ");
	
	System.out.println("sql:제품 판매(미등록 판매) 등록="+sql3.toString());

	pstmt3 = con2.prepareStatement(sql4.toString()); 
	*/
	
	int i=0;
	int j=0;
	
	while (rs.next() && rs != null) {
		i++;
		
		System.out.println("================="+rs.getString("paymentcd"));
		
		pstmt.setString(1,"CTR"+rs.getString("compcd"));
		pstmt.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
		pstmt.setString(3,rs.getString("paymethod"));
		pstmt.setString(4,rs.getString("auth_no"));
		pstmt.setString(5,rs.getString("auth_date"));
		pstmt.setString(6,rs.getString("auth_time"));
		pstmt.setString(7,rs.getString("org_auth_no"));
		pstmt.setString(8,rs.getString("org_auth_date"));
		pstmt.setString(9,rs.getString("org_auth_time"));
		pstmt.setString(10,rs.getString("paygubn"));
		pstmt.setString(11,rs.getString("card")); 
		pstmt.setString(12,rs.getString("money")); 
		pstmt.setString(13,rs.getString("amt")); 
		pstmt.setString(14,rs.getString("vat")); 
		pstmt.setString(15,rs.getString("total")); 
		pstmt.setString(16,rs.getString("discount")); 
		pstmt.setString(17,rs.getString("money_no")); 
		pstmt.setString(18,rs.getString("prescription_no"));
		pstmt.setString(19,rs.getString("cardgubn")); 
		pstmt.setString(20,rs.getString("installments")); 
		pstmt.setString(21,rs.getString("salesid")); 
		pstmt.setString(22,rs.getString("name")); 
		pstmt.setString(23,rs.getString("birthday")); 
		pstmt.setString(24,rs.getString("sex")); 
		pstmt.setString(25,rs.getString("hp")); 
		pstmt.setString(26,rs.getString("tid")); 
		pstmt.setString(27,rs.getString("cardno")); 
		pstmt.setString(28,rs.getString("etcamt")); 
		pstmt.setString(29,rs.getString("auth_ti")); 
		pstmt.setString(30,rs.getString("trans_filler")); 
		pstmt.setString(31,rs.getString("vancd")); 
		pstmt.setString(32,rs.getString("productnames")); 
		
		rescnt = rescnt+pstmt.executeUpdate();
		
		/*
		System.out.println("========"+"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
		pstmt3.setString(1,"CTR"+rs.getString("compcd"));
		pstmt3.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
		
		rescnt = rescnt+pstmt3.executeUpdate();
		
		if(rs.getString("etcamt")!="" && rs.getString("etcamt")!="0" && rs.getString("etcamt")!=null && rs.getString("etcamt").length()>1){
			j++;
			System.out.println("====etcamt=="+rs.getString("etcamt"));
			pstmt2.setString(1,"CTR"+rs.getString("compcd"));
			pstmt2.setString(2,"PAY"+rs.getString("compcd")+rs.getString("auth_no")+rs.getString("auth_date")+rs.getString("auth_time")+rs.getString("paygubn"));
			
			rescnt1 = rescnt1+pstmt2.executeUpdate();
			
		}
		*/
		
	}
	
	System.out.println("================="+i);
	// System.out.println("================="+j);
	
	System.out.println("sql:결제내역 등록 rescnt="+rescnt);
	// System.out.println("sql:결제내역 등록 rescnt1="+rescnt1);
	
	pstmt = null;
	pstmt2 = null;
	pstmt3 = null;
	stmt = null;
	sql = null;
	sql2 = null;
	sql3 = null;
	sql4 = null;
		
	if (pstmt != null)
		pstmt.close();
	
	if (pstmt2 != null)
		pstmt2.close();
	
	if (pstmt3 != null)
		pstmt3.close();
	
	if (stmt != null)
		stmt.close();
	if (rs != null)
		rs.close();
	
	if (sql != null)
		sql = null;
	if (sql2 != null)
		sql2 = null;
	if (sql3 != null)
		sql3 = null;
	if (sql4 != null)
		sql4 = null;
		
}
	
	
	/*
 	용도 : 데이타 이관 쿼리
	작성자 : jerry
	작성일 : 2023.01027
	*/
	public void setTransData(Connection con,Connection con2) throws Exception {
		
		/* 1. 가맹점 이동 */
		
		Statement stmt = null;
		PreparedStatement pstmt = null;
		PreparedStatement pstmt2 = null;
		PreparedStatement pstmt3 = null;
		PreparedStatement pstmt4 = null;
		
		ResultSet rs = null;
		String sql = null;
		String sql2 = null;
		String sql3 = null;
		String sql4 = null;
		
		sql = new String();
		sql2 = new String();
		sql3 = new String();
		sql4 = new String();
		
		sql = (" SELECT  ");
		sql = sql + (" G.busi_no compcd, ");
		sql = sql + (" G.busi_name companyname, ");
		sql = sql + (" G.busi_no corporatenumber, ");
		sql = sql + (" G.user_name president, ");
		sql = sql + (" 1 presidentcnt, ");
		sql = sql + (" '' registerdate, ");
		sql = sql + (" '' canceldate, ");
		sql = sql + (" F.address address, ");
		sql = sql + (" '' address2, ");
		sql = sql + (" REPLACE(F.phone_num, '-', '')  tel, ");
		sql = sql + (" REPLACE(F.cell_phone_num, '-', '') hp, ");
		sql = sql + (" '' fax, ");
		sql = sql + (" F.email email, ");
		sql = sql + (" '' taxusername, ");
		sql = sql + (" '' taxusertel, ");
		sql = sql + (" '' taxuseremail, ");
		sql = sql + (" '' opendate, ");
		sql = sql + (" '' remarks, ");
		sql = sql + (" '' business, ");
		sql = sql + (" C.code_name sectors, ");
		sql = sql + (" (CASE  ");
		sql = sql + (" 	WHEN G.chain_code='601' THEN 'CHA0000000006' "); // 참약사
		sql = sql + (" 	WHEN G.chain_code='602' THEN 'CHA0000000009' "); // 블루클럽
		sql = sql + (" 	WHEN G.chain_code='603' THEN 'CHA0000000010' "); // 정현철
		sql = sql + (" 	WHEN G.chain_code='604' THEN 'CHA0000000011' "); // 안경나라
		sql = sql + (" 	WHEN F.type_2='E팜' THEN 'CHA0000000008' ");  // 이디비
		sql = sql + (" 	ELSE 'CHA0000000007'  "); // 올댓페이
		sql = sql + (" END) chaincode,  ");
		sql = sql + (" (CASE  ");
		sql = sql + (" 	WHEN G.chain_code='601' THEN '참약사' "); // 참약사
		sql = sql + (" 	WHEN G.chain_code='602' THEN '블루클럽' "); // 블루클럽
		sql = sql + (" 	WHEN G.chain_code='603' THEN '정현철' "); // 정현철
		sql = sql + (" 	WHEN G.chain_code='604' THEN '안경나라' "); // 안경나라
		sql = sql + (" 	WHEN F.type_2='E팜' THEN '이디비' ");  // 이디비
		sql = sql + (" 	ELSE ''  "); // 올댓페이
		sql = sql + (" END) chain_name  ");
		sql = sql + (" FROM atpos_users G  ");
		sql = sql + (" LEFT OUTER JOIN allthatpay.franchisee F ON G.busi_no=F.busi_num  ");
		sql = sql + (" LEFT OUTER JOIN allthatpay.at_code_info C ON C.c_code1='005' AND F.sector=C.code ");
		sql = sql + (" WHERE G.busi_no IS NOT NULL AND chain_master='N'   ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		System.out.println("sql:가맹점 조회="+sql.toString());
		
		
		sql2 = (" insert into pos_company(companyname,corporatenumber,president,presidentcnt,address,address2,tel,hp,fax,email,taxusername,taxusertel,taxuseremail,remarks,business,sectors,compcd,regcd,regdt,useyn) ");
		sql2 = sql2 +  (" values(?,?,?,?,?,?, ");
		sql2 = sql2 +  (" ?,?,?,?,?,?,?,?,?,?,?,'1',now(),'Y' ) ");
		sql2 = sql2 +  (" on duplicate key ");
		sql2 = sql2 +  (" update address = ?, address2 =?,tel = ?, hp = ?, fax = ?, ");
		sql2 = sql2 +  (" email = ?, taxusername=?,taxusertel =?, taxuseremail=?, upddt = now() ");
		
		System.out.println("sql:가맹점 등록="+sql2.toString());
		pstmt = con2.prepareStatement(sql2.toString());
		
		int i=0;
		int rescnt = 0;
		int rescnt2 = 0;
		
		sql3 = null;
		
		sql3 = (" insert into pos_chaincompany(chaincode,compcd,registerdate,regdt,regcd) ");
		sql3 = sql3 +  (" values(?,?,now(),now(),'1') on duplicate key update upddt = now() , chaincode =?  ");
		
		System.out.println("sql:가맹점 체인 등록="+sql3.toString());
		pstmt4 = con2.prepareStatement(sql3.toString());

		
		while (rs.next() && rs != null) {
				
				pstmt.setString(1,rs.getString("companyname"));
				pstmt.setString(2,rs.getString("corporatenumber").replaceAll("-",""));
				pstmt.setString(3,rs.getString("president"));
				pstmt.setString(4,rs.getString("presidentcnt"));
				pstmt.setString(5,rs.getString("address"));
				pstmt.setString(6,rs.getString("address2"));
				pstmt.setString(7,rs.getString("tel"));
				pstmt.setString(8,rs.getString("hp"));
				pstmt.setString(9,rs.getString("fax"));
				pstmt.setString(10,rs.getString("email"));
				pstmt.setString(11,rs.getString("taxusername"));
				pstmt.setString(12,rs.getString("taxusertel"));
				pstmt.setString(13,rs.getString("taxuseremail"));
				pstmt.setString(14,rs.getString("chain_name"));
				pstmt.setString(15,rs.getString("business"));
				pstmt.setString(16,rs.getString("sectors"));
				pstmt.setString(17,"CTR"+rs.getString("corporatenumber").replaceAll("-","")); // compcd
				pstmt.setString(18,rs.getString("address"));
				pstmt.setString(19,rs.getString("address2"));
				pstmt.setString(20,rs.getString("tel"));
				pstmt.setString(21,rs.getString("hp"));
				pstmt.setString(22,rs.getString("fax"));
				pstmt.setString(23,rs.getString("email"));
				pstmt.setString(24,rs.getString("taxusername"));
				pstmt.setString(25,rs.getString("taxusertel"));
				pstmt.setString(26,rs.getString("taxuseremail"));
				
				rescnt = rescnt+pstmt.executeUpdate();	
				
				pstmt4.setString(1,rs.getString("chaincode"));
				pstmt4.setString(2,"CTR"+rs.getString("corporatenumber").replaceAll("-","")); // compcd
				pstmt4.setString(3,rs.getString("chaincode"));
				rescnt2 = rescnt2+pstmt4.executeUpdate();	
				
				i++;
				
		}
		
		System.out.println("=====i======"+i);
		System.out.println("=rescnt="+rescnt);
		
		sql = null;
		sql2 = null;
		rs = null;
		
		stmt = null;
		pstmt = null;
		
		sql = (" SELECT  ");
		sql = sql + (" G.user_id userid, ");
		sql = sql + (" 		SUBSTRING(G.user_id, -5)  passwd, ");
		sql = sql + (" 		G.user_name name, ");
		sql = sql + (" 		'CO2048' level, ");
		sql = sql + (" 		REPLACE(F.cell_phone_num, '-', '') hp, ");
		sql = sql + (" 		'' email, ");
		sql = sql + (" 		'' licence, ");
		sql = sql + (" 		G.busi_no compcd, ");
		sql = sql + (" 		'' joindate, ");
		sql = sql + (" 		'' resigndate ");
		sql = sql + (" 		FROM atpos_users G ");
		sql = sql + (" 		LEFT OUTER JOIN allthatpay.franchisee F ON G.busi_no=F.busi_num ");
		sql = sql + (" 		WHERE G.busi_no IS NOT NULL AND chain_master='N'   ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		System.out.println("sql:사용자 조회="+sql.toString());
		
		pstmt = null;
		
		i=0;
		rescnt = 0;
			
		/* 사용자 이관 */
		sql2 = (" insert into pos_companyuser(userid,passwd,name,level,compcd,regcd,regdt,useyn,userseq,hp) ");
		sql2 = sql2 +  (" values(?,?,?,'CO2048',?,'1',now(),'Y',?,? ) ");
		sql2 = sql2 +  (" on duplicate key update upddt = now() ");
		
		pstmt = con2.prepareStatement(sql2.toString());
		
		while (rs.next() && rs != null) {
			pstmt.setString(1,rs.getString("userid"));
			pstmt.setString(2,rs.getString("passwd"));
			pstmt.setString(3,rs.getString("name"));
			pstmt.setString(4,"CTR"+rs.getString("compcd"));
			pstmt.setString(5,"USR"+rs.getString("compcd")); // compcd
			pstmt.setString(6,rs.getString("hp")); // compcd
			
			rescnt = rescnt+pstmt.executeUpdate();	
			i++;
		
		}
		
		System.out.println("=====i2======"+i);
		System.out.println("=rescnt2="+rescnt);
		
		i=0;
		rescnt = 0;
		
		sql = null;
		sql2 = null;
		rs = null;
		
		stmt = null;
		pstmt = null;
		
		/* 제품 이관 */
		
		sql =  (" select compcd,barcode,case when product_code is null or product_code='' then barcode else product_code end product_code, ");
		sql = sql + ("		productname,maker,size,unit,spec,packingunit,price,discount,salesprice, ");
		sql = sql + ("		case when product_code is null or product_code='' then barcode else product_code end productid,remarks,purprice,salesdate,stock,appstock ");
		sql = sql + ("		from ( ");
		sql = sql +  (" SELECT ");
		sql = sql + (" concat('CTR',G.busi_no) compcd, ");
		sql = sql + (" G.barcode barcode, ");
		sql = sql + (" case when S.product_code is null or S.product_code='' then S.barcode else S.product_code end product_code, ");
		sql = sql + (" G.goods_name productname, ");
		sql = sql + (" G.company_name maker, ");
		sql = sql + (" G.goods_size size, ");
		sql = sql + (" G.goods_form unit, ");
		sql = sql + (" G.goods_package spec, ");
		sql = sql + (" ifnull(G.goods_amt,1) packingunit, ");
		sql = sql + (" G.sales_price price, ");
		sql = sql + (" S.discount_price discount, ");
		sql = sql + (" S.sales_price salesprice, ");
		sql = sql + (" G.stock, "); /*재고*/
		sql = sql + (" G.reasonable_stock as appstock, ");  /*적정재고*/
		sql = sql + (" case when S.product_code is null or S.product_code='' then S.barcode else S.product_code end productid, ");
		sql = sql + (" '' remarks, ");
		sql = sql + (" S.purchase_price purprice, ");
		sql = sql + (" S.sales_date salesdate ");
		sql = sql + (" FROM atpos_goods G ");
		sql = sql + (" LEFT OUTER JOIN ( ");
		sql = sql + (" 	SELECT * FROM atpos_sales WHERE (busi_no, barcode, reg_dttm) IN ");
		sql = sql + (" 	(SELECT busi_no, barcode, MAX(reg_dttm) max_time FROM atpos_sales WHERE barcode IS NOT NULL and pay_gubn='AP' GROUP BY busi_no, barcode) ");
		sql = sql + (" ) S ");
		sql = sql + (" ON G.busi_no=S.busi_no AND G.barcode=S.barcode ");
		sql = sql + (" ) a ");
		
		System.out.println("sql:제품 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		i=0;
		rescnt = 0;
		
		sql2 = (" insert into pos_compproduct(compcd,productid,productcd,barcode,productname,maker,size,unit,spec,remarks,purchaseprice,regcd,regdt,stock,appstock) ");
		sql2 = sql2 +  (" values(?,?,?,?,?,?,?,?,?,'2023-01-30',?,'1',now(),?,? ) ");
		sql2 = sql2 +  (" on duplicate key update purchaseprice = ? , stock=?, appstock=?, upddt = now() ");
		System.out.println("sql:가맹점 상품마스터 등록 ="+sql2.toString());
		
		pstmt = con2.prepareStatement(sql2.toString());
		
		sql3 = (" insert into pos_compproductgroup(compcd,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,discount,salesprice,productid,remarks,regcd,regdt,purprice,salesdate) ");
		sql3 = sql3 +  (" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'2023-01-30','1' ,now() ,?,? ) ");
		sql3 = sql3 +  (" on duplicate key update purprice=?, salesdate = ? , upddt = now() ");
		System.out.println("sql:가맹점 상품상세 등록 ="+sql3.toString());
		
		pstmt2 = con2.prepareStatement(sql3.toString());
		
		int rescnt3 = 0;
		
		while (rs.next() && rs != null) {
			
			/* 상품 등록(마스터) */
			
			
			pstmt.setString(1,rs.getString("compcd"));
			pstmt.setString(2,rs.getString("productid"));
			pstmt.setString(3,rs.getString("productid"));
			pstmt.setString(4,rs.getString("barcode"));
			pstmt.setString(5,rs.getString("productname"));
			pstmt.setString(6,rs.getString("maker"));
			pstmt.setString(7,rs.getString("size"));
			pstmt.setString(8,rs.getString("unit"));
			pstmt.setString(9,rs.getString("spec"));
			pstmt.setString(10,rs.getString("purprice")); 
			pstmt.setString(11,rs.getString("stock")); 
			pstmt.setString(12,rs.getString("appstock")); 
			pstmt.setString(13,rs.getString("purprice")); 
			pstmt.setString(14,rs.getString("stock")); 
			pstmt.setString(15,rs.getString("appstock")); 
			
			rescnt = rescnt+pstmt.executeUpdate();	
			
			System.out.println("============"+i);
			System.out.println("============"+rs.getString("barcode"));
			
			/* 상품 등록(포장단위) */
			pstmt2.setString(1,rs.getString("compcd"));
			pstmt2.setString(2,"PSI"+rs.getString("barcode"));
			pstmt2.setString(3,rs.getString("productid"));
			pstmt2.setString(4,rs.getString("barcode"));
			pstmt2.setString(5,rs.getString("productname"));
			pstmt2.setString(6,rs.getString("maker"));
			pstmt2.setString(7,rs.getString("size"));
			pstmt2.setString(8,rs.getString("unit"));
			pstmt2.setString(9,rs.getString("spec"));
			pstmt2.setString(10,rs.getString("packingunit"));
			pstmt2.setString(11,rs.getString("price")); 
			pstmt2.setString(12,rs.getString("discount")); 
			pstmt2.setString(13,rs.getString("salesprice")); 
			pstmt2.setString(14,rs.getString("productid")); 
			pstmt2.setString(15,rs.getString("purprice")); 
			pstmt2.setString(16,rs.getString("salesdate")); 
			pstmt2.setString(17,rs.getString("purprice")); 
			pstmt2.setString(18,rs.getString("salesdate")); 
			
			rescnt3 = rescnt3+pstmt2.executeUpdate();
			
			i++;
		
		}
		
		System.out.println("=====i2======"+i);
		System.out.println("=rescnt3="+rescnt);
		
		System.out.println("=====iiii======"+i);
		System.out.println("=rescnt3===="+rescnt2);
		
		pstmt3 = null;
		
		/* 재고등록 */
		sql4 = (" insert into pos_compstock(compcd,productid ,productcd ,stock ,appropriatestock , purchaseprice ,regcd,regdt) ");
		sql4 = sql4 +  (" select compcd,productid ,productcd ,ifnull(stock,0) ,ifnull(appstock,0) ,purchaseprice ,'1',now() from pos_compproduct pc ");
		sql4 = sql4 +  (" on duplicate key update stock=ifnull(pc.stock,0), appropriatestock = ifnull(pc.appstock,0) , purchaseprice = pc.purchaseprice, updatedate = now()  ");
		System.out.println("sql:가맹점 재고 등록 ="+sql4.toString());
		
		pstmt3 = con2.prepareStatement(sql4.toString());
		
		int rescnt4 = pstmt3.executeUpdate();
		
		System.out.println("=rescnt3===="+rescnt3);
		
		
		if (pstmt != null)
			pstmt.close();
		if (pstmt2 != null)
			pstmt3.close();
		if (pstmt3 != null)
			pstmt3.close();
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		
		if (sql != null)
			sql = null;
		if (sql2 != null)
			sql2 = null;
		if (sql3 != null)
			sql3 = null;
		if (sql4 != null)
			sql4 = null;
		
	}
	
	public void productCheck(Connection con, String sdate)  throws Exception {
		
		Statement stmt = null;
		Statement stmt2 = null;
		Statement stmt3 = null;
		Statement stmt4 = null;
		
		String sql = null;
		
		sql = new String();
		
		sql =(" insert into pos_compproduct "); 
		sql = sql+ ("  (compcd,productid,productcd,barcode,productname,maker,size,unit,spec,purchaseprice,stock,appstock,regcd,regdt) "); 
		sql = sql+ (" select  dat.compcd,dat.productcd productid,dat.productcd productcd,dat.productcd barcode,ag.goods_name productname,ag.company_name maker, "); 
		sql = sql+ ("        ag.goods_size size,ag.goods_form unit,ag.goods_class spec,ag.purchase_price   purchaseprice,ag.stock,ag.reasonable_stock appstock,'1',now() "); 
		sql = sql+ ("from( "); 
		sql = sql+ ("	select a.* "); 
		sql = sql+ ("	from  "); 
		sql = sql+ ("	(select ps.compcd,p.corporatenumber ,productcd from pos_salelist ps  "); 
		sql = sql+ ("		inner join pos_company p on ps.compcd = p.compcd  "); 
		sql = sql+ ("		where ps.salesdate='"+ sdate +"' "); 
		sql = sql+ ("	group by ps.compcd,p.corporatenumber ,productcd ) a "); 
		sql = sql+ ("	left outer join pos_compproductgroup pc  "); 
		sql = sql+ ("		on a.compcd = pc.compcd and a.productcd=pc.productcd  "); 
		sql = sql+ ("	where pc.productcd is null and a.productcd not in('ALLTAHT9999999999','TNS9999999999') "); 
		sql = sql+ (") dat	 "); 
		sql = sql+ ("  inner join atpos_goods ag "); 
		sql = sql+ ("  	on dat.corporatenumber = ag.busi_no and dat.productcd = ag.barcode "); 
		sql = sql+ (" on duplicate key  "); 
		sql = sql+ (" update upddt = now() "); 
		
		System.out.println("=누락제품 마스터 이전 ==="+sql);
		
		stmt = con.createStatement();
		stmt.executeUpdate(sql.toString());
		
		sql = null;
		
		sql =(" insert into pos_compproductgroup ");
		sql = sql+ (" (compcd,productsid,productcd,barcode,productname,maker,`size`,unit,spec,packingunit,price,salesprice,productid,regcd,regdt,purprice) ");
		sql = sql+ (" select  dat.compcd,fn_getuuid('PIS'),dat.productcd,dat.productcd,ag.goods_name,ag.company_name, ");
		sql = sql+ ("         ag.goods_size,ag.goods_form ,ag.goods_class ,ag.unit_cnt ,ag.sales_price ,ag.sales_price,dat.productcd,'1',now(),ag.purchase_price ");
		sql = sql+ (" from( ");
		sql = sql+ (" 	select a.* ");
		sql = sql+ (" 	from  ");
		sql = sql+ (" 	(select ps.compcd,p.corporatenumber ,productcd from pos_salelist ps  ");
		sql = sql+ (" 		inner join pos_company p on ps.compcd = p.compcd  where ps.salesdate='"+ sdate +"' ");
		sql = sql+ (" 	group by ps.compcd,p.corporatenumber ,productcd ) a ");
		sql = sql+ (" 	left outer join pos_compproductgroup pc  ");
		sql = sql+ (" 		on a.compcd = pc.compcd and a.productcd=pc.productcd  ");
		sql = sql+ (" 	where pc.productcd is null and a.productcd not in('ALLTAHT9999999999','TNS9999999999') ");
		sql = sql+ (" ) dat	 ");
		sql = sql+ ("   inner join atpos_goods ag ");
		sql = sql+ ("   	on dat.corporatenumber = ag.busi_no and dat.productcd = ag.barcode ");
		sql = sql+ ("  on duplicate key  ");
		sql = sql+ (" update upddt = now() ");
		
		System.out.println("=누락제품 서브 이전 ==="+sql);
		
		stmt2 = con.createStatement();
		stmt2.executeUpdate(sql.toString());
		
		
		sql = new String();
		
		sql =(" insert into pos_compproduct "); 
		sql = sql+ ("  (compcd,productid,productcd,barcode,productname,maker,stock,appstock,regdt,regcd) "); 
		sql = sql+ (" select pc.compcd,a.product_code,a.product_code,a.barcode,a.goods_name,a.company_name,stock,appstock,now(),'1' "); 
		sql = sql+ (" from "); 
		sql = sql+ (" ( "); 
		sql = sql+ ("	select busi_no , product_code ,barcode,goods_name,company_name,max(stock) stock,max(reasonable_stock) as appstock "); 
		sql = sql+ ("	from atpos_sales   "); 
		sql = sql+ ("	where sales_date='"+ sdate +"' and length(product_code)>1  "); 
		sql = sql+ ("	group by busi_no , product_code ,barcode,goods_name,company_name  "); 
		sql = sql+ ("  ) a  "); 
		sql = sql+ ("	inner join pos_company pc   "); 
		sql = sql+ ("	  on a.busi_no = pc.corporatenumber  "); 
		sql = sql+ ("  on duplicate key	 "); 
		sql = sql+ ("  update upddt=now() "); 
		
		System.out.println("=누락 판매제품 마스터 이전 ==="+sql);
		
		stmt3 = con.createStatement();
		stmt3.executeUpdate(sql.toString());
		
		sql = new String();
		
		sql =(" insert into pos_compproductgroup "); 
		sql = sql+ ("  (compcd,productsid,productid,productcd,barcode,productname,maker,packingunit,regdt,regcd) "); 
		sql = sql+ (" select pc.compcd,concat('PIS',a.product_code),a.product_code,a.product_code,a.barcode,a.goods_name,a.company_name,a.unit_cnt,now(),'1' "); 
		sql = sql+ (" from "); 
		sql = sql+ (" ( "); 
		sql = sql+ ("	select busi_no , product_code ,barcode,goods_name,company_name,unit_cnt "); 
		sql = sql+ ("	from atpos_sales    "); 
		sql = sql+ ("	where sales_date='"+ sdate +"' and length(product_code)>1  "); 
		sql = sql+ ("	group by busi_no , product_code ,barcode,goods_name,company_name,unit_cnt  "); 
		sql = sql+ ("  ) a  "); 
		sql = sql+ ("	inner join pos_company pc   "); 
		sql = sql+ ("	  on a.busi_no = pc.corporatenumber  "); 
		sql = sql+ ("  on duplicate key	 "); 
		sql = sql+ ("  update upddt=now() "); 
		
		System.out.println("=누락 판매제품 상세 이전 ==="+sql);
		
		stmt4 = con.createStatement();
		stmt4.executeUpdate(sql.toString());
		
		sql = null;
		
		if(stmt != null) stmt.close();
		if(stmt2 != null) stmt2.close();
		if(stmt3 != null) stmt3.close();
		if(stmt4 != null) stmt4.close();
	}
	
	public void setDeleteTemp(Connection con)  throws Exception {
		
		Statement stmt = null;
		String sql = null;

		sql = new String();

		sql =(" delete from pos_payment_temp "); 
		System.out.println("=Temp 테이블 삭제 ==="+sql);
		
		stmt = con.createStatement();
		stmt.executeUpdate(sql.toString());

		sql = null;
		
		if(stmt != null) stmt.close();
		
	}
	
	public void setCharmSalesData(Connection con, Connection con2, String sdate, String edate)  throws Exception {
		
		Statement stmt = null;
		PreparedStatement pstmt = null;
		
		ResultSet rs = null;
		String sql = null;
		String sql2 = null;
		
		sql = new String();
		sql2 = new String();
		
		int rescnt = 0;
		
		sql =( " select pc.corporatenumber  as businessno, ");
		sql = sql + ( " 		   pp.paymentcd , ");
		sql = sql + ( " 		   pp.auth_no , ");
		sql = sql + ( " 		   pp.auth_date , ");
		sql = sql + ( " 		   pp.auth_time , ");
		sql = sql + ( " 		   pp.paygubn , ");
		sql = sql + ( " 		   pp.card , ");
		sql = sql + ( " 		   pp.money , ");
		sql = sql + ( " 		   pp.amt , ");
		sql = sql + ( " 		   pp.vat, ");
		sql = sql + ( " 		   pp.discount , ");
		sql = sql + ( " 		   pp.total , ");
		sql = sql + ( " 		   pp.money_no , ");
		sql = sql + ( " 		   pp.prescription_no , ");
		sql = sql + ( " 		   pp.etcamt , ");
		sql = sql + ( " 		   now() ");
		sql = sql + ( " 	from pos_payment pp ");
		sql = sql + ( " 	inner join pos_company pc  ");
		sql = sql + ( " 		on pp.compcd = pc.compcd  ");
		sql = sql + ( " 	where pp.auth_date between '"+ sdate +"' and '"+ edate +"' and pp.compcd in( ");
		sql = sql + ( " 		select compcd from pos_chaincompany where chaincode='CHA0000000006'  ");
		sql = sql + ( " 	) and paymentcd in( ");
		sql = sql + ( "		select paymentcd from pos_salelist where salesday between '"+ sdate +"' and '"+ edate +"' and compcd in( ");
		sql = sql + ( "				select compcd from pos_chaincompany where chaincode='CHA0000000006'  ");
		sql = sql + ( "			) group by paymentcd ");
		sql = sql + ( "		) ");
		
		
		System.out.println("sql:결제 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		sql2 =( " insert into charm_payment(businessno,paymentcd ,auth_no ,auth_date ,auth_time ,paygubn ,card ,money ,amt ,vat,discount ,total , money_no ,prescription_no ,etcamt , transdt) ");
		sql2 = sql2 + ( " values(?,? ,? ,? ,? ,? ,? ,? ,? ,?,? ,? , ? ,? ,?,now() ) on duplicate key update upddt = now() ");
		
		System.out.println("sql:결제 등록="+sql2.toString());
		pstmt = con2.prepareStatement(sql2.toString());
		
		int rescnt2 = 0;
		
		while (rs.next() && rs != null) {
			
			/*  결제 등록(마스터) */
			pstmt.setString(1,rs.getString("businessno"));
			pstmt.setString(2,rs.getString("paymentcd"));
			pstmt.setString(3,rs.getString("auth_no"));
			pstmt.setString(4,rs.getString("auth_date"));
			pstmt.setString(5,rs.getString("auth_time"));
			pstmt.setString(6,rs.getString("paygubn"));
			pstmt.setString(7,rs.getString("card"));
			pstmt.setString(8,rs.getString("money"));
			pstmt.setString(9,rs.getString("amt"));
			pstmt.setString(10,rs.getString("vat"));
			pstmt.setString(11,rs.getString("discount"));
			pstmt.setString(12,rs.getString("total"));
			pstmt.setString(13,rs.getString("money_no"));
			pstmt.setString(14,rs.getString("prescription_no"));
			pstmt.setString(15,rs.getString("etcamt"));
			
			rescnt = rescnt+pstmt.executeUpdate();
			
		}
		
		
		sql = null;
		sql2 = null;
		rs = null;
		stmt = null;
		pstmt = null;
		
		sql =( " select "); 
		sql = sql+ ( " 		pc2.corporatenumber as businessno, ");
		sql = sql+ ( " 		ps.paymentcd, ");
		sql = sql+ ( " 		ps.salescd  as salescd, ");
		sql = sql+ ( " 		ps.salesdate, ");
		sql = sql+ ( " 		ps.salesday, ");
		sql = sql+ ( " 		ps.salestime, ");
		sql = sql+ ( " 		ps.productcd, ");
		sql = sql+ ( " 		pc.barcode, ");
		sql = sql+ ( " 		ps.cnt, ");
		sql = sql+ ( " 		ps.price, ");
		sql = sql+ ( " 		ps.discount, ");
		sql = sql+ ( " 		ps.amt, ");
		sql = sql+ ( " 		ps.vat, ");
		sql = sql+ ( " 		ps.total, ");
		sql = sql+ ( " 		pc.productname, ");
		sql = sql+ ( " 		pc.maker, ");
		sql = sql+ ( " 		unit, ");
		sql = sql+ ( " 		pc.spec, ");
		sql = sql+ ( " 		pc.packingunit, ");
		sql = sql+ ( " 		pc3.stock , ");
		sql = sql+ ( " 		pc3.appropriatestock as appstock ");
		sql = sql+ ( "	from pos_salelist ps ");
		sql = sql+ ( "		inner join pos_payment pp  ");
		sql = sql+ ( "			on ps.paymentcd = pp.paymentcd and ps.compcd = pp.compcd  ");
		sql = sql+ ( "		inner join pos_compproductgroup pc  ");
		sql = sql+ ( "			on ps.compcd = pc.compcd and ps.productcd = pc.productcd and pp.compcd = pc.compcd  ");
		sql = sql+ ( "		inner join pos_company pc2  ");
		sql = sql+ ( "			on ps.compcd = pc2.compcd and pp.compcd = pc2.compcd and pc.compcd = pc2.compcd  ");
		sql = sql+ ( "		left outer join pos_compstock pc3  ");
		sql = sql+ ( "			on pc.compcd = pc3.compcd and pc.productid = pc3.productid and pc2.compcd = pc3.compcd  ");
		sql = sql+ ( "	where ps.salesday between '"+ sdate +"' and '"+ edate +"' and ps.compcd in( ");
		sql = sql+ ( "			select compcd from pos_chaincompany where chaincode='CHA0000000006'  ");
		sql = sql+ ( "	) ");
		
		
		System.out.println("sql:판매 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		sql2 =( " insert into charm_sales(businessno,paymentcd,salescd,salesdate,salesday,salestime,productcd,barcode,cnt,price,discount,amt,vat,total,productname,maker,unit,spec,packingunit,transdt,stock,appstock) ");
		sql2 = sql2 + ( " values(?,? ,? ,? ,? ,? ,? ,? ,? ,?,? ,? , ? ,? ,?,?,?,?,?,now(),?,?) on duplicate key update upddt=now() ");
		System.out.println("sql:판매 등록="+sql2.toString());
		pstmt = con2.prepareStatement(sql2.toString());
		
		while (rs.next() && rs != null) {
			
			/* 판매 등록(마스터) */
			pstmt.setString(1,rs.getString("businessno"));
			pstmt.setString(2,rs.getString("paymentcd"));
			pstmt.setString(3,rs.getString("salescd"));
			pstmt.setString(4,rs.getString("salesdate"));
			pstmt.setString(5,rs.getString("salesday"));
			pstmt.setString(6,rs.getString("salestime"));
			pstmt.setString(7,rs.getString("productcd"));
			pstmt.setString(8,rs.getString("barcode"));
			pstmt.setString(9,rs.getString("cnt"));
			pstmt.setString(10,rs.getString("price"));
			pstmt.setString(11,rs.getString("discount"));
			pstmt.setString(12,rs.getString("amt"));
			pstmt.setString(13,rs.getString("vat"));
			pstmt.setString(14,rs.getString("total"));
			pstmt.setString(15,rs.getString("productname"));
			pstmt.setString(16,rs.getString("maker"));
			pstmt.setString(17,rs.getString("unit"));
			pstmt.setString(18,rs.getString("spec"));
			pstmt.setString(19,rs.getString("packingunit"));
			pstmt.setString(20,rs.getString("stock"));
			pstmt.setString(21,rs.getString("appstock"));
			
			rescnt2 = rescnt2+pstmt.executeUpdate();
			
		}
		
		sql = null;
		sql2 = null;
		
		if(stmt != null) stmt.close();
		if(pstmt != null) pstmt.close();
		if(rs != null) rs.close();
		
	}
	
	
		public void setCompanySumary(Connection con, String sdate, String edate)  throws Exception {
		
		PreparedStatement pstmt = null;
		
		String sql = null;
		
		sql = new String();
		
		int rescnt = 0;
		
		sql =( " insert into pos_payment_daysum(compcd,auth_date,apptotal,appcnt,cantotal,cancnt,etc,otc,card,money,amt,vat,total,discount,mcnt,fcnt,10m,10f,20m,20f,30m,30f,40m,40f,50m,50f,60m,60f,70m,70f,80m,80f,regdt) ");
		sql = sql + ( " 		select   ");
		sql = sql + ( " 		compcd, ");
		sql = sql + ( " 		auth_date, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then total else 0 end)  apptotal, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then 1 else 0 end)  appcnt, ");
		sql = sql + ( " 		sum(case when paygubn='CAN' then total else 0 end)  cantotal, ");
		sql = sql + ( " 		sum(case when paygubn='CAN' then 1 else 0 end)  cancnt, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then etcamt when paygubn='CAN' then 0-ifnull(etcamt,0) else 0 end) etc, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then amt when paygubn='CAN' then 0-ifnull(amt,0) else 0 end) otc, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then card when paygubn='CAN' then 0-ifnull(card,0) else 0 end) card, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then money when paygubn='CAN' then 0-ifnull(money,0) else 0 end) money, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then etcamt+amt when paygubn='CAN' then 0-(ifnull(etcamt,0)+ifnull(amt,0)) else 0 end) amt, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then vat when paygubn='CAN' then 0-ifnull(vat,0) else 0 end) vat, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then total when paygubn='CAN' then 0-ifnull(total,0) else 0 end) total, ");
		sql = sql + ( " 		sum(case when paygubn='ACC' then discount when paygubn='CAN' then 0-ifnull(discount,0) else 0 end) discount, ");
		sql = sql + ( "			sum(case when pp.sex='M' then 1 else 0 end) as mcnt, ");
		sql = sql + ( "			sum(case when pp.sex='F' then 1 else 0 end) as fcnt, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)<='1' and pp.sex='M' then 1 else 0 end) 10m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)<='1' and pp.sex='F' then 1 else 0 end) 10f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='2' and pp.sex='M' then 1 else 0 end) 20m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='2' and pp.sex='F' then 1 else 0 end) 20f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='3' and pp.sex='M' then 1 else 0 end) 30m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='3' and pp.sex='F' then 1 else 0 end) 30f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='4' and pp.sex='M' then 1 else 0 end) 40m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='4' and pp.sex='F' then 1 else 0 end) 40f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='5' and pp.sex='M' then 1 else 0 end) 50m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='5' and pp.sex='F' then 1 else 0 end) 50f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='6' and pp.sex='M' then 1 else 0 end) 60m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='6' and pp.sex='F' then 1 else 0 end) 60f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='7' and pp.sex='M' then 1 else 0 end) 70m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='7' and pp.sex='F' then 1 else 0 end) 70f, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)>='8' and pp.sex='M' then 1 else 0 end) 80m, ");
		sql = sql + ( "			sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)>='8' and pp.sex='F' then 1 else 0 end) 80f, now() ");
		sql = sql + ( " 	from pos_payment pp ");
		sql = sql + ( " 	where auth_date between ? and ? ");
		sql = sql + ( " 	group by compcd,auth_date ");
		sql = sql + ( " 	on duplicate key update upddt = now() ");
		
		System.out.println("sql:가맹점 결제 집계 등록="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
			
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		
		sql =( " insert into pos_salelist_daysum(compcd,productcd,salesday,cnt,discount,amt,vat,total) ");
		sql = sql + ( " 		select ps.compcd,ps.productcd,ps.salesday, ");
		sql = sql + ( " 		sum(case when pp.paygubn='ACC' then ps.cnt when pp.paygubn='CAN' then 0-ifnull(ps.cnt,0) else 0 end) cnt, ");
		sql = sql + ( " 		sum(case when pp.paygubn='ACC' then ps.discount when pp.paygubn='CAN' then 0-ifnull(ps.discount,0) else 0 end) discount, ");
		sql = sql + ( " 		sum(case when pp.paygubn='ACC' then ps.amt when pp.paygubn='CAN' then 0-ifnull(ps.amt,0) else 0 end) amt, ");
		sql = sql + ( " 		sum(case when pp.paygubn='ACC' then ps.vat when pp.paygubn='CAN' then 0-ifnull(ps.vat,0) else 0 end) vat, ");
		sql = sql + ( " 		sum(case when pp.paygubn='ACC' then ps.total when pp.paygubn='CAN' then 0-ifnull(ps.total,0) else 0 end) total  ");
		sql = sql + ( " from pos_salelist ps ");
		sql = sql + ( " 	inner join pos_payment pp  ");
		sql = sql + ( " 		on ps.compcd = pp.compcd and ps.paymentcd = pp.paymentcd  ");
		sql = sql + ( " where ps.salesday between ? and ? ");
		sql = sql + ( " group by ps.compcd,ps.productcd,ps.salesday ");
		sql = sql + ( " on duplicate key update upddt = now() ");
		
		System.out.println("sql:가맹점 판매 집계 등록="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
			
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		
		sql =( " insert into pos_payment_chain_daysum(chaincode,auth_date,compcnt,apptotal,appcnt,cantotal,cancnt,etc,otc,card,money,amt,vat,total,discount,mxcompcd,micompcd,mcnt,fcnt,10m,10f,20m,20f,30m,30f,40m,40f,50m,50f,60m,60f,70m,70f,80m,80f,regdt) ");
		sql = sql + ( "select  pc.chaincode,pp.auth_date, ");
		sql = sql + ( "	count(distinct(pp.compcd)) as compcnt, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then total else 0 end)  apptotal, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then 1 else 0 end)  appcnt, ");
		sql = sql + ( "	sum(case when paygubn='CAN' then total else 0 end)  cantotal, ");
		sql = sql + ( "	sum(case when paygubn='CAN' then 1 else 0 end)  cancnt, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then etcamt when paygubn='CAN' then 0-ifnull(etcamt,0) else 0 end) etc, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then amt when paygubn='CAN' then 0-ifnull(amt,0) else 0 end) otc, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then card when paygubn='CAN' then 0-ifnull(card,0) else 0 end) card, ");
		sql = sql + ( "		sum(case when paygubn='ACC' then money when paygubn='CAN' then 0-ifnull(money,0) else 0 end) money, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then etcamt+amt when paygubn='CAN' then 0-(ifnull(etcamt,0)+ifnull(amt,0)) else 0 end) amt, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then vat when paygubn='CAN' then 0-ifnull(vat,0) else 0 end) vat, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then total when paygubn='CAN' then 0-ifnull(total,0) else 0 end) total, ");
		sql = sql + ( "	sum(case when paygubn='ACC' then discount when paygubn='CAN' then 0-ifnull(discount,0) else 0 end) discount, ");
		sql = sql + ( "	b.mx,b.mi, ");
		sql = sql + ( "	sum(case when pp.sex='M' then 1 else 0 end) as mcnt, ");
		sql = sql + ( "	sum(case when pp.sex='F' then 1 else 0 end) as fcnt, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)<='1' and pp.sex='M' then 1 else 0 end) 10m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)<='1' and pp.sex='F' then 1 else 0 end) 10f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='2' and pp.sex='M' then 1 else 0 end) 20m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='2' and pp.sex='F' then 1 else 0 end) 20f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='3' and pp.sex='M' then 1 else 0 end) 30m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='3' and pp.sex='F' then 1 else 0 end) 30f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='4' and pp.sex='M' then 1 else 0 end) 40m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='4' and pp.sex='F' then 1 else 0 end) 40f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='5' and pp.sex='M' then 1 else 0 end) 50m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='5' and pp.sex='F' then 1 else 0 end) 50f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='6' and pp.sex='M' then 1 else 0 end) 60m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='6' and pp.sex='F' then 1 else 0 end) 60f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='7' and pp.sex='M' then 1 else 0 end) 70m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)='7' and pp.sex='F' then 1 else 0 end) 70f, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)>='8' and pp.sex='M' then 1 else 0 end) 80m, ");
		sql = sql + ( "	sum(case when length(pp.birthday)=4 and substr(date_format(now(),'%Y')-pp.birthday+1,1,1)>='8' and pp.sex='F' then 1 else 0 end) 80f, now() ");
		sql = sql + ( " from pos_payment pp inner join pos_chaincompany pc on pp.compcd = pc.compcd 	 ");
		sql = sql + ( "     left outer join( ");
		sql = sql + ( "     	select ");
		sql = sql + ( "     		chaincode,auth_date,SUBSTRING_INDEX(group_concat(compcd order by tot DESC), ',', 1) mx, ");
		sql = sql + ( "     		SUBSTRING_INDEX(group_concat(compcd order by tot asc), ',', 1) mi ");
		sql = sql + ( "     	from( ");
		sql = sql + ( "	     	select ");
		sql = sql + ( "	     		pc2.chaincode , pc.compcd,pp.auth_date, ");
		sql = sql + ( "	     		sum(case when pp.paygubn='ACC' then pp.total when pp.paygubn='CAN' then 0-total else 0 end) as tot ");
		sql = sql + ( "	     	from pos_payment pp ");
		sql = sql + ( "	     		inner join pos_company pc  on pp.compcd = pc.compcd  ");
		sql = sql + ( "	     		inner join pos_chaincompany pc2  on pp.compcd = pc2.compcd and pc.compcd = pc2.compcd  ");
		sql = sql + ( "	     	where pp.auth_date between ? and ? and pp.compcd!='CTR4528801339' ");
		sql = sql + ( "	     	group by pp.auth_date,pp.compcd,pc2.chaincode  ");
		sql = sql + ( "	    ) a ");
		sql = sql + ( "     	group by chaincode , auth_date	   "); 
		sql = sql + ( "     ) b ");
		sql = sql + ( "     on pp.auth_date = b.auth_date and pc.chaincode = b.chaincode ");
		sql = sql + ( "where pp.auth_date between  ? and ? and pp.compcd!='CTR4528801339' ");
		sql = sql + ( "group by pc.chaincode,pp.auth_date ");
		sql = sql + ( "on duplicate key update upddt = now() ");
		
		System.out.println("sql:체인점 결제 집계 등록="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
		pstmt.setString(3,sdate);
		pstmt.setString(4,edate);
			
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		
		sql =( " insert into pos_salelist_chain_daysum(chaincode,salesday,productcnt,cnt,discount,amt,vat,total,mxproductcd,miproductcd,regdt) ");
		sql = sql + ( " select ");
		sql = sql + ( " 	aa.chaincode,aa.salesday,aa.productcnt,aa.cnt,aa.discount,aa.amt,aa.vat,aa.total,bb.productcd,cc.productcd,now() ");
		sql = sql + ( " from( ");
		sql = sql + ( " 	select ");
		sql = sql + ( " 		pc.chaincode, ");
		sql = sql + ( " 		ps.salesday, ");
		sql = sql + ( " 			count(distinct(ps.productcd)) as productcnt, ");
		sql = sql + ( " 		sum(case when pp.paygubn = 'ACC' then ps.cnt when pp.paygubn = 'CAN' then 0-ifnull(ps.cnt, 0) else 0 end) cnt, ");
		sql = sql + ( " 		sum(case when pp.paygubn = 'ACC' then ps.discount when pp.paygubn = 'CAN' then 0-ifnull(ps.discount, 0) else 0 end) discount, ");
		sql = sql + ( " 		sum(case when pp.paygubn = 'ACC' then ps.amt when pp.paygubn = 'CAN' then 0-ifnull(ps.amt, 0) else 0 end) amt, ");
		sql = sql + ( " 		sum(case when pp.paygubn = 'ACC' then ps.vat when pp.paygubn = 'CAN' then 0-ifnull(ps.vat, 0) else 0 end) vat, ");
		sql = sql + ( " 		sum(case when pp.paygubn = 'ACC' then ps.total when pp.paygubn = 'CAN' then 0-ifnull(ps.total, 0) else 0 end) total ");
		sql = sql + ( " 	from ");
		sql = sql + ( " 		pos_salelist ps ");
		sql = sql + ( " 	inner join pos_payment pp on ");
		sql = sql + ( " 		ps.compcd = pp.compcd ");
		sql = sql + ( " 		and ps.paymentcd = pp.paymentcd ");
		sql = sql + ( " 	inner join pos_chaincompany pc on ");
		sql = sql + ( " 		pp.compcd = pc.compcd ");
		sql = sql + ( " 		and ps.compcd = pc.compcd ");
		sql = sql + ( " 	where 	pp.auth_date between ? and ? ");
		sql = sql + ( " 					and pp.compcd != 'CTR4528801339' and productcd!='TEMP_BARCODE' ");
		sql = sql + ( " 	group by pc.chaincode,ps.salesday ");
		sql = sql + ( " ) aa ");
		sql = sql + ( " left outer join( ");
		sql = sql + ( " 	select ");
		sql = sql + ( " 		a1.chaincode,a1.productcd,a1.salesday,a1.pdrank ");
		sql = sql + ( " 	from( ");
		sql = sql + ( " 		select ");
		sql = sql + ( " 			a.chaincode,a.productcd,a.salesday, ");
		sql = sql + ( " 			(CASE @chaincode1 WHEN concat(a.chaincode,a.salesday) THEN @rownum := @rownum + 1 ELSE @rownum := 1 END) pdrank, ");
		sql = sql + ( " 			(@chaincode1 := concat(a.chaincode,a.salesday)) chaincode1 ");
		sql = sql + ( " 		from( ");
		sql = sql + ( " 			select ");
		sql = sql + ( " 				pc2.chaincode , ");
		sql = sql + ( " 				ps.productcd, ");
		sql = sql + ( " 				ps.salesday, ");
		sql = sql + ( " 				sum(case when pp.paygubn = 'ACC' then ps.cnt when pp.paygubn = 'CAN' then 0-ps.cnt else 0 end) as cnt ");
		sql = sql + ( " 			from ");
		sql = sql + ( " 				pos_salelist ps ");
		sql = sql + ( " 			inner join pos_payment pp on ");
		sql = sql + ( " 				ps.compcd = pp.compcd ");
		sql = sql + ( " 				and ps.paymentcd = pp.paymentcd ");
		sql = sql + ( " 			inner join pos_company pc on ");
		sql = sql + ( " 				pp.compcd = pc.compcd ");
		sql = sql + ( " 			inner join pos_chaincompany pc2 on ");
		sql = sql + ( " 				pp.compcd = pc2.compcd ");
		sql = sql + ( " 				and pc.compcd = pc2.compcd ");
		sql = sql + ( " 			where ");
		sql = sql + ( " 				pp.auth_date between ? and ? ");
		sql = sql + ( " 				and pp.compcd != 'CTR4528801339' and productcd!='TEMP_BARCODE' ");
		sql = sql + ( " 			group by ");
		sql = sql + ( " 				pc2.chaincode , ");
		sql = sql + ( " 				ps.productcd, ");
		sql = sql + ( " 				ps.salesday ");
		sql = sql + ( " 		)a ,(SELECT @chaincode1 :='',@rownum := 0 FROM DUAL) b ");
		sql = sql + ( " 		order by a.chaincode asc,a.salesday,a.cnt desc ");
		sql = sql + ( " 	) a1  ");
		sql = sql + ( " 	where a1.pdrank=1 ");
		sql = sql + ( " ) bb on	aa.chaincode = bb.chaincode and aa.salesday = bb.salesday ");
		sql = sql + ( " left outer join( ");
		sql = sql + ( " 	select ");
		sql = sql + ( " 		a1.chaincode,a1.productcd,a1.salesday,a1.pdrank ");
		sql = sql + ( " 	from( ");
		sql = sql + ( " 		select ");
		sql = sql + ( " 			a.chaincode,a.productcd,a.salesday, ");
		sql = sql + ( " 			(CASE @chaincode1 WHEN concat(a.chaincode,a.salesday) THEN @rownum := @rownum + 1 ELSE @rownum := 1 END) pdrank, ");
		sql = sql + ( " 			(@chaincode1 := concat(a.chaincode,a.salesday)) chaincode1 ");
		sql = sql + ( " 		from( ");
		sql = sql + ( " 			select ");
		sql = sql + ( " 				pc2.chaincode , ");
		sql = sql + ( " 				ps.productcd, ");
		sql = sql + ( " 				ps.salesday, ");
		sql = sql + ( " 				sum(case when pp.paygubn = 'ACC' then ps.cnt when pp.paygubn = 'CAN' then 0-ps.cnt else 0 end) as cnt ");
		sql = sql + ( " 			from ");
		sql = sql + ( " 				pos_salelist ps ");
		sql = sql + ( " 			inner join pos_payment pp on ");
		sql = sql + ( " 				ps.compcd = pp.compcd ");
		sql = sql + ( " 				and ps.paymentcd = pp.paymentcd ");
		sql = sql + ( " 			inner join pos_company pc on ");
		sql = sql + ( " 				pp.compcd = pc.compcd ");
		sql = sql + ( " 			inner join pos_chaincompany pc2 on ");
		sql = sql + ( " 				pp.compcd = pc2.compcd ");
		sql = sql + ( " 				and pc.compcd = pc2.compcd ");
		sql = sql + ( " 			where ");
		sql = sql + ( " 				pp.auth_date between ? and ? ");
		sql = sql + ( " 				and pp.compcd != 'CTR4528801339' and productcd!='TEMP_BARCODE' ");
		sql = sql + ( " 			group by ");
		sql = sql + ( " 				pc2.chaincode , ");
		sql = sql + ( " 				ps.productcd, ");
		sql = sql + ( " 				ps.salesday ");
		sql = sql + ( " 		)a ,(SELECT @chaincode1 :='',@rownum := 0 FROM DUAL) b ");
		sql = sql + ( " 		order by a.chaincode asc,a.salesday,a.cnt asc ");
		sql = sql + ( " 	) a1  ");
		sql = sql + ( " 	where a1.pdrank=1 ");
		sql = sql + ( " 	) cc on	aa.chaincode = cc.chaincode and aa.salesday = cc.salesday ");
		sql = sql + ( " 	on duplicate key update upddt = now() ");
		 
		System.out.println("sql:체인점 판매 집계 등록="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
		pstmt.setString(3,sdate);
		pstmt.setString(4,edate);
		pstmt.setString(5,sdate);
		pstmt.setString(6,edate);
			
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		
		sql = (" insert into pos_payment_backup( ");
		sql = sql + ( " 		compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat, ");
		sql = sql + ( " 		total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,cardno,etcamt,auth_ti, ");
		sql = sql + ( " 		trans_filler,vancd,regdt,upddt,paycd ");
		sql = sql + ( " 	) ");
		sql = sql + ( " 	select  ");
		sql = sql + ( " 		compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,card,money,amt,vat, ");
		sql = sql + ( " 		total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,cardno,etcamt,auth_ti, ");
		sql = sql + ( " 		trans_filler,vancd,regdt,upddt,paycd ");
		sql = sql + ( " 	from pos_payment where auth_date between ? and ? ");
		sql = sql + ( " 	on duplicate key update upddt=now() ");
		
		System.out.println("sql:가맹점 결제자료 백업="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
		
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		
		sql = ( " insert into pos_salelist_backup( ");
		sql = sql + ( " compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt, ");
		sql = sql + ( " paymentcd,productsid,birth_year,purprice,salesti,upddt) ");
		sql = sql + ( " select compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd, ");
		sql = sql + ( " productsid,birth_year,purprice,salesti,now() ");
		sql = sql + ( " from pos_salelist  ");
		sql = sql + ( " where salesday between ? and ? on duplicate key update upddt=now() ");
		
		System.out.println("sql:가맹점 판매자료 백업="+sql.toString());
		pstmt = con.prepareStatement(sql.toString());
		
		pstmt.setString(1,sdate);
		pstmt.setString(2,edate);
		
		rescnt = rescnt+pstmt.executeUpdate();
		
		sql = null;
		pstmt = null;
		if(pstmt != null) pstmt.close();
		
	}
	
	
	public static String isNull(String str) {
        if (str == null || (str != null && str.equals("null")) || str.equals("-"))
            return " ";
        else return str;
    }
    
    public String chartColor(int row){
    	 String[] COLORFUL_COLORS = {
             "#900C3F","#C70039","#FF5733","#FFC300","#DAF7A6","#3f51b5","#4db6ac","#f06292","#ffc107","#e6ee9c","#9fa8da" };
    	 return COLORFUL_COLORS[row];
    }
        
    
	%>