define(["services/services","config"],function(e,t){e.factory("User",function(e,n,r,i){var s={login:{method:"GET",params:{first:"login",uuid:"",pass:""}},logout:{method:"GET",params:{first:"logout"},isArray:!0},resources:{method:"GET",params:{first:"resources"}},domain:{method:"GET",params:{first:"domain"},isArray:!0},geofence:{method:"GET",params:{first:"geofence"}},saveGeofence:{method:"PUT",params:{first:"geofence"}}};angular.forEach(s,function(e){e.method==="GET"&&(e.interceptor={response:function(e){return e}})});var o=e(t.host+"/:first/:second/:third/:fourth",{},s);return o.prototype._=function(e,t,r,i){var s=n.defer();t=t||{};try{o[e](t,r,function(e){i&&i.success&&i.success.call(this,e),s.resolve(e)},function(n){i&&i.error&&i.error.call(this,n),console.log("Error with call: "+e+" params: "+angular.toJson(t)+" data load:"+angular.toJson(r)+" result: "+angular.toJson(n)),s.resolve({error:n})})}catch(u){console.log("error with making call: "+u)}return s.promise},new o})});