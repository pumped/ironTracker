	$(document).ready(function() {
		graphInverterTemp = new Highcharts.Chart({
	      chart: {
	         renderTo: 'boostTempGraph',
	         zoomType: ''
	      },
	      title : {
				text : 'Booster Temperature'
			},
			yAxis: [axisTemp],
	      series: [{
	         name: 'Temperature',
	         color: cols["Temperature"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techBoosterTemperature']
	      }]
	   });
	
		graphBoosterTemp = new Highcharts.Chart({
	      chart: {
	         renderTo: 'invTempGraph',
	         zoomType: ''
	      },
	      title : {
				text : 'Inverter Temperature'
			},
	      yAxis: [axisTemp],
	      series: [{
	         name: 'Temperature',
	         color: cols["Temperature"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techInverterTemperature']
	      }]
	   });
		
		graphStrings = new Highcharts.Chart({
	      chart: {
	         renderTo: 'stringGraph1',
	         zoomType: ''
	      },
	      title: {
	         text: 'PV String 1'
	      },
	      yAxis: [axisPower],
	      series: [{
	         name: 'Power String 1',
	         color: '#393',
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techPVString1']
	      },{
	         name: 'Power String 2',
	         color: '#bff66f',
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techPVString2']
	      }]
	   });
		
		graphFrequency = new Highcharts.Chart({
	      chart: {
	         renderTo: 'gridFrequency',
	         zoomType: ''
	      },
	      title: {
	         text: 'Grid Frequency'
	      },
	      yAxis: [axisFrequency],
	      series: [{
	         name: 'Frequency',
	         color: cols["Frequency"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techGridFrequency']
	      }]
	   });
		
		graphVoltage = new Highcharts.Chart({
	      chart: {
	         renderTo: 'gridVoltage',
	         zoomType: ''
	      },
	      title: {
	         text: 'Grid Voltage'
	      },
	     yAxis: [axisVoltage],
	     series: [{
	         name: 'Voltage',
	         color: cols["Voltage"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techGridVoltage']
	      }]
	   });
		
		graphConvEfficiency = new Highcharts.Chart({
	      chart: {
	         renderTo: 'convEfficiency',
	         zoomType: ''
	      },
	      title: {
	         text: 'DC/AC Conversion Efficiency'
	      },
	      yAxis: [axisEfficiency],
	      series: [{
	         name: 'Efficiency',
	         color: cols["Efficiency"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techConversionEfficiency']
	      }]
	   });
			
		graphCurrent = new Highcharts.Chart({
	      chart: {
	         renderTo: 'gridCurrent',
	         zoomType: ''
	      },
	      title: {
	         text: 'Grid Current'
	      },
	      yAxis: [axisCurrent],
	      series: [{
	         name: 'Current',
	         color: cols["Current"],
	         type: 'spline',
	         marker: {
	            enabled: false
	         },
	         data: powerD['powerData']['techGridCurrent']
	      }]
	   });
		
   });