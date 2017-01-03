/* jshint unused:false, jquery:true, undef:false */

function returnEscapedHtml(string) {
    // This function returns the HTML entity escaped version of a string
    // Do NOT depend on this for security, you must always perform the same procedure in the backend!

    if (string === "") {
        return "";
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    if (typeof string === "undefined") {
        return "";
    } else {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
}

function modalState(state) {
    if (state === true) {
        //expand the modal
        $("#SAOModal").modal("show");
        setTimeout(function () {
            modalState("expand");
        }, 200);
    } else if (state === false) {
        //collapse the modal
        modalState("collapse");
        setTimeout(function () {
            $("#SAOModal").modal("hide");
        }, 200);

    } else if (state === "collapse") {
        $("#SAOModal .modal-dialog").addClass("closed");
        $("#SAOModal .modal-dialog").removeClass("open");

    } else if (state === "expand") {
        saoMenuOpenAudio.play();
        $("#SAOModal .modal-dialog").removeClass("closed");
        $("#SAOModal .modal-dialog").addClass("open");

    } else { //toggle
        $("#SAOModal .modal-dialog.closed").addClass("opening");
        $("#SAOModal .modal-dialog.open").addClass("closing");

        $("#SAOModal .modal-dialog.closing").addClass("closed");
        $("#SAOModal .modal-dialog.closing").removeClass("open");
        $("#SAOModal .modal-dialog.opening").addClass("open");
        $("#SAOModal .modal-dialog.opening").removeClass("closed");

        $("#SAOModal .modal-dialog.closed").removeClass("closing");
        $("#SAOModal .modal-dialog.open").removeClass("opening");
    }
}

function saoModalSetContent(title, body) {
    $("#SAOModalTitle").html(title);
    $("#SAOModalBody").html(body);
}

function saoLoneButton(state) {
    if (state === true) {
        // Hide deny button
        $("#SAOModalDeny").addClass("hidden-xs-up");
        $("#SAOModalAccept").removeClass("col-xs-6");
        $("#SAOModalAccept").addClass("col-xs-12");
    } else {
        // Restore the deny button
        $("#SAOModalDeny").removeClass("hidden-xs-up");
        $("#SAOModalAccept").addClass("col-xs-6");
        $("#SAOModalAccept").removeClass("col-xs-12");
    }
}

function saoModal(title, body, positiveResponseTitle, positiveResponse, isRefresh) {
    if (isRefresh === false && title === "" && body === "" && positiveResponseTitle === "" && positiveResponse === "") {
        var saoRandomSeed = Math.random();
        if (saoRandomSeed < 0.3) {
            title = "Dissolve";
            body = "Are you sure that you want to disband your party?";
            positiveResponseTitle = "Success";
            positiveResponse = "Party disbanded!";
        } else if (saoRandomSeed > 0.3 && saoRandomSeed < 0.6) {
            title = "Alert";
            body = "High heartrate! Log out?";
            positiveResponseTitle = "Logging out";
            positiveResponse = "Please note that this will result in a microwave discharge through your brain";
        } else {
            title = "Disconnect";
            body = "Would you like to disconnect from Swort Art Online?";
            positiveResponseTitle = "Error";
            positiveResponse = "Feature not implemented";
        }
    }

    if (isRefresh === true) {
        modalState("collapse");
        setTimeout(function () {
            saoLoneButton(true);
            saoModalSetContent(title, body);
            modalState("expand");
        }, 350);

        $("#SAOModalAccept").off();
        $("#SAOModalAccept").bind("click", function () {
            saoMenuSelectAudio.play();
            modalState(false);
        });

    } else {
        $("#SAOModalAccept").off();
        $("#SAOModalAccept").bind("click", function () {
            saoMenuSelectAudio.play();
            saoModal(positiveResponseTitle, positiveResponse, "", "", true);
        });

        $("#SAOModalDeny").off();
        $("#SAOModalDeny").bind("click", function () {
            saoMenuSelectAudio.play();
            modalState(false);
        });

        saoModalSetContent(title, body);
        modalState(true);
    }
}

$("#SAOModalButton").bind("click", function () {
    saoModal(
        returnEscapedHtml($("#SAOInputTitle").val()),
        returnEscapedHtml($("#SAOInputMessage").val()),
        returnEscapedHtml($("#SAOPositiveResponseTitleField").val()),
        returnEscapedHtml($("#SAOPositiveResponseField").val()),
        false
    );
});

$("#SAOModal").on('hidden.bs.modal', function () {
    saoLoneButton(false);
    $("#SAOModalDeny").off();
    $("#SAOModalAccept").off();
});