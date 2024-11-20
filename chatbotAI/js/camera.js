let currentImage = null; // Ảnh hiện tại
let captureInterval = null;

// Mở camera khi bấm nút "Dùng Camera"
document.getElementById("use-camera-btn").addEventListener("click", function () {
    // Ẩn nút chọn ảnh và hiển thị camera
    document.getElementById("upload-image").style.display = "none";
    document.getElementById("image-container").style.display = "none";
    document.getElementById("camera-container").style.display = "block";

    // Dừng chức năng chọn ảnh từ máy
    document.getElementById("upload-image").value = ""; // Xoá file đã chọn nếu có

    // Yêu cầu truy cập camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.getElementById("camera");
            video.srcObject = stream;
            video.play();
            window.stream = stream; // Lưu stream để tắt sau

            // Chụp ảnh mỗi giây (tuỳ chọn)
            captureInterval = setInterval(captureImage, 1000);
        })
        .catch(err => {
            console.error("Không thể truy cập camera: ", err);
            alert("Lỗi khi truy cập camera.");
        });
});

// Chọn ảnh từ máy
document.getElementById("choose-file-btn").addEventListener("click", function () {
    // Tắt camera nếu đang bật
    if (window.stream) {
        const tracks = window.stream.getTracks();
        tracks.forEach(track => track.stop());
        window.stream = null; // Reset stream
    }
    if (captureInterval) clearInterval(captureInterval);

    // Ẩn camera và hiển thị nút chọn ảnh
    document.getElementById("camera-container").style.display = "none";

    // Hiển thị input file
    //document.getElementById("upload-image").style.display = "block";
    document.getElementById("upload-image").click();

    document.getElementById("upload-image").onchange = function () {
        const file = document.getElementById("upload-image").files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                currentImage = e.target.result; // Lưu ảnh dưới dạng Base64

                // Hiển thị ảnh đã chọn
                const imageContainer = document.getElementById("image-container");
                const uploadedImage = document.getElementById("uploaded-image");
                imageContainer.style.display = "block";
                uploadedImage.src = currentImage;

                // Gửi ảnh đến server để dự đoán
                sendPredictionRequest(currentImage);
            };
            reader.readAsDataURL(file);
        }
    };
});

// Chụp ảnh từ video
function captureImage() {
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    currentImage = canvas.toDataURL("image/jpeg");

    // Gửi ảnh đến server để dự đoán
    sendPredictionRequest(currentImage);
}



// Xử lý nút "Chụp ảnh"
document.getElementById("capture-photo-btn").addEventListener("click", function () {
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Thiết lập kích thước canvas theo video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ khung hình hiện tại từ video vào canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Lưu ảnh dưới dạng Base64
    currentImage_bt = canvas.toDataURL("image/jpeg");

    // Hiển thị ảnh vừa chụp
    const imageContainer = document.getElementById("image-container");
    const uploadedImage = document.getElementById("uploaded-image");
    imageContainer.style.display = "block";
    uploadedImage.src = currentImage_bt;

    // Gửi ảnh đến server để dự đoán
    sendPredictionRequest(currentImage_bt);
});

// Dừng camera khi thoát
window.addEventListener("beforeunload", () => {
    if (window.stream) {
        const tracks = window.stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    if (captureInterval) clearInterval(captureInterval);
});
