window.io_global_object_name = "IGLOO"
window.IGLOO = window.IGLOO || {
    "enable_flash": false,
    "bbout_element_id": "ioBlackBox",
    "loader": {
        "version": "general5",
        "trace_handler": function(msg) {
            console.log(msg);
        }
    }
};
