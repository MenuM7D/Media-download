// ملف script.js
let currentPlatform = "";
const videoPlayer = document.getElementById("my-video");
const videoSource = document.getElementById("video-source");
const downloadBtn = document.getElementById("download-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const shareBtn = document.getElementById("share-btn");
const platformIndicator = document.getElementById("current-platform-indicator");
const platformIcon = document.getElementById("platform-icon");

// الترجمة
function changeLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach((element) => {
        if (element.getAttribute("data-lang") === lang) {
            element.style.display = "inline";
        } else {
            element.style.display = "none";
        }
    });
}

// تحديث المؤشر عند تغيير المنصة
function updatePlatformIndicator(platform) {
    let iconClass = "";
    switch (platform) {
        case "tiktok":
            iconClass = "fab fa-tiktok";
            break;
        case "pinterest":
            iconClass = "fab fa-pinterest";
            break;
        case "facebook":
            iconClass = "fab fa-facebook";
            break;
        case "twitter":
            iconClass = "fab fa-twitter";
            break;
        case "youtube":
            iconClass = "fab fa-youtube";
            break;
        case "youtube_music":
            iconClass = "fab fa-youtube";
            break;
        case "spotify":
            iconClass = "fab fa-spotify";
            break;
        case "soundcloud":
            iconClass = "fab fa-soundcloud";
            break;
        default:
            iconClass = "fas fa-question-circle";
    }
    platformIcon.className = `${iconClass} fa-2x`;
}

// الانتقال إلى صفحة التنزيل
function redirectToDownload(platform) {
    currentPlatform = platform;
    document.getElementById("download-section").classList.remove("hidden");
    updatePlatformIndicator(platform);
}

// جلب رابط الفيديو من API
async function fetchDownloadLink() {
    const videoUrl = document.getElementById("video-url").value || document.getElementById("video-url-en").value;
    if (!videoUrl) {
        toastr.error("يرجى إدخال رابط الفيديو");
        return;
    }

    let apiUrl = "";
    switch (currentPlatform) {
        case "tiktok":
            apiUrl = `https://api.siputzx.my.id/api/tiktok?url=${videoUrl}`;
            break;
        case "pinterest":
            apiUrl = `https://api.siputzx.my.id/api/d/pinterest?url=${videoUrl}`;
            break;
        case "facebook":
            apiUrl = `https://api.siputzx.my.id/api/d/facebook?url=${videoUrl}`;
            break;
        case "twitter":
            apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${videoUrl}`;
            break;
        case "youtube":
            apiUrl = `https://api.siputzx.my.id/api/d/ytmp4?url=${videoUrl}`;
            break;
        case "youtube_music":
            apiUrl = `https://api.siputzx.my.id/api/d/ytmp3?url=${videoUrl}`;
            break;
        case "spotify":
            apiUrl = `https://api.siputzx.my.id/api/d/spotify?url=${videoUrl}`;
            break;
        case "soundcloud":
            apiUrl = `https://api.siputzx.my.id/api/d/soundcloud?url=${videoUrl}`;
            break;
        default:
            toastr.error("المنصة غير مدعومة");
            return;
    }

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.status) {
            displayVideo(data.data);
        } else {
            toastr.error("فشل في جلب البيانات");
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
        toastr.error("حدث خطأ أثناء جلب البيانات");
    }
}

// عرض الفيديو
function displayVideo(data) {
    const videoUrl = currentPlatform === "tiktok" ? data.urls[0] : data.url || data.dl || data.download;
    videoSource.src = videoUrl;
    videoPlayer.load();
    videoPlayer.play();
    document.getElementById("video-player").classList.remove("hidden");

    // إعداد زر التنزيل
    downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = `video_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // إعداد زر نسخ الرابط
    copyLinkBtn.onclick = () => {
        navigator.clipboard.writeText(videoUrl).then(() => {
            toastr.success("تم نسخ الرابط بنجاح");
        });
    };

    // إعداد زر المشاركة
    shareBtn.onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: "فيديو",
                url: videoUrl,
            });
        } else {
            toastr.info("المشاركة غير مدعومة في هذا المتصفح");
        }
    };
}

// جلب الفيديو تلقائيًا عند إدخال الرابط
document.getElementById("video-url").addEventListener("input", fetchDownloadLink);
document.getElementById("video-url-en").addEventListener("input", fetchDownloadLink);
