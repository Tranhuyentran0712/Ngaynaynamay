document.getElementById("searchBtn").addEventListener("click", searchEvent);
document.getElementById("dateInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchEvent();
  }
});

function searchEvent() {
  const input = document.getElementById("dateInput").value.trim();
  const resultDiv = document.getElementById("eventResult");
  resultDiv.innerHTML = "<p>Đang tìm kiếm sự kiện...</p>";

  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = input.match(regex);

  if (!match) {
    resultDiv.innerHTML = `<p class="text-danger">Vui lòng nhập ngày đúng định dạng: dd/mm/yyyy</p>`;
    return;
  }

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);

  fetch(
    `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
  )
    .then((res) => res.json())
    .then((data) => {
      const events = data.events;
      const vnEvents = events.filter(
        (event) =>
          event.text.toLowerCase().includes("việt nam") ||
          event.text.toLowerCase().includes("vietnam")
      );

      if (vnEvents.length === 0) {
        resultDiv.innerHTML = `<p>Không tìm thấy sự kiện lịch sử Việt Nam cho ngày ${input}.</p>`;
        return;
      }

      resultDiv.innerHTML = `<h5 class="mb-3">Sự kiện đã diễn ra vào ngày ${day}/${month}:</h5>`;
      vnEvents.forEach((event) => {
        const eventHTML = `
            <div class="border-start border-3 border-danger ps-3 mb-3">
              <strong>${event.year}</strong>: ${event.text}
              <br>
              <button class="btn btn-sm btn-outline-danger mt-2" onclick='addToFavorites(${JSON.stringify(
                {
                  year: event.year,
                  text: event.text,
                }
              )})'> Thêm vào yêu thích</button>
            </div>`;
        resultDiv.innerHTML += eventHTML;
      });
    })
    .catch((error) => {
      console.error(error);
      resultDiv.innerHTML = `<p class="text-danger">Lỗi khi lấy dữ liệu từ Wikipedia.</p>`;
    });
}

// Hàm lưu vào Firestore
function addToFavorites(eventData) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Vui lòng đăng nhập để sử dụng chức năng này.");
    return;
  }

  db.collection("favorites")
    .add({
      uid: user.uid,
      year: eventData.year,
      text: eventData.text,
      addedAt: new Date(),
    })
    .then(() => {
      alert("Đã thêm vào bộ sưu tập yêu thích!");
    })
    .catch((error) => {
      console.error("Lỗi khi thêm vào yêu thích:", error);
      alert("Lưu thất bại. Vui lòng thử lại.");
    });
}
// firebase.auth().onAuthStateChanged((user) => {
//   const loginBtn = document.querySelector(".nav_login_btn");

//   if (loginBtn) {
//     if (user) {
//       // Nếu đã đăng nhập -> hiện icon user
//       loginBtn.innerHTML = '<i class="fas fa-user"></i>';
//       loginBtn.setAttribute("href", "./user.html");
//       loginBtn.classList.add("user-icon");
//     } else {
//       // Nếu chưa đăng nhập -> hiện chữ Đăng nhập
//       loginBtn.innerHTML = "Đăng nhập";
//       loginBtn.setAttribute("href", "./dangnhap.html");
//       loginBtn.classList.remove("user-icon");
//     }
//   }
// });
