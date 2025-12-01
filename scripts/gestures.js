document.addEventListener('DOMContentLoaded', () => {
    const tapTarget = document.getElementById('presentationRoot');
    if (!tapTarget) return;

    const swipeThreshold = 60;      // أقل مسافة أفقية علشان نعتبرها سحب
    const verticalTolerance = 80;   // مسموح شوية حركة رأسية بسيطة
    let startX = 0;
    let startY = 0;
    let moved = false;

    tapTarget.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        moved = false;
    }, { passive: true });

    tapTarget.addEventListener('touchmove', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < verticalTolerance) {
            event.preventDefault(); // نوقف السحب الرأسي لما يكون السحب أفقي
        }
        moved = true;
    }, { passive: false });

    tapTarget.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        const passedThreshold = Math.abs(deltaX) >= swipeThreshold;
        const verticalOk = Math.abs(deltaY) < verticalTolerance;

        if (isHorizontal && passedThreshold && verticalOk) {
            if (deltaX < 0) {
                window.PresentationController?.next();      // سحب لليسار → مشهد جديد
            } else {
                window.PresentationController?.previous();  // سحب لليمين → المشهد السابق
            }
        } else if (!moved || (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold)) {
            // مجرد نقرة خفيفة = نفس سلوك الـ tap القديم (المشهد التالي)
            window.PresentationController?.next();
        }
    }, { passive: true });
});
