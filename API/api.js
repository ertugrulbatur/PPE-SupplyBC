const express = require('express');
const router = express.Router();
const FabricService = require('./fabricService')

const fabricService = new FabricService();


router.post("/enrollAdmin", (req,res) => {
    fabricService.enrollAdmin(req.body.adminName, req.body.password).then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/registerUser", (req,res) => {
    fabricService.registerUser(req.body.adminName, req.body.username).then((results) => {
        res.send(results);
        return results;
    });
});


router.post("/createProducer", (req,res) => {
    fabricService.createProducer(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/updateHospitalDelivery", (req,res) => {
    fabricService.updateHospitalDelivery(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/updateMask", (req,res) => {
    fabricService.updateMask(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});
router.post("/acceptOffer", (req,res) => {
    fabricService.acceptOffer(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});
router.post("/createPaymentLetter", (req,res) => {
    fabricService.createPaymentLetter(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/createDeal", (req,res) => {
    fabricService.createDeal(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/createDelivery", (req,res) => {
    fabricService.createDelivery(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/createHospital", (req,res) => {
    fabricService.createHospital(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});
router.post("/makeHospitalOrder", (req,res) => {
    fabricService.makeHospitalOrder(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/makeProducerOffer", (req,res) => {
    fabricService.makeProducerOffer(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/updateDelivery", (req,res) => {
    fabricService.updateDelivery(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getProducerInfo", (req,res) => {
    fabricService.getProducerInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getProducerOfferInfo", (req,res) => {
    fabricService.getProducerOfferInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getDealInfo", (req,res) => {
    fabricService.getDealInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getHospitalInfo", (req,res) => {
    fabricService.getHospitalInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getMinistryInfo", (req,res) => {
    fabricService.getMinistryInfo(req.body.username, req.body.channel, req.body.smartcontract)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/makeMinistryOrder", (req,res) => {
    fabricService.makeMinistryOrder(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getMinistryOrderInfo", (req,res) => {
    fabricService.getMinistryOrderInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getPaymentLetterInfo", (req,res) => {
    fabricService.getPaymentLetterInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getDeliveryInfo", (req,res) => {
    fabricService.getDeliveryInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getHospitalOrderInfo", (req,res) => {
    fabricService.getHospitalOrderInfo(req.body.username, req.body.channel, req.body.smartcontract, req.body.args)
    .then((results) => {
        res.send(results);
        return results;
    });
});





module.exports = router;