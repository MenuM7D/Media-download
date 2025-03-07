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
const fileDuration = document.getElementById("file-duration");
const fileSize = document.getElementById("file-size");
const fileStatus = document.getElementById("file-status");
const videoUrlInput = document.getElementById("video-url");
const videoUrlInputEn = document.getElementById("video-url-en");

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
    clearVideoUrlInput(); // مسح حقل إدخال الرابط عند التبديل بين المنصات
}

// مسح حقل إدخال الرابط
function clearVideoUrlInput() {
    videoUrlInput.value = "";
    videoUrlInputEn.value = "";
    resetUI(); // إعادة تعيين واجهة المستخدم
}

// إعادة تعيين واجهة المستخدم
function resetUI() {
    fileInfo.classList.add("hidden");
    progressBar.classList.add("hidden");
    fileDuration.textContent = "";
    fileSize.textContent = "";
    fileSize.style.display = "none"; // إخفاء الحجم بشكل افتراضي
    fileStatus.textContent = "";
}

// جلب رابط الفيديو من API
async function fetchDownloadLink() {
    const videoUrl = videoUrlInput.value || videoUrlInputEn.value;
    if (!videoUrl) {
        resetUI(); // إعادة تعيين واجهة المستخدم إذا كان الحقل فارغًا
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

    // اكتشاف الحجم باستخدام HEAD أولاً، ثم GET كحل احتياطي
    try {
        // المحاولة الأولى: استخدام HEAD
        const headResponse = await fetch(videoUrl, { method: "HEAD" });
        const contentLength = headResponse.headers.get("content-length");

        if (contentLength) {
            const sizeInMB = (contentLength / (1024 * 1024)).toFixed(2);
            fileSize.textContent = `${sizeInMB} MB`;
            fileSize.style.display = "inline"; // إظهار الحجم إذا كان متاحًا
        } else {
            // المحاولة الثانية: استخدام GET
            const getResponse = await fetch(videoUrl);
            const reader = getResponse.body.getReader();
            let totalSize = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                totalSize += value.length;
            }

            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            fileSize.textContent = `${sizeInMB} MB`;
            fileSize.style.display = "inline"; // إظهار الحجم إذا كان متاحًا
        }
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الحجم:", error);
        fileSize.style.display = "none"; // إخفاء الحجم إذا لم يكن متاحًا
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
        link.download = `file_${Date.now()}`; // حفظ الملف بدون امتداد (سيتم تحديده تلقائيًا)
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
videoUrlInput.addEventListener("input", fetchDownloadLink);
videoUrlInputEn.addEventListener("input", fetchDownloadLink);

// إعادة تعيين واجهة المستخدم عند حذف الرابط
videoUrlInput.addEventListener("input", (e) => {
    if (!e.target.value) resetUI();
});
videoUrlInputEn.addEventListener("input", (e) => {
    if (!e.target.value) resetUI();
});
