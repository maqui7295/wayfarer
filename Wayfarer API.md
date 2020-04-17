FORMAT: 1A
HOST: http://localhost.4000/api/v1

# Way Farer

WayFarer is a public bus transportation booking server. You can view this documentation over at [Wayfarer](http://docs.pollsapi.apiary.io).

# Way Farer API Root [/api/v1]

This resource does not have any attributes. Instead it offers the initial API affordances in the form of the links in the JSON body.

It is recommend to follow the "url" link values, [Link](https://tools.ietf.org/html/rfc5988) or Location headers where applicable to retrieve resources. Instead of constructing your own URLs, to keep your client decoupled from implementation details.

## Group Authentication

Resources related to authentication in the API.

## Authentication

## signup [/auth/signup]

### create a user [POST]

You may create your own question using this action. It takes a JSON object containing a question and a collection of answers in the form of choices.

- email (string) - The email of the new user
- password (string) - The password of the new user
- first_name (string) - The first name of the new user
- last_name (string) - The last name of the new user

- Request (application/json)

        {
            "email": "example@example.com",
            "password": "secret",
            "first_name": "John",
            "last_name": "Doe",
        }

- Response 201 (application/json)

  - Body

          {
              "status": "success",
              "data": {
                  "user_id": integer,
                  "is_admin: boolean,
                  "token": string
              }

          }

## signin [/auth/signin]

### login a user [POST]

The user object should the following attributes:

- email (string) - The email of the new user
- password (string) - The password of the new user

- Request (application/json)

        {
            "email": "example@example.com",
            "password": "secret"
        }

- Response 200 (application/json)

  - Body

          {
              "status": "success",
              "data": {
                  "user_id": integer,
                  "is_admin: boolean,
                  "token": string,
                  "auth": boolean
              }

          }

## Group Trips

## Trips [/trips]

### Create a new trip [POST]

This action allows you to create a new trip

- token (string) - The token of the user
- user_id (integer) - The id of the user
- is_admin (boolean) - The status of the user (only admins can create trips)

- Request (application/json)

        {
            "user_id": "integer",
            "is_admin": "boolean",
            "token": "string",
            "trip_id": integer,
            "bus_id": integer,
            "origin": string,
            "destination": string,
            "trip_date": date,
            "fare": float
        }

- Response 201 (application/json)

  - Body

          {
              "status": "success",
              "data": {
                  "trip_id": integer,
                  "bus_id": integer,
                  "origin": string,
                  "destination": string,
                  "trip_date": date,
                  "fare": float,
                  "status": boolean,  <!-- 1 == active, 0 == cancelled -->
                  ...
              }

          }

## Trips Collection [/trips{?origin&destination}]

- Parameters
  - origin: "" (optional, string) - Filter trips based on origin
  - destination: "" (optional, string) - Filter trips based on destination
  - origin and destination: "" (optional, string) - Filter trips based on origin and destination

### List All Trips [GET]

- Request (application/json)

        {
            "user_id": "integer",
            "bus_id": "boolean",
            "token": "string",
        }

- Response 200 (application/json)

  - Headers

        Link: </trips?origin="benin">; rel="next"
        Link: </trips?destination="lagos">; rel="next"
        Link: </trips?origin="benin"&destination="lagos">; rel="next"

  - Body

          {
            "status": "success",
              "data": [
                  {
                      "trip_id": integer,
                      "bus_id": integer,
                      "origin": string,
                      "destination": string,
                      "trip_date": date,
                      "fare": float,
                      "status": boolean,
                      ...
                  },
                  {
                      "trip_id": integer,
                      "bus_id": integer,
                      "origin": string,
                      "destination": string,
                      "trip_date": date,
                      "fare": float,
                      "status": boolean,
                      ...
                  },

              ]
          }

## Trips [/trips/{tripId}]

### Cancel a trip [PATCH]

- Parameters

  - tripId: 1 (required, integer) - ID of the trip to be cancelled

- Response 200 (application/json)

        {
            "status": "success",
            "data":
                {
                   "message": "Trip cancelled successfully"
                }
        }

## Group Bookings

## Bookings [/bookings]

### Book a trip [POST]

This action allows the user to book a new trip

- token (string) - The token of the user
- user_id (integer) - The id of the user
- trip_id (integer) - The id of the user
- seat_number (integer) - The id of the user

- Request (application/json)

        {
            "user_id": "integer",
            "token": "string",
            "trip_id": integer,
            "seat_number": integer
        }

- Response 201 (application/json)

  - Body

          {
              "status": "success",
              "data": {
                    "id": 1,
                    "trip_id": integer,
                    "user_id": integer,
                    "seat_number": integer,
                    "created_at": date,
                    "bus_id": integer,
                    "first_name": string,
                    "last_name": string,
                    "email": string
              }

          }

## Bookings Collection [/bookings]

### List All User bookings [GET]

- Request (application/json)

        {
            "user_id": "integer",
            "bus_id": "boolean",
            "token": "string",
        }

- Response 200 (application/json)

  - Body

          {
            "status": "success",
              "data": [
                  {
                    "id": 1,
                    "trip_id": integer,
                    "user_id": integer,
                    "seat_number": integer,
                    "created_at": date,
                    "bus_id": integer,
                    "first_name": string,
                    "last_name": string,
                    "email": string
                  },
                  {
                    "id": 1,
                    "trip_id": integer,
                    "user_id": integer,
                    "seat_number": integer,
                    "created_at": date,
                    "bus_id": integer,
                    "first_name": string,
                    "last_name": string,
                    "email": string
                  },

              ]
          }

## Bookings [/bookings/{bookingId}]

### Delete a booking [DELETE]

- Parameters

  - bookingId: 1 (required, integer) - ID of the booking to be deleted

- Request (application/json)

        {
            "user_id": "integer",
            "bus_id": "boolean",
            "token": "string",
        }

- Response 200 (application/json)

        {
            "status": "success",
            "data":
                {
                   "message": "Booking deleted successfully"
                }
        }

## Bookings (change seats) [/bookings/{bookingId}]

### Change seats [PATCH]

- Parameters

  - bookingId: 1 (required, integer) - ID of the booking to be changed

- Request (application/json)

        {
            "user_id": "integer",
            "bus_id": "boolean",
            "token": "string",
            "trip_id": "integer",
            "old_seat_number": "integer",
            "new_seat_number": "integer"
        }

- Response 200 (application/json)

        {
            "status": "success",
            "data":
                {
                   "message": "Seat changed successfully"
                }
        }
