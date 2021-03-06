package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	//"github.com/hyperledger/fabric-chaincode-go/shim"
	//"github.com/hyperledger/fabric-protos-go/peer"
)

//SmartContract
type SmartContract struct {
}
type Producer struct {
	CoID       string `json:"coID"`
	Location   string `json:"loc"`
	MaskAmount string `json:"amount"`
}
type PaymentLetter struct {
	LetterID string `json:"letterID"`
	BankName string `json:"bankID"`
	Price    string `json:"price"`
	Date     string `json:"date"`
}
type Deal struct {
	DealID     string `json:"dealID"`
	CoID       string `json:"coID"`
	DealPrice  string `json:"dealPrice"`
	LetterID   string `json:"letterID"`
	MaskAmount string `json:"maskAmount"`
	Date       string `json:"date"`
}
type HospitalOrder struct {
	OrderID    string `json:"orderID"`
	MaskAmount string `json:"amount"`
	HospitalID string `json:"hosID"`
	Urgency    string `json:"urgency"`
	Date       string `json:"date"`
	Delivery   string `json:"deliveryStatus"`
}
type Delivery struct {
	DeliveryID string `json:"delID"`
	CoID       string `json:"coID"`
	Status     string `json:"status"`
	Date       string `json:"date"`
}
type MinistryOrder struct {
	OrderID    string `json:"orderID"`
	MaskAmount string `json:"amount"`
	Deadline   string `json:"endDate"`
	Date       string `json:"openDate"`
	OfferID    string `json:"winnerOffer"`
}
type MinistryOfHealth struct {
	MinistryID string `json:"minID"`
	MaskAmount string `json:"maskAmount"`
}
type Hospital struct {
	HospitalID string `json:"hosID"`
	Location   string `json:"loc"`
	MaskAmount string `json:"maskAmount"`
}
type ProducerOffer struct {
	OfferID string `json:"offerID"`
	CoID    string `json:"coID"`
	OrderID string `json:"orderID"`
	Offer   string `json:"offer"`
	Status  string `json:"status"`
	Date    string `json:"date"`
}

func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Println("Error when starting SmartContract", err)
	}
}
func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	healthMinistry := MinistryOfHealth{MinistryID: "TCSGB", MaskAmount: "0"}
	healthMinistryAsBytes, _ := json.Marshal(healthMinistry)
	stub.PutState("TCSGB", healthMinistryAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	function, args := stub.GetFunctionAndParameters()

	if function == "createProducer" {
		return s.createProducer(stub, args)
	} else if function == "createPaymentLetter" {
		return s.createPaymentLetter(stub, args)
	} else if function == "createDeal" {
		return s.createDeal(stub, args)
	} else if function == "createDelivery" {
		return s.createDelivery(stub, args)
	} else if function == "createHospital" {
		return s.createHospital(stub, args)
	} else if function == "updateDelivery" {
		return s.updateDelivery(stub, args)
	} else if function == "makeHospitalOrder" {
		return s.makeHospitalOrder(stub, args)
	} else if function == "getProducerInfo" {
		return s.getProducerInfo(stub, args)
	} else if function == "updateMask" {
		return s.updateMask(stub, args)
	} else if function == "getHospitalInfo" {
		return s.getHospitalInfo(stub, args)
	} else if function == "getMinistryInfo" {
		return s.getMinistryInfo(stub)
	} else if function == "getDealInfo" {
		return s.getDealInfo(stub, args)
	} else if function == "getDeliveryInfo" {
		return s.getDeliveryInfo(stub, args)
	} else if function == "getPaymentLetterInfo" {
		return s.getPaymentLetterInfo(stub, args)
	} else if function == "getHospitalOrderInfo" {
		return s.getHospitalOrderInfo(stub, args)
	} else if function == "makeMinistryOrder" {
		return s.makeMinistryOrder(stub, args)
	} else if function == "getMinistryOrderInfo" {
		return s.getMinistryOrderInfo(stub, args)
	} else if function == "makeProducerOffer" {
		return s.makeProducerOffer(stub, args)
	} else if function == "getProducerOfferInfo" {
		return s.getProducerOfferInfo(stub, args)
	} else if function == "acceptOffer" {
		return s.acceptOffer(stub, args)
	} else if function == "updateHospitalDelivery" {
		return s.updateHospitalDelivery(stub, args)
	}
	return shim.Success(nil)
}
func (s *SmartContract) createProducer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("invalid number of arguements")
	}
	parCoId := args[0]
	newProducer := Producer{CoID: args[0], Location: args[1], MaskAmount: args[2]}
	newProducerAsBytes, _ := json.Marshal(newProducer)
	stub.PutState(parCoId, newProducerAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) acceptOffer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("invalid number of arguements")
	}
	offerId := args[0]
	orderId := args[1]
	newOffer := ProducerOffer{}
	newOrder := MinistryOrder{}
	offer, _ := stub.GetState(offerId)
	order, _ := stub.GetState(orderId)
	if offer == nil {
		return shim.Error("Invalid id for offer")
	}
	if order == nil {
		return shim.Error("Invalid id for order")
	}
	err3 := json.Unmarshal(offer, &newOffer)
	if err3 != nil {
		fmt.Println("Error when starting Unmarshaling 1", err3)
	}
	err4 := json.Unmarshal(order, &newOrder)
	if err4 != nil {
		fmt.Println("Error when starting Unmarshaling 2", err4)
	}
	newOffer.Status = "1"
	newOrder.OfferID = offerId
	newOfferAsBytes, _ := json.Marshal(newOffer)
	newOrderAsBytes, _ := json.Marshal(newOrder)
	stub.PutState(offerId, newOfferAsBytes)
	stub.PutState(orderId, newOrderAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) createPaymentLetter(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 4 {
		return shim.Error("invalid number of arguements")
	}
	parLetterID := args[0]
	newPaymentLetter := PaymentLetter{LetterID: args[0], BankName: args[1], Price: args[2], Date: args[3]}
	newPaymentLetterAsBytes, _ := json.Marshal(newPaymentLetter)
	stub.PutState(parLetterID, newPaymentLetterAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) createDeal(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 6 {
		return shim.Error("invalid number of arguements")
	}
	parDealID := args[0]
	newDeal := Deal{DealID: args[0], CoID: args[1], DealPrice: args[2], LetterID: args[3], MaskAmount: args[4], Date: args[5]}
	newDealAsBytes, _ := json.Marshal(newDeal)
	stub.PutState(parDealID, newDealAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) createDelivery(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 4 {
		return shim.Error("invalid number of arguements")
	}
	parDelID := args[0]
	newDel := Delivery{DeliveryID: args[0], CoID: args[1], Status: args[2], Date: args[3]}
	newDelAsBytes, _ := json.Marshal(newDel)
	stub.PutState(parDelID, newDelAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) createHospital(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("invalid number of arguements")
	}
	hospitalID := args[0]
	newHospital := Hospital{HospitalID: args[0], Location: args[1], MaskAmount: args[2]}
	newHospitalAsBytes, _ := json.Marshal(newHospital)
	stub.PutState(hospitalID, newHospitalAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) makeHospitalOrder(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 6 {
		return shim.Error("invalid number of arguements")
	}
	ordID := args[0]
	newHospitalOrder := HospitalOrder{OrderID: args[0], MaskAmount: args[1], HospitalID: args[2], Urgency: args[3], Date: args[4], Delivery: args[5]}
	newHospitalAsBytes, _ := json.Marshal(newHospitalOrder)
	stub.PutState(ordID, newHospitalAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) makeProducerOffer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Error("invalid number of arguements")
	}
	offerID := args[0]
	newOffer := ProducerOffer{OfferID: args[0], CoID: args[1], OrderID: args[2], Offer: args[3], Status: "-1", Date: args[4]}
	newOfferAsBytes, _ := json.Marshal(newOffer)
	stub.PutState(offerID, newOfferAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) makeMinistryOrder(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 4 {
		return shim.Error("invalid number of arguements")
	}
	ordID := args[0]
	newHospitalOrder := MinistryOrder{OrderID: args[0], MaskAmount: args[1], Deadline: args[2], Date: args[3], OfferID: "none"}
	newHospitalAsBytes, _ := json.Marshal(newHospitalOrder)
	stub.PutState(ordID, newHospitalAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) updateMask(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("invalid number of arguments")
	}
	parCoID := args[0]
	upMaskAsBytes, _ := stub.GetState(parCoID)
	producer := Producer{}
	err := json.Unmarshal(upMaskAsBytes, &producer)
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	strVal := string(producer.MaskAmount)
	fmt.Println("Mask Amount:", strVal)
	value, err1 := strconv.Atoi(strVal)
	addValue, err2 := strconv.Atoi(args[1])
	if err1 != nil {
		fmt.Println("Error when convertion 1", err1)
	} else if err2 != nil {
		fmt.Println("Error when convertion 2", err2)
	}
	producer.MaskAmount = strconv.Itoa(value + addValue)
	updatedMaskAsBytes, _ := json.Marshal(producer)
	stub.PutState(parCoID, updatedMaskAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) updateHospitalDelivery(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("invalid number of arguements")
	}
	orderID := args[0]
	orderAsBytes, _ := stub.GetState(orderID)
	order := HospitalOrder{}
	err := json.Unmarshal(orderAsBytes, &order)
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	order.Delivery = args[1]
	updatedOrderAsBytes, _ := json.Marshal(order)
	stub.PutState(orderID, updatedOrderAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) updateDelivery(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("invalid number of arguements")
	}
	parDelID := args[0]
	newDelAsBytes, _ := stub.GetState(parDelID)
	delivery := Delivery{}
	err := json.Unmarshal(newDelAsBytes, &delivery)
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	delivery.Status = args[1]
	//delivery.Carrying = args[2]
	//delivery.Delivered = args[3]
	updatedDelAsBytes, _ := json.Marshal(delivery)
	stub.PutState(parDelID, updatedDelAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) getProducerInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getHospitalInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getMinistryInfo(stub shim.ChaincodeStubInterface) peer.Response {
	id := "TCSGB"
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getHospitalOrderInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getProducerOfferInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getMinistryOrderInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getPaymentLetterInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getDealInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
func (s *SmartContract) getDeliveryInfo(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("invalid number of arguments")
	}
	id := args[0]
	value, err := stub.GetState(id)
	if value != nil {
		b := []byte(value)
		return shim.Success(b)
	}
	if err != nil {
		fmt.Println("Error when starting Unmarshaling 1", err)
	}
	return shim.Error("Not Found")
}
