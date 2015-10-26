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
define(["./Formatters"],function(Formatters) {
  //to keep it simple we never reset it
  return {
    pbase: {},
    
    getNormalizedPrice: function(key,val) {
      if (!this.pbase[key]) {
        this.pbase[key] = val;
        return 100.00;
      } else {
        var perc = val/this.pbase[key]*100;
        return Formatters.formatDecimal(perc, 2, true);
      }
    }
  };
});