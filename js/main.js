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

  // Kiểm tra định dạng dd/mm/yyyy
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

      // Lọc các sự kiện có liên quan đến Việt Nam (có thể viết tiếng Việt hoặc Vietnam)
      const vnEvents = events.filter(
        (event) =>
          event.text.toLowerCase().includes("việt nam") ||
          event.text.toLowerCase().includes("vietnam")
      );

      if (vnEvents.length === 0) {
        resultDiv.innerHTML = `<p>Không tìm thấy sự kiện lịch sử Việt Nam cho ngày ${input}.</p>`;
        return;
      }

      resultDiv.innerHTML = `<h5 class="mb-3">Sự kiện đã diễn ra vào ngày ${input} là :</h5>`;
      vnEvents.forEach((event) => {
        resultDiv.innerHTML += `
          <div class="border-start border-3 border-danger ps-3 mb-3">
            <strong>${event.year}</strong>: ${event.text}
          </div>`;
      });
    })
    .catch((error) => {
      console.error(error);
      resultDiv.innerHTML = `<p class="text-danger">Lỗi khi lấy dữ liệu từ Wikipedia.</p>`;
    });
}
