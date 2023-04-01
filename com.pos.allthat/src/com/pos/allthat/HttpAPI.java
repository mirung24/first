package com.pos.allthat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class HttpAPI {
	private static final String URL = "https://api.allthatpay.kr/approve.do";
	
	public static JSONObject httpGetConnection(String data) throws IOException, ParseException {
		
		URL url = new URL(URL);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		
		// 전송모드 설정
		conn.setRequestMethod("POST");
		conn.setRequestProperty("Accept", "application/json");
		conn.setRequestProperty("Content-type", "application/json");// api 리턴값을 json으로 받을 경우!
		conn.setDoOutput(true);// OutputStream으로 POST 데이터를 넘겨주겠다는 옵션.
		conn.setDoInput(true);// InputStream으로 서버로 부터 응답을 받겠다는 옵션.
		
		BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
		bw.write(data.toString());
		bw.flush();
		bw.close();
		
		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
		String returnMsg = in.readLine();
		System.out.println("응답메시지 : "+  returnMsg);
		
		int responseCode = conn.getResponseCode();
		if(responseCode == 400) {
			System.out.println("400: 명령을 실행 오류");
		} else if(responseCode == 500) {
			System.out.println("500: 서버에러");
		} else {
			System.out.println(responseCode +": 응답코드임");
		}
		
		JSONParser parser = new JSONParser();
		Object obj = parser.parse(returnMsg);
		JSONObject json = (JSONObject)obj;
		
		return json;
	}//httpGetConnection
}