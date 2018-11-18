let Etcd = require("node-etcd");
let etcdUrls = process.env.ETCD_URL || "192.168.99.100:2379";
let etcd = new Etcd(etcdUrls);


let root = "/equipment/v1/";


// Get default configuration from env and config.json
// TODO: read config.json
var config = {
    "numEquipmentPerTenantGet": process.env.ETCD_NUMEQUIPMENTPERTENANTGET || 10
};


// Get initial values
etcd.get(root, {
    recursive: true
}, function (err, res) {
    try {
        for (let i = 0; i < res.node.nodes.length; i++) {
            processConfig(res.node.nodes[i]);
        }
    } catch (ex) {
        console.error(ex);
    }
});

// Watcher setup
let watcher = etcd.watcher(root, null, {
    recursive: true
});

watcher.on("change", (val) => {
    processConfig(val.node);
});

// validate and process configuration change
function processConfig(node) {
    let key = node.key.replace(root, '');
    let value = node.value;

    // Optional validations
    switch (key) {
        case "numEquipmentPerTenantGet":
            value = parseInt(value);
            break;
    }

    // Save keys
    config[key] = value;
}


module.exports = config;