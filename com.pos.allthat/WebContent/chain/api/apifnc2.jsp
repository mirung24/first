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
	호출명 : companyCheck
	용도	 : 가맹점 확인
	버젼  : 1.0
	작성자 : 22.09.27
	작성일 : Jerry
	
	*/
	
	public String getCompcd(Connection con,String corporatenumber) throws Exception {
		
		String compcd = null;
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		
		sql = new String();
		
		sql = (" select compcd from pos_company where replace(corporatenumber,'-','')=replace('"+ corporatenumber +"','-','')  ");
		
		System.out.println("compcd sql="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());

		if (rs != null && rs.next()) {
			compcd = rs.getString("compcd");
		}else{
			compcd="";
		}
				
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		System.out.println("compcd="+compcd);
		
		return compcd;
		
	}
	
	/* 
	호출명 : companyCheck
	용도	 : 가맹점 확인
	버젼  : 1.0
	작성자 : 22.09.27
	작성일 : Jerry
	
	*/
	
	public String getChaincode(Connection con,String compcd) throws Exception {
		
		String chaincode = null;
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		
		sql = new String();
		
		sql = (" select chaincode from pos_chaincompany pc inner join pos_company po on pc.compcd = po.compcd where po.compcd='"+ compcd +"' ");
		System.out.println("sql="+sql);
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());

		if (rs != null && rs.next()) {
			chaincode = rs.getString("chaincode");
		}else{
			chaincode="999999999";
		}
				
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return chaincode;
		
	}
	
	/* 
	호출명 : companyCheck
	용도	 : 가맹점 확인
	버젼  : 1.0
	작성자 : 22.09.27
	작성일 : Jerry
	
	*/
	
	public String CompanyCheck(Connection con,String corporatenumber,String tid,String serialno) throws Exception {
		
		String checkComp = null;
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		
		sql = new String();
		
		sql = (" select count(*) as cnt from pos_company co inner join pos_comptid pc on co.compcd = pc.compcd  ");
		sql = sql + (" where co.useyn='Y' and co.corporatenumber ='"+ corporatenumber +"'  ");
		if(tid!=null && tid !=""){
			sql = sql + (" and pc.tid = '"+ tid +"' "); 
		}
		if(serialno!=null && serialno !=""){
			sql = sql + (" and pc.serialno = '"+ serialno +"' "); 
		}
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());

		if (rs != null && rs.next()) {
			if(rs.getInt("cnt")>0){
				checkComp = "Y";
			}else{
				checkComp = "N";
			}
		}else{
			checkComp = "N";
		}
				
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return checkComp;
		
	}
	
	
	/* 
	호출명 : Login
	용도	 : 가맹점 POS 로그인
	버젼  : 1.0
	작성자 : 22.09.19
	작성일 : Jerry
	
	*/
	
	public JSONArray LoginPost(Connection con,String corporatenumber,String userid,String passwd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select compcd,userseq,userid,name from pos_companyuser ");
		sql = sql + (" where userid ='"+ userid +"' and passwd='"+ passwd +"' and (resigndate is null or resigndate='') ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("compcd", rs.getString("compcd"));
			subData.put("userid", rs.getString("userid"));
			subData.put("name", rs.getString("name"));
							
			masterData.put(subData);
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return masterData;
	}
	
	/* 
	호출명 : userlist
	용도	 : 가맹점 판매자목록
	버젼  : 1.0
	작성자 : 22.11.29
	작성일 : Jerry
	
	*/
	public JSONArray UserList(Connection con,String compcd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select userseq,userid,name from pos_companyuser ");
		sql = sql + (" where compcd ='"+ compcd +"' and resigndate is null ");
		
		System.out.println("sql="+sql);
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {
			
			JSONObject subData = new JSONObject();
			
			subData.put("userseq", rs.getString("userseq"));
			subData.put("userid", rs.getString("userid"));
			subData.put("name", rs.getString("name"));
							
			
			masterData.put(subData);
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		return masterData;
	}
	
	/* 
	호출명 : Login
	용도	 : 로그인 이력 등록
	버젼  : 1.0
	작성자 : 22.09.19
	작성일 : Jerry
	
	*/
	public void loginHistroy(Connection con, String userid, String devicenumber) throws Exception {
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		int setData = 0;

		sql = new String();

		sql = ("  insert into posuser_loghist (userid, logindate,loginip)  ");
		sql = sql + ("  values('"+ userid +"', now(), '" + devicenumber + "') ");

		System.out.println("loginHistroy sql = " + sql);
		
		stmt = con.createStatement();
		setData = stmt.executeUpdate(sql.toString());

		if (stmt != null)
			stmt.close();
		if (sql != null)
			sql = null;

	}
	
	
	/* 
	호출명 : checkConfigInfo
	용도	 : 가맹점 단말기 설정정보 체크
	버젼  : 1.0
	작성자 : 22.09.19
	작성일 : Jerry
	
	*/
	public int checkConfigInfo(Connection con,String compcd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select count(*) as cnt from pos_config ");
		sql = sql + (" where compcd ='"+ compcd +"' ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		rs.next();
		
		int cnt = rs.getInt("cnt");

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return cnt;
	}
	
	/* 
	호출명 : getCompconfigInfo
	용도	 : 단멀기 설정정보
	버젼  : 1.0
	작성자 : 22.09.28
	작성일 : Jerry
	
	
	public JSONArray getCompconfigInfo(Connection con,String compcd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select * from pos_config ");
		sql = sql + (" where compcd ='"+ compcd +"' ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("gatewayip", isNull(rs.getString("gatewayip")));
			subData.put("gatewayport", isNull(rs.getString("gatewayport")));
			subData.put("syncinfo", isNull(rs.getString("syncinfo")));
			subData.put("runtosync", isNull(rs.getString("runtosync")));
			subData.put("loadsync", isNull(rs.getString("loadsync")));
			subData.put("autoupdate", isNull(rs.getString("autoupdate")));
			subData.put("sound", isNull(rs.getString("sound")));
			subData.put("soundvol", isNull(rs.getString("soundvol")));
			subData.put("custvol", isNull(rs.getString("custvol")));
			subData.put("cardalram", isNull(rs.getString("cardalram")));
			subData.put("appauto", isNull(rs.getString("appauto")));
			subData.put("logohidden", isNull(rs.getString("logohidden")));
			subData.put("custprint", isNull(rs.getString("custprint")));
			subData.put("compprintadd", isNull(rs.getString("compprintadd")));
			subData.put("moneyprintadd", isNull(rs.getString("moneyprintadd")));
			subData.put("productprint", isNull(rs.getString("productprint")));
			subData.put("cancelbarcode", isNull(rs.getString("cancelbarcode")));
			subData.put("vatuse", isNull(rs.getString("vatuse")));
			subData.put("vatnon", isNull(rs.getString("vatnon")));
			subData.put("moneyic", isNull(rs.getString("moneyic")));
			subData.put("etcotc", isNull(rs.getString("etcotc")));
			subData.put("etcotcsort", isNull(rs.getString("etcotcsort")));
			subData.put("bongtu", isNull(rs.getString("bongtu")));
			subData.put("bongtunon ", isNull(rs.getString("bongtunon")));
			subData.put("bongtuchoice", isNull(rs.getString("bongtuchoice")));
			subData.put("bongtuprice", isNull(rs.getString("bongtuprice")));
			subData.put("posexchange", isNull(rs.getString("posexchange")));
			subData.put("custmoniter", isNull(rs.getString("custmoniter")));
			subData.put("amtchange ", isNull(rs.getString("amtchange")));
			subData.put("unit", isNull(rs.getString("unit")));
			subData.put("custreglist", isNull(rs.getString("custreglist")));
			subData.put("cusetdetail", isNull(rs.getString("cusetdetail")));
			subData.put("custsignpad", isNull(rs.getString("custsignpad")));
			subData.put("custkeyboard", isNull(rs.getString("custkeyboard")));
			subData.put("endetclist", isNull(rs.getString("endetclist")));
			subData.put("sumpay", isNull(rs.getString("sumpay")));
			subData.put("autorefresh", isNull(rs.getString("autorefresh")));
			subData.put("yetetclist", isNull(rs.getString("yetetclist")));
			subData.put("nonpaycust", isNull(rs.getString("nonpaycust")));
			subData.put("etcbutton", isNull(rs.getString("etcbutton")));
			subData.put("refresh", isNull(rs.getString("refresh")));
							
			masterData.put(subData);
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return masterData;
	}
	*/
	
	/*
	호출명 : getCompconfigInfo
	용도	 : 단멀기 설정정보
	버젼  : 1.0
	작성자 : 22.09.28
	작성일 : Jerry
	*/
	
	public String getCompconfigInfo(Connection con,String compcd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select config from pos_compconfig ");
		sql = sql + (" where compcd ='"+ compcd +"' ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		String config = "";
		
		while (rs.next() && rs != null) {
				
			config = isNull(rs.getString("config"));
			
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return config;
		
	}
	
	/*
	호출명 : getCompconfigInfo
	용도	 : 단멀기 설정정보 등록
	버젼  : 1.0
	작성자 : 22.09.28
	작성일 : Jerry
	*/
	
	public int setCompconfigInfo(Connection con, String compcd , String config, String remoteip)throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		int setData = 0;

		sql = new String();

		sql = ("  insert into pos_compconfig (compcd , config, insdate, remoteip) ");
		sql = sql + (" values('"+ compcd +"', '"+ config +"', now(), '"+ remoteip +"') ");
		sql = sql + (" on duplicate  key update  ");
		sql = sql + (" config ='"+ config +"',  ");
		sql = sql + (" upddate =now(),  ");
		sql = sql + (" remoteip ='"+ remoteip +"' ");

		
		System.out.println("setCompconfigInfo sql = " + sql);
		
		stmt = con.createStatement();
		setData = stmt.executeUpdate(sql.toString());

		if (stmt != null)
			stmt.close();
		if (sql != null)
			sql = null;
		
		return setData;
	}
		
	/* 
	호출명 : getProductInfoList
	용도	 : 제품정보 
	버젼  : 1.0
	작성자 : 22.09.28
	작성일 : Jerry
	
	*/
	
	public JSONArray getProductInfoList(Connection con,String compcd,String barcode,String chaincode,String productid) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		if(barcode!="8808989" && chaincode!="999999999"){
			
			/* 통합 마스터에서 체인마스터로 카피 */
			stmt = null;
			sql = null;
			
			sql = (" insert into pos_chainproduct(chaincode,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,remarks ,category3cd,regcd,regdt) ");
			sql = sql + (" select '"+ chaincode +"',productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size,'','','1',now() from pos_product where productid='"+ productid +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:체인 마스터 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());
			
			/* 통합 상품에서 체인상품으로 카피 */
			sql = (" insert into pos_chainproductgroup(chaincode,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,regcd,regdt) ");
			sql = sql + (" select '"+ chaincode +"',fn_barcode('BAR'),productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,'1',now() from pos_productgroup where barcode='"+ barcode +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:가맹점 상품 등록="+sql.toString());
	
			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());		

			/* 체인 마스터에서 가맹점마스터로 카피 */
			stmt = null;
			sql = null;
			
			sql = (" insert into pos_compproduct(compcd,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,regcd,regdt) ");
			sql = sql + (" select '"+compcd +"',productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size,'1',now() from pos_chainproduct where chaincode='"+ chaincode +"' and productid='"+ productid +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:가맹점 마스터 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());
							
			
			/* 체인 상품에서 가맹점상품으로 카피 */
			stmt = null;
			sql = null;
			
			sql = (" insert into pos_compproductgroup(compcd,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,remarks,regcd,regdt) ");
			sql = sql + (" select '"+compcd +"',fn_barcode('BAR'),productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,'','1',now() from pos_chainproductgroup where chaincode='"+ chaincode +"' and barcode='"+ barcode +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:가맹점 상품 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());
			
		}
		
		if(chaincode.equals("999999999") && barcode!="8808989"){
			
			/* 통합 마스터에서 가맹점마스터로 카피 */
			stmt = null;
			sql = null;
			
			sql = (" insert into pos_compproduct(compcd,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,regcd,regdt) ");
			sql = sql + (" select '"+compcd +"',productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size,'1',now() from pos_product where productid='"+ productid +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:가맹점 마스터 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());

			
			
			/* 통합 상품에서 가맹점상품으로 카피 */
			stmt = null;
			sql = null;
			
			sql = (" insert into pos_compproductgroup(compcd,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,remarks,regcd,regdt) ");
			sql = sql + (" select '"+compcd +"',fn_barcode('BAR'),productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,'','1',now() from pos_productgroup where barcode='"+ barcode +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update upddt = now() ");
			System.out.println("sql:가맹점 상품 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());
			
		}
		
		
		stmt = null;
		
		/* 2. 제품정보 조회 */
		sql =  (" select ");
		sql = sql + (" 	pg.productid,pg.productcd,pg.productname, pg.barcode , pg.maker ,pg.packingunit,pg.spec,pg.unit,pg.size, ifnull(pdate.mxprice,0) as mxprice, ");
		sql = sql + (" 	ifnull(pdate.miprice, 0) as miprice, ");
		sql = sql + (" 	ifnull(pdate.maprice, 0) as maprice, ");
		sql = sql + (" 	ifnull(st.stock, 0) as stock, ");
		sql = sql + (" 	ifnull(st.appropriatestock, 0) as appstock , ");
		sql = sql + (" 	floor(ifnull(st.stock, 0) / case when pg.packingunit is null or pg.packingunit = '' or pg.packingunit = 0 then 1 else pg.packingunit end) as salestock, ");
		sql = sql + (" 	ifnull(pg.price, 0) as price, ");
		sql = sql + (" 	ifnull(pg.purprice, 0) as purprice ");
		sql = sql + (" from ");
		sql = sql + (" pos_compproductgroup pg ");
		sql = sql + (" left outer join ( ");
		sql = sql + (" 	select ");
		sql = sql + (" 		barcode, ");
		sql = sql + (" 		SUBSTRING_INDEX(group_concat(salesprice order by pcnt DESC), ',', 1) AS maprice, ");
		sql = sql + (" 		min(salesprice) as miprice, ");
		sql = sql + (" 		max(salesprice) as mxprice ");
		sql = sql + (" 	FROM ");
		sql = sql + (" 		( ");
		sql = sql + (" 		select ");
		sql = sql + (" 			barcode, ");
		sql = sql + (" 			ifnull(cast(salesprice as decimal), 0) as salesprice, ");
		sql = sql + (" 			count(*) as pcnt ");
		sql = sql + (" 		from ");
		sql = sql + (" 			pos_compproductgroup ");
		sql = sql + (" 		where barcode = '"+ barcode +"' ");
		sql = sql + (" 		GROUP BY ");
		sql = sql + (" 			barcode,ifnull(cast(salesprice as decimal), 0) "); 
		sql = sql + (" 	) mmm  ");
		sql = sql + (" 	group by barcode "); 
		sql = sql + (" ) pdate ");
		sql = sql + (" 	on pg.barcode = pdate.barcode ");
		sql = sql + (" left outer join pos_compstock st  ");
		sql = sql + (" on pg.compcd = st.compcd and pg.productid = st.productid ");
		sql = sql + (" where 1=1 ");
		sql = sql + ("	             and pg.compcd = '"+ compcd +"' ");
		sql = sql + ("	             and pg.barcode='"+ barcode +"' ");
		
		System.out.println("=======제품 정보 조회========"+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("productid", rs.getString("productid"));
			subData.put("productcd", rs.getString("productcd"));
			subData.put("barcode", rs.getString("barcode"));
			subData.put("productname", rs.getString("productname"));
			subData.put("maker", isNull(rs.getString("maker")));
			subData.put("packingunit", rs.getString("packingunit"));
			subData.put("spec", rs.getString("spec"));
			subData.put("unit", rs.getString("unit"));
			subData.put("size", rs.getString("size"));
			subData.put("price", rs.getString("price"));
			if(barcode.equals("8808989")){
				subData.put("maprice", "");
				subData.put("mxprice", "");
				subData.put("miprice", "");
			}else{
				subData.put("maprice", rs.getString("maprice"));
				subData.put("mxprice", rs.getString("mxprice"));
				subData.put("miprice", rs.getString("miprice"));
			}
			subData.put("stock", rs.getString("stock"));
			subData.put("salestock", rs.getString("salestock"));
			subData.put("appstock", rs.getString("appstock"));
			subData.put("purprice", rs.getString("purprice"));
							
			masterData.put(subData);
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	
	/* 
	호출명 : getProductInfoList
	용도	 : 제품정보 
	버젼  : 1.0
	작성자 : 22.09.28
	작성일 : Jerry
	
	*/
	
	public JSONArray getProductInfoList2(Connection con,String compcd,String chaincode,String productname) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		/* 2. 제품정보 조회 */
		sql =  (" select ");
		sql = sql + (" 	pg.productid,pg.productcd,pg.productname, pg.barcode , pg.maker ,pg.packingunit,pg.spec,pg.unit,pg.size, ifnull(pdate.mxprice,0) as mxprice, ");
		sql = sql + (" 	ifnull(pdate.miprice, 0) as miprice, ");
		sql = sql + (" 	ifnull(pdate.maprice, 0) as maprice, ");
		sql = sql + (" 	ifnull(st.stock, 0) as stock, ");
		sql = sql + (" 	ifnull(st.appropriatestock, 0) as appstock , ");
		sql = sql + (" 	floor(ifnull(st.stock, 0) / case when pg.packingunit is null or pg.packingunit = '' or pg.packingunit = 0 then 1 else pg.packingunit end) as salestock, ");
		sql = sql + (" 	ifnull(pg.price, 0) as price, ");
		sql = sql + (" 	ifnull(pg.purprice, 0) as purprice ");
		sql = sql + (" from ");
		sql = sql + (" pos_compproductgroup pg ");
		sql = sql + (" left outer join ( ");
		sql = sql + (" 	select ");
		sql = sql + (" 		productcd, ");
		sql = sql + (" 		barcode, ");
		sql = sql + (" 		SUBSTRING_INDEX(group_concat(salesprice order by pcnt DESC), ',', 1) AS maprice, ");
		sql = sql + (" 		min(salesprice) as miprice, ");
		sql = sql + (" 		max(salesprice) as mxprice ");
		sql = sql + (" 	FROM ");
		sql = sql + (" 		( ");
		sql = sql + (" 		select ");
		sql = sql + (" 			productcd, ");
		sql = sql + (" 			barcode, ");
		sql = sql + (" 			ifnull(salesprice, 0) as salesprice, ");
		sql = sql + (" 			count(*) as pcnt ");
		sql = sql + (" 		from ");
		sql = sql + (" 			pos_compproductgroup ");
		sql = sql + (" 		where ");
		sql = sql + (" 		PRODUCTCD IN( ");
		sql = sql + (" 			select ");
		sql = sql + (" 				productcd ");
		sql = sql + (" 			from ");
		sql = sql + (" 				pos_compproductgroup ");
		sql = sql + (" 			where productname like concat('%','"+ productname +"','%') ) ");
		sql = sql + (" 		GROUP BY ");
		sql = sql + (" 			PRODUCTCD,barcode,ifnull(salesprice, 0) "); 
		sql = sql + (" 	) mmm  ");
		sql = sql + (" 	group by productcd,barcode "); 
		sql = sql + (" ) pdate ");
		sql = sql + (" 	on pg.barcode = pdate.barcode ");
		sql = sql + (" left outer join pos_compstock st  ");
		sql = sql + (" on pg.compcd = st.compcd and pg.productid = st.productid ");
		sql = sql + (" where 1=1 ");
		sql = sql + ("	             and pg.compcd = '"+ compcd +"' ");
		sql = sql + ("	             and pg.productname like concat('%','"+ productname +"','%') ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("productid", rs.getString("productid"));
			subData.put("productcd", rs.getString("productcd"));
			subData.put("barcode", rs.getString("barcode"));
			subData.put("productname", rs.getString("productname"));
			subData.put("maker", isNull(rs.getString("maker")));
			subData.put("packingunit", rs.getString("packingunit"));
			subData.put("spec", rs.getString("spec"));
			subData.put("unit", rs.getString("unit"));
			subData.put("size", rs.getString("size"));
			subData.put("price", rs.getString("price"));
			subData.put("maprice", rs.getString("maprice"));
			subData.put("mxprice", rs.getString("mxprice"));
			subData.put("miprice", rs.getString("miprice"));
			subData.put("stock", rs.getString("stock"));
			subData.put("salestock", rs.getString("salestock"));
			subData.put("appstock", rs.getString("appstock"));
			subData.put("purprice", rs.getString("purprice"));
							
			masterData.put(subData);
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	
	public String setProductInfoIns(Connection con,String compcd,String chaincode,String productid,String productcd,String barcode,String productname,String maker,String size,String unit,String spec,String packingunit,String price,String salesprice,String stock,String appropriatestock) throws Exception {

		int productsult =0;
		
		/* 1.제품 코드 체크(productcd:RABDOM)
		   임의 코드 생성(productcd,barcode)
		*/
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		String randomcd = "";
		String reproductcd  = productcd;
		
		int mcount = 0;
		int pcount = 0;
		int ccount = 0;
		int dcount = 0;
		
		int tmcount = 0;
		int tpcount = 0;
		
		int scount = 0;
		String pid ="";
		
		if(productid.equals("NEW")){
			
			sql = ("select fn_barcode('PID') as pid ");
			
			stmt = con.createStatement();
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			
			pid = rs.getString("pid");
			
			productid = pid;
			
		}
		
		if(productcd.equals("RANDOM")){
			
			stmt = null;
			sql = null;
			
			sql = ("select fn_barcode('BAR') as bar ");
			
			stmt = con.createStatement();
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			
			randomcd = rs.getString("bar");
			
			productcd = randomcd;
			
		}
		
		if(barcode.equals("RANDOM")){
			
			randomcd = "";
			
			stmt = null;
			sql = null;
			
			sql = ("select fn_barcode('BAR') as bar ");
			
			stmt = con.createStatement();
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			
			randomcd = rs.getString("bar");
			
			barcode = randomcd;
			
		}
		
		System.out.println("productid====="+productid);
		System.out.println("productcd====="+productcd);
		System.out.println("barcode====="+barcode);
		
		
		stmt = null;
		sql = null;
		
		/* 2. 제품 등록 및 수정(마스터)*/
		sql = new String();
		
		sql = (" insert into pos_compproduct(compcd,productid,productcd,barcode,productname,maker,size,unit,spec,regcd,regdt)");
		sql = sql + (" values('"+ compcd +"','"+ productid +"','"+ productid +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','1',now() ) ");
		sql = sql + (" on duplicate key ");
		sql = sql + (" update ");
		sql = sql + (" productname = '"+ productname +"', ");
		sql = sql + (" maker = '"+ maker +"', ");
		sql = sql + (" size = '"+ size +"', ");
		sql = sql + (" unit = '"+ unit +"', ");
		sql = sql + (" spec = '"+ spec +"' ");
		
		System.out.println("sql pos_compproduct ="+sql);
		
		stmt = con.createStatement();
		mcount = stmt.executeUpdate(sql.toString());
		
		productsult = productsult + mcount;
		
		if(mcount>0){
			
			productsult = 0;
			
			/* 2-1. 제품 등록 및 수정(제품상세)*/
			stmt = null;
			rs = null;
			sql = null;
			sql = new String();
			
			sql = (" insert into pos_compproductgroup(compcd,productsid,productid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,salesprice,regcd,regdt)");
			sql = sql + (" select '"+ compcd +"',fn_barcode('PDD'),productid,'"+ productcd +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','"+ packingunit +"','"+ price +"','"+ salesprice +"','1',now() from pos_compproduct where compcd = '"+ compcd +"' and productid = '"+ productid +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update ");
			sql = sql + (" productname = '"+ productname +"', ");
			sql = sql + (" maker = '"+ maker +"', ");
			sql = sql + (" size = '"+ size +"', ");
			sql = sql + (" unit = '"+ unit +"', ");
			sql = sql + (" spec = '"+ spec +"', ");
			sql = sql + (" price = '"+ price +"', ");
			sql = sql + (" salesprice = '"+ salesprice +"', ");
			sql = sql + (" packingunit = '"+ packingunit +"' ");
			
			System.out.println("sql pos_compproductgroup ="+sql);
			
			
			stmt = con.createStatement();
			pcount = stmt.executeUpdate(sql.toString());
			
			productsult = productsult + pcount;
			
		}
		
		if(pcount>0 && !chaincode.equals("999999999") && !reproductcd.equals("RANDOM") && !reproductcd.equals("")  && !productname.replace(" ","").equals("제품명_미등록")){
			
			/* 2-1. 체인 제품 등록 및 수정(제품상세)*/
			stmt = null;
			rs = null;
			sql = null;
			sql = new String();
			
			sql = (" insert into pos_chainproduct(chaincode,productid,productcd,barcode,productname,maker,size,unit,spec,regcd,regdt)");
			sql = sql + (" values('"+ chaincode +"','"+ productid +"','"+ productid +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','1',now() )");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update ");
			sql = sql + (" upddt = now() ");
			
			System.out.println("sql pos_chainproduct ="+sql);
			
			
			stmt = con.createStatement();
			dcount = stmt.executeUpdate(sql.toString());
			
			productsult = productsult + dcount;
			
			if(dcount>0){
				
				stmt = null;
				rs = null;
				sql = null;
				sql = new String();
				
				sql = (" insert into pos_chainproductgroup(chaincode,productsid,productid,productcd,barcode,productname,maker,size,unit,spec,packingunit,regcd,regdt)");
				sql = sql + (" values('"+ chaincode +"',fn_barcode('BAR'),'"+ productid +"','"+ productcd +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','"+ packingunit +"','1',now() )");
				sql = sql + (" on duplicate key ");
				sql = sql + (" update ");
				sql = sql + (" upddt = now() ");
				
				System.out.println("sql pos_chainproductgroup ="+sql);
				
				
				stmt = con.createStatement();
				ccount = stmt.executeUpdate(sql.toString());
				
				productsult = productsult + ccount;	
				
			}
			
		}
		
		
		/* 3. 통합 마스터 제품 등록 */
		if(pcount>0 && !reproductcd.equals("RANDOM") && !reproductcd.equals("") && !productname.replace(" ","").equals("제품명_미등록")){
			
			stmt = null;
			rs = null;
			sql = null;
			sql = new String();
			
			sql = (" insert into pos_product(productid,productcd,barcode,productname,maker,size,unit,spec,regcd,regdt)");
			sql = sql + (" values('"+ productid +"','"+ productid +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','1',now() ) ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update ");
			sql = sql + (" upddt = now() ");
			
			System.out.println("sql pos_product ="+sql);
			
			stmt = con.createStatement();
			tmcount = stmt.executeUpdate(sql.toString());

			productsult = productsult + tmcount;

			if(tmcount>0){
				
				stmt = null;
				rs = null;
				sql = null;
				sql = new String();
			
				sql = (" insert into pos_productgroup(productsid,productid,productcd,barcode,productname,maker,size,unit,spec,packingunit,regcd,regdt)");
				sql = sql + (" select fn_barcode('TPD'),productid,'"+ reproductcd +"','"+ barcode +"','"+ productname +"','"+ maker +"','"+ size +"','"+ unit +"','"+ spec +"','"+ packingunit +"','1',now() from pos_product where productid = '"+ productid +"' ");
				sql = sql + (" on duplicate key ");
				sql = sql + (" update ");
				sql = sql + (" upddt = now() ");
				
				System.out.println("sql pos_productgroup ="+sql);
				
				stmt = con.createStatement();
				tpcount = stmt.executeUpdate(sql.toString());
				
				productsult = productsult + tpcount;

			}
			
		}
		
		
		/* 4. 재고 정보 업데이트 */
		if(pcount>0){
			
			stmt = null;
			rs = null;
			sql = null;
			sql = new String();
			
			sql = (" insert into pos_compstock(compcd,productid,productcd,stock,appropriatestock,regcd,regdt)");
			sql = sql + (" select '"+ compcd +"',productid,productcd,'"+ stock +"','"+ appropriatestock +"','1',now() from pos_compproduct where  compcd='"+ compcd +"' and  productid = '"+ productid +"' ");
			sql = sql + (" on duplicate key ");
			sql = sql + (" update ");
			sql = sql + (" updatedate = now() ");
			if(stock!=""){
				sql = sql + (" ,stock = '"+ stock +"' ");
			}
			if(appropriatestock!=""){
				sql = sql + (" ,appropriatestock = '"+ appropriatestock +"' ");
			}
			
			System.out.println("sql pos_compstock ="+sql);
			
			
			stmt = con.createStatement();
			scount = stmt.executeUpdate(sql.toString());
			
			productsult = productsult + scount;

		}
		
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		if(productsult==0){
			productcd="FAIL"; 
		}
		
		return productcd;
		
	}
	
	/* 
	호출명 : getCustInfoList
	용도	 : 고객정보 
	버젼  : 1.0
	작성자 : 22.10.04
	작성일 : Jerry
	
	*/
	
	public JSONArray getCustInfoList(Connection con,String compcd,String name,String hp) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select pc.birthday,pc.sex,pc.hp,pc.name,vdate ");
		sql = sql + ("	from pos_customer pc inner join (select custcd,max(visitdate) as vdate from pos_compcusthist where compcd ='"+ compcd +"' group by custcd) pc2 on pc.custcd = pc2.custcd ");
		sql = sql + (" where 1=1 ");
		if(name!="")
		{
			sql = sql + (" and pc.name like concat('%','"+ name +"','%') ");
		}
		if(hp!="")
		{
			sql = sql + (" and pc.hp like concat('%','"+ hp +"','%') ");
		}
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("birthday", rs.getString("birthday"));
			subData.put("sex", rs.getString("sex"));
			subData.put("hp", rs.getString("hp"));
			subData.put("name", rs.getString("name"));
			subData.put("vdate", rs.getString("vdate"));
			
			masterData.put(subData); 
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return masterData;
	}
	
	/* 
	호출명 : getCustSalesList
	용도	 : 고객판매정보 
	버젼  : 1.0
	작성자 : 22.10.04
	작성일 : Jerry
	
	*/
	
	public JSONArray getCustSalesList(Connection con,String compcd,String hp,String sex,String birthday) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select ps.name,ps.age,pc.productcd , pc.productname , pc.maker , pc.unit , pc.size , pc.spec ,ps.price ,ps.cnt ,ps.discount , ps.amt "); 
		sql = sql + (" from pos_salecustomer ps ");
		sql = sql + (" inner join pos_compproductgroup pc  ");
		sql = sql + ("  on ps.productcd = pc.productcd and ps.compcd = pc.compcd "); 
		sql = sql + (" where ps.hp='"+ hp +"' and ps.sex='"+ sex +"' and ps.birthday='"+ birthday +"' ");
		sql = sql + (" order by ps.regdt desc ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("name", rs.getString("name"));
			subData.put("age", rs.getString("age"));
			subData.put("productcd", rs.getString("productcd"));
			subData.put("productname", rs.getString("productname"));
			subData.put("maker", rs.getString("maker"));
			subData.put("unit", rs.getString("unit"));
			subData.put("size", rs.getString("size"));
			subData.put("spec", rs.getString("spec"));
			subData.put("price", rs.getString("price"));
			subData.put("cnt", rs.getString("cnt"));
			subData.put("discount", rs.getString("discount"));
			subData.put("amt", rs.getString("amt"));
			
			masterData.put(subData);
		}

		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;

		return masterData;
	}
	
	public int setSalesData(Connection con,String compcd,String chaincode,String salesseq,String paymethod,String cardno,String tid,
			String hp,String birthday,String sex,String name,String auth_date,String auth_time,String org_auth_no,
			String org_auth_date,String prescription,String amt,String vat,String discount,String total,
			String[] productidval,String[] productcdval,String[] productbarcodeval,String[] productnameval,String[] productmakerval,String[] productpackingkval,String[] productstockval,String[] productappstockval,
			String[] salescntval,String[] salespriceval,String[] salesdiscountval,String[] salestotalval,String[] buypriceval,String[] salesvatval,String[] sizeval,String[] unitval,String[] specval,int productArrayCnt,
			String auth_no, String org_auth_time, String paygubn,String card,String money, String etcamt, String money_no, String cardgubn, String installments, String salesid, String trans_filler, String vancd)throws Exception {
		

		Statement stmt = null;
		ResultSet rs = null;
		
		String sql = null;
		sql = new String();
		
		int setSalescnt = 0;

		System.out.println("compcd="+compcd);
		System.out.println("chaincode="+chaincode);
		System.out.println("salesseq="+salesseq);
		System.out.println("paymethod="+paymethod);
		
		System.out.println("hp="+hp);
		System.out.println("birthday="+birthday);
		System.out.println("sex="+sex);
		System.out.println("name="+name);
		
		name = name.replaceAll("'","`");
		
		System.out.println("auth_date="+auth_date);
		System.out.println("auth_time="+auth_time);
		System.out.println("org_auth_no="+org_auth_no);
		System.out.println("org_auth_date="+org_auth_date);
		System.out.println("prescription="+prescription);

		System.out.println("cardno="+cardno);
		System.out.println("installments="+installments);
		System.out.println("tid="+tid);
		
		int productcnt = 0;
		int productidcnt =0;
		int productcidcnt =0;
		
		String productnames = "";
		
		if(productArrayCnt>=2){
			productnames = "외"+(productArrayCnt-1);
		}else{
			productnames = "";
		}
		
		String productnames1 ="";
		
		/* 결제  중복체크 */
		
		stmt = null;
		rs = null;
		
		sql = (" select count(*) as paycnt from pos_payment where paymentcd ='"+ salesseq +"' ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		rs.next();
		
		int paymentcnt = rs.getInt("paycnt");
		
		System.out.println("paymentcnt="+paymentcnt);
		
		if(paymentcnt==0){
		
			for(int j=0;j<productArrayCnt;j++){
				
				/* Print */
				System.out.println("============================="+j);

				productnameval[j] = productnameval[j].replaceAll("'","`");
				productmakerval[j] = productmakerval[j].replaceAll("'","`");
				
				System.out.println("productid="+productidval[j]);
				System.out.println("productcd="+productcdval[j]);
				System.out.println("productbarcode="+productbarcodeval[j]);
				System.out.println("productname="+productnameval[j]);
				System.out.println("productmaker="+productmakerval[j]);
				System.out.println("unitval="+unitval[j]);
				System.out.println("sizeval="+sizeval[j]);
				System.out.println("specval="+specval[j]);
				
				System.out.println("productpackingk="+productpackingkval[j]);
				
				System.out.println("productstock="+productstockval[j]);
				System.out.println("productappstock="+productappstockval[j]);
	
				System.out.println("salescnt="+salescntval[j]);
				System.out.println("salesprice="+salespriceval[j]);
				System.out.println("salesdiscount="+salesdiscountval[j]);
				System.out.println("salestotal="+salestotalval[j]);
				System.out.println("buyprice="+buypriceval[j]);
				System.out.println("salesvatval="+salesvatval[j]);
				
				if(productbarcodeval[j]!="8808989"){
					
					
					if(productidval[j].length()<3) {
						productidval[j]=productcdval[j];
					}
					
					stmt = null;
					sql = null;
					/* 통합 마스터 등록 */
					sql = (" insert into pos_product(productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,remarks ,category3cd,regcd,regdt) ");
					sql = sql + (" values('"+ productidval[j] +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ specval[j] +"' ,'"+ unitval[j] +"' ,'"+ sizeval[j] +"' ,'' ,'','1',now()) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',updcd='"+ compcd +"',upddt = now() ");
					System.out.println("sql:통합 마스터 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
					stmt = null;
					sql = null;
					/* 통합 상품 등록 */
					sql = (" insert into pos_productgroup(productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,remarks,regcd,regdt) ");
					sql = sql + (" values(fn_barcode('BAR'),'"+ productcdval[j] +"','"+ productbarcodeval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ sizeval[j] +"','"+ unitval[j] +"','"+ specval[j] +"','"+ productpackingkval[j] +"','"+ productidval[j] +"','','1',now()) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',packingunit = '"+ productpackingkval[j] +"',updcd='"+ compcd +"',upddt = now() ");
					System.out.println("sql:통합 상품 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
				}
				
				if(productbarcodeval[j]!="8808989" && chaincode!="999999999"){
					
					
					if(productidval[j].length()<3) {
						productidval[j]=productcdval[j];
					}
					
					stmt = null;
					sql = null;
					/* 체인 마스터 등록 */
					sql = (" insert into pos_chainproduct(chaincode,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,remarks ,category3cd,regcd,regdt) ");
					sql = sql + (" values('"+ chaincode +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ specval[j] +"' ,'"+ unitval[j] +"' ,'"+ sizeval[j] +"' ,'' ,'','1',now()) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',updcd='"+ compcd +"',upddt = now() ");
					System.out.println("sql:체인 마스터 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
					stmt = null;
					sql = null;
					/* 체인 상품 등록 */
					sql = (" insert into pos_chainproductgroup(chaincode,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,productid,remarks,regcd,regdt) ");
					sql = sql + (" values('"+ chaincode +"',fn_barcode('BAR'),'"+ productcdval[j] +"','"+ productbarcodeval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ sizeval[j] +"','"+ unitval[j] +"','"+ specval[j] +"','"+ productpackingkval[j] +"','"+ productidval[j] +"','','1',now()) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',packingunit = '"+ productpackingkval[j] +"',updcd='"+ compcd +"',upddt = now() ");
					System.out.println("sql:체인 상품 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
	
					
					stmt = null;
					sql = null;
					/* 가맹점 마스터 등록 */
					sql = (" insert into pos_compproduct(compcd,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,remarks ,category3cd,purchaseprice,regcd,regdt) ");
					sql = sql + (" values('"+ compcd +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ specval[j] +"' ,'"+ unitval[j] +"' ,'"+ sizeval[j] +"' ,'' ,'','"+ buypriceval[j] +"', '1',now() ) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',upddt = now() ");
					System.out.println("sql:가맹점 마스터 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
					stmt = null;
					sql = null;
					/* 가맹점 상품 등록 */
					sql = (" insert into pos_compproductgroup(compcd,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,discount,salesprice,productid,remarks,regcd,regdt,purprice,salesdate) ");
					sql = sql + (" values('"+ compcd +"',fn_barcode('BAR'),'"+ productcdval[j] +"','"+ productbarcodeval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ sizeval[j] +"','"+ unitval[j] +"','"+ specval[j] +"','"+ productpackingkval[j] +"','"+ salespriceval[j] +"','"+ salesdiscountval[j] +"',ifnull('"+ salespriceval[j]+"',0) - ifnull('"+ salesdiscountval[j]+"',0) ,'"+ productidval[j] +"','','1',now(),'"+ buypriceval[j] +"','"+ auth_date +"' ) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update barcode = '"+ productbarcodeval[j] +"',productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',packingunit = '"+ productpackingkval[j] +"',price = '"+ salespriceval[j] +"',discount = '"+ salesdiscountval[j] +"',salesprice = ifnull('"+ salespriceval[j]+"',0) - ifnull('"+ salesdiscountval[j]+"',0) ,upddt = now(),purprice = '"+ buypriceval[j] +"' ");
					System.out.println("sql:가맹점 상품 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
				
				}
				
				if(productbarcodeval[j].equals("8808989")){ // 가맹점내 사용 제품
					
					if(productidval[j].length()<3) {
						productidval[j]=productcdval[j];
					}
					
					stmt = null;
					sql = null;
					/* 가맹점 마스터 등록 */
					sql = (" insert into pos_compproduct(compcd,productid ,productcd ,barcode ,productname ,maker ,spec ,unit ,size ,remarks ,category3cd,purchaseprice,regcd,regdt) ");
					sql = sql + (" values('"+ compcd +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productidval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ specval[j] +"' ,'"+ unitval[j] +"' ,'"+ sizeval[j] +"' ,'' ,'','"+ buypriceval[j] +"', '1',now() ) ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',upddt = now() ");
					System.out.println("sql:가맹점 마스터 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
					stmt = null;
					sql = null;
					/* 가맹점 상품 등록 */
					sql = (" insert into pos_compproductgroup(compcd,productsid,productcd,barcode,productname,maker,size,unit,spec,packingunit,price,discount,salesprice,productid,remarks,regcd,regdt,purprice) ");
					sql = sql + (" values('"+ compcd +"',fn_barcode('BAR'),'"+ productcdval[j] +"','"+ productbarcodeval[j] +"','"+ productnameval[j] +"','"+ productmakerval[j] +"','"+ sizeval[j] +"','"+ unitval[j] +"','"+ specval[j] +"','"+ productpackingkval[j] +"','"+ salespriceval[j] +"','"+ salesdiscountval[j] +"',ifnull('"+ salespriceval[j]+"',0) - ifnull('"+ salesdiscountval[j]+"',0) ,'"+ productidval[j] +"','','1',now(),'"+ buypriceval[j] +"') ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update barcode = '"+ productbarcodeval[j] +"',productname = '"+ productnameval[j] +"',maker = '"+ productmakerval[j] +"',size = '"+ sizeval[j] +"',unit = '"+ unitval[j] +"',spec = '"+ specval[j] +"',packingunit = '"+ productpackingkval[j] +"',price = '"+ salespriceval[j] +"',discount = '"+ salesdiscountval[j] +"',salesprice = ifnull('"+ salespriceval[j]+"',0) - ifnull('"+ salesdiscountval[j]+"',0) ,upddt = now(),purprice = '"+ buypriceval[j] +"' ");
					System.out.println("sql:가맹점 상품 등록="+sql.toString());
	
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());

				}
				
				if(productidval[j].length()<3) {
					productidval[j]=productcdval[j];
				}
				
				stmt = null;
				sql = null;
				/* 재고 등록 */
				sql = (" insert into pos_compstock(compcd,productid,stock,appropriatestock,salescnt,salesdate,purchaseprice,regcd,regdt,productcd) ");
				sql = sql +  (" values( ");
				sql = sql +  (" 	'"+ compcd +"', ");
				sql = sql +  (" 	'"+ productidval[j] +"', ");
				sql = sql +  (" 	('"+ productstockval[j] +"' ) - ('"+ salescntval[j] +"' * '"+ productpackingkval[j] +"') , ");
				sql = sql +  (" 	'"+ productappstockval[j] +"' , ");
				sql = sql +  (" 	'"+ salescntval[j] +"', ");
				sql = sql +  (" 	'"+ auth_date +"', ");
				sql = sql +  (" 	'"+ buypriceval[j] +"', ");
				sql = sql +  (" 	'1', ");
				sql = sql +  (" 	now(), ");
				sql = sql +  (" 	'"+ productcdval[j] +"' ");
				sql = sql +  (" ) ");
				sql = sql +  (" on duplicate KEY  ");
				sql = sql +  (" update stock = '"+ productstockval[j] +"',appropriatestock='"+ productappstockval[j] +"',salescnt='"+ salescntval[j] +"',salescnt2=salescnt,salesdate='"+ auth_date +"',salesdate2=salesdate,purchaseprice='"+ buypriceval[j] +"',updatedate=now() ");
				
				System.out.println("sql:제품 재고 등록="+sql.toString());
				
				stmt = con.createStatement();
				stmt.executeUpdate(sql.toString());
				
				stmt = null;
				sql = null;
				/* 제품 판매 등록 */
				sql = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,purprice,salesti) ");
				sql = sql +  (" select compcd,fn_getuuid('SAL'),cast('"+ auth_date +"' as date),'"+ auth_date +"','"+ auth_time +"','"+ productcdval[j] +"','"+ paymethod +"','"+ salescntval[j] +"','"+ salespriceval[j] +"','"+ salesdiscountval[j] +"', ");
				sql = sql +  (" '"+ salespriceval[j] +"' * '"+ salescntval[j] +"','"+ salesvatval[j] +"','"+ salestotalval[j] +"','"+ sex +"','"+ hp +"','','"+ productidval[j] +"', 0,'"+ salesseq +"',productsid,'"+ birthday +"','"+ buypriceval[j] +"',substr('"+ auth_time +"',1,2) ");
				sql = sql +  (" from pos_compproductgroup where compcd='"+ compcd +"' and productcd='"+ productcdval[j] +"' ");
	
				System.out.println("sql:제품 판매 등록="+sql.toString());
	
				stmt = con.createStatement();
				setSalescnt = setSalescnt + stmt.executeUpdate(sql.toString());
							
				productnames1 = productnameval[j];
				
			} /* for End */
			
			productnames1 = productnames1+productnames;
					
			/* 제품 판매 등록(ETC 등록) 
			제품코드 : ALLTAHT9999999999
			
			
			if(etcamt!="0" && etcamt!="" && etcamt!=null && setSalescnt==productArrayCnt){ //ETC 금액이 있을 경우  
				
			stmt = null;
			sql = null;
			sql = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
			sql = sql +  (" values('"+ compcd +"',fn_getuuid('SAL'),cast('"+ auth_date +"' as date),'"+ auth_date +"','"+ auth_time +"','ALLTAHT9999999999','"+ paymethod +"','1','"+ etcamt +"','0', ");
			sql = sql +  (" 0,0,'"+ etcamt +"','"+ sex +"','"+ hp +"','','ALLTAHT9999999999', '"+ etcamt +"','"+ salesseq +"','ALLTAHT9999999999','"+ birthday +"', substr('"+ auth_time +"',1,2)) ");
			
			System.out.println("sql:제품 판매(ETC) 등록="+sql.toString());

			stmt = con.createStatement();
			stmt.executeUpdate(sql.toString());
			
			}
			
			*/
			
			stmt = null;
			sql = null;
					
			if(setSalescnt==productArrayCnt)	{
	
				/* 결제 등록 */
				
				if(cardgubn.length()==3){
					cardgubn = cardgubn.substring(1,3);
				}				
				sql = (" insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,cardno,card,money,amt,vat,total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,etcamt,auth_ti,trans_filler,vancd,regdt) ");
				sql = sql +  (" values('"+ compcd +"' , '"+ salesseq +"','"+ paymethod +"','"+ auth_no +"',replace('"+ auth_date +"','-',''),'"+ auth_time +"','"+ org_auth_no +"','"+ org_auth_date +"','"+ org_auth_time +"','"+ paygubn +"','"+ cardno +"','"+ card +"','"+ money +"', '"+ amt +"','"+ vat +"' ,'"+ total +"' ,'"+ discount +"', ");
				sql = sql +  (" '"+ money_no +"','"+ prescription +"', '"+ cardgubn +"', '"+ installments +"', '"+ salesid +"', '"+ name +"','"+ birthday +"','"+ sex +"','"+ hp +"', '"+ tid +"', '"+ productnames1 +"','"+ etcamt +"',substr('"+ auth_time +"',1,2),'"+ trans_filler +"','"+ vancd +"', now() ) ");
				
				System.out.println("sql:결제 등록="+sql.toString());
				
				stmt = con.createStatement(); 
				setSalescnt = stmt.executeUpdate(sql.toString());
				
				System.out.println("setSalescnt="+setSalescnt);
				
				
			}else{
				/* rollback */
				
				stmt = null;
				/* 제품 판매 삭제 */
				sql = (" delete from  pos_salelist where compcd='"+ compcd +"' and paymentcd='"+ salesseq +"' and paygubn='"+ paygubn +"' ");
	
				System.out.println("sql:제품 판매 삭제="+sql.toString());
	
				stmt = con.createStatement();
				stmt.executeUpdate(sql.toString());
				
				setSalescnt=0;
				
			}
		
		
		}	
			
		return setSalescnt;
	}
	
	public int setPaymentData(Connection con,String compcd,String chaincode,String salesseq,String paymethod,String cardno,String tid,
			String hp,String birthday,String sex,String name,String auth_date,String auth_time,String org_auth_no,
			String org_auth_date,String prescription,String amt,String vat,String discount,String total,
			String auth_no, String org_auth_time, String paygubn,String card,String money, String etcamt, String money_no, String cardgubn, String installments, String salesid, String trans_filler, String vancd)throws Exception {
		

		Statement stmt = null;
		ResultSet rs = null;
		
		String sql = null;
		sql = new String();
		
		int setSalescnt = 0;

		System.out.println("compcd="+compcd);
		System.out.println("chaincode="+chaincode);
		System.out.println("salesseq="+salesseq);
		System.out.println("paymethod="+paymethod);
		
		System.out.println("hp="+hp);
		System.out.println("birthday="+birthday);
		System.out.println("sex="+sex);
		System.out.println("name="+name);
		
		name = name.replaceAll("'","`");
		
		System.out.println("auth_date="+auth_date);
		System.out.println("auth_time="+auth_time);
		System.out.println("org_auth_no="+org_auth_no);
		System.out.println("org_auth_date="+org_auth_date);
		System.out.println("prescription="+prescription);

		System.out.println("cardno="+cardno);
		System.out.println("installments="+installments);
		System.out.println("tid="+tid);
		
		int productcnt = 0;
		int productidcnt =0;
		int productcidcnt =0;
		
		/* 결제  중복체크 */
		
		stmt = null;
		rs = null;
		
		sql = (" select count(*) as paycnt from pos_payment where paymentcd ='"+ salesseq +"' ");
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		rs.next();
		
		int paymentcnt = rs.getInt("paycnt");
		
		System.out.println("paymentcnt="+paymentcnt);
		
		if(paymentcnt==0){
			
			stmt = null;
			sql = null;
					
			/* 결제 등록 */
				
			if(cardgubn.length()==3){
				cardgubn = cardgubn.substring(1,3);
			}				
			sql = (" insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,cardno,card,money,amt,vat,total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,etcamt,auth_ti,trans_filler,vancd,regdt) ");
			sql = sql +  (" values('"+ compcd +"' , '"+ salesseq +"','"+ paymethod +"','"+ auth_no +"',replace('"+ auth_date +"','-',''),'"+ auth_time +"','"+ org_auth_no +"','"+ org_auth_date +"','"+ org_auth_time +"','"+ paygubn +"','"+ cardno +"','"+ card +"','"+ money +"', '"+ amt +"','"+ vat +"' ,'"+ total +"' ,'"+ discount +"', ");
			sql = sql +  (" '"+ money_no +"','"+ prescription +"', '"+ cardgubn +"', '"+ installments +"', '"+ salesid +"', '"+ name +"','"+ birthday +"','"+ sex +"','"+ hp +"', '"+ tid +"', '','"+ etcamt +"',substr('"+ auth_time +"',1,2),'"+ trans_filler +"','"+ vancd +"', now() ) ");
			
			System.out.println("sql:결제 등록="+sql.toString());
			
			stmt = con.createStatement(); 
			setSalescnt = stmt.executeUpdate(sql.toString());
			
			System.out.println("setSalescnt="+setSalescnt);
			
		}
		
		return setSalescnt;

	}
	
	/* 
	호출명 : getSalesCheck
	용도	 : 판매정보 
	버젼  : 1.0
	작성자 : 22.10.26
	작성일 : Jerry
	*/
	
	public int getSalesCheck(Connection con,String compcd,String salesseq) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		
		int cancelcnt = 0;
		
		sql = new String();
		
		sql = (" select count(*) as cnt ");
		sql = sql + ("	from  pos_payment pp ");
		sql = sql + ("		inner join pos_company pc on pp.compcd = pc.compcd "); 
		sql = sql + ("	where pp.compcd='"+ compcd +"' and  pp.paygubn='CAN' and pp.org_auth_no=(select auth_no from pos_payment where pp.compcd='"+ compcd +"' and paymentcd='"+ salesseq +"' ) and pp.org_auth_date=(select auth_date from pos_payment where compcd='"+ compcd +"' and paymentcd='"+ salesseq +"' ) and pp.compcd=(select compcd from pos_payment where compcd='"+ compcd +"' and paymentcd='"+ salesseq +"' ) "); 
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		while (rs.next() && rs != null) {
			cancelcnt= rs.getInt("cnt");		
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return cancelcnt;
	}
	
	/* 
	호출명 : getSalesList
	용도	 : 판매정보 
	버젼  : 1.0
	작성자 : 22.10.26
	작성일 : Jerry
	*/
	
	public JSONArray getSalesList(Connection con,String compcd,String salesseq) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select paymentcd as p_unique_id, ");
		sql = sql + (" 		   paymethod as p_pay_method, ");
		sql = sql + ("		   prescription_no as p_prescription_no, ");
		sql = sql + ("		   total as p_total_amt, ");
		sql = sql + ("		   etcamt as p_etc_amt, ");
		sql = sql + ("		   vat as p_vat, ");
		sql = sql + ("		   pc.corporatenumber as p_biz_no, ");
		sql = sql + ("		   tid as p_tid, ");
		sql = sql + ("		   installments as p_install, ");
		sql = sql + ("		   auth_no as p_appr_no, ");
		sql = sql + ("		   auth_date as p_appr_tiime,trans_filler as trans_filler ");
		sql = sql + ("	from  pos_payment pp ");
		sql = sql + ("		inner join pos_company pc on pp.compcd = pc.compcd "); 
		sql = sql + ("	where pp.compcd='"+ compcd +"' and  pp.paymentcd ='"+ salesseq +"' "); 
		
		System.out.println("sql:결제 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		JSONObject subData = new JSONObject();
		
		while (rs.next() && rs != null) {

			subData.put("p_unique_id", rs.getString("p_unique_id"));
			subData.put("p_pay_method", rs.getString("p_pay_method"));
			subData.put("p_prescription_no", rs.getString("p_prescription_no"));
			subData.put("p_total_amt", rs.getString("p_total_amt"));
			subData.put("p_etc_amt", rs.getString("p_etc_amt"));
			subData.put("p_vat", rs.getString("p_vat"));
			subData.put("p_biz_no", rs.getString("p_biz_no"));
			subData.put("p_tid", rs.getString("p_tid"));
			subData.put("p_install", rs.getString("p_install"));
			subData.put("p_appr_no", rs.getString("p_appr_no"));
			subData.put("p_appr_time", rs.getString("p_appr_tiime"));
			subData.put("trans_filler", rs.getString("trans_filler"));
			
		}
		
		stmt = null;
		rs = null;
		sql = null;
		
		sql = (" select  "); 
		sql = sql + ("			pc2.barcode , "); 
		sql = sql + ("			pc2.productcd as ProductCode, "); 
		sql = sql + ("			pc2.productname as GoodsName, "); 
		sql = sql + ("			ps.cnt as SellCnt, "); 
		sql = sql + ("			pc2.maker as Pharmcist, "); 
		sql = sql + ("			ifnull(pc.appropriatestock,0) as PropStockCnt, "); 
		sql = sql + ("			ifnull(pc.stock,0) as StockCnt, "); 
		sql = sql + ("			pc2.packingunit as UnitCnt, "); 
		sql = sql + ("			pc2.purprice as BuyAmount, "); 
		sql = sql + ("			ps.price as SellAmount, "); 
		sql = sql + ("			ps.discount as DiscntAmount, "); 
		sql = sql + ("			mm.salesprice as BestSalesPrice, "); 
		sql = sql + ("			mm.miprice as MinPrice, "); 
		sql = sql + ("			mm.maprice as MaxPrice "); 
		sql = sql + ("	from  pos_salelist ps "); 
		sql = sql + ("	    inner join pos_compproductgroup pc2  "); 
		sql = sql + ("	    	on ps.compcd = pc2.compcd and ps.productcd = pc2.productcd ");  
		sql = sql + ("		left outer join pos_compstock pc  "); 
		sql = sql + ("			on ps.compcd = pc.compcd and ps.productid = pc.productid and pc2.compcd = pc.compcd and pc2.productid = pc.productid ");  
		sql = sql + ("		left outer join( "); 
		sql = sql + ("				select productcd, "); 
		sql = sql + ("			 	       SUBSTRING_INDEX(group_concat(salesprice order by pcnt DESC), ',', 1) AS salesprice,min(salesprice) as miprice,max(salesprice) as maprice "); 
		sql = sql + ("				FROM  "); 
		sql = sql + ("			( "); 
		sql = sql + ("				select productcd,ifnull(salesprice,0) as salesprice,count(*) as pcnt "); 
		sql = sql + ("				from pos_compproductgroup "); 
		sql = sql + ("				where PRODUCTCD IN( "); 
		sql = sql + ("				      select productcd from pos_compproductgroup  "); 
		sql = sql + ("				      where productcd in( "); 
		sql = sql + ("				      	select productcd from pos_salelist where compcd='"+ compcd +"' and paymentcd ='"+ salesseq +"' "); 
		sql = sql + ("				      ) "); 
		sql = sql + ("				) "); 
		sql = sql + ("				GROUP BY PRODUCTCD,ifnull(salesprice,0) "); 
		sql = sql + ("			) pdate "); 
		sql = sql + ("		    group by productcd "); 
	    sql = sql + ("		)mm on ps.productcd = mm.productcd  "); 
		sql = sql + ("	where ps.compcd='"+ compcd +"' and  ps.paymentcd ='"+ salesseq +"' "); 
		
		System.out.println("sql:판매 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray GoodsList = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject SPList = new JSONObject();
			
			SPList.put("Barcode", rs.getString("Barcode"));
			SPList.put("ProductCode", rs.getString("ProductCode"));
			SPList.put("GoodsName", rs.getString("GoodsName"));
			SPList.put("SellCnt", rs.getString("SellCnt"));
			SPList.put("Pharmcist", rs.getString("Pharmcist"));
			SPList.put("PropStockCnt", rs.getString("PropStockCnt"));
			SPList.put("StockCnt", rs.getString("StockCnt"));
			SPList.put("UnitCnt", rs.getString("UnitCnt"));
			SPList.put("BuyAmount", rs.getString("BuyAmount"));
			SPList.put("SellAmount", rs.getString("SellAmount"));
			SPList.put("DiscntAmount", rs.getString("DiscntAmount"));

			SPList.put("BestSalesPrice", rs.getString("BestSalesPrice"));
			SPList.put("MinPrice", rs.getString("MinPrice"));
			SPList.put("MaxPrice", rs.getString("MaxPrice"));

			GoodsList.put(SPList);
		}
		
		subData.put("GoodsList",GoodsList);
		
		masterData.put(subData);
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	
	/* 
	호출명 : getProductPriceList
	용도	 : 판매정보 
	버젼  : 1.0
	작성자 : 22.10.26
	작성일 : Jerry
	*/
	
	public JSONArray getProductPriceList(Connection con,String compcd,String barcode,String chaincode) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		/*
		sql = (" select productcd, ");
		sql = sql + ("	       SUBSTRING_INDEX(group_concat(salesprice order by pcnt DESC), ',', 1) AS salesprice,min(salesprice) as miprice,max(salesprice) as maprice ");
		sql = sql + ("	       FROM  ");
		sql = sql + ("	       ( ");
		sql = sql + ("	       	select productcd,ifnull(salesprice,0) as salesprice,count(*) as pcnt ");
		sql = sql + ("	       	from pos_compproductgroup ");
		sql = sql + ("	       	where PRODUCTCD IN( ");
		sql = sql + ("	       	      select productcd from pos_compproductgroup "); 
		sql = sql + ("	       	      where barcode='"+ barcode +"' and salesprice>0 and salesdate >= date_format(date_sub(now(), interval 1 month),'%Y%m%d') ");
		sql = sql + ("	       	) ");
		sql = sql + ("	       	GROUP BY PRODUCTCD,ifnull(salesprice,0) ");
		sql = sql + ("	       ) pdate ");
		sql = sql + ("	       group by productcd "); 
		*/
		sql = (" select "); 
		sql = sql + (" 		barcode, "); 
		sql = sql + ("		SUBSTRING_INDEX(group_concat(salesprice order by pcnt desc), ',', 1) as salesprice, "); 
		sql = sql + ("		min(salesprice) as miprice, "); 
		sql = sql + ("		max(salesprice) as maprice "); 
		sql = sql + ("	from "); 
		sql = sql + ("		( "); 
		sql = sql + ("		select "); 
		sql = sql + ("			barcode, "); 
		sql = sql + ("			ifnull(salesprice, 0) as salesprice, "); 
		sql = sql + ("			count(*) as pcnt "); 
		sql = sql + ("		from "); 
		sql = sql + ("			pos_compproductgroup "); 
		sql = sql + ("		where "); 
		sql = sql + ("			barcode = '"+ barcode +"' "); 
		sql = sql + ("			and salesprice>0 "); 
		sql = sql + ("			and salesdate >= date_format(date_sub(now(), interval 1 month), '%Y%m%d')  "); 
		sql = sql + ("		group by  "); 
		sql = sql + ("		barcode, "); 
		sql = sql + ("			ifnull(salesprice, 0)  "); 
		sql = sql + ("	) pdata "); 
		sql = sql + ("	group by barcode "); 
		
		System.out.println("sql:결제 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		JSONObject subData = new JSONObject();
		
		while (rs.next() && rs != null) {

			
			subData.put("BestSalesPrice", rs.getString("salesprice"));
			subData.put("MinPrice", rs.getString("miprice"));
			subData.put("MaxPrice", rs.getString("maprice"));
			subData.put("productcd", rs.getString("barcode"));
			
			masterData.put(subData);
			
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	public String setCompanyInfo(Connection con,String chainname, String companyname,String corporatenumber,String president,String presidentcnt,String registerdate,String canceldate,String address,
			String address2,String tel,String hp,String fax,String email,String taxusername,String taxusertel,String taxuseremail,String opendate,String remarks, String tid) throws Exception {
		
		String userid="";
		int setcnt = 0;
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" insert into pos_company(compcd,companyname,corporatenumber,president,presidentcnt,registerdate,canceldate,address,address2,tel,hp,fax,email,taxusername,taxusertel,taxuseremail,opendate,remarks) ");
		sql = sql +  (" fn_getuuid('COM'),'"+ corporatenumber +"','"+ president +"','"+ presidentcnt +"',cast('"+ registerdate +"' as date),cast('"+  canceldate +"' as date),'"+ address +"','"+ address2 +"', ");
		sql = sql +  (" '"+ tel +"','"+ hp +"','"+ fax +"','"+ email +"','"+ taxusername +"','"+ taxusertel +"','"+ taxuseremail +"','"+ opendate +"','"+ remarks +"' ");
		sql = sql +  (" on duplicate key ");
		sql = sql +  (" update address = '"+ address +"', address2 ='"+ address2 +"',canceldate = '"+  canceldate +"', tel = '"+ tel +"', hp = '"+ hp +"', fax = '"+ fax +"', ");
		sql = sql +  (" email = '"+ email +"', taxusername='"+ taxusername +"',taxusertel ='"+ taxusertel +"', taxuseremail='"+ taxuseremail +"',opendate='"+ opendate +"', upddt = now() ");
		
		System.out.println("sql:가맹점 등록="+sql.toString());
		
		stmt = con.createStatement(); 
		setcnt = stmt.executeUpdate(sql.toString());
		
		if(setcnt>0){
			
			/* TID 등록 */
			int tidcnt =0;
			String[] tidval;
			
			tidval = tid.split("|^");
			
			tidcnt = tidval.length;
			
			for(int i=0;i<tidcnt;i++){
				
				sql =null;
				stmt = null;
				
				sql = (" insert into pos_comptid(compcd,serialno,regdt,tid,useyn,installdate) ");
				sql = sql +  (" select compcd,'',now(),'"+ tidval[i] +"','Y',now() from pos_company where corporatenumber ='"+ corporatenumber +"' ");
				
				stmt = con.createStatement(); 
				stmt.executeUpdate(sql.toString());
				
			}
			
			String chaincode = "";
			
			stmt = null;
			sql = null;
			sql = (" select chaincode from pos_chaininfo where chainname='"+ chainname +"' ");
			stmt = con.createStatement(); 
			rs = stmt.executeQuery(sql.toString());

			while(rs.next() && rs != null) {
				
				chaincode = rs.getString("chaincode");
				
			}
			
			System.out.println("chaincode"+chaincode);

			if(chaincode!=null && chaincode.length()==13){
				
				setcnt = 0;
				
				sql = (" insert into pos_company(chaincode,compcd,registerdate,regdt,regcd,canceldate,remarks) ");
				sql = sql +  (" select '"+ chaincode +"',compcd,cast('"+ registerdate +"' as date),'1',cast('"+ canceldate +"' as date),'"+remarks +"', ");
				sql = sql +  (" '"+ tel +"','"+ hp +"','"+ fax +"','"+ email +"','"+ taxusername +"','"+ taxusertel +"','"+ taxuseremail +"','"+ opendate +"','"+ remarks +"' ");
				sql = sql +  (" from pos_company where corporatenumber ='"+ corporatenumber +"' ");
				sql = sql +  (" on duplicate key ");
				sql = sql +  (" update registerdate = cast('"+ registerdate +"' as date) , canceldate = cast('"+ canceldate +"' as date), upddt = now() ");
				
				stmt = con.createStatement(); 
				setcnt = stmt.executeUpdate(sql.toString());
				
				
			}
			
		}
		
		if(setcnt>0){
			
			setcnt = 0;
			
			sql = (" insert into pos_companyuser(userid,passwd,name,level,compcd,regcd,regdt,useyn,userseq) ");
			sql = sql +  (" select corporatenumber,substr(corporatenumber,1,5),companyname,'CO2049','1',now(),'Y',gn_getuuid('USR') ");
			sql = sql +  (" from pos_company where corporatenumber ='"+ corporatenumber +"' ");
			sql = sql +  (" on duplicate key ");
			sql = sql +  (" update updcd='"+ corporatenumber +"',upddt = now() ");
			
			stmt = con.createStatement(); 
			setcnt = stmt.executeUpdate(sql.toString());
			
		}
		
		if(setcnt>0){
			userid = corporatenumber;
		}else{
			userid="";
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return userid;
		
	}
	
	
	/* 
	호출명 : setCustIns
	용도	 : 고객정보 등록
	버젼  : 1.0
	작성자 : 22.12.01
	작성일 : Jerry
	
	*/
	public int setCustIns(Connection con,String compcd,String name,String hp,String sex,String birthday,String visitdate,String visittime) throws Exception {
		int cnt =0;
		
		Statement stmt = null;
		String sql = null;

		sql = new String();
		
		sql = (" insert into pos_customer(birthday,hp,sex,name,scompcd,joindate,jointime,ecompcd,livedate,livetime,visitcnt,custcd,regdt,regcd) ");
		sql = sql +  (" values('"+ birthday +"', '"+ hp +"', '"+ sex +"', '"+ name +"', '"+ compcd +"', '"+ visitdate +"', '"+ visittime +"','"+ compcd +"', '"+ visitdate +"', '"+ visittime +"', 0, fn_getuuid('CST'),now(),'1') ");
		sql = sql +  (" on duplicate key ");
		sql = sql +  (" update livedate='"+ visitdate +"',livetime ='"+ visittime +"',upddt=now() ");
		
		System.out.println("=sql="+sql);
		
		stmt = con.createStatement(); 
		cnt = stmt.executeUpdate(sql.toString());
		
		if(cnt>0){
			
			stmt = null;
			
			sql = (" insert into pos_compcusthist(custcd,compcd,visitdate,visittime,regdt,regcd) ");
			sql = sql +  (" select custcd,'"+ compcd +"', '"+ visitdate +"','"+ visittime +"',now(),'1' from pos_customer where birthday='"+ birthday +"' and hp='"+ hp +"' and sex='"+ sex +"' and name='"+ name +"'");
			
			stmt = con.createStatement(); 
			cnt = cnt+stmt.executeUpdate(sql.toString());
			
		}
		
		
		return cnt;
	}
	
	/* 
	호출명 : setSetProductData
	용도	 : 세트정보 등록
	버젼  : 1.0
	작성자 : 22.12.15
	작성일 : Jerry
	*/
	public String setSetProductData(Connection con,String compcd,String setname,String setprice,String setdiscount,String setamt,String[] prodval,String[] priceval,String[] discountval,String[] amtval,String[] cntval)throws Exception {
		
		int setcnt =0;
		String setcode ="";
		ResultSet rs = null;
		Statement stmt = null;
		String sql = null;
		
			sql = new String();
			
			sql = (" select fn_getuuid('SET') as setcode ");
			
			stmt = con.createStatement(); 
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			setcode = rs.getString("setcode");
			
			stmt = null;
			sql = new String();
			
			sql = (" insert into pos_compset(compcd,setcode,setname,price,discount,amt,regdt,regcd) ");
			sql = sql +  (" values('"+ compcd +"', '"+ setcode +"', '"+ setname +"', '"+ setprice +"', '"+ setdiscount +"', '"+ setamt +"',now(),'1') ");
			
			System.out.println("sql:세트 등록="+sql.toString());
			
			stmt = con.createStatement(); 
			setcnt = stmt.executeUpdate(sql.toString());
			
			if(setcnt>0){
				
				setcnt = 0;
				
				stmt = null;
				sql = new String();
				
				int prodcnt = prodval.length;
				
				String productcd="";
				String price = "";
				String discount = "";
				String amt = "";
				String cnt = "";
				
				System.out.println("prodcnt="+prodcnt);
				
				for(int i=0;i<prodcnt;i++){
					
					setcnt=0;
					
					productcd = prodval[i];
					price = priceval[i];
					discount = discountval[i];
					amt = amtval[i];
					cnt = cntval[i];
					
					sql = (" insert into pos_compsetproduct(compcd,setcode,productid,price,cnt,discount,amt,regdt,regcd,productcd) ");
					sql = sql +  (" select '"+ compcd +"', '"+ setcode +"', productid, '"+ price +"', '"+ cnt +"', '"+ discount +"', '"+ amt +"', now(),'1',productcd from pos_compproductgroup where compcd='"+ compcd +"' and productcd='"+ productcd +"' ");
					
					System.out.println("sql:세트 상품 등록="+sql.toString());
					
					stmt = con.createStatement(); 
					setcnt = setcnt + stmt.executeUpdate(sql.toString());
					
				}
				
				System.out.println("setcnt="+setcnt);
				System.out.println("setcnt="+setcnt);
				
				if(setcnt==0){
					
					setcode = "";
					
					stmt = null;
					sql = new String();
					
					sql = (" delete from pos_compset where compcd='"+ compcd +"' and setcode = '"+ setcode +"' ");
					
					stmt = con.createStatement(); 
					stmt.executeUpdate(sql.toString());
					
				}
			
			}else{
				setcode="";
			}
		if (stmt != null)
			stmt.close();
		if (sql != null)
			sql = null;	
		
		return setcode;
	}
	
	/* 
	호출명 : setSetProductUpdate
	용도	 : 세트정보 수정
	버젼  : 1.0
	작성자 : 22.12.15
	작성일 : Jerry
	*/
	public int setSetProductUpdate(Connection con,String compcd,String setcode,String setname,String setprice,String setdiscount,String setamt,String[] prodval,String[] priceval,String[] discountval,String[] amtval,String[] cntval)throws Exception {
		
		int setcnt =0;
		ResultSet rs = null;
		Statement stmt = null;
		String sql = null;
		
			stmt = null;
			sql = new String();
			
			sql = (" update pos_compset set setname='"+ setname +"',price='"+ setprice +"',discount='"+ setdiscount +"',amt='"+ setamt +"',upddt=now() ");
			sql = sql +  (" where compcd='"+ compcd +"' and setcode='"+ setcode +"' ");
			
			System.out.println("sql:세트 수정="+sql.toString());
			
			stmt = con.createStatement(); 
			setcnt = stmt.executeUpdate(sql.toString());
			
			if(setcnt>0){
				
				setcnt = 0;
				
				stmt = null;
				sql = new String();
				
				sql = (" delete from pos_compsetproduct where compcd='"+ compcd +"' and setcode = '"+ setcode +"' ");
				
				stmt = con.createStatement(); 
				setcnt = stmt.executeUpdate(sql.toString());
				
				if(setcnt>0){
					
					setcnt = 0;
					
					stmt = null;
					sql = new String();
					
					int prodcnt = prodval.length;
					
					String productcd="";
					String price = "";
					String discount = "";
					String amt = "";
					String cnt = "";
					
					for(int i=0;i<prodcnt;i++){
						
						setcnt=0;
						
						productcd = prodval[i];
						price = priceval[i];
						discount = discountval[i];
						amt = amtval[i];
						cnt = cntval[i];
						
						sql = (" insert into pos_compsetproduct(compcd,setcode,productid,price,cnt,discount,amt,regdt,regcd,productcd) ");
						sql = sql +  (" select '"+ compcd +"', '"+ setcode +"', productid, '"+ price +"', '"+ cnt +"', '"+ discount +"', '"+ amt +"', now(),'1',productcd from pos_compproductgroup where compcd='"+ compcd +"' and productcd='"+ productcd +"' ");
						sql = sql +  (" on duplicate key ");
						sql = sql +  (" update upddt=now() ");
						
						System.out.println("sql:세트 상품 등록="+sql.toString());
						
						stmt = con.createStatement(); 
						setcnt = setcnt + stmt.executeUpdate(sql.toString());
						
					}
					
					if(setcnt==0){
						
						stmt = null;
						sql = new String();
						
						sql = (" delete from pos_compset where compcd='"+ compcd +"' and setcode = '"+ setcode +"' ");
						
						stmt = con.createStatement(); 
						stmt.executeUpdate(sql.toString());
						
					}
					
				}else{
					setcnt=0;
				}
				
			}else{
				setcnt=0;
			}
		
		if (stmt != null)
			stmt.close();
		if (sql != null)
			sql = null;	
			
		return setcnt;
	}
	
	/* 
	호출명 : getSetInfoList
	용도	 : 세트정보
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	
	public JSONArray getSetInfoList(Connection con,String compcd) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select  setcode,setname,price,discount,amt");
		sql = sql + ("	from pos_compset ");
		sql = sql + ("	where compcd='"+ compcd +"' ");
		
		System.out.println("sql:세트 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {

			JSONObject subData = new JSONObject();
			
			subData.put("setcode", rs.getString("setcode"));
			subData.put("setname", rs.getString("setname"));
			subData.put("price", rs.getString("price"));
			subData.put("discount", rs.getString("discount"));
			subData.put("amt", rs.getString("amt"));
			
			masterData.put(subData);
			
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	
	/* 
	호출명 : getSetProductList
	용도	 : 세트 상품정보
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	
	public JSONArray getSetProductList(Connection con,String compcd, String setcode) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;

		sql = new String();
		
		sql = (" select  ");
		sql = sql + ("		pc.productid ,pc.productcd ,pc2.barcode ,pc2.productname ,pc2.maker ,pc4.appropriatestock ,pc4.stock ,pc2.packingunit ,pc3.purchaseprice, ");
		sql = sql + ("		pc.price ,pc.discount ,pc.amt ,pc.cnt  ");
		sql = sql + ("	from pos_compsetproduct pc ");
		sql = sql + ("		inner join pos_compproductgroup pc2  ");
		sql = sql + ("			on pc.compcd = pc2.compcd  and pc.productcd = pc2.productcd  ");
		sql = sql + ("		inner join pos_compproduct pc3  ");
		sql = sql + ("			on pc2.compcd = pc3.compcd and pc2.productid = pc3.productid  ");
		sql = sql + ("		left outer join pos_compstock pc4  ");
		sql = sql + ("			on pc3.compcd = pc4.compcd and pc3.productid = pc4.productid  ");
		sql = sql + ("	where pc.compcd='"+ compcd +"' and pc.setcode='"+ setcode +"' ");
		
		System.out.println("sql:세트 상세 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		JSONObject subData = new JSONObject();
		
		while (rs.next() && rs != null) {

			
			subData.put("productid", rs.getString("productid"));
			subData.put("productcd", rs.getString("productcd"));
			subData.put("barcode", rs.getString("barcode"));
			subData.put("productname", rs.getString("productname"));
			subData.put("maker", rs.getString("maker"));
			subData.put("appropriatestock", rs.getString("appropriatestock"));
			subData.put("stock", rs.getString("stock"));
			subData.put("packingunit", rs.getString("packingunit"));
			subData.put("purchaseprice", rs.getString("purchaseprice"));
			subData.put("price", rs.getString("price"));
			subData.put("discount", rs.getString("discount"));
			subData.put("amt", rs.getString("amt"));
			subData.put("cnt", rs.getString("cnt"));
			
			masterData.put(subData);
			
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	/* 
	호출명 : setSetDabindoData
	용도	 : 다빈도 등록
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	public String setSetDabindoData(Connection con,String compcd,String dabindocd,String title,String num,String productcd,String setcode,String subnum, String dabinpdcd)throws Exception {
		
		int dabindocnt =0;
		ResultSet rs = null;
		Statement stmt = null;
		String sql = null;
			
			if(dabindocd==null || dabindocd.equals("")){

				sql = new String();
				
				sql = (" select fn_getuuid('DAB') as dabindocd ");
				
				stmt = con.createStatement(); 
				rs = stmt.executeQuery(sql.toString());
				
				rs.next();
				dabindocd = rs.getString("dabindocd");

			}
		
			stmt = null;
			sql = new String();
			
			sql = (" insert into pos_compdabindo(dabindocd,compcd,title,regdt,regcd,num,num2) ");
			sql = sql +  (" values('"+ dabindocd +"','"+ compcd +"', '"+ title +"',now(),'1','"+ num +"','"+ num +"') ");
			sql = sql +  (" on duplicate key ");
			sql = sql +  (" update title='"+ title +"', upddt=now() ");
			
			stmt = con.createStatement(); 
			dabindocnt = stmt.executeUpdate(sql.toString());
			
			if(dabindocnt>0){
				
				dabindocnt = 0;
				
					if(dabinpdcd==null || dabinpdcd.equals("")){
	
						stmt = null;
						sql = new String();
						
						sql = (" select fn_getuuid('DAP') as dabinpdcd ");
						
						stmt = con.createStatement(); 
						rs = stmt.executeQuery(sql.toString());
						
						rs.next();
						dabinpdcd = rs.getString("dabinpdcd");
	
					}
					
					dabindocnt=0;
					
					stmt = null;
					sql = new String();
				
					sql = (" insert into pos_compdabinproduct(dabinpdcd,dabindocd,compcd,subnum,productcd,setcode,regdt,regcd) ");
					sql = sql +  (" select '"+ dabinpdcd +"','"+ dabindocd +"','"+ compcd +"', '"+ subnum +"', '"+ productcd +"', '"+ setcode +"', now(),'1' from pos_compdabindo where compcd='"+ compcd +"' and dabindocd='"+ dabindocd +"' ");
					sql = sql +  (" on duplicate key ");
					sql = sql +  (" update upddt=now(),productcd='"+ productcd +"', setcode='"+ setcode +"', subnum='"+ subnum +"' ");
					
					stmt = con.createStatement(); 
					dabindocnt = stmt.executeUpdate(sql.toString());
					
					if(dabindocnt==0){
						
						dabindocd = "";
						
						stmt = null;
						sql = new String();
						
						sql = (" delete from pos_compdabindo where compcd='"+ compcd +"' and dabindocd = '"+ dabindocd +"' ");
						
						stmt = con.createStatement(); 
						stmt.executeUpdate(sql.toString());
						
					}
			
			}else{
				dabindocd="";
			}
		return dabindocd;
	}
	
	/* 
	호출명 : setSetDabindoData
	용도	 : 다빈도 등록
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	public int setSetDabindoTitle(Connection con,String compcd,String dabindocd,String title,String num)throws Exception {
		
		int dabindocnt =0;
		ResultSet rs = null;
		Statement stmt = null;
		String sql = null;
			
		if(dabindocd==null || dabindocd.equals("")){

			sql = new String();
			
			sql = (" select fn_getuuid('DAB') as dabindocd ");
			
			stmt = con.createStatement(); 
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			dabindocd = rs.getString("dabindocd");
		
		}
		
		stmt = null;
		sql = new String();			
		
		sql = (" insert into pos_compdabindo(dabindocd,compcd,title,regdt,regcd,num,num2) ");
		sql = sql +  (" values('"+ dabindocd +"','"+ compcd +"','"+ title +"',now(),'1','"+ num +"','"+ num +"') ");		
		sql = sql +  (" on duplicate key ");
		sql = sql +  (" update title = '"+ title +"' , upddt = now() ");
		
		stmt = con.createStatement(); 
		dabindocnt = stmt.executeUpdate(sql.toString());
		
		return dabindocnt;
	}
	
	/* 
	호출명 : getDabindoList
	용도	 : 다빈도 상품정보
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	
	public JSONArray getDabindoList(Connection con,String compcd, String dabindocd, String num) throws Exception {
		
		Statement stmt = null;
		ResultSet rs = null;
		String sql = null;
		
		Statement stmt1 = null;
		ResultSet rs1 = null;
		String sql1 = null;
		
		Statement stmt2 = null;
		ResultSet rs2 = null;
		String sql2 = null;
		
		String ptype="";
		String code ="";
		
		sql = new String();
		sql = (" select dabindocd,title,num from pos_compdabindo where compcd='"+ compcd +"' ");
		if(!dabindocd.equals("")){
			sql = sql +  (" and dabindocd ='"+ dabindocd +"' ");
		}
		sql = sql +  (" order by num ");
		
		System.out.println("sql:다빈도 타이틀 조회="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		JSONArray masterData = new JSONArray();
		
		while (rs.next() && rs != null) {
		
			JSONArray masterData2 = new JSONArray();
			
			JSONObject subData = new JSONObject();
			
			subData.put("dabindocd", rs.getString("dabindocd"));
			subData.put("title", rs.getString("title"));
			subData.put("num", rs.getString("num"));
			
			dabindocd = rs.getString("dabindocd");
			
			sql2 = new String();
			
			sql2 = (" select dabinpdcd,subnum, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then 'set' else 'prod' end as ptype, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then setcode else productcd end as code, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then pname2 else pname1 end as pname, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then price2 else price1 end as price, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then discount2 else discount1 end as discount, ");
			sql2 = sql2 +  (" case when productcd is null or productcd='' or productcd='null' then amt2 else amt1 end as amt ");
			sql2 = sql2 +  (" from( ");
			sql2 = sql2 +  (" select pc.dabinpdcd , pc.subnum ,pc.productcd ,pc.setcode ,  ");
			sql2 = sql2 +  (" 	pc2.productname as pname1,pc2.price as price1 ,pc2.discount as discount1,pc2.salesprice as amt1 ,  ");
			sql2 = sql2 +  (" 	pc3.setname as pname2,pc3.price as price2,pc3.discount as discount2 ,pc3.amt as amt2 ");
			sql2 = sql2 +  (" 	from pos_compdabinproduct pc ");
			sql2 = sql2 +  (" 	left outer join pos_compproductgroup pc2  ");
			sql2 = sql2 +  (" 		on pc.compcd = pc2.compcd and pc.productcd = pc2.productcd  ");
			sql2 = sql2 +  (" 	left outer join pos_compset pc3  ");
			sql2 = sql2 +  (" 		on pc.compcd = pc3.compcd and pc.setcode = pc3.setcode  ");
			sql2 = sql2 +  (" 	where pc.compcd='"+ compcd +"' and pc.dabindocd='"+ dabindocd +"' ");
			sql2 = sql2 +  (" ) dat ");
			sql2 = sql2 +  (" order by subnum ");
			
			System.out.println("sql:다빈도 상품 조회="+sql2.toString());
			
			stmt2 = con.createStatement();
			rs2 = stmt2.executeQuery(sql2.toString());
			
			while (rs2.next() && rs2 != null) {
				
				JSONArray masterData1 = new JSONArray();
				
				JSONObject subData2 = new JSONObject();
				
				subData2.put("dabinpdcd", rs2.getString("dabinpdcd"));
				subData2.put("subnum", rs2.getString("subnum"));
				subData2.put("ptype", rs2.getString("ptype"));
				subData2.put("code", rs2.getString("code"));
				subData2.put("pname", rs2.getString("pname"));
				subData2.put("price", rs2.getString("price"));
				subData2.put("discount", rs2.getString("discount"));
				subData2.put("amt", rs2.getString("amt"));
				
				masterData2.put(subData2);
				
				ptype = rs2.getString("ptype");
				code = rs2.getString("code");
				
				if(ptype.equals("prod")){
					
					sql1 = new String();
					
					sql1 = (" select  ");
					sql1 = sql1 +  (" 	productid ,productcd ,barcode ,productname ,maker ,appropriatestock ,stock ,packingunit ,ifnull(purchaseprice,'') as purchaseprice, ");
					sql1 = sql1 +  (" 	price ,discount ,amt ,cnt, subnum, ifnull(spec,'') as spec, ifnull(unit,'') as unit, ifnull(size,'') as size ");
					sql1 = sql1 +  (" from( ");
					sql1 = sql1 +  (" 	select  ");
					sql1 = sql1 +  (" 		pc2.productid ,pc2.productcd ,pc2.barcode ,pc2.productname ,pc2.maker ,pc4.appropriatestock ,pc4.stock ,pc2.packingunit ,pc3.purchaseprice, ");
					sql1 = sql1 +  (" 		pc2.price ,pc2.discount ,pc2.salesprice as amt ,'1' as cnt,pd2.subnum,pc2.spec,pc2.unit,pc2.size ");
					sql1 = sql1 +  (" 	from pos_compdabindo pd  ");
					sql1 = sql1 +  (" 		inner join pos_compdabinproduct pd2  ");
					sql1 = sql1 +  (" 			on pd.compcd = pd2.compcd and pd.dabindocd = pd2.dabindocd  ");
					sql1 = sql1 +  (" 		inner join pos_compproductgroup pc2 ");
					sql1 = sql1 +  (" 			on pd2.compcd = pc2.compcd and pd2.productcd = pc2.productcd ");
					sql1 = sql1 +  (" 		inner join pos_compproduct pc3  ");
					sql1 = sql1 +  (" 			on pc2.compcd = pc3.compcd and pc2.productid = pc3.productid  ");
					sql1 = sql1 +  (" 		inner join pos_compstock pc4 ");
					sql1 = sql1 +  (" 			on pc3.compcd = pc4.compcd and pc3.productid = pc4.productid  ");
					sql1 = sql1 +  (" 	where pd.compcd='"+ compcd +"'  ");
					sql1 = sql1 +  (" 		and pd.dabindocd ='"+ dabindocd +"' and pd2.productcd='"+ code +"' ");
					sql1 = sql1 +  (" ) da order by subnum ");
			
					System.out.println("sql:다빈도 상품 조회(상품)="+sql1.toString());
					
				}else{
					
					sql1 = (" select  ");
					sql1 = sql1 +  (" 	productid ,productcd ,barcode ,productname ,maker ,appropriatestock ,stock ,packingunit ,ifnull(purchaseprice,'') as purchaseprice, ");
					sql1 = sql1 +  (" 	price ,discount ,amt ,cnt, subnum, ifnull(spec,'') as spec, ifnull(unit,'') as unit, ifnull(size,'') as size");
					sql1 = sql1 +  (" from( ");
					sql1 = sql1 +  (" 	select ");
					sql1 = sql1 +  (" 		pc3.productid ,pc3.productcd ,pc3.barcode ,pc3.productname ,pc3.maker ,pc5.appropriatestock ,pc5.stock ,pc3.packingunit ,pc4.purchaseprice, ");
					sql1 = sql1 +  (" 		pc2.price ,pc2.discount ,pc2.amt ,pc2.cnt,pd2.subnum,pc3.spec,pc3.unit,pc3.size ");
					sql1 = sql1 +  (" 	from pos_compdabindo pd  ");
					sql1 = sql1 +  (" 		inner join pos_compdabinproduct pd2  ");
					sql1 = sql1 +  (" 			on pd.compcd = pd2.compcd and pd.dabindocd = pd2.dabindocd  ");
					sql1 = sql1 +  (" 		inner join pos_compset pc  ");
					sql1 = sql1 +  (" 			on pd2.compcd = pc.compcd and pd2.setcode = pc.setcode  ");
					sql1 = sql1 +  (" 		inner join pos_compsetproduct pc2  ");
					sql1 = sql1 +  (" 			on pc.compcd = pc2.compcd and pc.setcode = pc2.setcode  ");
					sql1 = sql1 +  (" 		inner join pos_compproductgroup pc3  ");
					sql1 = sql1 +  (" 			on pc2.compcd = pc3.compcd and pc2.productcd = pc3.productcd  ");
					sql1 = sql1 +  (" 		inner join pos_compproduct pc4  ");
					sql1 = sql1 +  (" 			on pc3.compcd = pc4.compcd and pc3.productid = pc4.productid  ");
					sql1 = sql1 +  (" 		inner join pos_compstock pc5  ");
					sql1 = sql1 +  (" 			on pc4.compcd = pc5.compcd and pc4.productid = pc5.productid  ");
					sql1 = sql1 +  (" 	where pd.compcd='"+ compcd +"' ");
					sql1 = sql1 +  (" 		and pd.dabindocd ='"+ dabindocd +"' and pd2.setcode='"+ code +"' ");
					sql1 = sql1 +  (" ) da order by subnum ");
					
					System.out.println("sql:다빈도 상품 조회(세트)="+sql1.toString());
				}
					
				stmt1 = con.createStatement();
				rs1 = stmt1.executeQuery(sql1.toString());
				
				while (rs1.next() && rs1 != null) {

					JSONObject subData1 = new JSONObject();
					
					subData1.put("productid", rs1.getString("productid"));
					subData1.put("productcd", rs1.getString("productcd"));
					subData1.put("barcode", rs1.getString("barcode"));
					subData1.put("productname", rs1.getString("productname"));
					subData1.put("maker", rs1.getString("maker"));
					subData1.put("appropriatestock", rs1.getString("appropriatestock"));
					subData1.put("stock", rs1.getString("stock"));
					subData1.put("packingunit", rs1.getString("packingunit"));
					subData1.put("purchaseprice", rs1.getString("purchaseprice"));
					subData1.put("price", rs1.getString("price"));
					subData1.put("discount", rs1.getString("discount"));
					subData1.put("amt", rs1.getString("amt"));
					subData1.put("cnt", rs1.getString("cnt"));
					subData1.put("purchaseprice", rs1.getString("purchaseprice"));
					subData1.put("spec", rs1.getString("spec"));
					subData1.put("unit", rs1.getString("unit"));
					subData1.put("size", rs1.getString("size"));
					
					masterData1.put(subData1);
					
				}
						
				subData2.put("productdata", masterData1);
				
			}
			
			subData.put("dispinfo",masterData2);
			
			masterData.put(subData);
			
		}
		
		if (stmt2 != null)
			stmt2.close();
		if (rs2 != null)
			rs2.close();
		if (sql2 != null)
			sql2 = null;
		
		
		if (stmt1 != null)
			stmt1.close();
		if (rs1 != null)
			rs1.close();
		if (sql1 != null)
			sql1 = null;
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return masterData;
	}
	
	
	/* 
	호출명 : delDabindo
	용도	 : 다빈도 상품 삭제
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	public int delDabindo(Connection con,String compcd,String dabindocd,String setcode,String productcd,String subnum)throws Exception {
		
		int dabindocnt =0;
		ResultSet rs = null;
		Statement stmt = null;
		String sql = null;
		String setYN="N";
		
		System.out.println("setcode="+setcode);
		
			if(setcode!=null && !setcode.equals("")){
				
				stmt = null;
				sql = new String();
				
				sql = (" delete from pos_compset where compcd='"+ compcd +"' and setcode = '"+ setcode +"' ");
				
				System.out.println("sql:다빈도 상품 삭제(세트)="+sql.toString());
				
				stmt = con.createStatement(); 
				dabindocnt = stmt.executeUpdate(sql.toString());
				
				System.out.println("dabindocnt="+dabindocnt);
			}
			
			if(setcode!=null && !setcode.equals("") && dabindocnt>0){
				setYN="Y";
			}else if(setcode!=null && !setcode.equals("") && dabindocnt==0){
				setYN="N";
			}else if(productcd!=null && !productcd.equals("") && subnum!=null && !subnum.equals("")){
				setYN="Y";
			}else{
				setYN="N";
			}
			
			if(setYN.equals("Y")){
				
				stmt = null;
				sql = new String();
				
				sql = (" delete from pos_compdabinproduct where compcd='"+ compcd +"'  ");
				if(setcode!=null && !setcode.equals("") ){
					sql = sql +(" and setcode = '"+ setcode +"'  ");
				}	
				if(productcd!=null && !productcd.equals("") && subnum!=null && !subnum.equals("")){
					sql = sql +(" and productcd ='"+ productcd +"' ");
				}
				
				System.out.println("sql:다빈도 상품 삭제="+sql.toString());
				
				stmt = con.createStatement(); 
				dabindocnt = stmt.executeUpdate(sql.toString());
				
				System.out.println("dabindocnt="+dabindocnt);
				
				if(dabindocnt>0){
					
					stmt = null;
					sql = new String();
					
					sql = (" update pos_compdabinproduct set subnum=subnum-1 where compcd='"+ compcd +"' and dabindocd='"+ dabindocd +"' and subnum > '"+ subnum +"' ");

					System.out.println("sql:다빈도 상품 이동="+sql.toString());
					
					stmt = con.createStatement(); 
					dabindocnt = stmt.executeUpdate(sql.toString());
					
					
					
				}else{ // 원복할까
					
					
					
				}
				
			}
		
			if (stmt != null)
				stmt.close();
			if (rs != null)
				rs.close();
			if (sql != null)
				sql = null;	
			
		return dabindocnt;
	}
	
	
	/* 
	호출명 : getDabindoList
	용도	 : 다빈도 상품이동
	버젼  : 1.0
	작성자 : 22.12.07
	작성일 : Jerry
	*/
	
	public int setProdChange(Connection con,String compcd, String[] prodVal, String[] subnumVal,int Cnt) throws Exception {
		
		int setCnt = 0;
		
		String subnum="";
		String dabinpdcd="";
		
		Statement stmt = null;
		String sql = null;
		
		stmt = con.createStatement(); 
		
		for(int i=0;i<Cnt;i++){
			
			subnum = subnumVal[i];
			dabinpdcd = prodVal[i];
			
			sql = (" update pos_compdabinproduct set subnum = '"+ subnum +"' where compcd='"+ compcd +"' and dabinpdcd = '"+ dabinpdcd +"' ");
			
			System.out.println("sql:다빈도 상품 이동="+sql.toString());
			
			setCnt = stmt.executeUpdate(sql.toString());
			
		}
		
		if (stmt != null)
			stmt.close();
		if (sql != null)
			sql = null;
		
		return setCnt;
		
	}
	
	
	public int setSalesCanData(Connection con,String compcd,String salesseq,String paymethod,String auth_no,String auth_date,String auth_time,String org_auth_no,String org_auth_date,String org_auth_time,String paygubn) throws Exception {
		
		int setCnt = 0;
		String org_paymentcd = null;
		
		Statement stmt = null;
		String sql = null;
		ResultSet rs = null;
		
		System.out.println("org_auth_no="+org_auth_no);
		
		/* 원 승인 번호 조회 */
		sql = ("select paymentcd from pos_payment where compcd='"+ compcd +"' and auth_no ='"+ org_auth_no +"' and auth_date ='"+ org_auth_date +"' and paygubn='ACC' ");
		
		System.out.println(" 원 승인 번호 조회 sql="+sql.toString());
		
		stmt = con.createStatement();
		rs = stmt.executeQuery(sql.toString());
		
		while (rs.next() && rs != null) {
			org_paymentcd = rs.getString("paymentcd");
		}
		
		System.out.println("org_paymentcd="+org_paymentcd);
		
		
		if(org_paymentcd==null){
			setCnt = 0;
		}else{
			
			/* 결제  중복체크 */
			
			stmt = null;
			rs = null;
			
			sql = (" select count(*) as paycnt from pos_payment where compcd='"+ compcd +"' and paymentcd ='"+ salesseq +"' and paygubn='"+ paygubn +"' ");
			
			System.out.println("compcd="+compcd);
			System.out.println("paymentcd="+salesseq);
			System.out.println("paygubn="+paygubn);
			
			System.out.println("sql="+sql.toString());
			
			stmt = con.createStatement();
			rs = stmt.executeQuery(sql.toString());
			
			rs.next();
			
			int paymentcnt = rs.getInt("paycnt");
			
			System.out.println("paymentcnt="+paymentcnt);
			
			if(paymentcnt>0){
				
				setCnt = 0;
				
			}else{
				
				/* 결제 취소 등록 */
				setCnt = 0;
				sql = (" insert into pos_payment(compcd,paymentcd,paymethod,auth_no,auth_date,auth_time,org_auth_no,org_auth_date,org_auth_time,paygubn,cardno,card,money,amt,vat,total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,etcamt,auth_ti,trans_filler,regdt,vancd) ");
				sql = sql +  (" select compcd,'"+ salesseq +"','"+ paymethod +"','"+ auth_no +"','"+ auth_date +"','"+ auth_time +"','"+ org_auth_no +"','"+ org_auth_date +"',auth_time,'CAN',cardno,card,money,amt,vat,total,discount,money_no,prescription_no,cardgubn,installments,salesid,name,birthday,sex,hp,tid,productnames,etcamt,auth_ti,trans_filler,now(),vancd from pos_payment where compcd='"+ compcd +"' and auth_no ='"+ org_auth_no +"' and auth_date ='"+ org_auth_date +"' ");
				
				System.out.println("sql:결제 취소 등록="+sql.toString());
				
				stmt = con.createStatement(); 
				setCnt = stmt.executeUpdate(sql.toString());
				
				if(setCnt>0){
					
					setCnt = 0;
					/* 판매 취소 등록 */
	
					stmt = null;
					sql = null;
					sql = (" insert into pos_salelist(compcd,salescd,salesdate,salesday,salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,paymentcd,productsid,birth_year,salesti) ");
					sql = sql +  (" select compcd,fn_getuuid('SAL'),cast('"+ auth_date +"' as date),'"+ auth_date +"',salestime,productcd,pay_method,cnt,price,discount,amt,vat,total,sex,hp,groupcode,productid,etcamt,'"+ salesseq +"',productsid,birth_year,salesti from pos_salelist where compcd='"+ compcd +"' and paymentcd='"+ org_paymentcd +"' ");
					
					System.out.println("sql:제품 판매 취소="+sql.toString());
	
					stmt = con.createStatement();
					setCnt = stmt.executeUpdate(sql.toString());
					
					/* 재고반영 */
					stmt = null;
					sql = null;
	
					sql = (" insert into pos_compstock(compcd,productid,productcd,stock,appropriatestock,regcd,regdt)");
					sql = sql +  (" select compcd,productid,productcd,st,appropriatestock,regcd,regdt ");
					sql = sql +  (" from( ");
					sql = sql +  (" 	select ps.compcd,pc.productid,pc2.productcd,ps.cnt*pc.packingunit as st,0 as appropriatestock,'1' as regcd,now() as regdt   ");
					sql = sql +  (" 		from pos_salelist ps ");
					sql = sql +  (" 		inner join pos_compproductgroup pc  ");
					sql = sql +  (" 			on ps.compcd = pc.compcd and ps.productcd = pc.productcd  ");
					sql = sql +  (" 		inner join pos_compproduct pc2  ");
					sql = sql +  (" 			on pc.compcd = pc2.compcd  and pc.productid = pc2.productid  ");
					sql = sql +  (" 	where ps.compcd='"+ compcd +"' and ps.paymentcd ='"+ salesseq +"' ");
					sql = sql +  (" ) a ");
					sql = sql + (" on duplicate key ");
					sql = sql + (" update ");
					sql = sql + (" updatedate = now() ");
					sql = sql + (" ,stock = stock+st ");
					
					System.out.println("sql:제품 재고 복구=="+sql);
					
					stmt = con.createStatement();
					stmt.executeUpdate(sql.toString());
					
				}
			}
		}
		
		if (stmt != null)
			stmt.close();
		if (rs != null)
			rs.close();
		if (sql != null)
			sql = null;
		
		return setCnt;
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