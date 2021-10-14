const express = require("express");

const port = 3001;
const app = express();

app.use(express.json());

//client can create a initial rooms 
// or customer cdan create their own room with the features they wanted and will be charged so
// so provided the room[]
let rooms = [];
//stores all the booking info 
let booking_info = [];

//stores all the customer data who booked the room
let customer_data = [];

//get all rooms data and their status
app.get ("/", (req, res) => {
  res.send(rooms);
});

//get all the booked data
app.get ("/booked_data", (req, res) => {
  if (booking_info.length === 0) {
    res.send("No rooms booked yet");
  } else {
    res.send(booking_info);
  }
});

//push the required cuatomer data in customer data info []
async function customer() {
  booking_info.forEach((item) => {
    customer_data.push({
      room_id: item.room_id,
      customer_name: item.customer_name,
      date: item.dates,
      start_time: item.start_time,
      end_time: item.end_time,
    });
  });
}

//route to get customer data
app.get ("/customer_data", (req, res) => {
  if (booking_info.length === 0) {
    res.status(200).send("no customer data is available,book room");
  } else {
    customer();
  }
  res.status(200).send(customer_data);
});

//route for creating the room
//data to be sent in req body
// {
//     "seats" :24000,
//     "amenities" : "aewedelyr",
//     "rent" : 850
//  }
app.post ("/create-room", (req, res) => {
  const createRoom = req.body;
  rooms.push({
    seats_available: createRoom.seats,
    amenities: createRoom.amenities,
    rent: createRoom.rent,
    status: "pending",
    room_id: rooms.length + 1,
  });
  res.send(rooms);
  console.log(rooms);
});


//route to book the room
//data to be sent in req body
// {
//     "customer_name" :"suraj",
//     "dates" : "10/3/2021" ,
//     "start_time" : "2.00 am",
//     "end_time" : "4.00 am",
//     "room_id" : 1
//   }
app.post ("/book_room", (req, res) => {
  //checking wether room is booked or not
  rooms.forEach((rooms) => {
    if (rooms.room_id === req.body.room_id && rooms.status === "pending") {
      booking_info.push({ ...req.body, booked_status: "booked" });
      res.status(200).send(" Your room is booked");
      rooms.status = "booked";
      console.log(rooms);
    } else if (
      //check the avalability of the room for the next day
      rooms.room_id === req.body.room_id &&
      rooms.status === "booked"
    ) {
      async function check() {
        let pure = booking_info.filter((item) => {
          if (item.dates === req.body.dates) {
            return item;
          } else {
            return;
          }
        });
        //if room is allready booked
        if (pure.length > 0) {
          res.send("room is already booked on same date");
        } else {
          booking_info.push({ ...req.body, booked_status: "booked" });
          res.send(`room is booked on ${req.body.dates}`);
        }
      }
      check();
    }
  });
});

//running the server
app.listen(port, () => {
  console.log("server started suraj");
});




