function sendPredictionRequest(image) {
    const base64Image = image.split(',')[1]; // Tách phần dữ liệu base64

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "image": base64Image }) // Gửi ảnh dưới dạng JSON
    })
        .then(response => response.json())
        .then(data => {
            const resultContainer = document.getElementById("result-container");
            resultContainer.innerHTML = ""; // Xóa nội dung trước đó

            if (data.success === false) {
                // Trường hợp ảnh không phải là da người
                resultContainer.innerHTML = `
                    <h3>Kết quả kiểm tra:</h3>
                    <p>${data.message || "Ảnh không được nhận diện là da người."}</p>`;
            } else if (data.success === true) {
                // Trường hợp ảnh là da người và có dự đoán bệnh
                if (data.predictions) {
                    let resultsHTML = `
                        <h3>Kết quả kiểm tra:</h3>
                        <p>Ảnh được nhận diện là <b>da người</b>.</p>
                        <h4>Phân tích bệnh da liễu:</h4>
                        <ul>`;

                    for (const [disease, confidence] of Object.entries(data.predictions)) {
                        const confidenceValue = parseFloat(confidence); // Đảm bảo chuyển thành số
                        if (!isNaN(confidenceValue)) {
                            resultsHTML += `<li>${disease}: ${confidenceValue.toFixed(2)}%</li>`;
                        }
                    }
                    resultsHTML += `</ul>`;
                    resultContainer.innerHTML = resultsHTML;
                } else {
                    resultContainer.innerHTML = `
                        <h3>Kết quả kiểm tra:</h3>
                        <p>Ảnh được nhận diện là <b>da người</b>.</p>
                        <p>Không tìm thấy thông tin dự đoán bệnh.</p>`;
                }
            } else {
                resultContainer.innerHTML = `
                    <h3>Lỗi:</h3>
                    <p>Dữ liệu phản hồi từ server không hợp lệ.</p>`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Đã có lỗi xảy ra! Vui lòng thử lại.");
        });
}
