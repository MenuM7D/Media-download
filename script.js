// كائن يحتوي على النصوص باللغتين
const translations = {
    ar: {
        errorEmptyUrl: "يرجى إدخال رابط الفيديو",
        errorFetchData: "فشل في جلب البيانات",
        errorGeneral: "حدث خطأ أثناء جلب البيانات",
        successCopyLink: "تم نسخ الرابط بنجاح",
        infoShareUnsupported: "المشاركة غير مدعومة في هذا المتصفح",
        fileStatusSuccess: "ناجحة",
        fileSizeUnknown: "غير معروف",
        platformMessages: {
            tiktok: "يرجي ادخال رابط فيديو تيك توك",
            pinterest: "يرجي ادخال رابط فيديو بنترست",
            facebook: "يرجي ادخال رابط فيديو فيسبوك",
            twitter: "يرجي ادخال رابط فيديو تويتر",
            youtube: "يرجي ادخال رابط فيديو يوتيوب",
            youtube_music: "يرجي ادخال رابط اغنيه من يوتيوب ميوزك او يوتيوب العادي",
            spotify: "يرجي ادخال رابط اغنيه من سبوتيفاي",
            soundcloud: "يرجي ادخال رابط اغنيه من ساوند كلاود",
            instagram: "يرجي ادخال رابط فيديو انستغرام"
        }
    },
    en: {
        errorEmptyUrl: "Please enter the video URL",
        errorFetchData: "Failed to fetch data",
        errorGeneral: "An error occurred while fetching data",
        successCopyLink: "Link copied successfully",
        infoShareUnsupported: "Sharing is not supported in this browser",
        fileStatusSuccess: "Successful",
        fileSizeUnknown: "Unknown",
        platformMessages: {
            tiktok: "Please enter a TikTok video link",
            pinterest: "Please enter a Pinterest video link",
            facebook: "Please enter a Facebook video link",
            twitter: "Please enter a Twitter video link",
            youtube: "Please enter a YouTube video link",
            youtube_music: "Please enter a YouTube Music or regular YouTube song link",
            spotify: "Please enter a Spotify song link",
            soundcloud: "Please enter a SoundCloud song link",
            instagram: "Please enter an Instagram video link"
        }
    }
};

let currentPlatform = "";
const downloadBtn = document.getElementById("download-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const shareBtn = document.getElementById("share-btn");
const platformIndicator = document.getElementById("current-platform-indicator");
const platformIcon = document.getElementById("platform-icon");
const progressBar = document.getElementById("progress-bar");
const progress = document.getElementById("progress");
const fileInfo = document.getElementById("file-info");
const videoUrlInput = document.getElementById("video-url");
const videoUrlInputEn = document.getElementById("video-url-en");
const loadingSpinner = document.getElementById("loading-spinner");
const successIcon = document.getElementById("success-icon");

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
    updatePlaceholder(currentPlatform); // تحديث placeholder عند تغيير اللغة
    clearVideoUrlInput(); // مسح حقل إدخال الرابط عند تغيير اللغة
    clearFileInfo(); // مسح معلومات الملف وإخفاء الأزرار
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
    updatePlaceholder(platform); // تحديث placeholder عند تغيير المنصة
}

// تحديث placeholder بناءً على المنصة واللغة
function updatePlaceholder(platform) {
    const lang = document.documentElement.lang || "ar";
    const placeholderText = translations[lang].platformMessages[platform] || translations[lang].errorEmptyUrl;

    const videoUrlInput = document.getElementById("video-url");
    const videoUrlInputEn = document.getElementById("video-url-en");

    if (lang === "ar") {
        videoUrlInput.placeholder = placeholderText;
    } else {
        videoUrlInputEn.placeholder = placeholderText;
    }
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
    clearFileInfo(); // مسح معلومات الملف وشريط التقدم
}

// مسح معلومات الملف وشريط التقدم
function clearFileInfo() {
    progressBar.classList.add("hidden");
    progress.style.width = "0%";
    fileInfo.classList.add("hidden");
    document.getElementById("file-duration").textContent = "";
    document.getElementById("file-size").textContent = "";
    document.getElementById("file-status").textContent = "";
    hideElements(); // إخفاء الأزرار عند مسح الرابط
    hideLoadingSpinner(); // إخفاء دائرة التحميل
    hideSuccessIcon(); // إخفاء علامة الصح
}

// إخفاء العناصر
function hideElements() {
    downloadBtn.classList.remove("show-elements");
    copyLinkBtn.classList.remove("show-elements");
    shareBtn.classList.remove("show-elements");
    fileInfo.classList.remove("show-elements");
}

// إظهار العناصر
function showElements() {
    downloadBtn.classList.add("show-elements");
    copyLinkBtn.classList.add("show-elements");
    shareBtn.classList.add("show-elements");
    fileInfo.classList.add("show-elements");
}

// إظهار دائرة التحميل
function showLoadingSpinner() {
    loadingSpinner.classList.remove("hidden");
    successIcon.classList.add("hidden");
}

// إخفاء دائرة التحميل
function hideLoadingSpinner() {
    loadingSpinner.classList.add("hidden");
}

// إظهار علامة الصح
function showSuccessIcon() {
    successIcon.classList.remove("hidden");
    loadingSpinner.classList.add("hidden");
    successIcon.classList.add("animate-success"); // إضافة تأثير بسيط
}

// إخفاء علامة الصح
function hideSuccessIcon() {
    successIcon.classList.add("hidden");
    successIcon.classList.remove("animate-success");
}

// جلب رابط الفيديو من API
async function fetchDownloadLink() {
    const videoUrl = videoUrlInput.value || videoUrlInputEn.value;
    const lang = document.documentElement.lang || "ar"; // الحصول على اللغة الحالية

    if (!videoUrl) {
        toastr.error(translations[lang].errorEmptyUrl);
        clearFileInfo(); // مسح المعلومات إذا كان الحقل فارغًا
        return;
    }

    showLoadingSpinner(); // إظهار دائرة التحميل

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
            toastr.error(translations[lang].errorFetchData);
            return;
    }

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.status) {
            showSuccessIcon(); // إظهار علامة الصح عند النجاح
            setupDownloadButtons(data);
            await displayFileInfo(data); // عرض المعلومات الفعلية
            showElements(); // إظهار الأزرار عند نجاح جلب البيانات
        } else {
            toastr.error(translations[lang].errorFetchData);
            hideLoadingSpinner(); // إخفاء دائرة التحميل عند الفشل
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
        toastr.error(translations[lang].errorGeneral);
        hideLoadingSpinner(); // إخفاء دائرة التحميل عند الخطأ
    }
}

// عرض معلومات الملف
async function displayFileInfo(data) {
    const lang = document.documentElement.lang || "ar"; // الحصول على اللغة الحالية
    const fileDuration = document.getElementById("file-duration");
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

    // اكتشاف الحجم باستخدام HEAD أولاً، ثم GET كحل احتياطي
    try {
        // المحاولة الأولى: استخدام HEAD
        const headResponse = await fetch(videoUrl, { method: "HEAD" });
        const contentLength = headResponse.headers.get("content-length");

        if (contentLength) {
            const sizeInMB = (contentLength / (1024 * 1024)).toFixed(2);
            fileSize.textContent = `${sizeInMB} MB`;
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
        }
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الحجم:", error);
        fileSize.textContent = translations[lang].fileSizeUnknown;
    }

    // الحالة
    fileStatus.textContent = translations[lang].fileStatusSuccess;

    fileInfo.classList.remove("hidden");
}

// إعداد أزرار التنزيل والنسخ والمشاركة
function setupDownloadButtons(data) {
    const lang = document.documentElement.lang || "ar"; // الحصول على اللغة الحالية

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
            toastr.success(translations[lang].successCopyLink);
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
            toastr.info(translations[lang].infoShareUnsupported);
        }
    };
}

// جلب الفيديو تلقائيًا عند إدخال الرابط
videoUrlInput.addEventListener("input", () => {
    if (!videoUrlInput.value) {
        clearFileInfo(); // مسح المعلومات إذا كان الحقل فارغًا
    } else {
        fetchDownloadLink();
    }
});
videoUrlInputEn.addEventListener("input", () => {
    if (!videoUrlInputEn.value) {
        clearFileInfo(); // مسح المعلومات إذا كان الحقل فارغًا
    } else {
        fetchDownloadLink();
    }
});
