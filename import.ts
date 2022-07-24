const token = prompt("token");
if (token) {
  localStorage.setItem("token", token);
}
const lastId = prompt("lastId");
if (lastId) {
  localStorage.setItem("lastId", lastId);
}
