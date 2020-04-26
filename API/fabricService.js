/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

class fabricService{

   async enrollAdmin(adminName, password) {
        try {
            // Create a new CA client for interacting with the CA.
            const caURL = ccp.certificateAuthorities['caorg1'].url;
            const ca = new FabricCAServices(caURL);
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(adminName);
            if (adminExists) {
                console.log('An identity for the admin user \"', adminName, '\" already exists in the wallet');
                return;
            }
    
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await ca.enroll({ enrollmentID: adminName, enrollmentSecret: password });
            const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(adminName, identity);
            console.log('Successfully enrolled admin user \"', adminName, '\" and imported it into the wallet');
            return identity;
        } catch (error) {
            console.error(`Failed to enroll admin user  \"`, adminName, `\" : ${error}`);
            return error;
        }
    }
    async registerUser(adminName, username) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (userExists) {
                console.log('An identity for the user \"', username, '\" already exists in the wallet');
                return;
            }
    
            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(adminName);
            if (!adminExists) {
                console.log('An identity for the admin user \"', adminName, '\" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: adminName, discovery: { enabled: false } });
    
            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();
    
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
            wallet.import(username, userIdentity);
            console.log('Successfully registered and enrolled admin user \"', username, '\" and imported it into the wallet');
            return userIdentity;
        } catch (error) {
            console.error(`Failed to register user \"`, username, `\": ${error}`);
            return error;
        }
    }

    async createProducer(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
     
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('createProducer', args.coID, args.loc, args.amount);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    async acceptOffer (username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
     
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('acceptOffer', args.offerID, args.orderID);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async updateMask(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('updateMask', args.coID, args.amount);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async createPaymentLetter(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('createPaymentLetter', args.letterID, args.bankID, args.price, args.Date);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }


    async createDeal(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('createDeal', args.dealID, args.coID, args.dealPrice, args.letterID, args.maskAmount, args.date);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async createDelivery(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('createDelivery', args.delID, args.coID, args.status, args.date);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    async createHospital(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('createHospital', args.hosID, args.loc, args.maskAmount);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
   
    async updateDelivery(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('updateDelivery', args.delID, args.status);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async updateHospitalDelivery(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('updateHospitalDelivery', args.orderID, args.deliveryStatus);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    async makeHospitalOrder(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('makeHospitalOrder', args.orderID, args.maskAmount, args.hosID, args.urgency, args.date, args.deliveryStatus);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async makeMinistryOrder(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('makeMinistryOrder', args.orderID, args.maskAmount, args.endDate, args.date);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    async makeProducerOffer(username, channel, smartcontract, args) {
        console.log("Initial.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            console.log("Gateway.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            await contract.submitTransaction('makeProducerOffer', args.offerID, args.coID, args.orderID, args.offer, args.date);
            console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return 'Transaction has been submitted';
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }
    async getProducerInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getProducerInfo', args.coID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getProducerOfferInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getProducerOfferInfo', args.offerID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getMinistryOrderInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getMinistryOrderInfo', args.orderID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getHospitalInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getHospitalInfo', args.hosID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getDealInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getDealInfo', args.dealID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }


    async getDeliveryInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getDeliveryInfo', args.delID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }


    async getPaymentLetterInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getPaymentLetterInfo', args.letterID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getMinistryInfo(username, channel, smartcontract) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getMinistryInfo');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }

    async getHospitalOrderInfo(username, channel, smartcontract, args) {
        console.log("Initial D.");
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = new FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(username);
            if (!userExists) {
                console.log('An identity for the user \"', username, '\" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }

            // Create a new gateway for connecting to our peer node.
            console.log("Gateway D.");
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: false } });

    
            // Get the network (channel) our contract is deployed to.
            console.log("Network D.");
            const network = await gateway.getNetwork(channel);
    
            // Get the contract from the network.
            console.log("Contract D.");
            const contract = network.getContract(smartcontract);
    
            // Submit the specified transaction.
            /*await contract.submitTransaction('getHistoryForProducer', args.coID);
            console.log('Transaction has been submitted');
    */
            // Disconnect from the gateway.
            const result = await contract.evaluateTransaction('getHospitalOrderInfo', args.orderID);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            await gateway.disconnect();
            return result;
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    }


}

module.exports = fabricService;