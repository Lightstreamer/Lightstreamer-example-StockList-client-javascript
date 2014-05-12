/*
  Copyright 2013 Weswit Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
require(["js/lsClient","Subscription","StaticGrid","Chart","SimpleChartListener",
         "js/Formatters","js/Colors","js/NormalizedPriceCalculator"], 
    function(lsClient,Subscription,StaticGrid,Chart,SimpleChartListener,
             Formatters,Colors,NormalizedPriceCalculator) {
    
    //Grid conf
    var stocksData = new StaticGrid("stocks",true);
    stocksData.addListener({
      onVisualUpdate: function(key,info) {
        if (info == null) {
          return;
        }
        
        info.setHotTime(500);
        info.setAttribute("bold","","fontWeight");
        info.setCellAttribute("stock_name",Colors.getColor(key),Colors.getColor(key),"color");
     
        //format timestamp
        var time = info.getChangedFieldValue("time");
        if (time != null) {
          info.setCellValue("time",Formatters.formatTime(time));
        }
    
        //format last price and add normalized price
        var newLast = info.getChangedFieldValue("last_price");
        if (newLast != null) {
          stocksData.updateRow(key,{base_price:NormalizedPriceCalculator.getNormalizedPrice(key,newLast)});
          info.setCellValue("last_price",Formatters.formatDecimal(newLast, 2, true));
        }
      }
    });
    
    //Chart conf
    var stocksChart = new Chart("graph", true);
    stocksChart.configureArea("lsgbox",150,400,5,25);
    
    stocksChart.setXAxis("time", function(stringDate) {
      return Formatters.getSeconds(stringDate);
      
    });
    stocksChart.addYAxis(["last_price"], function(yValue,key) {
      return NormalizedPriceCalculator.getNormalizedPrice(key,yValue);
    });
    
    stocksChart.setXLabels(4,"lslbl",function(val) {
      return Formatters.formatTime(Formatters.getTime(val));
    });
    
    stocksChart.addListener(new SimpleChartListener(60,10));
    stocksChart.addListener({
      lblSet: false,
      onNewLine: function(key,newChartLine,nowX,nowY) {
        if (!this.lblSet) {
          this.lblSet = true;
          newChartLine.setYLabels(5,"lslbl",function(val) {
            return Formatters.formatDecimal(val,2,true);
          });
        }
        var lineColor = Colors.getColor(key);
        newChartLine.setStyle(lineColor,lineColor,1,1);
      }
    });
    
    //Subscription conf
    var stockSubscription = new Subscription("MERGE",stocksData.extractItemList(),stocksData.extractFieldList());
    stockSubscription.setDataAdapter("QUOTE_ADAPTER");
    stockSubscription.setRequestedSnapshot("yes");
    stockSubscription.setRequestedMaxFrequency(0.9);
    stockSubscription.addListener(stocksData);
    stockSubscription.addListener(stocksChart);
    
    lsClient.subscribe(stockSubscription);
   
});