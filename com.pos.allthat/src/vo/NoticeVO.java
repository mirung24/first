package vo;

import org.springframework.web.multipart.MultipartFile;

public class NoticeVO {
	String no, noticecode, chaincode, title, content, category, regcd, regdt, upddt;
	int readhit;
	String search1, searchInput, searchDate1, searchDate2, pageno, pagecnt;
	String compcd, companyname, corporatenumber, addr, compcdArr, readyn, readdt;
	String[] compcdArr1;
	String url, filename, volume, extension, filecode;
	MultipartFile file;
	
	public String getFilecode() {
		return filecode;
	}
	public void setFilecode(String filecode) {
		this.filecode = filecode;
	}
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public String getVolume() {
		return volume;
	}
	public void setVolume(String volume) {
		this.volume = volume;
	}
	public String getReaddt() {
		return readdt;
	}
	public void setReaddt(String readdt) {
		this.readdt = readdt;
	}
	public String getReadyn() {
		return readyn;
	}
	public void setReadyn(String readyn) {
		this.readyn = readyn;
	}
	public String getCompcdArr() {
		return compcdArr;
	}
	public void setCompcdArr(String compcdArr) {
		this.compcdArr = compcdArr;
	}
	public String[] getCompcdArr1() {
		return compcdArr1;
	}
	public void setCompcdArr1(String[] compcdArr1) {
		this.compcdArr1 = compcdArr1;
	}
	public String getCompcd() {
		return compcd;
	}
	public void setCompcd(String compcd) {
		this.compcd = compcd;
	}
	public String getCompanyname() {
		return companyname;
	}
	public void setCompanyname(String companyname) {
		this.companyname = companyname;
	}
	public String getCorporatenumber() {
		return corporatenumber;
	}
	public void setCorporatenumber(String corporatenumber) {
		this.corporatenumber = corporatenumber;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getSearch1() {
		return search1;
	}
	public void setSearch1(String search1) {
		this.search1 = search1;
	}
	public String getSearchInput() {
		return searchInput;
	}
	public void setSearchInput(String searchInput) {
		this.searchInput = searchInput;
	}
	public String getSearchDate1() {
		return searchDate1;
	}
	public void setSearchDate1(String searchDate1) {
		this.searchDate1 = searchDate1;
	}
	public String getSearchDate2() {
		return searchDate2;
	}
	public void setSearchDate2(String searchDate2) {
		this.searchDate2 = searchDate2;
	}
	public String getPageno() {
		return pageno;
	}
	public void setPageno(String pageno) {
		this.pageno = pageno;
	}
	public String getPagecnt() {
		return pagecnt;
	}
	public void setPagecnt(String pagecnt) {
		this.pagecnt = pagecnt;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public String getNoticecode() {
		return noticecode;
	}
	public void setNoticecode(String noticecode) {
		this.noticecode = noticecode;
	}
	public String getChaincode() {
		return chaincode;
	}
	public void setChaincode(String chaincode) {
		this.chaincode = chaincode;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getRegcd() {
		return regcd;
	}
	public void setRegcd(String regcd) {
		this.regcd = regcd;
	}
	public String getRegdt() {
		return regdt;
	}
	public void setRegdt(String regdt) {
		this.regdt = regdt;
	}
	public String getUpddt() {
		return upddt;
	}
	public void setUpddt(String upddt) {
		this.upddt = upddt;
	}
	public int getReadhit() {
		return readhit;
	}
	public void setReadhit(int readhit) {
		this.readhit = readhit;
	}
	
}
