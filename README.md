# NestJS-Socket-Backend

## Description
Uzi Chat is a chatroom service in a which a user can sign into their previously created account and join or create a new chatroom that other users can join to chat with each other.

## Technical side
The backend will have a socket and just 3 endpoints
- `/auth/signup` : to create a new user account. 

  The request will contain:
  + `fullName`
  + `username`
  + `password`

  then the user will be saved in a mongodb database with the above fields and a randomly assigned avatar profile picture. ( the password will be hashed, of course! )
  
- `/auth/login`: to login a user to know who is sending the messages.

  The request will contain:
  + `username`
  + `password`

  The response will contain: 
  + `success`: a boolean value to indicate the status of the response
  + `token`: if the user is successfully authenticated, a jwt token will be generated.
  + `message`: if there is an error.


Then the rest of the requests will be handled by the `socket.io`. Here are some of the events to handle:
* `create_room`: new room will be created with the `room_name` property in the `data` object and then assigned a `room_id`. Then a `new_room_created` event will be broadcasted.

* `join_room`: logged in user will be added to `room_id` specified in the `data` object of the event.

* `new_room_created`: for when a "new room is created". 

* `user_joined`: for when a user joins a specific room.

* `leave_room`: for when a user requests to leave a room.

* `user_left`: for when a user leaves a specific room.

* `message_sent`: for when a user sends a message to a certain room.

* `new_message`: broadcasted by server to the room members to know that a user sent a message.
