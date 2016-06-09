var colors = ['#ff9900', '#ffa928', '#ffba51', '#ffca7a', '#ffdba3', '#ffebcc'];
var barCols = ['#bff66f', '#9ECAE1', '#f6c2bd', '#EE6D72', '#ED591A', '#ff9900'];
var genCol = colors[0];
var pacCol = colors[3];
var useCol = '#FF2E47'

var cols = {
	"Temperature" : "#9ECAE1",
	"Voltage" : "#ff9900",
	"Current" : "#ED591A",
	"Efficiency" : "#EE6D72",
	"Frequency" : "#bff66f"
};

var powerFormat = function() {
	var s = '<b>' + Highcharts.dateFormat('%I:%M%p', this.x) + '</b>';

	$.each(this.points, function(i, point) {
		val = roundNumber(point.y, 2);
		s += '<br/>' + point.series.name + ': <b>' + val;

		var unit = {
			'Instantaneous Power' : 'W',
			'Power Used' : 'W',
			'Power Generated' : 'W',
			'Net Power' : 'W',
			'Peak' : 'W',
			'Energy' : 'KWh',
			'Produced' : 'KWh',
			'Energy Used' : 'KWh',
			'Net Energy' : 'KWh',
			'Energy Generated' : 'KWh',
			'Exported' : 'KWh',
			'Imported' : 'KWh',
			'Consumed' : 'KWh',
			'Average Day' : 'KWh',
			'Power String 1' : 'KWh',
			'Power String 2' : 'KWh',
			'Voltage' : 'V',
			'Frequency' : 'Hz',
			'Current' : 'A',
			'Temperature' : '°C',
			'Efficiency' : '%'
		};

		if ($.inArray(this.series.name, unit)) {
			s += unit[this.series.name];
		} else {
			s += 'W'
			alert('not');
		}

		s += '</b>';
	});

	return s;
};

var axisPower = {// Primary yAxis
	labels : {
		formatter : function() {
			return this.value/1000 + 'KW';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Power',
		style : {
			color : '#666'
		}
	}
};

var axisEnergy = { // Tertiary yAxis
     min: 0,
     title: {
        text: 'Energy',
        style: {
           color: 'black'
        }
     },
     labels: {
        formatter: function() {
           return this.value +'W';
        },
        style: {
           color: 'black'
        }
     }
 };

var axisTemp = {// Primary yAxis
	labels : {
		formatter : function() {
			return this.value + '°C';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Temperature',
		style : {
			color : '#666'
		}
	}
};

var axisFrequency = {// Primary yAxis
	labels : {
		formatter : function() {
			return this.value + 'Hz';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Frequency',
		style : {
			color : '#666'
		}
	}
};

var axisVoltage = {// Primary yAxis
	labels : {
		formatter : function() {
			return this.value + 'V';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Voltage',
		style : {
			color : '#666'
		}
	}
};

var axisCurrent = {// Primary yAxis
	min : 0,
	labels : {
		formatter : function() {
			return this.value + 'A';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Current',
		style : {
			color : '#666'
		}
	}
};

var axisEfficiency = {// Primary yAxis
	min : 0,
	labels : {
		formatter : function() {
			return this.value + '%';
		},
		style : {
			color : 'black'
		}
	},
	title : {
		text : 'Efficiency',
		style : {
			color : '#666'
		}
	}
}

var powerPlotOptions = {
	spline : {
		lineWidth : 2,
		shadow : false,
		states : {
			hover : {
				lineWidth : 2
			}
		},
		marker : {
			enabled : false,
			states : {
				hover : {
					enabled : true,
					symbol : 'circle',
					radius : 4,
					lineWidth : 1
				}
			}
		}
	},
	areaspline : {
		fillOpacity : .60,
		lineWidth : 2,
		shadow : false,
		states : {
			hover : {
				lineWidth : 2
			}
		},
		marker : {
			enabled : false,
			states : {
				hover : {
					enabled : true,
					symbol : 'circle',
					radius : 4,
					lineWidth : 1
				}
			}
		}
	},
	area : {
		fillColor : {
			linearGradient : [0, 0, 0, 300],
			stops : [[0, colors[0]], [1, 'rgba(255,255,255,0)']]
		},
		lineWidth : 2,
		color : colors[0],
		marker : {
			enabled : false,
			states : {
				hover : {
					enabled : true,
					radius : 5
				}
			}
		},
		shadow : false,
		states : {
			hover : {
				lineWidth : 1
			}
		}
	},
	column : {
		borderWidth : 0,
		borderRadius : 2,
		pointPadding : 0,
		groupPadding : 0.1,
		shadow : false
	}
};

var columnPlotOpts = {
			column: {
				borderWidth : 0,
				borderRadius : 0,
				pointPadding : 0,
				groupPadding : 0.1,
				shadow : false
			},
			series: {
				stacking: 'normal'
			}
		};


var miniDialChart = {
            plotBackgroundColor: null,
            backgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            spacingBottom: -25,
	        spacingTop: 0,
	        spacingLeft: 0,
	        spacingRight: 0,
        };

var miniDialPlotOptions =  {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: 10,
                    style: {
                        fontWeight: '300',
                        color: '#666',
                        textShadow: '0px 1px 2px white'
                    }
                },
                startAngle: -120,
                endAngle: 120,
                center: ['50%', '50%']
            }
        };


var defaultGraph = {
	title: {
		style: {
            fontSize: '18px',
            fontWeight: '300',
            fontFamily: '\'open sans\''
        }
	},
	chart : {
		renderTo : 'boostTempGraph',
		zoomType : ''
	},
	credits : {
		enabled : false
	},
	exporting : {
		enabled : false
	},
	plotOptions : powerPlotOptions,
	xAxis : {
		type : 'datetime',
		dateTimeLabelFormats : {// don't display the dummy year
			month : '%H:%M',
			year : '%H:%M'
		}
	},
	tooltip : {
		shared : true,
		crosshairs : true,
		formatter : powerFormat
	},
	legend : {
		backgroundColor : '#FFFFFF',
		borderColor : '#CCCCCC',
		borderWidth : 1,
		itemStyle: {
			fontWeight: '300',
            fontFamily: '\'open sans\''
		}
	}
};

Highcharts.setOptions(defaultGraph);