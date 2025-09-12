// Event Detail Page - Hiển thị chi tiết sự kiện lịch sử Việt Nam

document.addEventListener("DOMContentLoaded", () => {
  loadEventDetail();
});

// Hàm load chi tiết sự kiện
function loadEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  const detailEl = document.getElementById("event-detail-content");

  if (!eventId) {
    detailEl.innerHTML = `
      <div class="alert alert-warning" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        Không tìm thấy ID sự kiện trong URL.
      </div>
    `;
    return;
  }

  fetch("events.json")
    .then((res) => {
      if (!res.ok) throw new Error("Không tải được events.json");
      return res.json();
    })
    .then((events) => {
      // Tìm sự kiện theo ID
      const event = events.find((e) => e.id.toString() === eventId);
      
      if (!event) {
        detailEl.innerHTML = `
          <div class="alert alert-danger" role="alert">
            <i class="fas fa-times-circle"></i>
            Không tìm thấy sự kiện có ID: ${eventId}
          </div>
        `;
        return;
      }
      
      // Hiển thị chi tiết sự kiện
      detailEl.innerHTML = `
        <div class="row">
          <div class="col-md-8 offset-md-2">
            <div class="card shadow-lg">
              <img src="${event.event_img}" class="card-img-top" alt="${event.event_title}" style="height: 400px; object-fit: cover; width: 100%;">
              <div class="card-body">
                <h1 class="card-title text-center mb-3">${event.event_title}</h1>
                <div class="text-center mb-4">
                  <span class="badge bg-danger fs-6">
                    <i class="fas fa-calendar-alt"></i> ${event.event_date}
                  </span>
                </div>
                <div class="event-content">
                  <p class="lead text-justify" style="line-height: 1.8; text-align: justify;">
                    ${event.event_content}
                  </p>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                  <button class="btn btn-outline-danger" onclick="addToFavorites({
                    year: '${event.event_date}', 
                    text: '${event.event_title}: ${event.event_content.substring(0, 100)}...'
                  })">
                    <i class="fas fa-heart"></i> Thêm vào yêu thích
                  </button>
                  <button class="btn btn-outline-secondary" onclick="shareEvent('${event.event_title}', '${window.location.href}')">
                    <i class="fas fa-share-alt"></i> Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .catch((err) => {
      console.error("Lỗi khi tải sự kiện:", err);
      detailEl.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-circle"></i>
          Lỗi khi tải chi tiết sự kiện. Vui lòng thử lại sau.
        </div>
      `;
    });
}

// Hàm thêm vào yêu thích (sử dụng lại từ main.js)
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

// Hàm chia sẻ sự kiện
function shareEvent(title, url) {
  if (navigator.share) {
    navigator.share({
      title: `Sự kiện lịch sử: ${title}`,
      text: `Khám phá sự kiện lịch sử thú vị: ${title}`,
      url: url
    }).catch((error) => {
      console.log('Lỗi khi chia sẻ:', error);
      fallbackShare(title, url);
    });
  } else {
    fallbackShare(title, url);
  }
}

// Fallback share function
function fallbackShare(title, url) {
  const textToCopy = `Sự kiện lịch sử: ${title} - ${url}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Đã sao chép link sự kiện vào clipboard!');
    }).catch(() => {
      promptCopyText(textToCopy);
    });
  } else {
    promptCopyText(textToCopy);
  }
}

function promptCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    alert('Đã sao chép link sự kiện!');
  } catch (err) {
    alert(`Link sự kiện: ${text}`);
  }
  document.body.removeChild(textarea);
}
