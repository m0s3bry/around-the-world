document.addEventListener('DOMContentLoaded', () => {
    const tapTarget =
        document.getElementById('presentationRoot') ||
        document.querySelector('[data-presentation-root]');
    if (!tapTarget) {
        console.warn('gesture target not found');
        return;
    }

    console.log('gestures ready'); // هتشوفها في الكونسول لما الملف يشتغل

    const SWIPE_THRESHOLD = 60;
    const VERTICAL_TOLERANCE = 80;

    let startX = 0;
    let startY = 0;
    let pointerDown = false;

    const handlePointerDown = (event) => {
        pointerDown = true;
        startX = event.clientX;
        startY = event.clientY;
    };

    const handlePointerMove = (event) => {
        if (!pointerDown) return;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < VERTICAL_TOLERANCE) {
            event.preventDefault();
        }
    };

    const handlePointerUp = (event) => {
        if (!pointerDown) return;
        pointerDown = false;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        const horizontal = Math.abs(deltaX) > Math.abs(deltaY);
        const passed = Math.abs(deltaX) >= SWIPE_THRESHOLD;
        const verticalOk = Math.abs(deltaY) < VERTICAL_TOLERANCE;

        if (horizontal && passed && verticalOk) {
            if (deltaX < 0) {
                window.PresentationController?.next();
            } else {
                window.PresentationController?.previous();
            }
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
            window.PresentationController?.next();
        }
    };

    const handlePointerCancel = () => {
        pointerDown = false;
    };

    tapTarget.addEventListener('pointerdown', handlePointerDown);
    tapTarget.addEventListener('pointermove', handlePointerMove);
    tapTarget.addEventListener('pointerup', handlePointerUp);
    tapTarget.addEventListener('pointercancel', handlePointerCancel);
});
