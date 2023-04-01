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

	// 
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