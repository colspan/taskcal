
var calModel = {
  dbName:"calendar",
  fetchEvents:function(callback){
    $.couch.urlPrefix = "http://localhost:5984";
    $.couch.db("calendar").allDocs({
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
  updateEvent:function(event,callback){ // TODO optionsとしてcallback関数errorとsuccessつくる
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
