const HFaddon = (function() {
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

})();

new CustomComponent("HFaddon", HFaddon.init);