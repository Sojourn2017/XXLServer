axios
.post("/users/playerStatis", {
  openid: 'test',
  timeStart: 1556172020000,
  timeEnd: 1556349080000
})
.then(console.log)
.catch(console.log);