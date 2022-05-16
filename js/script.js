const fromText=document.querySelector(".from-text"),
toText=document.querySelector(".to-text"),
selectTag=document.querySelectorAll("select"),
exchangeIcon=document.querySelector(".exchange"),
translateBTN=document.querySelector("button"),
icons=document.querySelectorAll(".row i");

selectTag.forEach((tag,id)=>{
	for(const country_code in countries) {
		// selecting English by-default from language and Bengali to language.
		let selected;
		if(id==0 && country_code=="en-US"){
			selected="selected";
		}
		else if(id==1 && country_code=="bn-IN"){
			selected="selected";
		}
		let option = `<option value="${country_code}" ${selected}>${countries[country_code]} </option>`;
		tag.insertAdjacentHTML("beforeend",option); // adding option tag inside select tag

	}
});

exchangeIcon.addEventListener("click",()=>{
	// exchanging the textarea and select tag values
	let tempText=fromText.value;
	tempLang=selectTag[0].value;
	fromText.value=toText.value;
	selectTag[0].value=selectTag[1].value;
	toText.value=tempText;
	selectTag[1].value=tempLang;
});

translateBTN.addEventListener("click",()=>{
	let text=fromText.value,
	translateFrom=selectTag[0].value,  //getting from select tag value
	translateTo=selectTag[1].value; //getting to select tag value
	if(!text)
		return;
	toText.setAttribute("placeholder", "Translating....");
	let apiURL=`https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
	// fetching api response and returning it with parsing into json object
	// and in another then method receiving that object
	fetch(apiURL).then(res=>res.json()).then(data=>{
		console.log(data);
		toText.value=data.responseData.translatedText;
		toText.setAttribute("placeholder", "Translation");
	})
});

icons.forEach(icon => {
	icon.addEventListener("click",({target})=>{
		console.log(target);
		if(target.classList.contains("fa-copy")){
			if(target.id=="from"){
				console.log("From copy icon clicked");
				navigator.clipboard.writeText(fromText.value);
			}
			else{
				console.log("To copy icon clicked");
				navigator.clipboard.writeText(toText.value);
			}
		}
		else{
			console.log("Speech icon clicked");
			// if clicked icon has from id, speak the fromTextArea value else speak the toTextarea value
			let utterance;
			if(target.id=="from"){
				utterance=new SpeechSynthesisUtterance(fromText.value);
				utterance.lang=selectTag[0].value; // setting utterance language to fromSelect tag value
			}
			else{
				utterance=new SpeechSynthesisUtterance(toText.value);
				utterance.lang=selectTag[1].value;	// setting utterance language to toSelect tag value
			}
			speechSynthesis.speak(utterance); //speak the passed utterance
		}
	})
});