

// TODO callback関数success用,error用を追加

var calModel = {
  dbName:"calendar",
  fetchAll:function(callback){
    $.couch.urlPrefix = "http://localhost:5984";
    $.couch.db(this.dbName).allDocs({
        include_docs:true,
        success: function(data) {
          console.log(data);
          var fetchedRowEvents = data.rows;
          var i;
          var events = [];
          for(i=0;i<fetchedRowEvents.length;i++){
            events.push(fetchedRowEvents[i].doc);
          }
          callback(events);
        }
    });
  },
  update:function(event,callback){
    console.log("updateEvent");
    console.log(event);
    var dataToSave = {
      _id:event._id,
      _rev:event._rev,
      start:event.start,
      end:event.end,
      title:event.title
    };
    if( dataToSave._id && dataToSave._id.length==4 ){
      delete(dataToSave._id);
    }
    var options ={
      success:function(resp){
        console.log("updated successfully.")
        console.log(resp);
        if(event._rev){ //レコード更新
          event._rev=resp.rev;
        }
        if(callback){
          callback(event);
        }
      },
      error:function(resp){
        console.log("update failure.")
        console.log(resp);
      }
    };
    $.couch.db(this.dbName).saveDoc(dataToSave,options);
  }
};

var frequentlyTask = {
  dbName:"frequently_task",
  create: function(){
    var value = prompt('Task Name?');
    var dataToSave = {
      title:value
    };
    var options ={
      success:function(resp){
        appendFrequentlyTaskToList({title:value});
      },
      error:function(resp){
        console.log("frequently_task update failure.")
        console.log(resp);
      }
    };
    $.couch.db(this.dbName).saveDoc(dataToSave,options);
  },
  delete: function(task,callback){
    $.couch.db(this.dbName).removeDoc(task, {
      success: function(data) {
        callback();
      },
      error: function(status) {
        console.log(status);
      }
    });
  },
  update: function(task,callback){
    var options ={
      success:function(resp){
        console.log("updated successfully.")
        console.log(resp);
        if(task._rev){ //レコード更新
          task._rev=resp.rev;
        }
        if(callback){
          callback();
        }
      },
      error:function(resp){
        console.log("update failure.")
        console.log(resp);
      }
    };
    $.couch.db(this.dbName).saveDoc(task,options);
  },
  fetchAll: function(callback){
    $.couch.urlPrefix = "http://localhost:5984";
    $.couch.db(this.dbName).allDocs({
        include_docs:true,
        success: function(data) {
          console.log(data);
          var fetchedRowEvents = data.rows;
          var i;
          var tasks = [];
          for(i=0;i<fetchedRowEvents.length;i++){
            tasks.push(fetchedRowEvents[i].doc);
          }
          callback(tasks);
        }
    });
  }
};
