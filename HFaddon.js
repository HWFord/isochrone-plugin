const HFaddon = (function() {
    var _draw;
    var _xy;
    var btn_depart;
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