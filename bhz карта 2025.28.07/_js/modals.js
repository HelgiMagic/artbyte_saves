function modalShow(data) {
    var $modal = $(data.target);
    SendAjax("LOAD_MODAL", data, function (data) {
        $modal.html(data.html);
        $modal.modal();
        setTimeout(function () {
            initPlugins();
        }, 150);
    });
}
$(document).ready(function () {
    $(document).on("click", ".js-modal-show", function (e) {
        e.preventDefault();
        var $this = $(this);
        var data = $this.data();
        modalShow(data);
    });
    $(document).on("click", ".js-load-form", function (e) {
        e.preventDefault();
        var $this = $(this);
        var data = $this.data();
        var $modal = $this.closest(".modal");
        SendAjax("LOAD_MODAL", data, function (data) {
            $modal.html(data.html);
            initPlugins();
        });
    });
    $(document).on("submit", ".js-form-submit", function (e) {
        e.preventDefault();
        var $this = $(this);
        if (!myValidateForm($this)) {
            return false;
        }

        var type = $this.attr("data-form-type");
        var form_data = $this.serializeObject();
        form_data["g-recaptcha-response"] = $this.find("[name=g-recaptcha-response]").val(); 
        SendAjax(type, form_data, function (data) {
            if(data["GOAL"]) {
                sendYandexGoal(data["GOAL"]);
            }
            var html = data["html"];
            var $modal = $this.closest(".modal");
            if (!$modal.length) {
                $modal = $("#Modal");
            }
            $modal.html(html);
            initPlugins();
            if (data["show_modal"]) {
                $modal.modal();
            }
            if (data["redirect_url"]) {
                $modal.on('hide.bs.modal', function (e) {
                    location.href = data["redirect_url"];
                });
            }
            if (data["reload"]) {
                $modal.on('hide.bs.modal', function (e) {
                    location.reload();
                });
            }
          if (data["auto_hide"]) {
            setTimeout(function () {
              $modal.modal('hide');
            }, 2000);
          }
        });
    });
});