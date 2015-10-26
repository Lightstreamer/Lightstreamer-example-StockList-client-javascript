/*
  Copyright (c) Lightstreamer Srl

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

// Lightstreamer Stock-List Demo - Frame Version
// Data Format Management

  function formatDecimalField(info, field) {
    var newValue = info.getChangedFieldValue(field);
    if (newValue != null) {
      var formattedVal = formatDecimal(newValue, 2, true);
      info.setCellValue(field,formattedVal);
    }
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
  
  // time format from timestamp to xx:xx:xx string
  function getTime(secondsStr) {
    var hours = Math.floor(secondsStr/(60*60));
    var seconds = secondsStr - (hours * (60*60));
    var minutes = Math.floor(seconds/60);
    var seconds = Math.round(seconds - (minutes * 60));

    if (minutes.toString().length < 2) {
      minutes = ":0" + minutes;
    } else {
      minutes = ":" + minutes;
    }

    if (seconds.toString().length < 2) {
      seconds = ":0" + seconds;
    } else {
      seconds = ":" + seconds;
    }

    return hours +  minutes + seconds;
  }

  // format a decimal number to a fixed number of decimals
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
  
  // force to highlight or force to not highlight the cells
  function forceHighlight(info,isOn,fList) {
    for (var i = 0; i < fList.length; i++) {
      // all the visual fields; we can address fields by numbers as well as names
      info.setCellValue(fList[i], isOn ? info.getCellValue(fList[i]) : null);
    }
  }