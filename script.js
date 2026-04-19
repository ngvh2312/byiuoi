let currentPageIndex = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

// Đối tượng lưu trữ các câu trả lời
let userAnswers = {
    "Câu 1 (Kể anh nghe)": "",
    "Câu 2 (Ăn uống)": "",
    "Câu 3 (Đi đâu)": "",
    "Câu 4 (Mệt mỏi)": "",
    "Câu 5 (Nhớ anh không)": ""
};

// Hàm cố gắng phát nhạc (vì trình duyệt đôi khi chặn autoplay)
function tryPlayMusic() {
    if (!isMusicPlaying && bgMusic) {
        bgMusic.volume = 0.5; // Chỉnh âm lượng vừa phải
        bgMusic.play().then(() => {
            isMusicPlaying = true;
        }).catch(e => {
            console.log('Trình duyệt chặn tự động phát nhạc:', e);
        });
    }
}

// Lưu câu 1 (dạng tự nhập chữ) rồi chuyển trang
function saveQ1AndNext(reactionText) {
    const textInput = document.getElementById('q1-answer');
    if (textInput) {
        userAnswers["Câu 1 (Kể anh nghe)"] = textInput.value || "Không nhập gì cả :(";
    }
    if (reactionText) {
        window.showReactionPopup(reactionText);
    } else {
        nextPage();
    }
}

// Lưu các câu trắc nghiệm (từ 2 đến 5) rồi chuyển trang
function saveAnswerAndNext(questionKey, answerText, reactionText) {
    userAnswers[questionKey] = answerText;
    if (reactionText) {
        window.showReactionPopup(reactionText);
    } else {
        nextPage();
    }
}

// Gửi ngầm tới mail hungshark2k7@gmail.com qua FormSubmit
function sendEmailToHung() {
    const statusText = document.getElementById('loading-email');
    if(statusText) statusText.innerText = "Đang lén gửi thư cho anh Hưng... 💌";

    fetch("https://formsubmit.co/ajax/hungshark2k7@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "Lời nhắn": "Bé Yến vừa làm xong bài test nha!",
            ...userAnswers
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Đã gửi thành công:", data);
        if(statusText) statusText.innerText = "Đã báo cáo tình hình cho anh Hưng hoàn tất rồi ó!! 🥰";
    })
    .catch(error => {
        console.error("Lỗi:", error);
        if(statusText) statusText.innerText = "Gửi báo cáo thất bại... Nhưng mà anh Hưng vẫn iu Yến nha!! 🥺";
    });
}

// Hàm chuyển trang chính
function nextPage() {
    tryPlayMusic(); // Nhấp 1 cái là nhồi nhạc ngay

    if (currentPageIndex < totalPages - 1) {
        // Thêm class out để page hiện tại bay lên và mờ đi
        pages[currentPageIndex].classList.remove('active');
        pages[currentPageIndex].classList.add('out');
        
        // Chờ hiệu ứng của page trước chạy được một nửa rồi mới gọi page tiếp theo lên
        setTimeout(() => {
            currentPageIndex++;
            pages[currentPageIndex].classList.add('active');

            // NẾU LÀ TRANG CUỐI => SEND EMAIL
            if (currentPageIndex === totalPages - 1) {
                sendEmailToHung();
            }

        }, 300);
    }
}

// Hàm tạo hiệu ứng bong bóng bay lên
function createBubbles() {
    const container = document.getElementById('bubbles-container');
    if (!container) return;
    const bubbleCount = 40; // Số lượng bong bóng

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 60 + 15; 
        const left = Math.random() * 100; 
        const animationDuration = Math.random() * 6 + 5; 
        const animationDelay = Math.random() * 8; 

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${animationDuration}s`;
        bubble.style.animationDelay = `${animationDelay}s`;

        container.appendChild(bubble);
    }
}

// Khởi chạy khi vừa load xong web
window.onload = () => {
    createBubbles();
};

// Modal xem ảnh lớn
window.openModal = function(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    if (modal && modalImg) {
        modalImg.src = imgSrc;
        modal.classList.add('show');
    }
};

window.closeModal = function() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('show');
    }
};

// Hiển thị Popup phản hồi răng cưa
window.showReactionPopup = function(text) {
    const popup = document.getElementById('reactionPopup');
    const reactionTextEl = document.getElementById('reactionText');
    if (popup && reactionTextEl) {
        reactionTextEl.innerText = text;
        popup.classList.add('show-reaction');
        tryPlayMusic();
    }
};

// Đóng Popup và chuyển câu tiếp theo
window.closeReactionAndNext = function() {
    const popup = document.getElementById('reactionPopup');
    if (popup) {
        popup.classList.remove('show-reaction');
    }
    nextPage();
};
