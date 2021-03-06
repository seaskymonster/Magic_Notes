var Util=require('./util'); // you need to know what is Util
var mysql=require('mysql');  // you need to know what is mysql..
var dbClient;

module.exports =function(){
	_constructor();

	this.findOneById=function(tableName,idJson,callback){
       dbClient.query('SELECT * FROM ' + tableName +' where ?', idJson, 
       	   function(error, results){
       	   	   if(error){
       	   	   	   console.log('GetData Error:' + error.message);
       	   	   	   dbClient.end();
       	   	   	   callback(false);// return false;; if there are some error....
       	   	   }else{

       	   	   	     if(results){ // if you can look up one data...
       	   	   	     	callback(results.pop());  //in this pop(), it is good when you want to console one item of the json..
       	   	   	     }else{ // if the pop data is empty.....
       	   	   	    	callback(results);
       	   	   	     }
       	   	   }
       	   });
	};

this.findAllById=function(tableName,idJson,callback){
       dbClient.query('SELECT * FROM ' + tableName +' where ?', idJson, 
           function(error, results){
               if(error){
                   console.log('GetData Error:' + error.message);
                   dbClient.end();
                   callback(false);// return false;; if there are some error....
               }else{

                     if(results){ // if you can look up one data...
                      callback(results);  //in this pop(), it is good when you want to console one item of the json..
                     }else{ // if the pop data is empty.....
                      callback(results);
                     }
               }
           });
  };

	this.insert=function(tableName,rowInfo,callback){
        dbClient.query('INSERT INTO ' +tableName+' SET ?',rowInfo, function(error,result){  //change rowInfo's JSON to "key==value" format
        	if(error){
            console.log("InsertData Error"+ error.message);
            dbClient.end();
            callback(false);
          }else{
            callback(result);
          }
       });
	};

	this.modify=function(tableName,idJson,rowInfo,callback){
         dbClient.query('UPDATE ' + tableName +' SET ? where ?',[rowInfo, idJson], function(err, result){
         	if(err){
         		console.log("ClientReady Error: " +err.message);
         		callback(false);
         	}else{
         		callback(result);
         	}
         });
	};


	this.remove=function(tableName,idJson,callback){
         dbClient.query('DELETE FROM '+tableName +' where ?',idJson,
          function(err,results){
         	if(err){
         		console.log("ClientReady Error: "+err.message);
         		dbClient.end();
         		callback(false);
         	}else{
         		callback(true);
         	}
         });
	};

  this.findbycondition=function(tableName,username,password,callback){
        console.log(username);
        console.log(password);
        dbClient.query('SELECT * FROM ' + tableName +' where'+ username +password, 
          function(error,results){
          if(error){
             console.log("ClientReady Error: "+error.message);
             callback(false);
          }else{
            console.log(results);
            callback(results.pop());
          }
        });
  };

	this.find=function(tableName, whereJson, orderByJson, limitArr, fieldsArr, callback){
         var andWhere = whereJson['and'];
         var orWhere  = whereJson['or'];
         var andArr   =[] ;
         var orArr    =[];

         for( var i=0; i<andWhere.length;i++){
            andArr.push(andWhere[i]['key']+andWhere[i]['opts']+andWhere[i]['value']);
         }

         for( var i=0; i<orWhere.length;i++){
            andArr.push(orWhere[i]['key']+orWhere[i]['opts']+orWhere[i]['value']);
         }

         var fieldsStr= fieldsArr.length>0 ? fieldsArr.join(',') : '*';
         var andStr= andArr.length>0 ? andArr.join(' AND ') : ' ';
         var orStr =orArr.length>0 ? ' or ' +orArr.join(' OR ') : ' ';
         var limitStr= limitArr.length>0 ? 'limit'+limitArr.join(',') : ' ';
         var orderStr= orderByJson ? ' order by ' +orderByJson['key'] +' '+orderByJson['type'] :' ';

         dbClient.query('SELECT ' +fieldsStr +' FROM ' +tableName +' WHERE ' + andStr + orStr +orderStr +limitStr+';', function(err,results){
          if(err){
            console.log("ClientReady Error: "+err.message);
            dbClient.end();
            callback(false);
          }else{
            callback(results);
          }
         });
	};

	function _constructor(){
		
		var dbConfig=Util.get('config.json','db');

		client={};
		client.host=dbConfig['host'];
		client.port=dbConfig['port'];
		client.user=dbConfig['user'];
		client.password=dbConfig['password'];
        
		dbClient=mysql.createConnection(client);  //create the connection object... 
		dbClient.connect();  //connect to mysql...

		dbClient.query('USE '+dbConfig['dbName'], function(error, results){  // USE is used to connect MYSQL's one database....
			if(error){
				console.log('ClientConnectionReady Error:'+ error.message);
				dbClient.end();
			}else{
			console.log('connection local mysql success');
		    }
		});

	}
}