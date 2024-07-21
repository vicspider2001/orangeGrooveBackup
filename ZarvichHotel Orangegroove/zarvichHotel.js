var express = require('express');
var zarvich = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = process.env.MongoLiveUrl;
var MongoOnline = process.env.MongoOnline;
var cors = require('cors')
const bodyparser = require('body-parser');
const res = require('express/lib/response');
var port = process.env.PORT || 80;
var db;


zarvich.use(bodyparser.urlencoded({extended:true}));
zarvich.use(bodyparser.json());
zarvich.use(cors());
zarvich.use(express());

//return all roomtypes
zarvich.get('/',(re,res)=>{
    res.send("This is root page")
})

//return all roomtypes
zarvich.get('/rooms', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return roomtypes wrt floor
    else if(req.query.floor){
        var floor = (req.query.floor)
        query={floorNumber:(req.query.floor)}
    }

//return roomtypes wrt roomType_Id
    else if (req.query.details){
        var details=(req.query.details)
        query={'roomNumbers':(details)}
    }

//return roomrates wrt room Num
    else if (req.query.rates){
        var rates=(req.query.rates)
        query={'roomNumbers':(req.query.rates)}
    }

    db.collection('hoteldata').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/DeptWitOutPC', (req,res)=> {
    var query = {};
        
  db.collection('DeptsWitOutPC').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Create a Room
zarvich.post('/createRoom',(req,res)=>{
	console.log(req.body);
	db.collection('hoteldata').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//Edit Room
zarvich.put('/editRoom/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('hoteldata').updateOne(
        {_id:id},
        {
            $set: {
                roomtypeID:req.body.roomtypeID,
                roomtypeName:req.body.roomtypeName,
                roomNumbers:req.body.roomNumbers,
                roomRate:req.body.roomRate,
                floorNumber:req.body.floorNumber
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete a Room
zarvich.delete('/delRoom/:id',(req,res)=>{
    var id = req.params.id
    db.collection('hoteldata').deleteOne(
        {roomNumbers:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/resvntdel/:id',(req,res)=>{
    var id = req.params.id
    db.collection('reservationData').deleteOne(
        {resID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// Post to City Ledger
zarvich.post('/addCityLedger',(req,res)=>{
	console.log(req.body);
	db.collection('cityLedger').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get city ledger
zarvich.get('/getcityLedger', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

//return city ledger wrt phone Num
    else if (req.query.phoneNumb){
        var phoneNumb=(req.query.phoneNumb)
        query={'phone':(req.query.phoneNumb)}
    }

    //return city ledger wrt email
    else if (req.query.guestEmail){
        var guestEmail=(req.query.guestEmail)
        query={'email':(req.query.guestEmail)}
    }

    db.collection('cityLedger').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete a city ledger
zarvich.delete('/delcityLedger/:id',(req,res)=>{
    var id = req.params.id
    db.collection('cityLedger').deleteOne(
        {"phone":id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

// Create a RoomStatus
zarvich.post('/createRoomStatus',(req,res)=>{
	console.log(req.body);
	db.collection('roomStatus').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// get Room Status
zarvich.get('/getRoomStatus', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

//return room status wrt room Num
    else if (req.query.roomSt){
        var roomSt=(req.query.roomSt)
        query={'roomNumbers':(req.query.roomSt)}
    }

    db.collection('roomStatus').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//Edit Room Status
zarvich.put('/editRoomStatus/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('roomStatus').updateOne(
        {roomNumbers:id},
        {
            $set: {
                roomNumbers:req.body.roomNumbers,
                roomStatus:req.body.roomStatus,
                roomtypeName:req.body.roomtypeName,
                fname:req.body.fname,
                lname:req.body.lname,
                status:req.body.status,
                BillStatus:req.body.BillStatus
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete a Room Status
zarvich.delete('/delRoomSt/:id',(req,res)=>{
    var id = req.params.id
    db.collection('roomStatus').deleteOne(
        {_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//return all checkinRooms
zarvich.get('/checkin', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return checkinRooms wrt roomNum
    else if(req.query.guest){
        var guest = (req.query.guest)
        query={'roomNumbers':(req.query.guest)}
    }

    else if(req.query.actual){
        var actual = (req.query.actual)
        query = {transactionDate:(req.query.actual)}
    }

//return checkinRooms wrt postDocket
    else if(req.query.docket){
        var docket = (req.query.docket)
        query={'postBillStatus':(req.query.docket)}

    }
//return checkinGuest wrt roomNumID
    else if(req.query.roomNumID){
        var roomNumID = (req.query.roomNumID)
        query={'roomNumbers':(req.query.roomNumID)}

    }
//return checkinGuest wrt guestID
    else if(req.query.checkinID){
        var checkinID = (req.query.checkinID)
        query={'refID':(req.query.checkinID)}

    }
//return checkinGuest wrt group
else if(req.query.orgNames){
    var orgNames = (req.query.orgNames)
    query={'group':(req.query.orgNames)}

}

    db.collection('checkinData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all checkoutRooms
zarvich.get('/checkedout', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return checkoutRooms wrt guestDetails
    else if(req.query.chkoutguest){
        var chkoutguest = (req.query.chkoutguest)
        query={guestID:(req.query.chkoutguest)}
    }
    else if(req.query.chkoutdate){
        var chkoutdate = (req.query.chkoutdate)
        query={departureDate:(chkoutdate)}
    }
    else if(req.query.findPastGuest){
        var findPastGuest = (req.query.findPastGuest)
        query={refID:(req.query.findPastGuest)}
    }

    db.collection('checkoutData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// Check a guest into check in Database
zarvich.post('/bookNow',(req,res)=>{
	console.log(req.body);
	db.collection('checkinData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Post Card Details
zarvich.post('/prntCard',(req,res)=>{
	console.log(req.body);
	db.collection('cardDetails').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Post Card Details
zarvich.post('/prntCardError',(req,res)=>{
	console.log(req.body);
	db.collection('cardErrorLog').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})



zarvich.post('/postOccuppancy',(req,res)=>{
	console.log(req.body);
	db.collection('checkinWarehouse').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// post Bill of a guest in Checkin Database
zarvich.post('/bill',(req,res)=>{
	console.log(req.body);
	db.collection('roomPostingData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Billing Complete")
	})
})

// post Bill of a guest in Checkin Database
zarvich.post('/InhouseGrpBill',(req,res)=>{
	console.log(req.body);
	db.collection('InhouseGroup').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Billing Complete")
	})
})



//Check a guest out from checkin database
zarvich.post('/goodbye',(req,res)=>{
	console.log(req.body);
	db.collection('checkoutData').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check out Complete")
	})
})

//delete from checkin data
zarvich.delete('/delBooking/:id',(req,res)=>{
    var id = req.params.id
    db.collection('checkinData').deleteOne(
        {_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//delete card details
zarvich.delete('/delCard',(req,res)=>{
    db.collection('cardDetails').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete cardErrors
zarvich.delete('/delError',(req,res)=>{
    db.collection('cardErrorLog').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



//delete from firstNite data
zarvich.delete('/delFirstNite/:id',(req,res)=>{
    var id = req.params.id
    db.collection('FirstNite').deleteOne(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete from salesPoint data
zarvich.delete('/delDockets/:id',(req,res)=>{
    var id = req.params.id
    db.collection('InhouseGroup').deleteOne(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete from roomcharges1
zarvich.delete('/delBooking2/:id',(req,res)=>{
    var id = req.params.id
    db.collection('grcharges').deleteOne(
        {'refID':id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete from roomcharges2
zarvich.delete('/delBooking3/:id',(req,res)=>{
    var id = req.params.id
    db.collection('roomRateCharges').deleteOne(
        {'refID':id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Update Guest details
zarvich.put('/guestupdate2/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('checkinData').updateOne(
        {_id:id},
        {
            $set: {
                    roomNumbers:req.body.roomNumbers,
                    status:req.body.status,
                    refID:req.body.refID,
                    group:req.body.group,
                    roomRate:req.body.roomRate,
                    roomtypeName:req.body.roomtypeName,
                    dailyRate:req.body.dailyRate,
                    discountAmount:req.body.discountAmount,
                    discounType:req.body.discounType,
                    comingFrom:req.body.comingFrom,
                    goingTo:req.body.goingTo,
                    arrivalDate:req.body.arrivalDate,
                    departureDate:req.body.departureDate,
                    stay:req.body.stay,
                    postBillStatus:req.body.postBillStatus,
                    title:req.body.title,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    middlename:req.body.middlename,
                    dob:req.body.dob,
                    mob:req.body.mob,
                    phone:req.body.phone,
                    email:req.body.email,
                    ID:req.body.ID,
                    passportNum:req.body.passportNum,
                    Gender:req.body.Gender,
                    Nationality:req.body.Nationality,
                    Address:req.body.Address,
                    occupation:req.body.occupation,
                    NokLname:req.body.NokLname,
                    NokFname:req.body.NokFname,
                    NokMname:req.body.NokMname,
                    NokRelationship:req.body.NokRelationship,
                    NokPhone:req.body.NokPhone,
                    POV:req.body.POV,
                    vehicleReg:req.body.vehicleReg,
                    roomStatus:req.body.roomStatus,
                    tranDate:req.body.tranDate,
                    VAT:req.body.VAT,
                    TourismLevy:req.body.TourismLevy

                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Update groupGuestwarehouse details
zarvich.put('/groupguestupdate2/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('groupGuestWarehouse').updateOne(
        {_id:id},
        {
            $set: {
                    roomNumbers:req.body.roomNumbers,
                    status:req.body.status,
                    refID:req.body.refID,
                    group:req.body.group,
                    roomRate:req.body.roomRate,
                    roomtypeName:req.body.roomtypeName,
                    dailyRate:req.body.dailyRate,
                    discountAmount:req.body.discountAmount,
                    discounType:req.body.discounType,
                    comingFrom:req.body.comingFrom,
                    goingTo:req.body.goingTo,
                    arrivalDate:req.body.arrivalDate,
                    departureDate:req.body.departureDate,
                    stay:req.body.stay,
                    postBillStatus:req.body.postBillStatus,
                    title:req.body.title,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    middlename:req.body.middlename,
                    dob:req.body.dob,
                    mob:req.body.mob,
                    phone:req.body.phone,
                    email:req.body.email,
                    ID:req.body.ID,
                    passportNum:req.body.passportNum,
                    Gender:req.body.Gender,
                    Nationality:req.body.Nationality,
                    Address:req.body.Address,
                    occupation:req.body.occupation,
                    NokLname:req.body.NokLname,
                    NokFname:req.body.NokFname,
                    NokMname:req.body.NokMname,
                    NokRelationship:req.body.NokRelationship,
                    NokPhone:req.body.NokPhone,
                    POV:req.body.POV,
                    vehicleReg:req.body.vehicleReg,
                    roomStatus:req.body.roomStatus,
                    transactionDate:req.body.transactionDate,
                    calculatedstay:req.body.calculatedstay
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Update Guest details
zarvich.put('/guestupdate/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('checkinData').updateOne(
        {'roomNumbers':id},
        {
            $set: {
                    
                    status:req.body.status,
                    refID:req.body.refID,
                    group:req.body.group,
                    roomRate:req.body.roomRate,
                    roomtypeName:req.body.roomtypeName,
                    dailyRate:req.body.dailyRate,
                    discounType:req.body.discounType,
                    discountAmount:req.body.discountAmount,
                    comingFrom:req.body.comingFrom,
                    goingTo:req.body.goingTo,
                    arrivalDate:req.body.arrivalDate,
                    departureDate:req.body.departureDate,
                    stay:req.body.stay,
                    postBillStatus:req.body.postBillStatus,
                    title:req.body.title,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    middlename:req.body.middlename,
                    dob:req.body.dob,
                    mob:req.body.mob,
                    phone:req.body.phone,
                    email:req.body.email,
                    ID:req.body.ID,
                    passportNum:req.body.passportNum,
                    Gender:req.body.Gender,
                    Nationality:req.body.Nationality,
                    Address:req.body.Address,
                    occupation:req.body.occupation,
                    NokLname:req.body.NokLname,
                    NokFname:req.body.NokFname,
                    NokMname:req.body.NokMname,
                    NokRelationship:req.body.NokRelationship,
                    NokPhone:req.body.NokPhone,
                    POV:req.body.POV,
                    vehicleReg:req.body.vehicleReg,
                    roomStatus:req.body.roomStatus,
                    VAT:req.body.VAT,
                    TourismLevy:req.body.TourismLevy,
                    ServiceChrg:req.body.ServiceChrg,
                    calculatedstay:req.body.calculatedstay
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Update groupGuestWarehouse details
zarvich.put('/groupguestupdate/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('groupGuestWarehouse').updateOne(
        {'roomNumbers':id},
        {
            $set: {
                    
                    status:req.body.status,
                    refID:req.body.refID,
                    group:req.body.group,
                    roomRate:req.body.roomRate,
                    roomtypeName:req.body.roomtypeName,
                    dailyRate:req.body.dailyRate,
                    discounType:req.body.discounType,
                    discountAmount:req.body.discountAmount,
                    comingFrom:req.body.comingFrom,
                    goingTo:req.body.goingTo,
                    arrivalDate:req.body.arrivalDate,
                    departureDate:req.body.departureDate,
                    stay:req.body.stay,
                    postBillStatus:req.body.postBillStatus,
                    title:req.body.title,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    middlename:req.body.middlename,
                    dob:req.body.dob,
                    mob:req.body.mob,
                    phone:req.body.phone,
                    email:req.body.email,
                    ID:req.body.ID,
                    passportNum:req.body.passportNum,
                    Gender:req.body.Gender,
                    Nationality:req.body.Nationality,
                    Address:req.body.Address,
                    occupation:req.body.occupation,
                    NokLname:req.body.NokLname,
                    NokFname:req.body.NokFname,
                    NokMname:req.body.NokMname,
                    NokRelationship:req.body.NokRelationship,
                    NokPhone:req.body.NokPhone,
                    POV:req.body.POV,
                    vehicleReg:req.body.vehicleReg,
                    roomStatus:req.body.roomStatus,
                    transactionDate:req.body.transactionDate,
                    calculatedstay:req.body.calculatedstay
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Room Change
zarvich.put('/roomnum/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('hoteldata').updateOne(
        {guestID:id},
        {
            $set: {
                    roomtype_Name:req.body.roomtype_Name,
                    room_images:req.body.room_images,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//return all website reservations
zarvich.get('/ebooking', (req,res) => {
    db.collection('reservations').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all card locks
zarvich.get('/getCards', (req,res) => {
    db.collection('cardDetails').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all card Errors
zarvich.get('/getCardErrors', (req,res) => {
    db.collection('cardErrorLog').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all cardErrors locks
zarvich.get('/getCardError', (req,res) => {
    db.collection('cardErrorLog').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all local reservations
zarvich.get('/reservation', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return reservation wrt title
    else if(req.query.resTitl){
        var resTitl = (req.query.resTitl)
        query={'title':(req.query.resTitl)}
    }


//return reservation wrt resID
    else if(req.query.resavtnID){
        var resavtnID = (req.query.resavtnID)
        query={'resID':(req.query.resavtnID)}

    }

    db.collection('reservationData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//make a local reservations
zarvich.post('/reserveNow',(req,res)=>{
	console.log(req.body);
	db.collection('reservationData').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

zarvich.delete('/delReservation/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('reservationData').deleteOne(
        {_id:(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

//update reservation data
zarvich.put('/reservatn/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('reservationData').updateOne(
        {_id:id},
        {
            $set: {
                    resID:req.body.resID,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    allDay:req.body.allDay,
                    start:req.body.start,
                    end:req.body.end,
                    title:req.body.title,
                    phone:req.body.phone,
                    room:req.body.room,
                   
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//register a group
zarvich.post('/group',(req,res)=>{
	console.log(req.body);
	db.collection('groupRegData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get a group listing
zarvich.get('/groupdetail', (req,res) => {
    db.collection('groupRegData').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//register a discountType
zarvich.post('/discount',(req,res)=>{
	console.log(req.body);
	db.collection('discountTypes').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get a room status
zarvich.get('/getrmstatus', (req,res) => {
    db.collection('roomStatus').find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})

//get roomStatus
zarvich.get('/newRoomStat', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    //return organisations wrt class
    else if(req.query.wrtRmNum){
        var wrtRmNum = (req.query.wrtRmNum)
        query={roomNumbers:(req.query.wrtRmNum)}
    }
        
    db.collection('roomStatus').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//roomupdater//
zarvich.post('/roomupdater',(req,res)=>{
	console.log(req.body);
	db.collection('roomupdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get roomupdater
zarvich.get('/roomupdating', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('roomupdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete roomupdater
zarvich.delete('/delroomupdate',(req,res)=>{
    db.collection('roomupdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//post to othersalesupdater//
zarvich.post('/postothersupdater',(req,res)=>{
	console.log(req.body);
	db.collection('othersupdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get othersalesupdater
zarvich.get('/getothersupdater', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('othersupdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete othersalesupdater
zarvich.delete('/delothersupdater',(req,res)=>{
    db.collection('othersupdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//post to roomDepositUpdater//
zarvich.post('/postDepositUpdater',(req,res)=>{
	console.log(req.body);
	db.collection('roomDepositUpdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get roomDepositUpdater
zarvich.get('/getDepositUpdater', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('roomDepositUpdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete roomDepositUpdater
zarvich.delete('/delDepositUpdater',(req,res)=>{
    db.collection('roomDepositUpdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//post to restaurantUpdater//
zarvich.post('/postRestUpdater',(req,res)=>{
	console.log(req.body);
	db.collection('restuarantUpdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get restaurantUpdater
zarvich.get('/getRestUpdater', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('restuarantUpdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete restaurantUpdater
zarvich.delete('/delRestUpdater',(req,res)=>{
    db.collection('restuarantUpdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//post to barUpdater//
zarvich.post('/postBarUpdater',(req,res)=>{
	console.log(req.body);
	db.collection('barUpdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get barUpdater
zarvich.get('/getBarUpdater', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('barUpdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete barUpdater
zarvich.delete('/delBarUpdater',(req,res)=>{
    db.collection('barUpdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//post to poolUpdater//
zarvich.post('/postPoolUpdater',(req,res)=>{
	console.log(req.body);
	db.collection('barUpdater').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send('room reserved')
	})
})

//get poolUpdater
zarvich.get('/getPoolUpdater', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
           
    db.collection('barUpdater').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete poolUpdater
zarvich.delete('/delPoolUpdater',(req,res)=>{
    db.collection('barUpdater').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//update Room status
zarvich.put('/rmstatus2/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('roomStatus').updateOne(
        {'roomNumbers':id},
        {
            $set: {
                                    
                status:req.body.status,
                roomtypeName:req.body.roomtypeName,
                fname:req.body.fname,
                lname:req.body.lname,
                roomStatus:req.body.roomStatus,
                BillStatus:req.body.BillStatus,
                refID:req.body.refID
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//update Room status
zarvich.put('/guestBalanceChk/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('roomStatus').updateOne(
        {'refID':id},
        {
            $set: {
                status:req.body.status,
                roomtypeName:req.body.roomtypeName,
                fname:req.body.fname,
                lname:req.body.lname,
                roomStatus:req.body.roomStatus,
                BillStatus:req.body.BillStatus,
                refID:req.body.refID
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//update Room status
zarvich.put('/rmstatus/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('roomStatus').updateOne(
        {'_id':id},
        {
            $set: {
                    roomNumbers:req.body.roomNumbers,
                    status:req.body.status,
                    roomtypeName:req.body.roomtypeName,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    roomStatus:req.body.roomStatus,
                    refID:req.body.refID,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})


//get organisations
zarvich.get('/org', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={orgName:(req.query.id)}
    }
    //return organisations wrt class
    else if(req.query.groupNow){
        var groupNow = (req.query.groupNow)
        query={id:(req.query.groupNow)}
    }
    else if(req.query.groupID){
        var groupID = (req.query.groupID)
        query={orgID:(req.query.groupID)}
    }

    else if(req.query.grpName){
        var grpName = (req.query.grpName)
        query={orgName:(req.query.grpName)}
    }
    
    db.collection('organisations').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
// Post to organisation 
zarvich.post('/postOrg',(req,res)=>{
	console.log(req.body);
	db.collection('organisations').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Delete organisation
zarvich.delete('/delorg/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('organisations').deleteOne(
        {"_id": (req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

//update organisation data
zarvich.put('/putOrg/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('organisations').updateOne(
        {_id:id},
        {
            $set: {
                class:req.body.class,
                    orgName:req.body.orgName,
                    orgAddress:req.body.orgAddress,
                    orgEmail:req.body.orgEmail,
                    orgPhone:req.body.orgPhone,
                    orgID:req.body.orgID,
                    class:req.body.class
                   
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// post to FunctionBill
zarvich.post('/functionBillPost',(req,res)=>{
	console.log(req.body);
	db.collection('functionBill').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//return all function deposits
zarvich.get('/MainfunctionDep', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

    else if(req.query.orgName){
        var orgName = (req.query.orgName)
        query={group:(req.query.orgName)}
    }

    else if(req.query.Bstaff){
        var Bstaff = (req.query.Bstaff)
        query={user:(req.query.Bstaff)}
    }
    
    db.collection('functionBill').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// post to TempFunctionBill
zarvich.post('/PostTempfunction',(req,res)=>{
	console.log(req.body);
	db.collection('tempFunctionBill').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})
//return all Tempfunction deposits
zarvich.get('/functionDep', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }


    else if(req.query.Fnstaff){
        var Fnstaff = (req.query.Fnstaff)
        query={user:(req.query.Fnstaff)}
    }
    
    db.collection('tempFunctionBill').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//delete tempFunctionBill posts
zarvich.delete('/delTempFunctionBills',(req,res)=>{
    db.collection('tempFunctionBill').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// post to groupGuestWarehouse
zarvich.post('/groupGuestDetail',(req,res)=>{
	console.log(req.body);
	db.collection('groupGuestWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// post to groupGuestRoomCharging
zarvich.post('/groupRoomCharges',(req,res)=>{
	console.log(req.body);
	db.collection('groupRooomCharges').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// post to billSummary
zarvich.post('/allBillSummary',(req,res)=>{
	console.log(req.body);
	db.collection('BillSummary').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//return all groupGuestWarehouseCheckin
zarvich.get('/groupCheckin', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
// Return groupGuest wrt orgName and dates
else if(req.query.orgName && req.query.startDate && req.query.endDate){
    var orgName = (req.query.orgName)
    var startDate = (req.query.startDate)
    var endDate = (req.query.endDate)
    query={'group':(req.query.orgName), transactionDate:{$gte:(req.query.startDate), $lte:(req.query.endDate)}}
}

    db.collection('groupGuestWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all guestbillingSummary
zarvich.get('/guestbillingSummary', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
// Return guestbillingSummary wrt orgName
else if(req.query.orgName){
    var orgName = (req.query.orgName)
    query={'group':(orgName)}
}

    db.collection('BillSummary').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all roomstatus
zarvich.get('/roomstatus', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:Number(req.query.id)}
    }

//return Rooms wrt room Status
    else if(req.query.Rstatus){
        var Rstatus = (req.query.Rstatus)
        query={'roomStatus':(req.query.Rstatus)}
    }
//return Rooms wrt room number
else if(req.query.Rnumber){
    var Rnumber = (req.query.Rnumber)
    query={'roomNumbers':(req.query.Rnumber)}
}

    db.collection('roomStatus').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all menuitems
zarvich.get('/menuitems', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return menuitems wrt mealtypes
    else if(req.query.mealtypes){
        var mealtypes = (req.query.mealtypes)
        query={mealTypeID:Number(mealtypes)}
    }
//return menuitems wrt categories
    else if(req.query.category){
        var category = (req.query.category)
        query={categoryID:Number(req.query.category)}
    }
    db.collection('restaurantMenu').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



//return all laundryitems
zarvich.get('/laundryitems', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return menuitems wrt clothtypes
    else if(req.query.clothtypes){
        var clothtypes = (req.query.clothtypes)
        query={mealTypeID:Number(clothtypes)}
    }
//return menuitems wrt categories
    else if(req.query.category){
        var category = (req.query.category)
        query={categoryID:Number(req.query.category)}
    }
    db.collection('LaundryMenu').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/restaurantMenus/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('restaurantMenu').deleteOne(
        {_id:(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

zarvich.delete('/delCat/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('MealCategories').deleteOne(
        {mealTypeID:Number(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})
////////////////////////////

//return all Pooldrinkitems
zarvich.get('/pooldrinkitems', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return pooldrinkitems wrt pooldrinktypes
    else if(req.query.pooldrinktypes){
        var pooldrinktypes = (req.query.pooldrinktypes)
        query={mealTypeID:Number(req.query.pooldrinktypes)}
    }
//return pooldrinkitems wrt poolcategories
    else if(req.query.pooldcategory){
        var pooldcategory = (req.query.pooldcategory)
        query={categoryID:Number(req.query.pooldcategory)}
    }
    db.collection('poolbarMenu').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


///////////////////////////
//return all drinkitems
zarvich.get('/drinkitems', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return drinkitems wrt drinktypes
    else if(req.query.drinktypes){
        var drinktypes = (req.query.drinktypes)
        query={mealTypeID:Number(req.query.drinktypes)}
    }
//return drinkitems wrt categories
    else if(req.query.dcategory){
        var dcategory = (req.query.dcategory)
        query={categoryID:Number(req.query.dcategory)}
    }

    else if(req.query.drinxxName){
        var drinxxName = (req.query.drinxxName)
        query={'mealName':(drinxxName)}
    }

    db.collection('barMenu').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Perform barMenu Post
zarvich.post('/postDrinksMenu',(req,res)=>{
	console.log(req.body);
	db.collection('barMenu').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//Edit BarMenu 
zarvich.put('/editDrinksMenu/:id',(req,res)=>{
	console.log(req.params.id);
    var id = Number(req.params.id)
	db.collection('barMenu').update(
        {'_id':id},
        {
            $set: {
                   
                    mealTypeID:req.body.mealTypeID,
                    mealName:req.body.mealName,
                    mealPrice:req.body.mealPrice,
                    mealQt:1,
                    mealType:req.body.mealType,
                    categoryID:req.body.categoryID,
                    category:req.body.category

                    
            }
        },
        
    )
		res.send("Check in Complete")

})
//return all menuCategories
zarvich.get('/menuCategories', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={mealTypeID:(req.query.id)}
    }
//return menucategories wrt mealtypes
    else if(req.query.mainmenu){
        var mainmenu = (req.query.mainmenu)
        query={mealTypeID:Number(req.query.mainmenu)}
    }

    else if(req.query.findID){
        var findID = (req.query.findID)
        query={'mealType':(findID)}
    }

    db.collection('MealCategories').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//return all laundryCategories
zarvich.get('/laundryCategories', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={mealTypeID:(req.query.id)}
    }
//return menucategories wrt LaundryMenu
    else if(req.query.LaundryMenu){
        var LaundryMenu = (req.query.LaundryMenu)
        query={mealTypeID:Number(req.query.LaundryMenu)}
    }

    else if(req.query.LaundryfindID){
        var LaundryfindID = (req.query.LaundryfindID)
        query={'mealType':(LaundryfindID)}
    }

    db.collection('ClothesCategories').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.post('/postRestMenu',(req,res)=>{
	console.log(req.body);
	db.collection('restaurantMenu').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/postCategory',(req,res)=>{
	console.log(req.body);
	db.collection('MealCategories').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//return all drinkCategories
zarvich.get('/drinkCategories', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={mealTypeID:(req.query.id)}
    }
//return drinkcategories wrt drinktypes ID
    else if(req.query.drinkmenu){
        var drinkmenu = (req.query.drinkmenu)
        query={mealTypeID:Number(req.query.drinkmenu)}
    }
//return drinkcategories wrt drinktypes Names
    else if(req.query.drinkType){
        var drinkType = (req.query.drinkType)
        query={mealType:(req.query.drinkType)}
    }

    db.collection('DrinkCategories').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
////////////////////

//return all PooldrinkCategories
zarvich.get('/pooldrinkCategories', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={mealTypeID:(req.query.id)}
    }
//return Pooldrinkcategories wrt drinktypes
    else if(req.query.pooldrinkmenu){
        var pooldrinkmenu = (req.query.pooldrinkmenu)
        query={mealTypeID:Number(req.query.drinkmenu)}
    }

    db.collection('PoolDrinkCategories').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

/////////////////////

// Perform Restaurant Postings
zarvich.post('/restaurant',(req,res)=>{
	console.log(req.body);
	db.collection('restaurantData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/Laundry',(req,res)=>{
	console.log(req.body);
	db.collection('laundryData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Perform Restaurant Credits Postings
zarvich.post('/restCredit',(req,res)=>{
	console.log(req.body);
	db.collection('restaurantCredit').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})


// Perform Laundry Credits Postings
zarvich.post('/laundryCredit',(req,res)=>{
	console.log(req.body);
	db.collection('laundryCredit').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})


// Perform Bar Credits Postings
zarvich.post('/barCredit',(req,res)=>{
	console.log(req.body);
	db.collection('barCredit').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/clubCredit',(req,res)=>{
	console.log(req.body);
	db.collection('clubCredit').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/poolCredit',(req,res)=>{
	console.log(req.body);
	db.collection('poolCredit').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// return Restaurant Postings
zarvich.get('/restaurantSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Restaurants wrt user
else if(req.query.Rstaff){
    var Rstaff = (req.query.Rstaff)
    query={user:(req.query.Rstaff)}
}
    

    db.collection('restaurantData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// return Restaurant Postings
zarvich.get('/alllaundrySales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Restaurants wrt user
else if(req.query.Lstaff){
    var Lstaff = (req.query.Lstaff)
    query={user:(Lstaff)}
}
    

    db.collection('laundryData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Restaurant Credits Postings
zarvich.get('/restaurantCredit', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Restaurants Credits wrt user
else if(req.query.RCstaff){
    var RCstaff = (req.query.RCstaff)
    query={user:(RCstaff)}
}
    

    db.collection('restaurantCredit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// return Restaurant Credits Postings
zarvich.get('/laundryCredit', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Restaurants Credits wrt user
else if(req.query.LCstaff){
    var LCstaff = (req.query.LCstaff)
    query={user:(LCstaff)}
}
    

    db.collection('laundryCredit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Bar Credits Postings
zarvich.get('/barCreditSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)

//return all Credit
if(req.query.id){
    query={_id:(req.query.id)}
}
// return all Bar Credits wrt user
else if(req.query.BCstaff){
    var BCstaff = (req.query.BCstaff)
    query={user:(BCstaff)}
}
    

    db.collection('barCredit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Bar Credits Postings
zarvich.get('/poolCreditSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    
//return all Credit
if(req.query.id){
    query={_id:(req.query.id)}
}
// return all Bar Credits wrt user
else if(req.query.PCstaff){
    var PCstaff = (req.query.PCstaff)
    query={user:(PCstaff)}
}
    
    db.collection('poolCredit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Bar Credits Postings
zarvich.get('/clubCreditSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    
//return all Credit
if(req.query.id){
    query={_id:(req.query.id)}
}
// return all Bar Credits wrt user
else if(req.query.Clstaff){
    var Clstaff = (req.query.Clstaff)
    query={user:(Clstaff)}
}
    
    db.collection('clubCredit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return hotel address
zarvich.get('/hoteladdress', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
  

    db.collection('hoteladdress').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

/////////////////////////////////

// Perform PoolBar Postings
zarvich.post('/poolbar',(req,res)=>{
	console.log(req.body);
	db.collection('poolbarData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Perform PoolBar Postings
zarvich.post('/club',(req,res)=>{
	console.log(req.body);
	db.collection('clubData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// return poolBar Postings
zarvich.get('/poolbarSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all poolbar wrt user
else if(req.query.Pstaff){
    var Pstaff = (req.query.Pstaff)
    query={user:(Pstaff)}
}

    db.collection('poolbarData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return poolBar Postings
zarvich.get('/clubSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all poolbar wrt user
else if(req.query.Cstaff){
    var Cstaff = (req.query.Cstaff)
    query={user:(Cstaff)}
}

    db.collection('clubData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//////////////////////////

// return PoolBar Tables
zarvich.get('/poolbarTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.tableID){
    var tableID = (req.query.tableID)
    query={tableNum:(req.query.tableID)}
}

    db.collection('poolbarTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/poolbarWaitersTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.waitersName){
    var waitersName = (req.query.waitersName)
    query={waiter:(waitersName)}
}

else if(req.query.waiterTabID){
    var waiterTabID = (req.query.waiterTabID)
    query={_id: Number(waiterTabID)}
}

    db.collection('waitersSalesData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return PoolBar Tables
zarvich.get('/getclubTables', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.tableID){
    var tableID = (req.query.tableID)
    query={tableNum:(tableID)}
}

    db.collection('clubTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//return laundry Tables
zarvich.get('/getLaundryTables', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.tableID){
    var tableID = (req.query.tableID)
    query={tableNum:(tableID)}
}

    db.collection('laundryTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

////////////////////////////

// return Bar Tables
zarvich.get('/barTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.tableID){
    var tableID = (req.query.tableID)
    query={tableNum:(req.query.tableID)}
}

    db.collection('barTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

/////////////////////////////////

// Perform Bar Postings
zarvich.post('/bar',(req,res)=>{
	console.log(req.body);
	db.collection('barData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})
// return Bar Postings
zarvich.get('/barSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Restaurants wrt user
else if(req.query.staff){
    var staff = (req.query.staff)
    query={'user':(req.query.staff)}
}

    db.collection('barData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Bar Tables
zarvich.get('/barTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all Bar Tables ID 
else if(req.query.tableID){
    var tableID = (req.query.tableID)
    query={_id:Number(req.query.tableID)}
}

    db.collection('barTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get bar Print Table
zarvich.post('/barPrint',(req,res)=>{
	console.log(req.body);
	db.collection('barPrintTable').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// post to bar Print 
zarvich.post('/posttoPrint',(req,res)=>{
	console.log(req.body);
	db.collection('barPrintTable').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Delete Bar Print Items
zarvich.delete('/delBarPrint',(req,res)=>{
    db.collection('barPrintTable').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return Restaurant Tables
zarvich.get('/restTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all rest Tables ID 
else if(req.query.resttableID){
    var resttableID = (req.query.resttableID)
    query={tableNum:(req.query.resttableID)}
}

    db.collection('restTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



// return Restaurant Tables
zarvich.get('/LDTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all rest Tables ID 
else if(req.query.LDtableID){
    var LDtableID = (req.query.LDtableID)
    query={tableNum:(LDtableID)}
}

    db.collection('laundryTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// return Restaurant Tables
zarvich.get('/laundTable', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return all rest Tables ID 
else if(req.query.laundtableID){
    var laundtableID = (req.query.laundtableID)
    query={tableNum:(laundtableID)}
}

    db.collection('laundryTables').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

////////////////////////////////

// post into PoolBar Tables
zarvich.put('/poolbarTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('poolbarTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,
                    user:req.body.user

                    
            }
        },
        
    )
		res.send("Check in Complete")

})

// post into club Tables
zarvich.put('/clubTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('clubTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,
                    user:req.body.user

                    
            }
        },
        
    )
		res.send("Check in Complete")

})



// post into club Tables
zarvich.put('/laundryTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('laundryTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,
                    user:req.body.user

                    
            }
        },
        
    )
		res.send("Check in Complete")

})

///////////////////////////////

// put into Bar Tables
zarvich.put('/barTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('barTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,

                    
            }
        },
        
    )
		res.send("Check in Complete")

})
//post into Restaurant Tables
zarvich.put('/restaurantTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('restTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,

                    
            }
        },
        
    )
		res.send("Check in Complete")

})


//post into Restaurant Tables
zarvich.put('/laundryTablePost/:id',(req,res)=>{
	console.log(req.params.id);
    var id = (req.params.id)
	db.collection('laundryTables').update(
        {"_id":id},
        {
            $set: {
                    selected:req.body.selected,
                    billCost:req.body.billCost,
                    tableNum:req.body.tableNum,

                    
            }
        },
        
    )
		res.send("Check in Complete")

})
/////////////////////////////

// Delete poolbarTable
zarvich.delete('/delPoolTable/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('poolbarTables').deleteOne(
        {_id: Number(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

///////////////////////////////
// Delete barTable
zarvich.delete('/delTable/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('barTables').deleteOne(
        {_id: Number(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

// Delete restTable
zarvich.delete('/delrestTable/:id',(req,resp)=>{
    console.log(req.params.id);
    db.collection('restTables').deleteOne(
        {_id: Number(req.params.id)},(err,result)=>{
        if(err) throw err;
        resp.send(result)
    })
    
})

zarvich.get('/paymentMethods', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    db.collection('paymentMeth').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/roomDeposits', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    db.collection('depositTypes').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// Perform otherSales Postings
zarvich.post('/otherSales',(req,res)=>{
	console.log(req.body);
	db.collection('revenueData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})


zarvich.post('/GymnasiumSales',(req,res)=>{
	console.log(req.body);
	db.collection('GymnasiumSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/SmoothiesSales',(req,res)=>{
	console.log(req.body);
	db.collection('SmoothieSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/SwimmingSales',(req,res)=>{
	console.log(req.body);
	db.collection('SwimmingSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/HallHireSales',(req,res)=>{
	console.log(req.body);
	db.collection('HallHireSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/ShishaSales',(req,res)=>{
	console.log(req.body);
	db.collection('ShishaSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/BbqSales',(req,res)=>{
	console.log(req.body);
	db.collection('BarbequeSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/MiniMartSales',(req,res)=>{
	console.log(req.body);
	db.collection('MiniMartSales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// post otherSales into revenueWarehouse
zarvich.post('/postRWarehouse',(req,res)=>{
	console.log(req.body);
	db.collection('revenueWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.get('/findOtherSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.others12 && req.query.Othrstartdate12 && req.query.OthrendDate12){
        var others12 = (req.query.others12)
        var Othrstartdate12 = (req.query.Othrstartdate12)
        var OthrendDate12 = (req.query.OthrendDate12)
        query={'department':(others12), date:{$gte:(Othrstartdate12), $lte:(OthrendDate12)}}
    }
    
    db.collection('revenueWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findLaundrySales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.laundry12 && req.query.Laundrystartdate12 && req.query.LaundryendDate12){
        var laundry12 = (req.query.laundry12)
        var Laundrystartdate12 = (req.query.Laundrystartdate12)
        var LaundryendDate12 = (req.query.LaundryendDate12)
        query={'department':(laundry12), date:{$gte:(Laundrystartdate12), $lte:(LaundryendDate12)}}
    }
    
    db.collection('laundrySales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findGymSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.gym12 && req.query.gymstartdate12 && req.query.gymendDate12){
        var gym12 = (req.query.gym12)
        var gymstartdate12 = (req.query.gymstartdate12)
        var gymendDate12 = (req.query.gymendDate12)
        query={'department':(gym12), date:{$gte:(gymstartdate12), $lte:(gymendDate12)}}
    }
    
    db.collection('GymnasiumSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findSmoothieSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.smoot12 && req.query.smoostartdate12 && req.query.smooendDate12){
        var smoot12 = (req.query.smoot12)
        var smoostartdate12 = (req.query.smoostartdate12)
        var smooendDate12 = (req.query.smooendDate12)
        query={'department':(smoot12), date:{$gte:(smoostartdate12), $lte:(smooendDate12)}}
    }
    
    db.collection('SmoothieSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findSwimmingSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.swim12 && req.query.swimstartdate12 && req.query.swimendDate12){
        var swim12 = (req.query.swim12)
        var swimstartdate12 = (req.query.swimstartdate12)
        var swimendDate12 = (req.query.swimendDate12)
        query={'department':(swim12), date:{$gte:(swimstartdate12), $lte:(swimendDate12)}}
    }
    
    db.collection('SwimmingSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findMiniMartSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.mart12 && req.query.martstartdate12 && req.query.martendDate12){
        var mart12 = (req.query.mart12)
        var martstartdate12 = (req.query.martstartdate12)
        var martendDate12 = (req.query.martendDate12)
        query={'department':(mart12), date:{$gte:(martstartdate12), $lte:(martendDate12)}}
    }
    
    db.collection('MiniMartSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findBbqSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.bbq12 && req.query.bbqstartdate12 && req.query.bbqendDate12){
        var bbq12 = (req.query.bbq12)
        var bbqstartdate12 = (req.query.bbqstartdate12)
        var bbqendDate12 = (req.query.bbqendDate12)
        query={'department':(bbq12), date:{$gte:(bbqstartdate12), $lte:(bbqendDate12)}}
    }
    
    db.collection('BarbequeSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findShiSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.shi12 && req.query.shistartdate12 && req.query.shiendDate12){
        var shi12 = (req.query.shi12)
        var shistartdate12 = (req.query.shistartdate12)
        var shiendDate12 = (req.query.shiendDate12)
        query={'department':(shi12), date:{$gte:(shistartdate12), $lte:(shiendDate12)}}
    }
    
    db.collection('ShishaSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findHallSales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
   
    else if(req.query.hall12 && req.query.hallstartdate12 && req.query.hallendDate12){
        var hall12 = (req.query.hall12)
        var hallstartdate12 = (req.query.hallstartdate12)
        var hallendDate12 = (req.query.hallendDate12)
        query={'department':(hall12), date:{$gte:(hallstartdate12), $lte:(hallendDate12)}}
    }
    
    db.collection('HallHireSales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// return otherSales Postings
zarvich.get('/otherSalesPoints', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
// return otherSales wrt incomeHead
else if(req.query.incomeHead){
    var incomeHead = (req.query.incomeHead)
    query={'incomeHead':(req.query.drinkmenu)}
}

else if(req.query.Fostaff){
    var Fostaff = (req.query.Fostaff)
    query={user:(req.query.Fostaff)}
}

    db.collection('revenueData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Delete from otherSales database

zarvich.delete('/delOtherrevenue/:id',(req,res)=>{
    var id = req.params.id
    db.collection('revenueData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//return all room postings
zarvich.get('/posting', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }
//return postings wrt roomNum
    else if(req.query.guestRm){
        var guestRm = (req.query.guestRm)
        query={'roomNumbers':(req.query.guestRm)}
    }


//return checkinGuest wrt guestID
    else if(req.query.GcheckinID){
        var GcheckinID = (req.query.GcheckinID)
        query={'refID':(req.query.GcheckinID)}

    }

    //return postings wrt department
    else if(req.query.postdept){
        var postdept = (req.query.postdept)
        query={'department':(req.query.postdept)}

    }

    //return posting wrt group
    else if(req.query.orgName && req.query.startDate && req.query.endDate){
        var orgName = (req.query.orgName)
        var startDate = (req.query.startDate)
        var endDate = (req.query.endDate)
        query={'group':(req.query.orgName), date:{$gte:(req.query.startDate), $lte:(req.query.endDate)}}
    }

    db.collection('roomPostingData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all GuestInhouse postings
zarvich.get('/InhouseBill', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={roomtype_id:Number(req.query.id)}
    }

    //return posting wrt organisation
    else if(req.query.orgNamex){
        var orgNamex = (req.query.orgNamex)
        query={'group':(orgNamex)}
    }

    db.collection('InhouseGroup').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Post roomCharges to guest in house Account
zarvich.post('/postRmCharges',(req,res)=>{
	console.log(req.body);
	db.collection('roomRateCharges').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})
// Delete orders from orders database
zarvich.delete('/delCharges',(req,res)=>{
    db.collection('roomRateCharges').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Delete Active Work Date
zarvich.delete('/delworkdate',(req,res)=>{
    db.collection('ActiveWorkDate').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get Active Work Date
zarvich.get('/getActive', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('ActiveWorkDate').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Post into Active Work Date
zarvich.post('/postActive',(req,res)=>{
	console.log(req.body);
	db.collection('ActiveWorkDate').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get global room charges
zarvich.get('/roomRates', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return room charges wrt globalDetails
    else if(req.query.gdetails){
        var gdetails = (req.query.gdetails)
        query={'refID':(req.query.gdetails)}
    }
    
    db.collection('roomRateCharges').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//set global room rates
zarvich.get('/globalRmChrges', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.getRef){
        var getRef = (req.query.getRef)
        query={'refID':(getRef)}
    }
    else if(req.query.orgName){
        var orgName = (req.query.orgName)
        query={'group':(orgName)}
    }
    else if(req.query.getRoom){
        var getRoom = (req.query.getRoom)
        query={'roomNumbers':(req.query.getRoom)}
    }  
    
    db.collection('grcharges').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/getFirstNite', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.getRoom){
        var getRoom = (req.query.getRoom)
        query={'roomNumbers':(req.query.getRoom)}
    }
    
    else if(req.query.orgName){
        var orgName = (req.query.orgName)
        query={'group':(orgName)}
    }

    else if(req.query.getRefID){
        var getRefID = (req.query.getRefID)
        query={'refID':(getRefID)}
    }     
    
    db.collection('FirstNite').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//update First Nite status
zarvich.put('/updateFirstNite/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('FirstNite').updateOne(
        {'refID':id},
        {
            $set: {
                group:req.body.group,
                roomtypeName:req.body.roomtypeName,
                fname:req.body.fname,
                lname:req.body.lname,
                arrivalDate:req.body.arrivalDate,
                departureDate:req.body.departureDate,
                roomNumbers:req.body.roomNumbers,
                dailyRate:req.body.dailyRate,
                VAT:req.body.VAT,
                TourismLevy:req.body.TourismLevy,
                ServiceCharge:req.body.ServiceCharge,
                tranDate:req.body.tranDate,
                description:req.body.description,
                searchKey:req.body.searchKey,

                    
            }
        },
        
    )
    res.send('data updated')      
  
})


// Post into global room rates
zarvich.post('/globalRmPost',(req,res)=>{
	console.log(req.body);
	db.collection('grcharges').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

// Post into global room rates
zarvich.post('/firstNight',(req,res)=>{
	console.log(req.body);
	db.collection('FirstNite').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//update globalRm status
zarvich.put('/rmstatus3/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('grcharges').updateOne(
        {'_id':id},
        {
            $set: {
                    refID:req.body.refID,
                    arrivalDate:req.body.arrivalDate,
                    departureDate:req.body.departureDate,
                    roomNumbers:req.body.roomNumbers,
                    dailyRate:req.body.dailyRate,
                    description:req.body.description,
                   
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Post guest Deposits
zarvich.post('/rmDeposit',(req,res)=>{
	console.log(req.body);
	db.collection('roomDeposits').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//Get guest Deposits
zarvich.get('/getRmDeposits', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    //Get guest Deposit Based on ID
    else if(req.query.GstbillId){
        var GstbillId = (req.query.GstbillId)
        query={'refID':(req.query.GstbillId)}

    }

    else if(req.query.Bystaff){
        var Bystaff = (req.query.Bystaff)
        query={user:(req.query.Bystaff)}
    }

    
    db.collection('roomDeposits').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//sort deposit dates

zarvich.get('/findRmDeposits', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    

    else if(req.query.roomDep13&&req.query.startdate13&&req.query.endDate13&&req.query.shiftNow2){
        var roomDep13 = (req.query.roomDep13)
        var startdate13 = (req.query.startdate13)
        var endDate13 = (req.query.endDate13)
        var shiftNow = (req.query.shiftNow2)
        query={'department':(req.query.roomDep13), date:{$gte:(req.query.startdate13), $lte:(req.query.endDate13)},'shift':(req.query.shiftNow2)}
    }

    else if(req.query.roomDep12 && req.query.startdate12 && req.query.endDate12){
        var roomDep12 = (req.query.roomDep12)
        var startdate12 = (req.query.startdate12)
        var endDate12 = (req.query.endDate12)
        query={'department':(req.query.roomDep12), date:{$gte:(req.query.startdate12), $lte:(req.query.endDate12)}}
    }
    
    db.collection('roomDeposits').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// Post room change Data
zarvich.post('/postRoomChangeReason',(req,res)=>{
	console.log(req.body);
	db.collection('roomChangeData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//Get room Change Data
zarvich.get('/getRoomChangeReason', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    db.collection('roomChangeData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from bar User
zarvich.delete('/delbarUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('barUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Edit User
zarvich.put('/editBarUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('barUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add Bar User Data
zarvich.post('/baruser',(req,res)=>{
	console.log(req.body);
	db.collection('barUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get bar User
zarvich.get('/barUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return bar username
    else if(req.query.baruserName){
        var baruserName = (req.query.baruserName)
        query={'username':(baruserName)}
    }
//return bar password
    else if(req.query.barcode){
        var barcode = (req.query.barcode)
        query={'password':(barcode)}
    }

    else if(req.query.barrefcode){
        var barrefcode = (req.query.barrefcode)
        query={refID:(barrefcode)}
    }
    
    db.collection('barUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get password User
zarvich.get('/getpassword', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return bar username
    else if(req.query.passwordNow){
        var passwordNow = (req.query.passwordNow)
        query={'password':(passwordNow)}
    }

    db.collection('password').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from bar User
zarvich.delete('/delbarUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('barUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//Edit User
zarvich.put('/editGuestUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('guestUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add Bar User Data
zarvich.post('/guestuser',(req,res)=>{
	console.log(req.body);
	db.collection('guestUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get bar User
zarvich.get('/guestUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return bar username
    else if(req.query.guestuserName){
        var baruserName = (req.query.baruserName)
        query={'username':(baruserName)}
    }
//return bar password
    else if(req.query.guestcode){
        var barcode = (req.query.barcode)
        query={'password':(barcode)}
    }

    else if(req.query.guestrefcode){
        var barrefcode = (req.query.barrefcode)
        query={refID:(barrefcode)}
    }
    
    db.collection('guestUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from frontoffice User
zarvich.delete('/delfrontUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('fofUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editFrontUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('fofUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add frontOffice User Data
zarvich.post('/fofuser',(req,res)=>{
	console.log(req.body);
	db.collection('fofUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get front User
zarvich.get('/fofUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return front username
    else if(req.query.fofuserName){
        var fofuserName = (req.query.fofuserName)
        query={'username':(fofuserName)}
    }
//return front password
    else if(req.query.fofcode){
        var fofcode = (req.query.fofcode)
        query={'password':(fofcode)}
    }

    else if(req.query.fofrefcode){
        var fofrefcode = (req.query.fofrefcode)
        query={refID:(fofrefcode)}
    }
    
    db.collection('fofUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from pool User
zarvich.delete('/delpoolUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('poolUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/delclubUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('clubUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editPoolUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('poolUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

zarvich.put('/editClubUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('clubUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add Pool User Data
zarvich.post('/pooluser',(req,res)=>{
	console.log(req.body);
	db.collection('poolUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/ClubUsers',(req,res)=>{
	console.log(req.body);
	db.collection('clubUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/poolWaiterslist',(req,res)=>{
	console.log(req.body);
	db.collection('poolWaiters').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/splitPayments',(req,res)=>{
	console.log(req.body);
	db.collection('poolSplitPayment').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

zarvich.post('/postWaitersSales',(req,res)=>{
	console.log(req.body);
	db.collection('waitersSalesData').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get poolBarTemp data
zarvich.get('/poolWaitersData', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('poolWaiters').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/poolWaitersCost', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.TotwaiterTabID){
        var TotwaiterTabID = (req.query.TotwaiterTabID)
        query={waiter: (TotwaiterTabID)}
    }

    db.collection('waitersSalesData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from admin User
zarvich.delete('/poolwaitersSD/:id',(req,res)=>{
    var id = req.params.id
    db.collection('waitersSalesData').deleteOne(
        {_id:Number(id)},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//get poolbar User
zarvich.get('/poolUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return pool username
    else if(req.query.pooluserName){
        var pooluserName = (req.query.pooluserName)
        query={'username':(pooluserName)}
    }
//return pool password
    else if(req.query.poolcode){
        var poolcode = (req.query.poolcode)
        query={'password':(poolcode)}
    }

    else if(req.query.poolrefcode){
        var poolrefcode = (req.query.poolrefcode)
        query={'password':(poolrefcode)}
    }
    
    db.collection('poolUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get poolbar User
zarvich.get('/clubUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return pool username
    else if(req.query.clubuserName){
        var clubuserName = (req.query.clubuserName)
        query={'username':(clubuserName)}
    }
//return pool password
    else if(req.query.clubcode){
        var clubcode = (req.query.clubcode)
        query={'password':(clubcode)}
    }

    else if(req.query.clubrefcode){
        var clubrefcode = (req.query.clubrefcode)
        query={'password':(clubrefcode)}
    }
    
    db.collection('clubUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from admin User
zarvich.delete('/deladminUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('adminUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editAdminUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('adminUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add admin User Data
zarvich.post('/adminuser',(req,res)=>{
	console.log(req.body);
	db.collection('adminUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get admin User
zarvich.get('/adminUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return admin username
    else if(req.query.adminuserName){
        var adminuserName = (req.query.adminuserName)
        query={'username':(adminuserName)}
    }
//return admin password
    else if(req.query.admincode){
        var admincode = (req.query.admincode)
        query={'password':(admincode)}
    }

//return admin refID
    else if(req.query.refcode){
        var refcode = (req.query.refcode)
        query={refID:(refcode)}
    }
    
    db.collection('adminUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from housekeeper User
zarvich.delete('/delhousekpUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('houseKeepUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/edithousekpUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('houseKeepUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add housekeeper User Data
zarvich.post('/housekeepuser',(req,res)=>{
	console.log(req.body);
	db.collection('houseKeepUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get housekeeper User
zarvich.get('/housekpUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return housekeeper username
    else if(req.query.housekpuserName){
        var housekpuserName = (req.query.housekpuserName)
        query={'username':(housekpuserName)}
    }
//return housekeeper password
    else if(req.query.housekpcode){
        var housekpcode = (req.query.housekpcode)
        query={'password':(housekpcode)}
    }

    else if(req.query.housekprefcode){
        var housekprefcode = (req.query.housekprefcode)
        query={refID:(housekprefcode)}
    }
    
    db.collection('houseKeepUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//delete from restaurant User
zarvich.delete('/delrestUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('restUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editRestkpUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('restUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add restaurant User Data
zarvich.post('/restuser',(req,res)=>{
	console.log(req.body);
	db.collection('restUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get restaurant User
zarvich.get('/restUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return restaurant username
    else if(req.query.restuserName){
        var restuserName = (req.query.restuserName)
        query={'username':(restuserName)}
    }
//return restaurant password
    else if(req.query.restcode){
        var restcode = (req.query.restcode)
        query={'password':(restcode)}
    }

    else if(req.query.restrefcode){
        var restrefcode = (req.query.restrefcode)
        query={refID:(restrefcode)}
    }
    
    
    db.collection('restUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get restaurant User
zarvich.get('/laundryUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return restaurant username
    else if(req.query.launduserName){
        var launduserName = (req.query.launduserName)
        query={'username':(launduserName)}
    }
//return restaurant password
    else if(req.query.laundcode){
        var laundcode = (req.query.laundcode)
        query={'password':(laundcode)}
    }

    else if(req.query.laundrefcode){
        var laundrefcode = (req.query.laundrefcode)
        query={refID:(laundrefcode)}
    }
    
    
    db.collection('laundryUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from billing User
zarvich.delete('/delbillingUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('billingUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editbillingUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('billingUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add billing User Data
zarvich.post('/billinguser',(req,res)=>{
	console.log(req.body);
	db.collection('billingUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get billing User
zarvich.get('/billingUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return billing username
    else if(req.query.billinguserName){
        var billinguserName = (req.query.billinguserName)
        query={'username':(billinguserName)}
    }
//return billing password
    else if(req.query.billingcode){
        var billingcode = (req.query.billingcode)
        query={'password':(billingcode)}
    }

//return billing password
    else if(req.query.billingrefcode){
        var billingrefcode = (req.query.billingrefcode)
        query={refID:(billingrefcode)}
    }
    
    db.collection('billingUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//delete from fandB User
zarvich.delete('/delfandbUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('fandbUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editfandbUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('fandbUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add fandb User Data
zarvich.post('/fandbuser',(req,res)=>{
	console.log(req.body);
	db.collection('fandbUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get fandb User
zarvich.get('/fandbUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return fandb username
    else if(req.query.fandbuserName){
        var fandbuserName = (req.query.fandbuserName)
        query={'username':(fandbuserName)}
    }
//return fandb password
    else if(req.query.fandbcode){
        var fandbcode = (req.query.fandbcode)
        query={'password':(fandbcode)}
    }

    else if(req.query.fandbrefcode){
        var fandbrefcode = (req.query.fandbrefcode)
        query={refID:(fandbrefcode)}
    }
    
    db.collection('fandbUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from fandB User
zarvich.delete('/delstoreUser/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeUser').deleteMany(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//Edit User
zarvich.put('/editstoreUser/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeUser').updateOne(
        {refID:id},
        {
            $set: {
                name:req.body.name,
                username:req.body.username,
                password:req.body.password,
                department:req.body.department,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

// Add store User Data
zarvich.post('/storeuser',(req,res)=>{
	console.log(req.body);
	db.collection('storeUser').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Check in Complete")
	})
})

//get fandb User
zarvich.get('/storeUserInfo', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

//return fandb username
    else if(req.query.storeuserName){
        var storeuserName = (req.query.storeuserName)
        query={'username':(storeuserName)}
    }
//return fandb password
    else if(req.query.storecode){
        var storecode = (req.query.storecode)
        query={'password':(storecode)}
    }

    else if(req.query.storerefcode){
        var storerefcode = (req.query.storerefcode)
        query={refID:(storerefcode)}
    }
    
    db.collection('storeUser').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


////////////////////////////////////////

// Add sales to poolbarWarehouse
zarvich.post('/retirepoolBar',(req,res)=>{
	console.log(req.body);
	db.collection('poolbarWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

// Add sales to poolbarWarehouse
zarvich.post('/retireClub',(req,res)=>{
	console.log(req.body);
	db.collection('clubWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})
// Add sales to poolbarTemp
zarvich.post('/TemppoolBar',(req,res)=>{
	console.log(req.body);
	db.collection('poolbarTemp').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

// Add sales to poolbarTemp
zarvich.post('/Tempclub',(req,res)=>{
	console.log(req.body);
	db.collection('clubTempData').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

///////////////////////
zarvich.get('/findPoolSalesNow', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.poolNowDep83&&req.query.startdate83&&req.query.endDate83&&req.query.shiftNow83){
        var poolNowDep83 = (req.query.poolNowDep83)
        var startdate83 = (req.query.startdate83)
        var endDate83 = (req.query.endDate83)
        var shiftNow83 = (req.query.shiftNow83)
        query={'department':(poolNowDep83), date:{$gte:(startdate83), $lte:(endDate83)},'shift':(shiftNow83)}
    }

    else if(req.query.poolNowDep84&&req.query.poolstartdate84&&req.query.poolendDate84){
        var poolNowDep84 = (req.query.poolNowDep84)
        var poolstartdate84 = (req.query.poolstartdate84)
        var poolendDate84 = (req.query.poolendDate84)
        query={'department':(poolNowDep84), date:{$gte:(poolstartdate84), $lte:(poolendDate84)}}
    }   
    
    
    db.collection('poolbarWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findClubSalesNow', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.clubNowDep83&&req.query.clubstartdate83&&req.query.clubendDate83&&req.query.clubshiftNow83){
        var clubNowDep83 = (req.query.clubNowDep83)
        var clubstartdate83 = (req.query.clubstartdate83)
        var clubendDate83 = (req.query.clubendDate83)
        var clubshiftNow83 = (req.query.clubshiftNow83)
        query={'department':(clubNowDep83), date:{$gte:(clubstartdate83), $lte:(clubendDate83)},'shift':(clubshiftNow83)}
    }

    else if(req.query.clubNowDep84&&req.query.clubstartdate84&&req.query.clubendDate84){
        var clubNowDep84 = (req.query.clubNowDep84)
        var clubstartdate84 = (req.query.clubstartdate84)
        var clubendDate84 = (req.query.clubendDate84)
        query={'department':(clubNowDep84), date:{$gte:(clubstartdate84), $lte:(clubendDate84)}}
    }   
    
    
    db.collection('clubWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//////////////////////

//get poolbar sales data
zarvich.get('/findpoolbarsales', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.actual && req.query.shift){
        var actual = (req.query.actual)
        var shift = (req.query.shift)
        query = {date:(req.query.actual), shift:(req.query.shift)}
    }

    else if(req.query.actual2){
        var actual2 = (req.query.actual2)
        query = {date:(req.query.actual2)}
    }
    
    db.collection('poolbarWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

// Add deposits to TempRoomDatabase
zarvich.post('/PostTmpRmDep',(req,res)=>{
	console.log(req.body);
	db.collection('TempRoomDeposit').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

//get TempRoomPost data
zarvich.get('/GetTmpRmDep', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    else if(req.query.Bstaff){
        var Bstaff = (req.query.Bstaff)
        query={user:(req.query.Bstaff)}
    }

    db.collection('TempRoomDeposit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


zarvich.delete('/delWaiters',(req,res)=>{
    db.collection('poolWaiters').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})

zarvich.delete('/delWaitersSales',(req,res)=>{
    db.collection('waitersSalesData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})

zarvich.delete('/delsplitpay',(req,res)=>{
    db.collection('poolSplitPayment').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})

zarvich.get('/getWaiters', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('poolWaiters').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/getSplits', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('poolSplitPayment').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/delTmpRmDep',(req,res)=>{
    db.collection('TempRoomDeposit').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})


//get poolBarTemp data
zarvich.get('/GetpoolBarTemp', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('poolbarTemp').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/GetclubTemp', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('clubTempData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete from poolbarData

zarvich.delete('/delpoolBar/:id',(req,res)=>{
    var id = req.params.id
    db.collection('poolbarData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/delClub/:id',(req,res)=>{
    var id = req.params.id
    db.collection('clubData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete from poolTemp

zarvich.delete('/delpoolBarTemp',(req,res)=>{
    db.collection('poolbarTemp').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})

zarvich.delete('/delclubTemp',(req,res)=>{
    db.collection('clubTempData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
    
})
///////////////////////////////////

//////

// Add sales to barWarehouse
zarvich.post('/retireBar',(req,res)=>{
	console.log(req.body);
	db.collection('barWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})
//delete from barData

zarvich.delete('/delBar/:id',(req,res)=>{
    var id = req.params.id
    db.collection('barData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete online barData

zarvich.delete('/delOnlineBar',(req,res)=>{
    db.collection('barData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete online roomsData

zarvich.delete('/delOnlineRoomDep',(req,res)=>{
    db.collection('roomDeposits').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete online restaurant

zarvich.delete('/delOnlineRest',(req,res)=>{
    db.collection('restaurantData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete online poolBar

zarvich.delete('/delOnlinePool',(req,res)=>{
    db.collection('poolbarData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete online othersData

zarvich.delete('/delOnlineOthers',(req,res)=>{
    db.collection('revenueData').remove({},(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/findbarsales', (req,res)=> {
    var query = {_id:(req.query.id)};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    
    else if(req.query.actual && req.query.shift){
        var actual = (req.query.actual)
        var shift = (req.query.shift)
        query = {date:(req.query.actual), shift:(req.query.shift)}
    }

    else if(req.query.actual2){
        var actual2 = (req.query.actual2)
        query = {date:(req.query.actual2)}
    }

    else if(req.query.barDep43&&req.query.startdate43&&req.query.endDate43&&req.query.shiftNow43){
        var barDep43 = (req.query.barDep43)
        var startdate43 = (req.query.startdate43)
        var endDate43 = (req.query.endDate43)
        var shiftNow43 = (req.query.shiftNow43)
        query={'department':(barDep43), date:{$gte:(startdate43), $lte:(endDate43)},'shift':(shiftNow43)}
    }

    else if(req.query.barDep44&&req.query.startdate44&&req.query.endDate44){
        var barDep44 = (req.query.barDep44)
        var startdate44 = (req.query.startdate44)
        var endDate44 = (req.query.endDate44)
        query={'department':(barDep44), date:{$gte:(startdate44), $lte:(endDate44)}}
    }
    
    db.collection('barWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



// Add sales to restWarehouse
zarvich.post('/retireRest',(req,res)=>{
	console.log(req.body);
	db.collection('restaurantWarehouse').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Restaurant Sales Retired")
	})
})

// Add sales to laundrywarehouse
zarvich.post('/retireLaundry',(req,res)=>{
	console.log(req.body);
	db.collection('laundrySales').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Restaurant Sales Retired")
	})
})
///////////////////////////////
//get restaurant sales data
zarvich.get('/findrestaurantsalesNow', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    

    else if(req.query.restDep23&&req.query.startdate23&&req.query.endDate23&&req.query.shiftNow23){
        var restDep23 = (req.query.restDep23)
        var startdate23 = (req.query.startdate23)
        var endDate23 = (req.query.endDate23)
        var shiftNow23 = (req.query.shiftNow23)
        query={'department':(restDep23), date:{$gte:(startdate23), $lte:(endDate23)},'shift':(shiftNow23)}
    }

    else if(req.query.restDep24 && req.query.startdate24 && req.query.endDate24){
        var restDep24 = (req.query.restDep24)
        var startdate24 = (req.query.startdate24)
        var endDate24 = (req.query.endDate24)
        query={'department':(restDep24), date:{$gte:(startdate24), $lte:(endDate24)}}
    }
    
    db.collection('restaurantWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



zarvich.get('/findrestaurantsales', (req,res)=> {
    var query = {_id:(req.query.id)};
    console.log(req.query.id)
    
    if(req.query.startdate && req.query.endate){
        var startdate = (req.query.startdate)
        var endate = (req.query.endate)
        query = {date:{$gt:req.query.startdate, $lt:req.query.endate}}
    }

    if(req.query.actual && req.query.shift){
        var actual = (req.query.actual)
        var shift = (req.query.shift)
        query = {date:(req.query.actual), shift:(req.query.shift)}
    }

    if(req.query.actual2){
        var actual2 = (req.query.actual2)
        query = {date:(req.query.actual2)}
    }

    else if(req.query.roomDep13&&req.query.startdate13&&req.query.endDate13&&req.query.shiftNow2){
        var roomDep13 = (req.query.roomDep13)
        var startdate13 = (req.query.startdate13)
        var endDate13 = (req.query.endDate13)
        var shiftNow = (req.query.shiftNow2)
        query={'department':(req.query.roomDep13), date:{$gte:(req.query.startdate13), $lte:(req.query.endDate13)},'shift':(req.query.shiftNow2)}
    }

    
    db.collection('restaurantWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//delete from restData

zarvich.delete('/delRest/:id',(req,res)=>{
    var id = req.params.id
    db.collection('restaurantData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


zarvich.delete('/delLaund/:id',(req,res)=>{
    var id = req.params.id
    db.collection('laundryData').deleteMany(
        {user:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
////////////////////////////
// Add to dailySales
zarvich.post('/add',(req,res)=>{
	console.log(req.body);
	db.collection('dailySales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

zarvich.post('/postLaundry',(req,res)=>{
	console.log(req.body);
	db.collection('laundrySales').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})
//Bulk Add
zarvich.post('/addMany',(req,res)=>{
	console.log(req.body);
	db.collection('dailySales').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

zarvich.post('/addManyClub',(req,res)=>{
	console.log(req.body);
	db.collection('dailySales').insert(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

//Add Halls
zarvich.post('/addHalls',(req,res)=>{
	console.log(req.body);
	db.collection('halls').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

//Get Halls
zarvich.get('/getHalls', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.hallType){
        var hallType = (req.query.hallType)
        query = {hallName:(req.query.hallType)}
    }
    db.collection('halls').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Get hall reservations
zarvich.get('/getHallReservation', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.resavtnID){
        var resavtnID = (req.query.resavtnID)
        query = {hallName:(resavtnID)}
    }
   
    db.collection('FandB').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//update reservation data
zarvich.put('/Hallreservatn/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('FandB').updateOne(
        {_id:id},
        {
            $set: {
                    resID:req.body.resID,
                    fname:req.body.fname,
                    lname:req.body.lname,
                    allDay:req.body.allDay,
                    start:req.body.start,
                    end:req.body.end,
                    title:req.body.title,
                    phone:req.body.phone,
                    room:req.body.room,
                   
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Add Function Posting
zarvich.post('/functionPosts',(req,res)=>{
	console.log(req.body);
	db.collection('FandB').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

//Post Function Food and Drinks
zarvich.post('/foodanddrinks',(req,res)=>{
	console.log(req.body);
	db.collection('FunctionFoodandDrinks').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("Bar Sales Retired")
	})
})

//get Function Food and Drinks
zarvich.get('/getfoodanddrinks', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.orgName && req.query.startDate && req.query.endDate){
        var orgName = (req.query.orgName)
        var startDate = (req.query.startDate)
        var endDate = (req.query.endDate)
        query={'group':(req.query.orgName), transactionDate:{$gte:(req.query.startDate), $lte:(req.query.endDate)}}
    }

    db.collection('FunctionFoodandDrinks').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

PC})



//delete from dailySales

zarvich.delete('/delDSales/:id',(req,res)=>{
    var id = req.params.id
    db.collection('dailySales').deleteOne(
        {refID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//get Daily Sales report
zarvich.get('/salesReport', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    //return Sales WRT Bar
    else if(req.query.BarSales&&req.query.bartoday){
        var BarSales = (req.query.BarSales)
        var bartoday = (req.query.bartoday)
        query={'department':(BarSales),'date':(bartoday)}
    }

    //return Sales WRT Restaurant
    else if(req.query.restSales&&req.query.resttoday){
        var restSales = (req.query.restSales)
        var resttoday = (req.query.resttoday)
        query={'department':(restSales),'date':(resttoday)}
       
    }

    else if(req.query.otherSales&&req.query.othertoday){
        var otherSales = (req.query.otherSales)
        var othertoday = (req.query.othertoday)
        query={'department':(otherSales),'date':(othertoday)}
    }

    else if(req.query.dailypoolsales&&req.query.dailypooltoday){
        var dailypoolsales = (req.query.dailypoolsales)
        var dailypooltoday = (req.query.dailypooltoday)
        query={'department':(dailypoolsales),'date':(dailypooltoday)}
    }

    else if(req.query.clubSales&&req.query.clubtoday){
        var clubSales = (req.query.clubSales)
        var clubtoday = (req.query.clubtoday)
        query={'department':(clubSales),'date':(clubtoday)}
    }

    else if(req.query.LaundrySales&&req.query.laundrytoday){
        var LaundrySales = (req.query.LaundrySales)
        var laundrytoday = (req.query.laundrytoday)
        query={'department':(LaundrySales),'date':(laundrytoday)}
    }

    else if(req.query.gymnasiumSNow&&req.query.gymnasiumtoday){
        var gymnasiumSNow = (req.query.gymnasiumSNow)
        var gymnasiumtoday = (req.query.gymnasiumtoday)
        query={'department':(gymnasiumSNow),'date':(gymnasiumtoday)}
    }

    else if(req.query.smoothiSales&&req.query.smoothietoday){
        var smoothiSales = (req.query.smoothiSales)
        var smoothietoday = (req.query.smoothietoday)
        query={'department':(smoothiSales),'date':(smoothietoday)}
    }

    else if(req.query.swimmingSales&&req.query.swimmingtoday){
        var swimmingSales = (req.query.swimmingSales)
        var swimmingtoday = (req.query.swimmingtoday)
        query={'department':(swimmingSales),'date':(swimmingtoday)}
    }

    else if(req.query.minimartSales&&req.query.marttoday){
        var minimartSales = (req.query.minimartSales)
        var marttoday = (req.query.marttoday)
        query={'department':(minimartSales),'date':(marttoday)}
    }

    else if(req.query.BarbeQueSales&&req.query.bbqtoday){
        var BarbeQueSales = (req.query.BarbeQueSales)
        var bbqtoday = (req.query.bbqtoday)
        query={'department':(BarbeQueSales),'date':(bbqtoday)}
    }

    else if(req.query.shishaSales&&req.query.shishatoday){
        var shishaSales = (req.query.shishaSales)
        var shishatoday = (req.query.shishatoday)
        query={'department':(shishaSales),'date':(shishatoday)}
    }

    else if(req.query.HHSales&&req.query.hhiretoday){
        var HHSales = (req.query.HHSales)
        var hhiretoday = (req.query.hhiretoday)
        query={'department':(HHSales),'date':(hhiretoday)}
    }

    else if(req.query.accDepositReceptn&&req.query.today){
        var accDepositReceptn = (req.query.accDepositReceptn)
        var today = (req.query.today)
        query={'department':(accDepositReceptn),'date':(today)}
    }

    db.collection('dailySales').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

zarvich.get('/getDailyOccuppancy', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.occuppancyToday){
       var occuppancyToday = (req.query.occuppancyToday)
        query={'OccuppancyDate':(occuppancyToday)}
    }

    db.collection('checkinWarehouse').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

zarvich.get('/getReservationBydate', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.selectDate){
       var selectDate = (req.query.selectDate)
        query={'start3':(selectDate)}
    }

    db.collection('reservationData').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

/////STORE//////////

//get Store category
zarvich.get('/storeTypes', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.storeName){
        var storeName = (req.query.storeName)
        query={'categoryName':(req.query.storeName)}
    }

    else if(req.query.catID){
        var catID = (req.query.catID)
        query={'catgoryID':(req.query.catID)}
    }

    db.collection('storeCategories').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })


})

//Post new store category
zarvich.post('/storeTypePost',(req,res)=>{
	console.log(req.body);
	db.collection('storeCategories').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new store created")
	})
})

//Edit category
zarvich.put('/editcategory/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeCategories').updateOne(
        {'catgoryID':id},
        {
            $set: {
                categoryName:req.body.categoryName,
                categoryCode:req.body.categoryCode
                    
                    
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete store category
zarvich.delete('/delcategory/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeCategories').deleteOne(
        {catgoryID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })

})
///////////////////////




////////////////////////

//get storeIssue Depts
zarvich.get('/issueDepts', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.issuedDept){
        var issuedDept = (req.query.issuedDept)
        query={'departmentName':(req.query.issuedDept)}
    }

    else if(req.query.deptID){
        var deptID = (req.query.deptID)
        query={departmentID:(req.query.deptID)}
    }

    db.collection('storeIssueDept').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//get hospitalityfees 
zarvich.get('/feesAndCharges', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.nameOfFee){
        var nameOfFee = (req.query.nameOfFee)
        query={'feesName':(req.query.nameOfFee)}
    }

    else if(req.query.amountInfee){
        var amountInfee = (req.query.amountInfee)
        query={feeAmount:(req.query.amountInfee)}
    }

    else if(req.query.fID){
        var fID = (req.query.fID)
        query={feesID:(fID)}
    }
    else if(req.query.fRate){
        var fRate = (req.query.fRate)
        query={feesRate:(req.query.feesRate)}
    }

    db.collection('hotelslevies').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Post new hospitalityfees 
zarvich.post('/postFees',(req,res)=>{
	console.log(req.body);
	db.collection('hotelslevies').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new dept created")
	})
})

//get roomTypes 
zarvich.get('/roomTypes', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.roomName){
        var roomName = (req.query.roomName)
        query={'roomNames':(req.query.roomName)}
    }

    else if(req.query.roomID){
        var roomID = (req.query.roomID)
        query={'_id':(req.query.roomID)}
    }


    db.collection('roomTypes').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})


//Post new room type
zarvich.post('/newRoom',(req,res)=>{
	console.log(req.body);
	db.collection('roomTypes').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new room type created")
	})
})

//Post new issue Dept
zarvich.post('/newDept',(req,res)=>{
	console.log(req.body);
	db.collection('storeIssueDept').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new dept created")
	})
})

//Edit Dept
zarvich.put('/editdept/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeIssueDepts').updateOne(
        {'departmentID':id},
        {
            $set: {
                    departmentName:req.body.departmentName,
                    
                    
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//Edit hospitalityfees
zarvich.put('/editfees/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('hotelslevies').updateOne(
        {'feesID':id},
        {
            $set: {
                
                feesName:req.body.feesName,
                feesRate:req.body.feesRate
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete issue dept
zarvich.delete('/deldepartment/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeIssueDepts').deleteOne(
        {departmentID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete room type
zarvich.delete('/delRoomType/:id',(req,res)=>{
    var id = req.params.id
    db.collection('roomTypes').deleteOne(
        {typeID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete fees and charges
zarvich.delete('/delFee/:id',(req,res)=>{
    var id = req.params.id
    db.collection('hotelslevies').deleteOne(
        {feesID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//get store units
zarvich.get('/storeUnits', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.actualunits){
        var actualunits = (req.query.actualunits)
        query={'unit':(req.query.actualunits)}
    }

    else if(req.query.storeUnitID){
        var storeUnitID = (req.query.storeUnitID)
        query={'unitsID':(req.query.storeUnitID)}
    }

    db.collection('storeUnitsManager').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Post new store unit
zarvich.post('/newUnit',(req,res)=>{
	console.log(req.body);
	db.collection('storeUnitsManager').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new dept created")
	})
})

//Edit store unit
zarvich.put('/editUnit/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeUnitsManager').updateOne(
        {'unitsID':id},
        {
            $set: {
                unit:req.body.unit,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete issue dept
zarvich.delete('/delUnit/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeUnitsManager').deleteOne(
        {unitsID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})




//Post new product Price
zarvich.post('/pricereview',(req,res)=>{
	console.log(req.body);
	db.collection('storePriceManager').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new dept created")
	})
})

//get product prices Manager
zarvich.get('/pricemanager', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.productprices){
        var productprices = (req.query.productprices)
        query={'productName':(req.query.productprices)}
    }

    else if(req.query.priceID){
        var priceID = (req.query.priceID)
        query={'productID':(req.query.priceID)}
    }

    db.collection('storePriceManager').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Edit price review
zarvich.put('/editpricereview/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storePriceManager').updateOne(
        {'productID':id},
        {
            $set: {
                productName:req.body.productName,
                productPrice:req.body.productPrice,
                productUnit:req.body.productUnit
                    
            }
        },
        
    )
    res.send('data updated')      
  
})


//delete price review
zarvich.delete('/delpricereview/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storePriceManager').deleteOne(
        {productID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//get active product price
zarvich.get('/prices', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.productcode){
        var productcode = (req.query.productcode)
        query={'productID':(req.query.productcode)}
    }

    db.collection('storePrices').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Active Product Price Change
zarvich.delete('/delpricereview/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storePrices').deleteOne(
        {productID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//get vendor
zarvich.get('/vendors', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.venid){
        var venid = (req.query.venid)
        query={'vendorID':(req.query.venid)}
    }

    else if(req.query.name){
        var name = (req.query.name)
        query={'vendorName':(req.query.name)}
    }

    else if(req.query.date){
        var date = (req.query.date)
        query={'dateRegistered':(req.query.date)}
    }

    db.collection('storeVendor').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Post new vendor 
zarvich.post('/addVendor',(req,res)=>{
	console.log(req.body);
	db.collection('storeVendor').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//edit vendor
zarvich.put('/editVendor/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeVendor').updateOne(
        {vendorID:id},
        {
            $set: {
                    vendorName:req.body.vendorName,
                    address:req.body.address,
                    phone:req.body.phone,
                    email:req.body.email,
                    productDescription:req.body.productDescription,
                    dateRegistered:req.body.dateRegistered
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete vendor
zarvich.delete('/delvendor/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeVendor').deleteOne(
        {vendorID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//get product units
zarvich.get('/units', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    db.collection('storeProductUnit').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get store products reg
zarvich.get('/products', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.getproductID){
        var getproductID = (req.query.getproductID)
        query={'productID':(req.query.getproductID)}
    }

    else if(req.query.getreOrderLevel){
        var getreOrderLevel = (req.query.getreOrderLevel)
        query={'reOrderLevel':(req.query.getreOrderLevel)}
    }

    else if(req.query.getcategoryName){
        var getcategoryName = (req.query.getcategoryName)
        query={'categoryName':(req.query.getcategoryName)}
    }

    else if(req.query.uniqueCat){
        var uniqueCat = (req.query.uniqueCat)
        query={'categoryName':(req.query.uniqueCat)}
    }


    else if(req.query.getproductName){
        var getproductName = (req.query.getproductName)
        query={'productName':(req.query.getproductName)}
    }

    else if(req.query.getEntryDate){
        var getEntryDate = (req.query.getEntryDate)
        query={'entryDate':(req.query.getEntryDate)}
    }

    db.collection('storeProductReg').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Register new product 
zarvich.post('/addProduct',(req,res)=>{
	console.log(req.body);
	db.collection('storeProductReg').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//Edit Product reg
zarvich.put('/editproduct/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('storeProductReg').updateOne(
        {'productID':id},
        {
            $set: {
                    productName:req.body.productName,
                    categoryName:req.body.categoryName,
                    catgoryID:req.body.catgoryID,
                    binNum:req.body.binNum,
                    reOrderLevel:req.body.reOrderLevel,
                    entryDate:req.body.entryDate,
                    productUnit:req.body.productUnit,
                    pieces:req.body.pieces,
                    productType:req.body.productType,
                    productTypeID:req.body.productTypeID,
                    productSellingPrice:req.body.productSellingPrice,
                    name:req.body.name,
                    


                    
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete reg product
zarvich.delete('/delProduct/:id',(req,res)=>{
    var id = req.params.id
    db.collection('storeProductReg').deleteOne(
        {'productID':id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.delete('/delBarMenu/:id',(req,res)=>{
    var id = req.params.id
    db.collection('barMenu').deleteOne(
        {'mealName':id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete reg bar Menu
zarvich.delete('/delBarMenu/:id',(req,res)=>{
    var id = req.params.id
    db.collection('barMenu').deleteOne(
        {_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//get store transactions
zarvich.get('/storeTran', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.grvNumber){
        var grvNumber = (req.query.grvNumber)
        query={'grvNum':(req.query.grvNumber)}
    }

    else if(req.query.tranProdName){
        var tranProdName = (req.query.tranProdName)
        query={'productName':(req.query.tranProdName)}
    }

    else if(req.query.categoryIn&&req.query.startDateIn&&req.query.endDateIn){
        var categoryIn = (req.query.categoryIn)
        var startDateIn = (req.query.startDateIn)
        var endDateIn = (req.query.endDateIn)
        query={'categoryName':(categoryIn), transDate:{$gte:(startDateIn), $lte:(endDateIn)}}
    }

    else if(req.query.prodName&&req.query.startDateInProd&&req.query.endDateInProd){
        var prodName = (req.query.prodName)
        var startDateInProd = (req.query.startDateInProd)
        var endDateInProd = (req.query.endDateInProd)
        query={'productName':(prodName), transDate:{$gte:(startDateInProd), $lte:(endDateInProd)}}
    }
    

    else if(req.query.orderNumber){
        var orderNumber = (req.query.orderNumber)
        query={'orderNum':(req.query.orderNumber)}
    }

    else if(req.query.vendorNm){
        var vendorNm = (req.query.vendorNm)
        query={'vendorName':(req.query.vendorNm)}
    }

    else if(req.query.invoiceNumber){
        var invoiceNumber = (req.query.invoiceNumber)
        query={'invoiceNum':(req.query.invoiceNumber)}
    }

    else if(req.query.prodID){
        var prodID = (req.query.prodID)
        query={productID:(req.query.prodID)}
    }

    else if(req.query.suppDt){
        var suppDt = (req.query.suppDt)
        query={supplyDate:(req.query.suppDt)}
    }

    db.collection('stockIn').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

//Post store Transactions 
zarvich.post('/stockInNow',(req,res)=>{
	console.log(req.body);
	db.collection('stockIn').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//Edit Stock In
zarvich.put('/editstockIn/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('stockIn').updateOne(
        {grvNum:id},
        {
            $set: {
                    orderNum:req.body.orderNum,
                    productID:req.body.productID,
                    categoryName:req.body.categoryName,
                    vendorName:req.body.vendorName,
                    vendorID:req.body.vendorID,
                    qtyIn:req.body.qtyIn,
                    productUnit:req.body.productUnit,
                    productPrice:req.body.productPrice,
                    productValue:req.body.productValue,
                    invoiceDate:req.body.invoiceDate,
                    invoiceNum:req.body.invoiceNum,
                    supplyDate:req.body.supplyDate,
                    remark:req.body.remark,
                    transDate:req.body.transDate,
                    productName:req.body.productName
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete stockIn 
zarvich.delete('/delstoreTran/:id',(req,res)=>{
    var id = req.params.id
    db.collection('stockIn').deleteOne(
        {grvNum:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//get stockOut transactions
zarvich.get('/stockOutNow', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.siv){
        var siv = (req.query.siv)
        query={'sivNum':(req.query.siv)}
    }

    else if(req.query.category && req.query.startDateCat && req.query.endDateCat){
        var category = (req.query.category)
        var startDateCat = (req.query.startDateCat)
        var endDateCat = (req.query.endDateCat)
        query={'categoryName':(category), transDate:{$gte:(startDateCat), $lte:(endDateCat)}}
    }

    else if(req.query.prodOutName && req.query.startDateProd && req.query.endDateProd){
        var prodOutName = (req.query.prodOutName)
        var startDateProd = (req.query.startDateProd)
        var endDateProd = (req.query.endDateProd)
        query={'productName':(prodOutName), transDate:{$gte:(startDateProd), $lte:(endDateProd)}}
    }

    else if(req.query.deptOutName && req.query.startDateDept && req.query.endDateDept){
        var deptOutName = (req.query.deptOutName)
        var startDateDept = (req.query.startDateDept)
        var endDateDept = (req.query.endDateDept)
        query={'issueDept':(deptOutName), transDate:{$gte:(startDateDept), $lte:(endDateDept)}}
    }

    else if(req.query.sivProdName){
        var sivProdName = (req.query.sivProdName)
        query={'productName':(req.query.sivProdName)}
    }

    else if(req.query.sivProdID){
        var sivProdID = (req.query.sivProdID)
        query={'productID':(req.query.sivProdID)}
    }

    else if(req.query.sivTranDate){
        var sivTranDate = (req.query.sivTranDate)
        query={'transDate':(req.query.sivTranDate)}
    }

    else if(req.query.sivDept){
        var sivDept = (req.query.sivDept)
        query={'departmentName':(req.query.sivDept)}
    }

    else if(req.query.issDept){
        var issDept = (req.query.issDept)
        query={'issueDept':(req.query.issDept)}
    }

    db.collection('stockOut').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})


//Post stockOut Transactions 
zarvich.post('/postStockOut',(req,res)=>{
	console.log(req.body);
	db.collection('stockOut').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//Post stockOut to BarStore 
zarvich.post('/InnerBarSend',(req,res)=>{
	console.log(req.body);
	db.collection('BarStore').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//get stock from BarStore
zarvich.get('/getBarStore', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.prodNme){
        var prodNme = (req.query.prodNme)
        query={'productName':(req.query.prodNme)}
    }
    
    db.collection('BarStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Post stockOut to BarStore 
zarvich.post('/postBarSalesQty',(req,res)=>{
	console.log(req.body);
   
    db.collection('BarSalesQty').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("new vendor created")
    })
    
	
})

//Post stockOut to RestStore 
zarvich.post('/postRestSalesQty',(req,res)=>{
	console.log(req.body);
   
    db.collection('RestSalesQty').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("new vendor created")
    })
    
	
})

//Post stockOut to PoolBarStore 
zarvich.post('/postPoolBarSalesQty',(req,res)=>{
	console.log(req.body);
   
    db.collection('PoolBarSalesQty').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("new vendor created")
    })
    
	
})

//Post stockOut to PoolBarStore 
zarvich.post('/postClubSalesQty',(req,res)=>{
	console.log(req.body);
   
    db.collection('ClubSalesQty').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("new vendor created")
    })
    
	
})


//get stock from BarStore
zarvich.get('/getBarSalesQty', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.prodNmeQ){
        var prodNmeQ = (req.query.prodNmeQ)
        query={'productName':(req.query.prodNmeQ)}
    }

    else if(req.query.useDate&&req.query.useshift&&req.query.userstaff){
        var useDate = (req.query.useDate)
        var useshift = (req.query.useshift)
        var userstaff = (req.query.userstaff)
        query = {'tranDate':(req.query.useDate), 'shift':(req.query.useshift), 'user':(req.query.userstaff)}
    }
    
    db.collection('BarSalesQty').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get stock from BarStore
zarvich.get('/getRestSalesQty', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.prodNmeR){
        var prodNmeR = (req.query.prodNmeR)
        query={'productName':(req.query.prodNmeR)}
    }

    else if(req.query.useDate&&req.query.useshift&&req.query.userstaff){
        var useDate = (req.query.useDate)
        var useshift = (req.query.useshift)
        var userstaff = (req.query.userstaff)
        query = {'tranDate':(req.query.useDate), 'shift':(req.query.useshift), 'user':(req.query.userstaff)}
    }
    
    db.collection('RestSalesQty').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//get stock from BarStore
zarvich.get('/getLaundrySalesQty', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.prodNmeL){
        var prodNmeL = (req.query.prodNmeL)
        query={'productName':(req.query.prodNmeL)}
    }   

    else if(req.query.useDateL&&req.query.useshiftL&&req.query.userstaffL){
        var useDateL = (req.query.useDateL)
        var useshiftL = (req.query.useshiftL)
        var userstaffL = (req.query.userstaffL)
        query = {'tranDate':(useDateL), 'shift':(useshiftL), 'user':(userstaffL)}
    }
    
    db.collection('LaundrySalesQty').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})



//get stock from PoolBarStore
zarvich.get('/getPoolBarSalesQty', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.prodNmeQ){
        var prodNmeQ = (req.query.prodNmeQ)
        query={'productName':(req.query.prodNmeQ)}
    }

    else if(req.query.useDate&&req.query.useshift&&req.query.userstaff){
        var useDate = (req.query.useDate)
        var useshift = (req.query.useshift)
        var userstaff = (req.query.userstaff)
        query = {'tranDate':(req.query.useDate), 'shift':(req.query.useshift), 'user':(req.query.userstaff)}
    }
    
    db.collection('PoolBarSalesQty').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get stock from PoolBarStore
zarvich.get('/getClubSalesQtyNew', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }

    else if(req.query.clubprodNmeQ){
        var clubprodNmeQ = (req.query.clubprodNmeQ)
        query={'productName':(clubprodNmeQ)}
    }

    else if(req.query.useDate&&req.query.useshift&&req.query.userstaff){
        var useDate = (req.query.useDate)
        var useshift = (req.query.useshift)
        var userstaff = (req.query.userstaff)
        query = {'tranDate':(req.query.useDate), 'shift':(req.query.useshift), 'user':(req.query.userstaff)}
    }
    
    db.collection('ClubSalesQty').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//Post stockOut to PoolBarStore 
zarvich.post('/PoolBarSend',(req,res)=>{
	console.log(req.body);
	db.collection('PoolBarStore').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

zarvich.post('/ClubSend',(req,res)=>{
	console.log(req.body);
	db.collection('clubStore').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//Post stockOut to RestBarStore 
zarvich.post('/RestBarSend',(req,res)=>{
	console.log(req.body);
	db.collection('RestBarStore').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//get stock from RestBarStore
zarvich.get('/getRestBarStore', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.prodNmeRe){
        var prodNmeRe = (req.query.prodNmeRe)
        query={'productName':(req.query.prodNmeRe)}
    }
    
    db.collection('RestBarStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//get stock from RestBarStore
zarvich.get('/getLaundryStore', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.prodNmeLaundry){
        var prodNmeLaundry = (req.query.prodNmeLaundry)
        query={'productName':(req.query.prodNmeLaundry)}
    }
    
    db.collection('LaundryStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//get stock from PoolBarStore
zarvich.get('/getPoolBarStore2', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.prodNme2){
        var prodNme2 = (req.query.prodNme2)
        query={'productName':(req.query.prodNme2)}
    }
    
    db.collection('PoolBarStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get stock from PoolBarStore
zarvich.get('/getClubStore', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    else if(req.query.clubprodNme2){
        var clubprodNme2 = (req.query.clubprodNme2)
        query={'productName':(clubprodNme2)}
    }
    
    db.collection('clubStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Post stockOut to OpenBar Store 
zarvich.post('/OpenBarSend',(req,res)=>{
	console.log(req.body);
	db.collection('OpenBarStore').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("new vendor created")
	})
})

//get stock from OpenBar Store
zarvich.get('/getOpenBarStore', (req,res)=> {
    var query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
    
    db.collection('OpenBarStore').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


//Edit Stock In
zarvich.put('/editstockOut/:id',(req,res)=>{
    console.log(req.params.id);
    var id = (req.params.id)
    db.collection('stockOut').updateOne(
        {grvNum:id},
        {
            $set: {
                    sivNum:req.body.sivNum,
                    productID:req.body.productID,
                    categoryName:req.body.categoryName,
                    departmentName:req.body.departmentName,
                    qtyOut:req.body.qtyOut,
                    productUnit:req.body.productUnit,
                    productPrice:req.body.productPrice,
                    productValue:req.body.productValue,
                    productName:req.body.productName,
                    invoiceNum:req.body.invoiceNum,
                    transDate:req.body.tranDate,
                    
            }
        },
        
    )
    res.send('data updated')      
  
})

//delete stockIn 
zarvich.delete('/delstockOut/:id',(req,res)=>{
    var id = req.params.id
    db.collection('stockOut').deleteOne(
        {productID:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

zarvich.get('/owingGuests', async (req, res) => {
    try {
        const checkinData = db.collection('checkinData');
        const result = await checkinData.aggregate([
            // Join with roomDeposits
            {
                $lookup: {
                    from: "roomDeposits",
                    localField: "refID",
                    foreignField: "refID",
                    as: "deposits"
                }
            },
            { $unwind: { path: "$deposits", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$refID",
                    roomNumbers: { $first: "$roomNumbers" },
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    transactionDate: { $first: "$transactionDate" },
                    totalDeposit: { $sum: {
                        $add: [
                            { $ifNull: [{ $toDouble: "$deposits.POSAmount" }, 0] },
                            { $ifNull: [{ $toDouble: "$deposits.CashAmount" }, 0] },
                            { $ifNull: [{ $toDouble: "$deposits.TransferAmount" }, 0] }
                        ]
                    } }
                }
            },
            // Join with roomPostingData
            {
                $lookup: {
                    from: "roomPostingData",
                    localField: "_id",
                    foreignField: "refID",
                    as: "postings"
                }
            },
            { $unwind: { path: "$postings", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    roomNumbers: { $first: "$roomNumbers" },
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    transactionDate: { $first: "$transactionDate" },
                    totalDeposit: { $first: "$totalDeposit" },
                    totalPosting: { $sum: {
                        $add: [
                            { $ifNull: [{ $toDouble: "$postings.POSAmount" }, 0] },
                            { $ifNull: [{ $toDouble: "$postings.CashAmount" }, 0] },
                            { $ifNull: [{ $toDouble: "$postings.TransferAmount" }, 0] }
                        ]
                    } }
                }
            },
            // Join with FirstNite
            {
                $lookup: {
                    from: "FirstNite",
                    localField: "_id",
                    foreignField: "refID",
                    as: "firstNite"
                }
            },
            { $unwind: { path: "$firstNite", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    roomNumbers: { $first: "$roomNumbers" },
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    transactionDate: { $first: "$transactionDate" },
                    totalDeposit: { $first: "$totalDeposit" },
                    totalPosting: { $first: "$totalPosting" },
                    totalFirstNiteRate: { $sum: { $ifNull: [{ $toDouble: "$firstNite.dailyRate" }, 0] } }
                }
            },
            // Join with grcharges
            {
                $lookup: {
                    from: "grcharges",
                    localField: "_id",
                    foreignField: "refID",
                    as: "charges"
                }
            },
            { $unwind: { path: "$charges", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    roomNumbers: { $first: "$roomNumbers" },
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    transactionDate: { $first: "$transactionDate" },
                    totalDeposit: { $first: "$totalDeposit" },
                    totalPosting: { $first: "$totalPosting" },
                    totalFirstNiteRate: { $first: "$totalFirstNiteRate" },
                    totalChargesRate: { $sum: { $ifNull: [{ $toDouble: "$charges.dailyRate" }, 0] } }
                }
            },
            {
                $addFields: {
                    totalRoomRate: { $add: ["$totalFirstNiteRate", "$totalChargesRate"] }
                }
            },
            {
                $addFields: {
                    guestBalance: {
                        $subtract: [
                            { $toDouble: "$totalDeposit" },
                            { $add: [
                                { $toDouble: "$totalPosting" },
                                { $toDouble: "$totalRoomRate" }
                            ]}
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    refID: "$_id",
                    roomNumbers: 1,
                    fname: 1,
                    lname: 1,
                    transactionDate: 1,
                    totalDeposit: 1,
                    totalPosting: 1,
                    totalRoomRate: 1,
                    guestBalance: 1,
                    
                }
            }
        ]).toArray();

        res.json(result);
    } catch (error) {
        console.error('Error during aggregation:', error.message);
        res.status(500).send(error.message);
    }
});






MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('zarvichHotel');
    zarvich.listen(port, '0.0.0.0',()=>{
        console.log(`listening on port ${port}`)
    })
})




