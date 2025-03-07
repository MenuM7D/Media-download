// ملف script.js
let currentPlatform = "";
const downloadBtn = document.getElementById("download-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const shareBtn = document.getElementById("share-btn");
const platformIndicator = document.getElementById("current-platform-indicator");
const platformIcon = document.getElementById("platform-icon");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const fileInfo = document.getElementById("file-info");

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
        case "instagram":
            iconClass = "fab fa-instagram";
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

    progressBar.classList.remove("hidden");
    progress.style.width = "0%";

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
        case "instagram":
            apiUrl = `https://bk9.fun/download/instagram?url=${videoUrl}`;
            break;
        default:
            toastr.error("المنصة غير مدعومة");
            return;
    }

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.status) {
            progress.style.width = "100%";
            setTimeout(() => {
                progressBar.classList.add("hidden");
            }, 500);
            setupDownloadButtons(data);
            await displayFileInfo(data); // عرض المعلومات الفعلية
        } else {
            toastr.error("فشل في جلب البيانات");
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
        toastr.error("حدث خطأ أثناء جلب البيانات");
    }
}

// عرض معلومات الملف
async function displayFileInfo(data) {
    const fileDuration = document.getElementById("file-duration");
    const fileType = document.getElementById("file-type");
    const fileSize = document.getElementById("file-size");
    const fileStatus = document.getElementById("file-status");

    let videoUrl = "";
    if (currentPlatform === "tiktok") {
        videoUrl = data.urls[0];
    } else if (currentPlatform === "instagram") {
        videoUrl = data.BK9[0].url;
    } else if (currentPlatform === "twitter") {
        videoUrl = data.data.downloadLink; // تعديل هنا لاستخراج رابط التنزيل من تويتر
    } else {
        videoUrl = data.data.url || data.data.dl || data.data.download;
    }

    // اكتشاف الوقت
    const video = document.createElement("video");
    video.src = videoUrl;
    video.addEventListener("loadedmetadata", () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        fileDuration.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });

    // اكتشاف النوع بناءً على امتداد الرابط
    const fileExtension = videoUrl.split(".").pop().toLowerCase();
    if (fileExtension === "mp3") {
        fileType.textContent = "صوت";
    } else if (fileExtension === "mp4") {
        fileType.textContent = "فيديو";
    } else {
        fileType.textContent = "غير معروف"; // إذا كان الامتداد غير معروف
    }

    // اكتشاف الحجم
    try {
        const response = await fetch(videoUrl, { method: "HEAD" });
        const size = response.headers.get("content-length");
        if (size) {
            const sizeInMB = (size / (1024 * 1024)).toFixed(2);
            fileSize.textContent = `${sizeInMB} MB`;
        } else {
            fileSize.textContent = "غير معروف";
        }
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الحجم:", error);
        fileSize.textContent = "غير معروف";
    }

    // الحالة
    fileStatus.textContent = "ناجحة";

    fileInfo.classList.remove("hidden");
}

// إعداد أزرار التنزيل والنسخ والمشاركة
function setupDownloadButtons(data) {
    let videoUrl = "";
    if (currentPlatform === "tiktok") {
        videoUrl = data.urls[0];
    } else if (currentPlatform === "instagram") {
        videoUrl = data.BK9[0].url;
    } else if (currentPlatform === "twitter") {
        videoUrl = data.data.downloadLink; // تعديل هنا لاستخراج رابط التنزيل من تويتر
    } else {
        videoUrl = data.data.url || data.data.dl || data.data.download;
    }

    // إعداد زر التنزيل
    downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = videoUrl;
        link.download = `video_${Date.now()}.${videoUrl.split(".").pop()}`; // حفظ الملف بامتداده الصحيح
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
