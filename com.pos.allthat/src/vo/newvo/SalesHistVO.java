package vo.newvo;

public class SalesHistVO {
	String salesdt, compcd, chaincode, popSearch1, popSearch2;
	int tot, cnt;
	
	public String getSalesdt() {
		return salesdt;
	}
	public void setSalesdt(String salesdt) {
		this.salesdt = salesdt;
	}
	public String getCompcd() {
		return compcd;
	}
	public void setCompcd(String compcd) {
		this.compcd = compcd;
	}
	public String getChaincode() {
		return chaincode;
	}
	public void setChaincode(String chaincode) {
		this.chaincode = chaincode;
	}
	public String getPopSearch1() {
		return popSearch1;
	}
	public void setPopSearch1(String popSearch1) {
		this.popSearch1 = popSearch1;
	}
	public String getPopSearch2() {
		return popSearch2;
	}
	public void setPopSearch2(String popSearch2) {
		this.popSearch2 = popSearch2;
	}
	public int getTot() {
		return tot;
	}
	public void setTot(int tot) {
		this.tot = tot;
	}
	public int getCnt() {
		return cnt;
	}
	public void setCnt(int cnt) {
		this.cnt = cnt;
	}
}
