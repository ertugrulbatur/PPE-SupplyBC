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
}
type Deal struct {
	DealID     string `json:"dealID"`
	CoID       string `json:"coID"`
	DealPrice  string `json:"dealPrice"`
	LetterID   string `json:"letterID"`
	MaskAmount string `json:"maskAmount"`
}
type HospitalOrder struct {
	OrderID    string `json:"orderID"`
	MaskAmount string `json:"amount"`
	HospitalID string `json:"hosID"`
}
type Delivery struct {
	DeliveryID string `json:"delID"`
	CoID       string `json:"coID"`
	Status     string `json:"status"`
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
func (s *SmartContract) createPaymentLetter(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("invalid number of arguements")
	}
	parLetterID := args[0]
	newPaymentLetter := PaymentLetter{LetterID: args[0], BankName: args[1], Price: args[2]}
	newPaymentLetterAsBytes, _ := json.Marshal(newPaymentLetter)
	stub.PutState(parLetterID, newPaymentLetterAsBytes)
	return shim.Success(nil)
}
func (s *SmartContract) createDeal(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Error("invalid number of arguements")
	}
	parDealID := args[0]
	newDeal := Deal{DealID: args[0], CoID: args[1], DealPrice: args[2], LetterID: args[3], MaskAmount: args[4]}
	newDealAsBytes, _ := json.Marshal(newDeal)
	stub.PutState(parDealID, newDealAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) createDelivery(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("invalid number of arguements")
	}
	parDelID := args[0]
	newDel := Delivery{DeliveryID: args[0], CoID: args[1], Status: args[2]}
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
	if len(args) != 3 {
		return shim.Error("invalid number of arguements")
	}
	ordID := args[0]
	newHospitalOrder := HospitalOrder{OrderID: args[0], MaskAmount: args[1], HospitalID: args[2]}
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
