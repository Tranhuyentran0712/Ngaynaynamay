const inpEmail = document.getElementById("inp-email-login");
const inpPwd = document.getElementById("inp-pwd-login");

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  let email = inpEmail.value.toLowerCase();
  let password = inpPwd.value;

  if (!email || !password) {
    alert("Vui lòng điền đủ các trường");
    return;
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      alert("Đăng nhập thành công");
      window.location.href = "index.html";
      localStorage.setItem("user_session", JSON.stringify(user));
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Mật khẩu không đúng");
    });
});
