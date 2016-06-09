function athleteList() {
  this.athletes = {
    /*2: {
      "name": "Luke MCKENZIE",
      "startTime": "8:05"
    },*/
    386: {
      "name": "Glen HARKER",
      "startTime": "8:05"
    }
  };

  this.load();
}

athleteList.prototype.save = function () {
  if (typeof(Storage) !== "undefined") {
    var athletes = JSON.stringify(this.athletes);
    localStorage.setItem("athletes",athletes);
  } else {
    console.debug("This browser doesn't support local storage");
  }
};

athleteList.prototype.load = function () {
  if (typeof(Storage) !== "undefined") {
    var athletes = JSON.parse(localStorage.getItem("athletes"));
    console.log(athletes);
    if (athletes) {
      this.athletes = athletes;
    }
  } else {
    console.debug("This browser doesn't support local storage");
  }
};

athleteList.prototype.add = function (bib, start) {
  var that = this;

  //post to server
/*  $.get("/addAthlete?bib="+bib+"&start="+start, function athResponse(data){
    //process response
    that.added();
  });*/

  //get response


  //add athlete
  this.athletes[bib] = {
    "startTime": start
  }

  //save athlete list
  this.save();

  //update dom
  this.updateDom();
};

athleteList.prototype.list = function() {
  //get
}

athleteList.prototype.updateDom = function() {
  // delete everything
  $("#MainMenu").html("");

  for (bib in this.athletes) {
    // rebuild
    if (this.athletes[bib].hasOwnProperty("name")) {
      var name = this.athletes[bib].name;
    } else {
      var name = "#"+bib;
    }

    var dom = '<a class="list-group-item" href="#'+bib+'"><span class="glyphicon glyphicon-user menu-icon"></span> '+name+'</a>';
    $("#MainMenu").append(dom);
  }

}

athleteList.prototype.added = function() {
  //call update function
  this.callback.runCallbacks("updated");
}

athleteList.prototype.runCallbacks = function(event, data) {
	if (!data) data = this;

	if (this.callbacks[event]) {
		for (i in this.callbacks[event]) {
			if (typeof this.callbacks[event][i] === "function") {
		    // Call it, since we have confirmed it is callable​
		        this.callbacks[event][i].apply(data);
		    }
		}
	}
}

athleteList.prototype.update = function(callback) {
  this.callbacks["updated"].push(callback);
}

athleteList.prototype.updateAthlete = function(data) {
  //check the data has the correct paramaters
  if (data.hasOwnProperty("bib") && data.hasOwnProperty("name")) {
    //check athlete has been added
    if (this.athletes.hasOwnProperty(data.bib)) {
      //check if the name already exists
      if (this.athletes[data.bib].name != data.name) {
        this.athletes[data.bib].name = data.name;
        //save
        this.save();
        //update dom
        this.updateDom();
      }
    } else {
      console.error("Athlete data for a non-existant athlete has been loaded!!!")
    }
  }
}


athleteList.prototype.submit = function(event) {
  var bib = $('#add-bibNumber').val()
  var startTime = $("add-startTime").val();
  this.add(bib,startTime);

  $("#addAthleteModal").modal('hide');
  window.location.hash = bib;
};
