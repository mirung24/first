package vo;

public class ChaincompanyVO {
	String chaincode, compcd, registerdate, regdt, regcd, remarks;
	java.math.BigDecimal canceldate;
	
	public String getChaincode() {
		return chaincode;
	}
	public void setChaincode(String chaincode) {
		this.chaincode = chaincode;
	}
	public String getCompcd() {
		return compcd;
	}
	public void setCompcd(String compcd) {
		this.compcd = compcd;
	}
	public String getRegisterdate() {
		return registerdate;
	}
	public void setRegisterdate(String registerdate) {
		this.registerdate = registerdate;
	}
	public String getRegdt() {
		return regdt;
	}
	public void setRegdt(String regdt) {
		this.regdt = regdt;
	}
	public String getRegcd() {
		return regcd;
	}
	public void setRegcd(String regcd) {
		this.regcd = regcd;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public java.math.BigDecimal getCanceldate() {
		return canceldate;
	}
	public void setCanceldate(java.math.BigDecimal canceldate) {
		this.canceldate = canceldate;
	}
}
