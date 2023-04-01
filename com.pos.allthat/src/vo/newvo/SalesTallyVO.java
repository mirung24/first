package vo.newvo;

public class SalesTallyVO {
	int total, cnt, avgtot;
	float avgcnt;
	String compcd;

	public String getCompcd() {
		return compcd;
	}

	public void setCompcd(String compcd) {
		this.compcd = compcd;
	}

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public int getCnt() {
		return cnt;
	}

	public void setCnt(int cnt) {
		this.cnt = cnt;
	}

	public int getAvgtot() {
		return avgtot;
	}

	public void setAvgtot(int avgtot) {
		this.avgtot = avgtot;
	}

	public float getAvgcnt() {
		return avgcnt;
	}

	public void setAvgcnt(float avgcnt) {
		this.avgcnt = avgcnt;
	}
}
