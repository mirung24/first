var util  = function () {
	"use strict";	
	return {
//		LocalDate: function (month) {
//			if(month == "" || month === null || month === undefined){
//				month = 0;
//			}
//			var now = new Date();
//			now.setMonth(now.getMonth() + month);
//			var year = now.getFullYear();
//			var month = (now.getMonth() + 1) > 9 ? '' + (now.getMonth() + 1) : '0'
//					+ (now.getMonth() + 1);
//			var day = now.getDate() > 9 ? '' + now.getDate() : '0' + now.getDate();
//
//			return year + '-' + month + '-' + day;
//		},
//		LocalTime: function (val) {
//			var now = new Date();
//			var hours = now.getHours();
//			var minutes = now.getMinutes();
//			if(val == 24){
//				hours = hours > 9 ? '' + hours : '0' + hours;
//				minutes = minutes > 9 ? '' + minutes : '0' + minutes;
//				return hours + ':' + minutes;
//			}
//			var mid='AM';
//			if(hours > 12){ 
//				hours = hours-12;
//				mid='PM';
//		    }
//		    hours = hours > 9 ? '' + hours : '0' + hours;
//			minutes = minutes > 9 ? '' + minutes : '0' + minutes;
//			return hours + ':' + minutes + ' ' + mid;
//		},
		MakeSelOptions: function (ele,json,select,first) {
			if(first){
				ele.html("");
				var option = $("<option value='' />");
				option.text(first)
				ele.append(option);
			}
			for (var i = 0; i < json.length; i++) {
	    		var thisValue = json[i].code;
	    		var thisName = json[i].codename;
	    		var option = $("<option>", {value: thisValue,selected:select == thisValue});
	    		option.text(thisName)
	    		ele.append(option);   	
	    	}
		},
		MakeSelAccount: function (ele,json,select,first) {
			if(first){
				ele.html("");
				var option = $("<option value='all' />");
				option.text(first)
				ele.append(option);
			}
			for (var i = 0; i < json.length; i++) {
	    		var thisValue = json[i].accountcd;
	    		var thisName = json[i].accountname;
	    		var option = $("<option>", {value: thisValue,selected:select == thisValue});
	    		option.text(thisName)
	    		ele.append(option);   	
	    	}
		},
//		,
//		MakeLabelOptions: function (ele,json,select,first) {
//			if(first){
//				ele.html("");
//				var option = $("<option value='' />");
//				option.text(first)
//				ele.append(option);
//			}
//			for (var i = 0; i < json.length; i++) {
//	    		var thisValue = json[i].code_label;
//	    		var thisName = json[i].code_label;
//	    		var option = $("<option>", {value: thisValue,selected:select == thisValue});
//	    		option.text(thisName)
//	    		ele.append(option);   	
//	    	}
//		},			
//		MakeSelCharmOptions: function (ele,json,select,first) {
//			if(first){
//				ele.html("");
//				var option = $("<option info='' charmcd=''  value='' />");
//				option.text(first)
//				ele.append(option);
//			}
//			for (var i = 0; i < json.length; i++) {
//	    		var thisValue 	= json[i].code_value;
//	    		var thisName 	= json[i].code_label;
//	    		var thisInfo 	= json[i].info;
//	    		var thisCharmcd = json[i].charm_cd;
//	    		var option = $("<option>", {value: thisValue,charmcd: thisCharmcd, info: thisInfo, selected:select == thisValue});
//	    		option.text(thisName)
//	    		ele.append(option);   	
//	    	}
//		},		
//		MakeGrdOptions: function (json,first) {
//			var txt = "" ;
//			if(firstfirstption || first== ""){
//				 txt = ":"+first+";" ;
//			}
//			for (var i = 0; i < json.length; i++) {
//				if(i > 0){
//					txt +=";";
//				}				
//				txt +=json[i].code_value+":"+json[i].code_label;
//				
//			}
//			return txt;
//		},
		MakeSelCheckBox: function (ele,json,json_ret){
			ele.html("");
			
		 	for (var i = 0; i < json.length; i++) {
		        var thisValue = json[i].code;
	         	var thisName  = json[i].code;	
	         	var thisLabel = json[i].codename;	
	         	var thischeck = "";		
				if(json_ret){
	         	   thischeck = (json_ret[i].value == thisValue)?"checked":"";
			    }
			   var checkbox = $("<input class='inp-cbx' id='card"+(i+1)+"' type='checkbox' name='"+thisName+"' value='"+thisValue+"' "+thischeck +">");
			   var label = $("<label class='cbx' for='card"+(i+1)+"'><span><svg width='17px' height='15px'>" +
			   		"<use xlink:href='#check'></use></svg></span><span class='mr-2'>"+thisLabel+"</span></label>")
			  ele.append(checkbox).append(label);

			}
		}
//		MakepubOptions: function (ele,json,select,first) {
//			if(first){
//				ele.html("");
//				var option = $("<option value='' />");
//				option.text(first)
//				ele.append(option);
//			}
//			for (var i = 0; i < json.length; i++) {
//	    		var thisValue = json[i].idx;
//	    		var thisUse   = json[i].is_use;	
//	    		var thisName  = "["+ json[i].ver_nm +"]"+ json[i].pub_title;
//	    		var option = $("<option>", {value: thisValue, is_use: thisUse, selected:select == thisValue});
//	    		option.text(thisName)
//	    		ele.append(option);   	
//	    	}
//		},
//		MakeCustHisOptions: function (ele,json,select,first) {
//			if(first){
//				ele.html("");
//				var option = $("<option tab_id='' value='' />");
//				option.text(first)
//				ele.append(option);
//			}
//			for (var i = 0; i < json.length; i++) {
//	    		var thisValue 	= json[i].consult_id;
//	    		var thisName 	= json[i].charm_nm;
//	    		var thisTabId 	= json[i].tab_id;
//	    		var option = $("<option>", {value: thisValue, tab_id: thisTabId, selected:select == thisValue &&thisTabId == 1 });
//	    		option.text(thisName)
//	    		ele.append(option);   	
//	    	}
//		}			
									  
	};
}();
