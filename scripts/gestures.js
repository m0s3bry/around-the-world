(() => {
    const target = document.getElementById("presentationRoot");
    if (!target) return; // لو العنصر مش جاهز، منخرجش أي أخطاء

    let startX = 0;
    let isPointerDown = false;
    const swipeThreshold = 40; // أقل مسافة نعتبرها سحبة
    const rotateStep = 6; // درجات التدوير للتأثير البصري

    const scene = document.getElementById("sceneContainer");

    const handlePointerDown = (event) => {
        isPointerDown = true;
        startX = event.clientX || event.touches?.[0]?.clientX || 0;
    };

    const handlePointerUp = (event) => {
        if (!isPointerDown) return;
        isPointerDown = false;

        const endX = event.clientX || event.changedTouches?.[0]?.clientX || 0;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) < swipeThreshold) return;

        const direction = deltaX > 0 ? "right" : "left";
        spinScene(direction);
        notifyController(direction);
    };

    const spinScene = (direction) => {
        if (!scene) return;
        const currentRotation = Number(scene.dataset.rotation || 0);
        const nextRotation =
            direction === "right"
                ? currentRotation + rotateStep
                : currentRotation - rotateStep;

        scene.dataset.rotation = nextRotation;
        scene.style.transform = `rotateY(${nextRotation}deg)`;
    };

    const notifyController = (direction) => {
        if (window.PresentationController) {
            const method = direction === "right" ? "goNext" : "goPrev";
            if (typeof window.PresentationController[method] === "function") {
                window.PresentationController[method]();
                return;
            }
        }

        document.dispatchEvent(
            new CustomEvent("swipeNavigation", {
                detail: { direction }
            })
        );
    };

    target.addEventListener("pointerdown", handlePointerDown);
    target.addEventListener("pointerup", handlePointerUp);
    target.addEventListener("touchstart", handlePointerDown, { passive: true });
    target.addEventListener("touchend", handlePointerUp);
})();
