  var fieldsList = ["last_price", "time", "pct_change", "bid_quantity", "bid", "ask", "ask_quantity", "min", "max", "ref_price", "open_price", "stock_name", "item_status"];
  var itemList1 = ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10", "item11", "item12", "item13", "item14", "item15"];
  var itemList2 = ["item16", "item17", "item18", "item19", "item20", "item21", "item22", "item23", "item24", "item25", "item26", "item27", "item28", "item29", "item30"];
  var actGroup = null;
  var maxBandVal = 5.5;
  var maxFreqVal = 2.1;
  var onLoadPage = 1;
  var hotColor = "#efb23b";
  var lsClient;
  
  var subsItemList1;
  var subsItemList2;

  /////////////////LightstreamerClient Configuration
  require(["js/lsClient","Subscription","DynaGrid"], 
    function(lsClient,Subscription,DynaGrid) {
    
    window.lsClient = lsClient;
    
    lsClient.connectionOptions.setMaxBandwidth("unlimited");
    
    var dynaGrid = new DynaGrid("stocks",true);
    
    dynaGrid.setSort("stock_name");
    dynaGrid.setNodeTypes(["div","span","img","a"]);
    dynaGrid.setAutoCleanBehavior(true, false);
    dynaGrid.addListener({
      onVisualUpdate: function(key,info,domNode) {
        if (info == null) {
          return;
        }

        //general style and effects
        var cold = (key.substring(4) % 2 == 1) ? "#eeeeee" : "#ddddee";
        domNode.style.backgroundColor = cold;
        
        info.setHotTime(600);
        info.setAttribute(hotColor, cold, "backgroundColor");
          
        // format decimal fields.
        formatDecimalField(info, "last_price");
        formatDecimalField(info, "bid");
        formatDecimalField(info, "ask");
        formatDecimalField(info, "min");
        formatDecimalField(info, "max");
        formatDecimalField(info, "ref_price");
        formatDecimalField(info, "open_price");
         
        // format the timestamp
        var time = info.getChangedFieldValue("time");
        if (time != null) {
          info.setCellValue("time",formatTime(time));
        }
      }
    });
    
    subsItemList1 = new Subscription("MERGE",itemList1,fieldsList);
    subsItemList1.addListener(dynaGrid);
    subsItemList1.setDataAdapter("QUOTE_ADAPTER");
    subsItemList1.setRequestedSnapshot("yes");
    subsItemList1.setRequestedMaxFrequency("unlimited");
    
    subsItemList2 = new Subscription("MERGE",itemList2,fieldsList);
    subsItemList2.addListener(dynaGrid);
    subsItemList2.setDataAdapter("QUOTE_ADAPTER");
    subsItemList2.setRequestedSnapshot("yes");
    subsItemList2.setRequestedMaxFrequency("unlimited");
    
    lsClient.subscribe(subsItemList1);  
    //lsClient.subscribe(subsItemList2); //we may also subscribe both lists simultaneously  
    
    document.getElementById("switchP1").style.display = "none";
    document.getElementById("switchP2").style.display = "";
  }); 

  // format a decimal number to a fixed number of decimals
  function formatDecimalField(info, field) {
    var newValue = info.getChangedFieldValue(field);
    if (newValue != null) {
      var formattedVal = formatDecimal(newValue, 2, true);
      info.setCellValue(field,formattedVal);
    }
  }
  
  function formatDecimal(value, decimals, keepZero) {
    var mul = new String("1");
    var zero = new String("0");
    for (var i = decimals; i > 0; i--) {
      mul += zero;
    }
    value = Math.round(value * mul);
    value = value / mul;
    var strVal = new String(value);
    if (!keepZero) {
      return strVal;
    }

    var nowDecimals = 0;
    var dot = strVal.indexOf(".");
    if (dot == -1) {
      strVal += ".";
    } else {
      nowDecimals = strVal.length - dot - 1;
    }
    for (var i = nowDecimals; i < decimals; i++) {
      strVal = strVal + zero;
    }

    return strVal;
  }
  
  // time format from [0-24] to [0-12] (without AM / PM )
  function formatTime(val) {
    var a = new Number(val.substring(0,val.indexOf(":")));
    if (a > 12) {
      a -= 12;
    }
    var b = val.substring(val.indexOf(":"),val.length);
    return a + b;
  }
  
//////////////// Stock Grid Management

  function changePage(groupNumber) {
    if (groupNumber == 1) {
      document.getElementById("switchP1").style.display = "none";
      document.getElementById("switchP2").style.display = "";
      lsClient.unsubscribe(subsItemList2); 
      lsClient.subscribe(subsItemList1); 
    } else if (groupNumber == 2) {
      document.getElementById("switchP1").style.display = "";
      document.getElementById("switchP2").style.display = "none";
      lsClient.unsubscribe(subsItemList1); 
      lsClient.subscribe(subsItemList2); 
    }
  }

  //////////////// Slider configuration
  
  //Bandwidth slider
  var values = [];
  for (var x = 0.5; x <= maxBandVal; x += 0.5) {
    values.push(x);
  }
  var bwslider = new Control.Slider('handleSelectBandwidth','selectBandwidth',{sliderValue:maxBandVal,values:values,step:0.5,increment:0.5,range:$R(0.5,maxBandVal),
        onSlide:function(v) {
          updateBWInd(v);
        },
        onChange:function(v) {
          updateBWInd(v);
           if (lsClient) {
             if (v == maxBandVal) {
               v = "unlimited";
             }  
             lsClient.connectionOptions.setMaxBandwidth(v);
           }
            //maxBandVal = v;
        }
  });
                
  function updateBWInd(v) {
    if (v == maxBandVal) {
      document.getElementById("nowBandwidth").innerHTML = "unlimited";
      return;
    }

    var txt = v.toString();
    if (txt.indexOf(".5") <= -1) {
      document.getElementById("nowBandwidth").innerHTML = txt + ".0";
    } else {
      document.getElementById("nowBandwidth").innerHTML = v;
    }
  }
  
  //Frequency slider
  var freqValues = [];
  for (var x = 0.1; x <= maxFreqVal+0.1; x += 0.1) {
    freqValues.push(x);
  }
  
  var freqSlider = new Control.Slider('handleSelectFrequency','selectFrequency',{sliderValue:maxFreqVal,values:freqValues,step:0.1,increment:0.1,range:$R(0.1,maxFreqVal),
        onSlide:function(v) {
          updateFreqInd(v);
        },
        onChange:function(v) {
           var rv = updateFreqInd(v);
           if (subsItemList1 && subsItemList2) {
             subsItemList1.setRequestedMaxFrequency(rv);
             subsItemList2.setRequestedMaxFrequency(rv);
           }
        }
  });
  
  function updateFreqInd(v) {
    v+=0.01;
    var val = Number(v.toString().substring(0,3));
    if (val == maxFreqVal) {
      val = "unlimited";
    }
    document.getElementById("nowFrequency").innerHTML = val;
    return val;
  }