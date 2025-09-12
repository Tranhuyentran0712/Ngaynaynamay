document.getElementById("searchBtn").addEventListener("click", searchEvent);
document.getElementById("dateInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchEvent();
  }
});

async function searchEvent() {
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
  const year = parseInt(match[3]);

  try {
    // Tìm kiếm trong database Firebase trước
    const firebaseResults = await searchEventsInFirebase(input);
    
    // Tìm kiếm từ Wikipedia API song song
    const wikipediaResults = await searchEventsInWikipedia(month, day);
    
    // Kết hợp kết quả
    displaySearchResults(firebaseResults, wikipediaResults, input, day, month);
    
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sự kiện:', error);
    resultDiv.innerHTML = `<p class="text-danger">Lỗi khi tìm kiếm sự kiện. Vui lòng thử lại.</p>`;
  }
}

// Tìm kiếm sự kiện trong Firebase
async function searchEventsInFirebase(dateString) {
  try {
    const snapshot = await db.collection('events')
      .where('event_date', '==', dateString)
      .get();
    
    const results = [];
    snapshot.forEach(doc => {
      results.push(doc.data());
    });
    
    return results;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm trong Firebase:', error);
    return [];
  }
}

// Tìm kiếm sự kiện từ Wikipedia
async function searchEventsInWikipedia(month, day) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
    );
    
    if (!response.ok) {
      throw new Error('Lỗi khi gọi Wikipedia API');
    }
    
    const data = await response.json();
    const vnEvents = data.events.filter(
      (event) =>
        event.text.toLowerCase().includes("việt nam") ||
        event.text.toLowerCase().includes("vietnam")
    );
    
    return vnEvents;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm Wikipedia:', error);
    return [];
  }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(firebaseResults, wikipediaResults, input, day, month) {
  const resultDiv = document.getElementById("eventResult");
  
  if (firebaseResults.length === 0 && wikipediaResults.length === 0) {
    resultDiv.innerHTML = `
      <div class="alert alert-info" role="alert">
        <i class="fas fa-info-circle"></i>
        Không tìm thấy sự kiện lịch sử Việt Nam cho ngày ${input}.
      </div>
    `;
    return;
  }

  let resultsHTML = `<h5 class="mb-3">Sự kiện đã diễn ra vào ngày ${day}/${month}:</h5>`;

  // Hiển thị kết quả từ Firebase trước (sự kiện Việt Nam)
  if (firebaseResults.length > 0) {
    resultsHTML += `<h6 class="text-danger mb-3"><i class="fas fa-star"></i> Sự kiện lịch sử Việt Nam:</h6>`;
    
    firebaseResults.forEach(event => {
      resultsHTML += `
        <div class="card mb-3 border-danger">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <img src="${event.event_img}" alt="${event.event_title}" 
                     class="img-fluid rounded" style="height: 100px; object-fit: cover; width: 100%;">
              </div>
              <div class="col-md-9">
                <h6 class="card-title text-danger">${event.event_title}</h6>
                <p class="card-text">${event.event_content.substring(0, 150)}...</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">Ngày: ${event.event_date}</small>
                  <div>
                    <button class="btn btn-sm btn-outline-danger" onclick="addToFavorites({
                      year: '${event.event_date}', 
                      text: '${event.event_title}'
                    })">Thêm vào yêu thích</button>
                    <a href="events.html?id=${event.id}" class="btn btn-sm btn-outline-info">
                      <i class="fas fa-eye"></i> Xem thêm
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Hiển thị kết quả từ Wikipedia
  if (wikipediaResults.length > 0) {
    if (firebaseResults.length > 0) {
      resultsHTML += `<h6 class="text-info mb-3 mt-4"><i class="fas fa-globe"></i> Sự kiện quốc tế liên quan Việt Nam:</h6>`;
    }
    
    wikipediaResults.forEach(event => {
      resultsHTML += `
        <div class="border-start border-3 border-info ps-3 mb-3">
          <strong>${event.year}</strong>: ${event.text}
          <br>
          <button class="btn btn-sm btn-outline-danger mt-2" onclick='addToFavorites(${JSON.stringify({
            year: event.year,
            text: event.text,
          })})'>
            <i class="fas fa-heart"></i> Thêm vào yêu thích
          </button>
        </div>
      `;
    });
  }

  resultDiv.innerHTML = resultsHTML;
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
// Load featured events from Firebase on page load
document.addEventListener('DOMContentLoaded', function() {
  loadFeaturedEvents();
});

// Load sự kiện nổi bật từ Firebase
async function loadFeaturedEvents() {
  try {
    // Lấy 3 sự kiện mới nhất từ Firebase
    const snapshot = await db.collection('events')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get();
    
    if (!snapshot.empty) {
      updateFeaturedEventsDisplay(snapshot);
    } else {
      console.log('Không có sự kiện nào trong database.');
    }
  } catch (error) {
    console.error('Lỗi khi tải sự kiện nổi bật:', error);
    // Giữ lại static events nếu có lỗi
  }
}

// Cập nhật hiển thị sự kiện nổi bật
function updateFeaturedEventsDisplay(snapshot) {
  const events = [];
  snapshot.forEach(doc => {
    events.push(doc.data());
  });
  
  // Tìm các card hiện tại
  const cardContainers = document.querySelectorAll('.events-section .col-md-4');
  
  events.forEach((event, index) => {
    if (index < cardContainers.length && cardContainers[index]) {
      const cardContainer = cardContainers[index];
      const cardBody = cardContainer.querySelector('.card-body');
      
      if (cardBody) {
        // Cập nhật hình ảnh
        const img = cardContainer.querySelector('.card-img-top');
        if (img) {
          img.src = event.event_img;
          img.alt = event.event_title;
        }
        
        // Cập nhật nội dung
        cardBody.innerHTML = `
          <h5 class="card-title">${event.event_title}</h5>
          <p class="card-text">Thời gian: ${event.event_date}</p>
          <a href="events.html?id=${event.id}" class="btn btn-outline-danger btn-sm">
            <i class="fas fa-eye"></i> Xem thêm
          </a>
        `;
      }
    }
  });
}
