document.addEventListener('DOMContentLoaded', () => {
    const tapTarget = document.getElementById('presentationRoot');
    if (!tapTarget) return;

    const swipeThreshold = 60;   // المسافة الأفقية الدنيا (بالبكسل) لاعتبار الحركة سحب
    const verticalTolerance = 80; // السماح بقدر بسيط من الحركة الرأسية
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

        // لو الحركة أفقية أكتر من رأسية نمنع scroll ونعتبرها تفاعل presentation
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < verticalTolerance) {
            event.preventDefault();
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
                window.PresentationController?.next();
            } else {
                window.PresentationController?.previous();
            }
        } else if (!moved || (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold)) {
            // لو كان مجرد “طَقّة” خفيفة اعتبره tap للانتقال التالي
            window.PresentationController?.next();
        }
    }, { passive: true });
});

