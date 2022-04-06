import { TemplateHandler } from 'easy-template-x';
import { Docxtemplater } from 'docxtemplater';

var placeholders = [];

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

document.getElementById("nextBtn").style.display = "none";

// otherBtn button click event - it will create new file input for other template upload
document.getElementById("otherBtn").onclick = function() {
  let fileinput = document.createElement("input");
  fileinput.setAttribute("type", "file");
  fileinput.setAttribute("class", "load-file");
  document.getElementsByClassName("tab")[0].appendChild(fileinput);

  let br =  document.createElement("br");
  document.getElementsByClassName("tab")[0].appendChild(br);
}

// get-parameters button click event
document.getElementById("get-parameters").onclick = function() {
  var loadfile = document.getElementsByClassName("load-file");
  for(var m = 0; m < loadfile.length; m++) {
      var file2 = document.getElementsByClassName("load-file")[m].files[0];
      getParameters(file2, m);
  }
}

// function for getting the parameters from the docx template uploaded
function getParameters(file2, index2) {
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

             var checkph = "";
             for (var i = 0; i < keys.length; i++) {
                      var checkph = checkExistingPlaceholder(keys[i]);
                      if(checkph == false) {
                          placeholders.push(keys[i]);
                          let input = document.createElement("input");
                          input.type = "text";
                          var i2 = i + 1;
                          input.placeholder = "Parameter " + i2 + " (" + keys[i] + ")";
                          input.id = keys[i];
                          input.setAttribute("class", "placeholdersfield");

                          if(i == keys.length - 1) {
                            let tab = document.createElement("div");
                            tab.setAttribute("class", "tab");
                            tab.appendChild(input);
                            document.getElementById("tabarea").appendChild(tab);
                          } else {
                            let tab = document.createElement("div");
                            tab.setAttribute("class", "tab");
                            tab.appendChild(input);
                            document.getElementById("tabarea").appendChild(tab);
                          }

                          let span = document.createElement("span");
                          span.setAttribute("class", "step");
                          document.getElementById("steparea").appendChild(span);
                      }
                 }
                 document.getElementById("nextBtn").style.display = "inline";
                 document.getElementById("get-parameters").style.display = "none";
                 if(index2 == (document.getElementsByClassName("load-file").length-1)) {
                    document.getElementById("nextBtn").click();
                 }
             }
         );
      };
      reader2.readAsDataURL(file2);
}

// to check if the placeholder/parameter is already existing
function checkExistingPlaceholder(keyToCheck) {
  return placeholders.includes(keyToCheck);
}

// done-button id click - for processing and downloading the docx template with value on parameter
document.getElementById("done-button").onclick = function(e) {
	  var loadfile = document.getElementsByClassName("load-file");
    for(var m = 0; m < loadfile.length; m++) {
        var file = document.getElementsByClassName("load-file")[m].files[0];
        processFile(file);
    }
    document.getElementById("new-button").style.display = "inline";
};

// to process the data from form inputs and template then it will automatically download the new docx file.
function processFile(file) {
    var reader = new FileReader();
    reader.onload = function() { 
    var blob = window.dataURLtoBlob(reader.result);
    const templateFile = blob;
    const data = {};
    var phf = document.getElementsByClassName("placeholdersfield");
    for(var x = 0; x < phf.length; x++) {
      data[placeholders[x]] = phf[x].value;
    }
    const handler = new TemplateHandler();
    async function doc1 ()
    {
      const doc = await handler.process(templateFile, data);
      var filename2 = file.name;
      var filearray = filename2.split(".");
      saveFile(filearray[0]+"_filled.docx", doc);
    };
    doc1();
    };
    reader.readAsDataURL(file);
}

// function for saving/downloading the new docx templates
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

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

// to show the tab either previous or next tab
function showTab(n) {
  console.log(n);
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } 
  else if (n == (x.length-1)) {
    document.getElementById("prevBtn").style.display = "none";
  }
  else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    //document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
/*
  if (n == (x.length - 1)) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
  }
*/
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

document.getElementById("prevBtn").onclick = function() {
  // This function will figure out which tab to display
  var n = document.getElementById("prevvalue").value;
  n = parseInt(n);
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

document.getElementById("nextBtn").onclick = function() {
  // This function will figure out which tab to display
  var n = document.getElementById("nextvalue").value;
  n = parseInt(n);
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...

  document.getElementById("otherBtn").style.display = "none";
  if (currentTab == (x.length - 1)) {
    // ... the form gets submitted:
    //document.getElementById("regForm").submit();
    //return false;
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("new-button").style.display = "none";
    document.getElementById("done-button").style.display = "inline";
  }

  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function nextbuttonClick() {
//function nextPrev(n) {
  // This function will figure out which tab to display
  var n = document.getElementById("nextvalue").value;
  n = parseInt(n);
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...

  document.getElementById("otherBtn").style.display = "none";
  if (currentTab == (x.length - 1)) {
    // ... the form gets submitted:
    //document.getElementById("regForm").submit();
    //return false;
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("new-button").style.display = "none";
    document.getElementById("done-button").style.display = "inline";
  }

  // Otherwise, display the correct tab:
  showTab(currentTab);
}

document.getElementById("new-button").onclick = function() {
  placeholders = [];
	location.reload();
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}