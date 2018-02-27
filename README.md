# parking-app-server

### Main address: https://parking-app-server.herokuapp.com/

### Errors
All the errors are in the following form:
```javascript
{
  "error": message
}
```

### API:
POST: /api/signup  
Requires: login, password  
Returns:  
```javascript
user = {
  "login": "SomeLogin",
  "image": "DummyImageUrl",
  "_id": "SomeId"
}
```

POST: /api/login  
Requires: login, password  
Returns:  
```javascript
user = {
  "login": "SomeLogin",
  "image": "DummyImageUrl",
  "_id": "SomeId"
}
```

POST: /api/updateuserpassword  
Requires: id, password, newpassword  
Returns:  
```javascript
user = {
  "login": "SomeLogin",
  "image": "DummyImageUrl",
  "_id": "SomeId"
}
```

POST: /api/updateuserlogin  
Requires: id, login  
Returns:  
```javascript
user = {
  "login": "SomeLogin",
  "image": "DummyImageUrl",
  "_id": "SomeId"
}
```
GET: /api/parking-places   
Returns the list of parking places:  
```javascript
[{
  "id": id,
  "address":"Some Address",
  "type":"instant/long-term",
  "price":2,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"SomeUser",
  "description":"Really nice spot not far from shop !"
},...]
```

GET: /api/add-place/:id  
Adds a parking place to myPlaces array
Returns:
```javascript
{
  "result": "success"
}
```

GET: /api/my-places
Returns own parking places:
```javascript
[{
  "id": id,
  "address":"Some Address",
  "type":"instant/long-term",
  "price":2,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"SomeUser",
  "description":"Really nice spot not far from shop !"
},...]
```

POST: /api/add-new-place
Creates a new parking place
Requires:
```javascript
{
  "address":"Some Address",
  "type":"instant/long-term",
  "price":2,
  "start_date":"20.2.2018",
  "end_date":"3.3.2018",
  "start_time":"8:00",
  "end_time":"16:00",
  "username":"SomeUser",
  "description":"Really nice spot not far from shop !"
}
```
Returns:
```javascript
{
  "result": "success"
}
```
