package vo;

import java.util.ArrayList;

public class ApiVO {
	String BUSI_NAME, BUSI_NO, RET_CODE, RET_MSG;
	int DATA_CNT;
	ArrayList<String> DATA;
	Object TOT_DATA;
	
	public String getBUSI_NAME() {
		return BUSI_NAME;
	}
	public void setBUSI_NAME(String bUSI_NAME) {
		BUSI_NAME = bUSI_NAME;
	}
	public String getBUSI_NO() {
		return BUSI_NO;
	}
	public void setBUSI_NO(String bUSI_NO) {
		BUSI_NO = bUSI_NO;
	}
	public String getRET_CODE() {
		return RET_CODE;
	}
	public void setRET_CODE(String rET_CODE) {
		RET_CODE = rET_CODE;
	}
	public String getRET_MSG() {
		return RET_MSG;
	}
	public void setRET_MSG(String rET_MSG) {
		RET_MSG = rET_MSG;
	}
	public int getDATA_CNT() {
		return DATA_CNT;
	}
	public void setDATA_CNT(int dATA_CNT) {
		DATA_CNT = dATA_CNT;
	}
	public ArrayList<String> getDATA() {
		return DATA;
	}
	public void setDATA(ArrayList<String> dATA) {
		DATA = dATA;
	}
	public Object getTOT_DATA() {
		return TOT_DATA;
	}
	public void setTOT_DATA(Object tOT_DATA) {
		TOT_DATA = tOT_DATA;
	}
	
}
