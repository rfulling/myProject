function suitelet_print(request, response){
     var ifid = request.getParameter('custparam_recid');
	 var record = nlapiLoadRecord('invoice', ifid);
	 var toEmail = record.getFieldValue('custbody_to_email');	
	 var createdFrom = record.getFieldValue('createdfrom');	
	 
	 var docName = record.getFieldValue('tranid');
	 var mailDate= new Date();
	 nlapiLogExecution('DEBUG', 'to email from field : ', toEmail);	
	// nlapiLogExecution('DEBUG', 'Created From SO Internal ID: ', createdFrom);	
     var file = nlapiPrintRecord('TRANSACTION', ifid, 'PDF',null); 
	 //this will allow you to define the template that will be used to print the invoice
     response.setContentType('PDF', 'Print Invoice Record', 'INLINE');
     response.write(file.getValue());
	  var emailTempId = 5; // internal id of the email template
	  var emailTemp = nlapiLoadRecord('emailtemplate',emailTempId); 
	  var emailSubj = emailTemp.getFieldValue('subject');
	  var emailBody = emailTemp.getFieldValue('content');	  
	  var records = new Array();
	  records['transaction'] = nlapiGetRecordId(); //internal id of Transaction
	 
	
	  if (toEmail)
    	{
  	  	var cc = [];
  	  	toEmail = toEmail.split(',');
  	  	primaryEmail=toEmail[0];
  	  	for (var x = 0; x < toEmail.length-1; x++){
  	  		cc.push(toEmail[x+1]);
            
  	  	}
  	 }   
   
      var renderer = nlapiCreateTemplateRenderer();
	  renderer.addRecord('transaction', record);
	  nlapiLogExecution('DEBUG', 'primaryEmail = ', primaryEmail);
	  nlapiLogExecution('DEBUG', 'what id the cc ', cc);	
	  
	  renderer.setTemplate(emailSubj);	 
	  renderSubj = renderer.renderToString();
	  
	  nlapiLogExecution('DEBUG', 'what is the subject ', renderSubj);
	  
	  renderer.setTemplate(emailBody);
	  renderBody = renderer.renderToString();
	  
	  nlapiSendEmail(23779, primaryEmail, renderSubj, renderBody, cc, null, records, file);
	  nlapiLogExecution('DEBUG', 'Email successfully Sent');	  
	 
	  //RF to save pdf and put file on the transction.
	  
	  file.setName(docName + ' - '+  mailDate + '.pdf' );
	  file.setFolder(25257);
	  fileId = nlapiSubmitFile(file);
	  
	  //create the message so it stays on the transaction 
	  
	  var mailedMessage = nlapiCreateRecord('message');
	  mailedMessage.setFieldValue('author',23779);
	  mailedMessage.setFieldValue('subject',renderSubj);
	  mailedMessage.setFieldValue('message', renderBody);
	  mailedMessage.setFieldValue('transaction', ifid);
	  mailedMessage.setFieldValue('emailed','T');
	  mailedMessage.setFieldValue('recipientemail',primaryEmail);
	  var index = mailedMessage.getLineItemCount('mediaitem');
	  nlapiLogExecution('DEBUG', 'what index '+index);
	  mailedMessage.setLineItemValue('mediaitem', 'mediaitem', index + 1, fileId);
	 // 	mailedMessage.selectNewLineItem('ccbcclist');
     // 	mailedMessage.setCurrentLineItemValue('ccbcclist','cc','T');
//		mailedMessage.setCurrentLineItemValue('ccbcclist','email',cc);
	//	mailedMessage.commitLineItem('ccbcclist');
 
	  
	  nlapiSubmitRecord(mailedMessage);
	  
	  }
