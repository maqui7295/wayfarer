FORMAT: 1A
HOST: http://localhost.4000/api/v1

# Way Farer

WayFarer is a public bus transportation booking server. You can view this documentation over at [Apiary](http://docs.pollsapi.apiary.io).

# Way Farer API Root [/]

This resource does not have any attributes. Instead it offers the initial API affordances in the form of the links in the JSON body.

It is recommend to follow the "url" link values, [Link](https://tools.ietf.org/html/rfc5988) or Location headers where applicable to retrieve resources. Instead of constructing your own URLs, to keep your client decoupled from implementation details.

## Group Authentication

Resources related to authentication in the API.

## Authentication

## signup [/auth/signup]

### create a user [POST]

You may create your own question using this action. It takes a JSON object containing a question and a collection of answers in the form of choices.

+ email (string) - The email of the new user
+ password (string) - The password of the new user
+ first_name (string) - The first name of the new user
+ last_name (string) - The last name of the new user

+ Request (application/json)

        {
            "email": "example@example.com",
            "password": "secret",
            "first_name": "John",
            "last_name": "Doe",
        }

+ Response 201 (application/json)

    + Headers

            Location: /questions/2

    + Body

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

+ email (string) - The email of the new user
+ password (string) - The password of the new user

+ Response 200 (application/json)

    + Headers

            Location: /questions/2

    + Body

            {
                "status": "success",
                "data": {
                    "user_id": integer,
                    "is_admin: boolean,
                    "token": string
                }
               
            }

## Group Trips

## Trips [/trips]

<!-- + Parameters
    + question_id: 1 (required, number) - ID of the Question in form of an integer
    + choice_id: 1 (required, number) - ID of the Choice in form of an integer -->

### Create a new trip [POST]

This action allows you to create a new trip

+ token (string) - The token of the user
+ user_id (integer) - The id of the user
+ is_admin (boolean) - The status of the user

+ Response 201 (application/json)

    + Headers

            Location: /questions/2

    + Body

            {
                "status": "success",
                "data": {
                    "trip_id": integer,
                    "bus_id": integer,
                    "origin": string,
                    "destination": string,
                    "trip_date": date,
                    "fare": float
                }
               
            }

### List All Trips [GET]

+ Response 200 (application/json)

    + Headers

            Link: </trips?origin="origin">; rel="next"

    + Body

            {
              "status": "success",
                "data": [
                    {
                        "trip_id": integer,
                        "bus_id": integer,
                        "origin": string,
                        "destination": string,
                        "trip_date": date,
                        "fare": float
                    },
                    {
                        "trip_id": integer,
                        "bus_id": integer,
                        "origin": string,
                        "destination": string,
                        "trip_date": date,
                        "fare": float
                    },

                ]
            }