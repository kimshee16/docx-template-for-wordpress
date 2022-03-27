import { TemplateHandler } from 'easy-template-x';
import { Docxtemplater } from 'docxtemplater';

var placeholders = [];

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

document.getElementById("get-parameters").onclick = function() {
   placeholders = [];
   document.getElementById("placeholdersarea").innerHTML = "";
   var file2 = document.getElementById("load-file").files[0];
	  var reader2 = new FileReader();
	  reader2.onload = function() { 
		  	loadFile(
		       reader2.result,
		       function (error, content) {
		           if (error) {
		               throw error;
		           }
		           var zip = new PizZip(content);
		           var doc = new window.docxtemplater(zip);
		           var text = doc.getFullText();
		           const myArray = text.split(" ");

		           const InspectModule = require("docxtemplater/js/inspect-module");
                   const iModule = InspectModule();
                   const doc1 = new window.docxtemplater(zip, { modules: [iModule] });
                   const tags1 = iModule.getAllTags();
                   console.log(tags1);

                   var keys = Object.keys(tags1);
				   console.log(keys);

				   for (var i = 0; i < keys.length; i++) {
		                alert("Detected placeholders: " + keys[i]);
		                placeholders.push(keys[i]);
		                let input = document.createElement("input");
				        input.type = "text";
				        input.placeholder = keys[i];
				        input.id = keys[i];
				        input.setAttribute("class", "placeholdersfield");
				        document.getElementById("placeholdersarea").appendChild(input);
				        let br = document.createElement("br");
				        document.getElementById("placeholdersarea").appendChild(br);
		           }

                   /*
		           for (var i = 0; i < myArray.length; i++) {
		               if(myArray[i].includes("{")) {
		                   if(myArray[i].includes("}")) {
		                       alert("Detected placeholders: " + myArray[i]);
		                       replacer = myArray[i].replace("{", "");
		                       replacer = replacer.replace("}", "");
		                       placeholders.push(replacer);
		                       let input = document.createElement("input");
				               input.type = "text";
				               input.placeholder = replacer;
				               input.id = replacer;
				               input.setAttribute("class", "placeholdersfield");
				               document.getElementById("placeholdersarea").appendChild(input);
				               let br = document.createElement("br");
				               document.getElementById("placeholdersarea").appendChild(br);
		                   }
		               }
		           }
		           console.log(placeholders);
		           */
		       }
		   );
	  };
	  reader2.readAsDataURL(file2);
}

document.getElementById("done-button").onclick = function(e) {
  	  var file = document.getElementById("load-file").files[0];
	  var reader = new FileReader();
	  reader.onload = function() { 
	    var blob = window.dataURLtoBlob(reader.result);
		const templateFile = blob;
		//var name = document.getElementById("name").value;
		//var age = document.getElementById("age").value;
		//const data = {
		//	    "name": name,
		//	    "age": age
		//	};
		const data = {};
		var phf = document.getElementsByClassName("placeholdersfield");
		for(var x = 0; x < phf.length; x++) {
			data[placeholders[x]] = phf[x].value;
		}
		
		console.log(data);

	    const handler = new TemplateHandler();
		async function doc1 ()
		{
		  const doc = await handler.process(templateFile, data);
		  saveFile('myTemplate - output.docx', doc);
		};
		doc1();
	  };
	  reader.readAsDataURL(file);
};

function saveFile(filename, blob) {
    const blobUrl = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.download = filename;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        link = null;
    }, 0);
}

//browserify().transform("babelify", {presets: ["es2015"]});