// Kiểm tra người dùng đăng nhập và lấy dữ liệu yêu thích
auth.onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    db.collection("favorites")
      .where("uid", "==", uid)
      .get()
      .then((querySnapshot) => {
        const container = document.getElementById("favorite-events");
        if (querySnapshot.empty) {
          container.innerHTML = "<p>Bạn chưa có sự kiện nào được lưu.</p>";
          return;
        }
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const div = document.createElement("div");
          div.className = "col-md-6";
          div.innerHTML = `
                <div class="event-card border p-3 mb-4 shadow-sm">
                  <h4>${data.text}</h4>
                  <p><strong>Năm:</strong> ${data.year}</p>
                  <button class="btn btn-danger btn-sm" onclick="deleteFavorite('${doc.id}')">Xóa khỏi yêu thích</button>
                </div>
              `;
          container.appendChild(div);
        });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  } else {
    document.getElementById("favorite-events").innerHTML =
      "<p>Vui lòng đăng nhập để xem bộ sưu tập.</p>";
  }
});

function deleteFavorite(docId) {
  db.collection("favorites")
    .doc(docId)
    .delete()
    .then(() => {
      alert("Đã xóa sự kiện khỏi yêu thích.");
      location.reload();
    })
    .catch((err) => {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể xóa sự kiện.");
    });
}
