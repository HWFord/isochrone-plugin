const HFaddon = (function() {
    var _draw;
    var _xy;
    var btn_depart;
    var btn_calcul;
    var btn_moyen_deplacement;
    var btn_moyen_deplacement
//toggles display of form
    var _toggleForm = function (e) {
        var _form = document.getElementById("custom-popin");
        if (_form.style.display === "none") {
          _form.style.display = "block";
        } else {
          _form.style.display = "none";
          _xy = null;
          mviewer.hideLocation();
          _layer.getSource().clear();
          $('#temps :input').val('');
          $('#distance :input').val('');
          $('#color :input').val('#2e5367');
        }
    };

//gets start point on click of button and click on map
    var getXY = function () {
        info.disable();
        _draw = new ol.interaction.Draw({
          type: 'Point'
        });
        _draw.on('drawend', function(event) {
            _xy = ol.proj.transform(event.feature.getGeometry().getCoordinates(),'EPSG:3857', 'EPSG:4326');
            mviewer.getMap().removeInteraction(_draw);
            mviewer.showLocation('EPSG:4326', _xy[0], _xy[1]);
            info.enable();
        });
        mviewer.getMap().addInteraction(_draw);

    };

//switch for transport mode
    var switchModeDeplacement= function (e) {
      let element = e.currentTarget;
      $(".selected.isochrone-mode").removeClass("selected");
      $(element).addClass("selected");
    }

//switch between time and distance, display respective form and clears the form not displayed
    var switchModeParametre= function (f) {

      let element = f.currentTarget;
      $(".selected.parametre").removeClass("selected");
      $(element).addClass("selected");
      var parametreData = element.dataset.parametre;
      if(parametreData === "temps"){
        document.getElementById("temps").style.display = "block";
        document.getElementById("distance").style.display = "none";
        $('#distance :input').val('');
      }else if(parametreData === "distance"){
        document.getElementById("distance").style.display = "block";
        document.getElementById("temps").style.display = "none";
        $('#temps :input').val('');
      }
      
    }
      
//gets forms inputs and sends infomation for isochrone to be calculate on click caculer button   
    var calcul = function () {
            var times = [];
            var distances = [];
//changes input values to correspond to time in seconds and distance in meters
            $("#heures_input").each(function(index,input) {
                if (input.value > 0) {
                    times.push(input.value*3600);
                };
            });

            $("#minutes_input").each(function(index,input) {
                if (input.value > 0) {
                    times.push(input.value*60);
                };
            });

            $("#kilometres_input").each(function(index,input) {
                if (input.value > 0) {
                    distances.push(input.value*1000);
                }
            });

            $("#metres_input").each(function(index,input) {
                if (input.value > 0) {
                    distances.push(input.value);
                }
            });

            if (!_xy || (times.length === 0) && (distances.length === 0)) {
                mviewer.alert("Isochrones : Il faut définir l'origine et au moins un temps de parcours ou une distance", "alert-info")
                return;
            }
//Adds all times and sets it to a variabel, same with distance            
            var totalTime = 0;
            for(var t = 0; t<times.length; t++){
              totalTime = totalTime + parseInt(times[t]);
            }

            var totalDistance = 0;
            for(var t = 0; t<distances.length; t++){
              totalDistance = totalDistance + parseInt(distances[t]);
            }
//gets other parameters for request
            var mode = $(".selected.isochrone-mode").attr("data-mode");
            var url = "https://kartenn.region-bretagne.fr/isochrone?";

            var dataParameters = {
                            "location":_xy.join(","),
                            "graphName":mode,
                            "smoothing": true,
                            "holes":true,
                            "srs": "epsg:4326"   
                        };

            if( totalTime != 0 && totalDistance== 0){
              dataParameters["time"]=totalTime;
              dataParameters["method"]="time";
            } else if( totalDistance != 0 && totalTime == 0){
              dataParameters["distance"]=totalDistance;
              dataParameters["method"]="distance";
            }else{
              mviewer.alert("Isochrones : Il faut définir soit un temps soit une distance, pas les deux", "alert-info")
              return;
            };
            
//Sends request, shows loading messages when request is sent, hides messages when result recieved
            $("#loading-isochrones").show();
                    $.ajax({
                        type: "GET",
                        url: url,
                        crossDomain: true,
                        data: dataParameters,
                        dataType: "json",
                        success: function (response) {
                            console.log(response)
                            _showResult(response);
                        },
                        error: function (request, status, error) {
                            console.log(error);
                        document.getElementById("loading").style.display = "none";
                        }
                    });
            document.getElementById("loading").style.display = "block";
    };

    return {

        init : function () {
//creates button used for toggling form display
            var _btn = document.createElement("button");
            _btn.id="hfbtn";
            _btn.className = "btn btn-default btn-raised";
            _btn.title = "isochrone";
            let _span = document.createElement("span");
            _span.className = "fas fa-route";
            _btn.appendChild(_span);
            _btn.addEventListener('click', _toggleForm);
            document.getElementById("toolstoolbar").appendChild(_btn);

//used for getting start point
            btn_depart = document.getElementById('choisir_depart');
            btn_depart.addEventListener('click', getXY);

//used for calcuate button
            btn_calcul = document.getElementById('calcul_result');
            btn_calcul.addEventListener('click', calcul);

//Used for transport mode switch
            btn_moyen_deplacement = document.getElementsByClassName('isochrone-mode');
            btn_moyen_deplacement[0].addEventListener('click', switchModeDeplacement);
            btn_moyen_deplacement[1].addEventListener('click', switchModeDeplacement);

//used for option switch between time and distance
            btn_moyen_parametre = document.getElementsByClassName('parametre');
            btn_moyen_parametre[0].addEventListener('click', switchModeParametre);
            btn_moyen_parametre[1].addEventListener('click', switchModeParametre);

})();

new CustomComponent("HFaddon", HFaddon.init);