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
      if (user.role.includes("admin")) {
        window.location.href = "admin.html";
      } else {
        let user = userCredential.user;
        alert("Đăng nhập thành công");
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      alert("Email hoặc mật khẩu không đúng");
    });
});
