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
})();

new CustomComponent("HFaddon", HFaddon.init);