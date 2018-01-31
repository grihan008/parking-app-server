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
