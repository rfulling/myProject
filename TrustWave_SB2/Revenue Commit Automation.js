/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @author Chelsea Fagen, RSM
 */
 
    define(["N/record", "N/render", "N/search"], function( record, render, search){
 
      
 
        /**
         * @description Acquires a collection of data
         * 
         * @returns Array | Object | search.Search | mapReduce.ObjectRef | file.File Object
         */
        function getInputData(){
 
            try{
            	var rev_commit_automationSearchObj = search.create({
            		   type: "customrecordtw__rev_commit_automation",
            		   filters:
            		   [
            		   ],
            		   columns:
            		   [
            		      search.createColumn({name: "custrecord_tw_rec_commit_automation", label: "Sales Order"}),
            		      search.createColumn({name: "custrecordtw_rev_commit_auto_crm_id", label: "CRM ID"}),
            		      search.createColumn({name: "custrecord_tw_re_commit_autu_sku", label: "Sku Item"}),
            		      search.createColumn({name: "custrecord_tw_rev_commit_auto_qty", label: "Quanity"}),
            		      search.createColumn({name: "custrecord_tw_rev_commit_auto_amt", label: "Amount"}),
            		      search.createColumn({name: "custrecord_tw_rev_commit_auto_start", label: "Rev Rec Start"}),
            		      search.createColumn({name: "custrecord_tw_rev_commit_auto_enddate", label: "Rev Rec End"})
            		   ]
            		});
            		var searchResultCount = customrecordtw__rev_commit_automationSearchObj.runPaged().count;
            		log.debug("customrecordtw__rev_commit_automationSearchObj result count",searchResultCount);
            		customrecordtw__rev_commit_automationSearchObj.run().each(function(result){
            		   // .run().each has a limit of 4,000 results
            		   return true;
            		});
 
            }catch(e){
                log.error("Script Error", e);
            }
 
            log.debug("rev_commit_automationSearchObj", rev_commit_automationSearchObj);
            return rev_commit_automationSearchObj;
        }
     
        /**
         * @description Parses each row of data into a key/value pair
         * One key/value pair is passed per function invocation 
         * 
         * @param {*} context 
         */
        function map(context){
            log.debug("enter map context", context);
             try{
 
                if(!context || !context.value) return;
                var revCommitSearch = JSON.parse(context.value);
                soID: Number(openInvoiceSearch.id);
               
               context.write({
                    key: customerId,
                    value: openInvoiceSearch
                });
             
            }catch(e){
                log.error("Script Error", e);
            }
 
            log.debug("exit map context", context);
     
        }
     
        /**
         * @description Evaluates the data in each group 
         * One group (key/value) is passed per function invocation 
         * 
         * @param {*} context 
         */
        function reduce(context){
            log.debug("enter reduce context", context);
 
            try{
            	
              var saleOrderID = Number(context.key);
              //transform the sales order
              // remove all the lines
              // loop through the new lines
              // add new lines 
               log.debug('what is the sales ORder  ',saleOrderID );
                 
 
             
             
            }catch(e){
                log.error("Script Error", e);
            }
 
            log.debug("exit reduce context", context);
        }
     
     
        /**
         * @description Summarizes the output of the previous stages
         * Used summarize the data from the entire map/reduce process and write it to a file or send an email
         * This stage is optional
         * 
         * @param {*} summary 
         */
        function summarize(summary){
            var type = summary.toString();
            log.debug(type + ' Usage Consumed', summary.usage);
            log.debug(type + ' Number of Queues', summary.concurrency);
            log.debug(type + ' Number of Yields', summary.yields);
        }
        return {
            getInputData: getInputData,
            //map: map,
            reduce: reduce,
            summarize: summarize
        };
     
    });